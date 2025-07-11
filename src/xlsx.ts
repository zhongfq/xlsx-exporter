import xlsx from "xlsx";

export const RANGE_CHECKER = "xlsx.checker.range";
export const INDEX_CHECKER = "xlsx.checker.index";
export const EXPR_CHECKER = "xlsx.checker.expr";

export const enum TagType {
    Row = "xlsx.type.row",
    Cell = "xlsx.type.cell",
    Object = "xlsx.type.object",
    Sheet = "xlsx.type.sheet",
}

export type Tag = {
    /** data name */
    ["!name"]?: string;
    /** type tag */
    ["!type"]?: string | TagType;
    /** special toString function */
    ["!toString"]?: (v: TValue, indent: number, format: "ts" | "json" | "lua" | string) => string;
    /** if exists, use this value instead of the object */
    ["!value"]?: TValue;
    /** enum name */
    ["!enum"]?: string;
    /** comment */
    ["!comment"]?: string;
    /** row index */
    ["!index"]?: number;
    /** field */
    ["!field"]?: Field;
    /** row data */
    ["!row"]?: TRow;
    /** row key */
    ["!key"]?: TCell;
};

export type TCell = {
    /** converted value */
    v: unknown;
    /** location: A1 */
    r: string;
    /** original string value */
    s: string;
} & Tag;

export type TValue = boolean | number | string | null | undefined | TObject | TArray | TCell;
export type TObject = { [k: string | number]: TValue } & Tag;
export type TArray = TValue[] & Tag;
export type TRow = { [k: string]: TCell } & Tag;

export type Field = {
    sheet: string;
    path: string;
    index: number;
    name: string;
    typename: string;
    writers: string[];
    checker: CheckerType[];
    comment: string;
    refer: string;
};

export type Sheet = {
    name: string;
    processors: { name: string; args: string[] }[];
    fields: Field[];
    data: { [idx: string | number]: TRow };
};

export type Workbook = {
    path: string;
    sheets: Record<string, Sheet>;
};

export type TypeConvertor = (str: string) => unknown | null;
type RealType = "int" | "float" | "string" | "bool" | null;
type Type = { realtype?: RealType; convertor: TypeConvertor };

export type Checker = (cell: TCell, row: TRow, field: Field, errors: string[]) => boolean;
export type CheckerParser = (...args: string[]) => Checker;
type CheckerType = {
    name: string;
    force: boolean;
    def: string;
    exec: Checker;
};

export type Processor = (workbook: Workbook, sheet: Sheet, ...args: string[]) => void;
type ProcessorType = {
    name: string;
    priority: number;
    required: boolean;
    exec: Processor;
};

export type Writer = (path: string, data: TObject, processor: string) => void;

const MAX_ERRORS = 50;
const MAX_HEADERS = 6;
export const files: Record<string, Workbook> = {};
export const checkerParsers: Record<string, CheckerParser> = {};
export const convertors: Record<string, Type> = {};
export const processors: Record<string, ProcessorType> = {};
export const writers: Record<string, Writer> = {};
const columnCaches: Record<string, TCell[]> = {};
const rowCaches: Record<string, TRow[]> = {};
const doings: string[] = [];

export const doing = (msg: string) => {
    doings.push(msg);
    return new (class {
        [Symbol.dispose]() {
            doings.pop();
        }
    })();
};

export function error(msg: string): never {
    if (doings.length > 0) {
        console.log(" -> " + doings.join("\n -> "));
    }
    throw new Error(msg);
}

export function assert(condition: boolean, msg: string): asserts condition {
    if (!condition) {
        error(msg);
    }
}

export function registerType(typename: string, convertor: TypeConvertor): void;
export function registerType(typename: string, realtype: RealType, convertor: TypeConvertor): void;
export function registerType(
    typename: string,
    realtypeOrConvertor: RealType | TypeConvertor,
    convertor?: TypeConvertor
): void {
    let realtype: RealType | null = null;
    if (!convertor) {
        convertor = realtypeOrConvertor as TypeConvertor;
        realtype = null;
    } else {
        realtype = realtypeOrConvertor as RealType;
    }
    assert(typeof convertor === "function", `Convertor must be a function: '${typename}'`);
    assert(!convertors[typename], `Type '${typename}' already registered`);
    convertors[typename] = { realtype, convertor };
}

export const registerChecker = (name: string, parser: CheckerParser) => {
    assert(!checkerParsers[name], `Checker parser '${name}' already registered`);
    checkerParsers[name] = parser;
};

/**
 * Register a processor.
 * @param name - The name of the processor.
 * @param processor - The processor function.
 * @param priority - The priority of the processor.
 * @param required - Whether the processor is required.
 */
export const registerProcessor = (
    name: string,
    processor: Processor,
    priority: number = 0,
    required: boolean = false
) => {
    assert(!processors[name], `Processor '${name}' already registered`);
    processors[name] = {
        name,
        priority,
        required: required,
        exec: processor,
    };
};

export const registerWriter = (name: string, writer: Writer) => {
    assert(!writers[name], `Writer '${name}' already registered`);
    writers[name] = writer;
};

export const checkValue = (value: TValue): TValue => {
    if (value && typeof value === "object" && value["!value"]) {
        return checkValue(value["!value"]);
    }
    return value;
};

export const isNullOrUndefined = (value: TValue) => {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === "object" && value["!type"] === TagType.Cell) {
        const cell = value as unknown as TCell;
        if (cell.v === null || cell.v === undefined) {
            return true;
        }
    }
    return false;
};

/**
 * Convert a cell to a string.
 * @param cell - The cell to convert.
 * @returns The string value of the cell, or empty string if the cell.v is null or undefined.
 */
export const toString = (cell?: TCell) => {
    if (!cell || isNullOrUndefined(cell)) {
        return "";
    }
    if (typeof cell.v === "string") {
        return cell.v.trim();
    }
    return String(cell.v);
};

export const toRef = (col: number, row: number) => {
    const COLUMN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let ret = "";
    while (true) {
        const c = col % 26;
        ret = COLUMN[c] + ret;
        col = (col - c) / 26 - 1;
        if (col < 0) {
            break;
        }
    }
    return `${ret}${row + 1}`;
};

export function convertValue(cell: TCell, typename: string): TCell;
export function convertValue(value: string, typename: string): TValue;
export function convertValue(cell: TCell | string, typename: string) {
    const type = convertors[typename.replace("?", "")];
    if (!type) {
        error(`Convertor not found: '${typename}'`);
    }
    if (typeof cell === "string") {
        const v = type.convertor(cell);
        if (v === null || v === undefined || v === "") {
            error(`Convert value error: '${cell}' => type '${typename}'`);
        }
        return v as TValue;
    } else {
        if (typename.endsWith("?") && cell.v === "") {
            cell.s = "null";
            cell.v = null;
        } else {
            const v = cell.v;
            cell.s = toString(cell);
            cell.v = type.convertor(cell.s);
            if (cell.v === null || cell.v === undefined || cell.v === "") {
                error(`Convert value error at ${cell.r}: '${v}' => type '${typename}'`);
            }
        }
        return cell;
    }
}

const parseProcessor = (str: string) => {
    return str
        .split(/[;\n\r]+/)
        .filter((s) => s.trim())
        .map((s) => {
            /**
             * @Processor
             * @Processor(arg1, arg2, ...)
             */
            const match = s.match(/@(\w+)(?:\((.*?)\))?/);
            const [, name = "", args = ""] = match ?? [];
            if (!processors[name]) {
                error(`Processor not found: '${name}'`);
            }
            return {
                name,
                args: args ? args.split(",").map((a) => a.trim()) : [],
            };
        })
        .filter((p) => p.name);
};

const parseChecker = (path: string, refer: string, str: string) => {
    if (str === "x") {
        return [];
    }
    return str
        .split(/[;\n\r]+/)
        .filter((s) => !!s.trim())
        .map((s) => {
            const force = s.startsWith("!");
            if (force) {
                s = s.slice(1);
            }
            using _ = doing(`Parsing checker at ${refer}: '${s}'`);
            let checker: CheckerType | undefined;
            if (s.startsWith("@")) {
                /**
                 * @Checker
                 * @Checker(arg1, arg2, ...)
                 */
                const [, name = "", arg = ""] = s.match(/@(\w+)(?:\((.*?)\))?/) ?? [];
                const parser = checkerParsers[name];
                if (!parser) {
                    error(`Checker parser not found at ${refer}: '${name}'`);
                }
                checker = {
                    name,
                    force,
                    def: s,
                    exec: parser(...arg.split(",").map((a) => a.trim())),
                };
            } else if (s.startsWith("[") && s.endsWith("]")) {
                /**
                 * [0, 1, "a", "b", "c", ...]
                 */
                const parser = checkerParsers[RANGE_CHECKER];
                checker = {
                    name: RANGE_CHECKER,
                    force,
                    def: s,
                    exec: parser(s),
                };
            } else if (s.includes("#")) {
                /**
                 * id=task#main.id
                 * task#main.id
                 * #main.id
                 */
                const [, idx = "", file = "", sheet = "", key = ""] =
                    s.match(/^(?:\[?(\w+)\]?=)?([^=]*)#([^.]+)\.(\w+)$/) ?? [];
                if (!sheet || !key) {
                    error(`Invalid index checker at ${refer}: '${s}'`);
                }
                const parser = checkerParsers[INDEX_CHECKER];
                checker = {
                    name: INDEX_CHECKER,
                    force,
                    def: s,
                    exec: parser(file || path, sheet, key, idx),
                };
            } else if (s !== "x") {
                /**
                 * value >= 0 && value <= 100
                 */
                const parser = checkerParsers[EXPR_CHECKER];
                checker = {
                    name: EXPR_CHECKER,
                    force,
                    def: s,
                    exec: parser(s),
                };
            }
            return checker;
        })
        .filter((v) => !!v);
};

const readCell = (sheetData: xlsx.WorkSheet, r: number, c: number) => {
    const cell: TCell = sheetData[r]?.[c] ?? {};
    cell.v = typeof cell.v === "string" ? cell.v.trim() : (cell.v ?? "");
    cell.r = toRef(c, r);
    cell["!type"] = TagType.Cell;
    return cell;
};

const readHeader = (path: string, data: xlsx.WorkBook) => {
    const requiredProcessors = Object.values(processors)
        .filter((p) => p.required)
        .reduce(
            (acc, p) => {
                acc[p.name] = 0;
                return acc;
            },
            {} as Record<string, number>
        );
    const workbook: Workbook = {
        path: path,
        sheets: {},
    };
    files[path] = workbook;
    const writerKeys = Object.keys(writers);
    let firstSheet: Sheet | null = null;
    for (const sheetName of data.SheetNames) {
        using _ = doing(`Reading sheet '${sheetName}' in '${path}'`);
        const sheetData = data.Sheets[sheetName];
        if (sheetName.startsWith("#") || !sheetData[0]) {
            continue;
        }

        const sheet: Sheet = {
            name: sheetName,
            processors: [],
            fields: [],
            data: {},
        };

        const str = toString(readCell(sheetData, 0, 0));
        let start = 0;
        if (str.startsWith("@")) {
            sheet.processors.push(...parseProcessor(str));
            start = 1;
            for (const p of sheet.processors) {
                if (requiredProcessors[p.name] !== undefined) {
                    requiredProcessors[p.name]++;
                }
            }
        }

        if (!sheetData[start]) {
            continue;
        }

        const parsed: Record<string, string> = {};
        for (let c = 0; c < sheetData[start].length; c++) {
            const r = start;
            const name = toString(readCell(sheetData, r + 0, c));
            const typename = toString(readCell(sheetData, r + 1, c));
            const writer = toString(readCell(sheetData, r + 2, c));
            const checker = toString(readCell(sheetData, r + 3, c));
            const comment = toString(readCell(sheetData, r + 4, c));

            if (!name || !typename) {
                break;
            } else if (writer !== "x") {
                const arr = writer
                    .split("|")
                    .map((w) => w.trim())
                    .filter((w) => w)
                    .map((w) => {
                        if (!writerKeys.includes(w) && c > 0) {
                            error(`Writer not found: '${w}' at ${toRef(c, r + 2)}`);
                        }
                        return w;
                    });
                assert(
                    !!convertors[typename.replace("?", "")],
                    `Type not found at ${toRef(c, r + 1)}: '${typename}'`
                );
                if (parsed[name]) {
                    error(`Duplicate field name: '${name}' at ${toRef(c, r)}`);
                }
                parsed[name] = toRef(c, r);
                sheet.fields.push({
                    path,
                    sheet: sheetName,
                    index: c,
                    name,
                    typename,
                    writers: c > 0 && arr.length ? arr : writerKeys.slice(),
                    checker: parseChecker(path, parsed[name], c === 0 ? "x" : checker),
                    comment,
                    refer: toRef(c, r),
                });
            }
        }

        if (sheet.fields.length > 0) {
            firstSheet ??= sheet;
            workbook.sheets[sheetName] = sheet;
        }
    }

    if (firstSheet) {
        for (const name in requiredProcessors) {
            if (requiredProcessors[name] === 0) {
                firstSheet.processors.push({
                    name,
                    args: [],
                });
            }
        }
    }
};

const readBody = (path: string, data: xlsx.WorkBook) => {
    const workbook = files[path];
    for (const sheetName of data.SheetNames) {
        using _ = doing(`Reading sheet '${sheetName}' in '${path}'`);
        const sheetData = data.Sheets[sheetName];
        if (!workbook.sheets[sheetName]) {
            continue;
        }
        const sheet = workbook.sheets[sheetName];
        const start = toString(readCell(sheetData, 0, 0)).startsWith("@")
            ? MAX_HEADERS
            : MAX_HEADERS - 1;
        loop: for (let r = start; r < sheetData.length; r++) {
            const row: TRow = {};
            row["!type"] = TagType.Row;
            row["!index"] = r + 1;
            for (const field of sheet.fields) {
                const cell: TCell = readCell(sheetData, r, field.index);
                if (field.index === 0 && cell.v === "") {
                    break loop;
                }
                if (field.typename === "auto") {
                    cell.v = r - start + 1;
                }
                cell["!field"] = field;
                cell["!row"] = row;
                row[field.name] = cell;
                if (field.index === 0) {
                    row["!key"] = cell;
                    sheet.data[cell.v as string] = row;
                }
            }
        }
    }
};

const parseBody = () => {
    for (const file in files) {
        const workbook = files[file];
        console.log(`parsing: '${file}'`);
        for (const sheetName in workbook.sheets) {
            using _ = doing(`Parsing sheet '${sheetName}' in '${file}'`);
            const sheet = workbook.sheets[sheetName];
            for (const field of sheet.fields) {
                for (const row of Object.values(sheet.data)) {
                    const cell = row[field.name];
                    convertValue(cell, field.typename);
                }
            }
        }
    }
};

const invokeChecker = (sheet: Sheet, field: Field, errors: string[]) => {
    for (const checker of field.checker) {
        const errorValues: string[] = [];
        const errorDescs: string[] = [];
        for (const row of Object.values(sheet.data)) {
            const cell = row[field.name];
            if ((cell.v !== null || checker.force) && !checker.exec(cell, row, field, errorDescs)) {
                errorValues.push(`${cell.r}: ${cell.s}`);
                if (errorDescs.length > 0) {
                    for (const str of errorDescs) {
                        errorValues.push("    ❌ " + str);
                    }
                    errorDescs.length = 0;
                }
            }
        }
        if (errorValues.length > 0) {
            if (errorValues.length > MAX_ERRORS) {
                errorValues.length = MAX_ERRORS;
                errorValues.push("...");
            }
            errors.push(
                `builtin check:\n` +
                    `     path: ${field.path}\n` +
                    `    sheet: ${field.sheet}\n` +
                    `    field: ${field.name}\n` +
                    `  checker: ${checker.def}\n` +
                    `   values:\n` +
                    `      ${errorValues.join("\n      ")}\n`
            );
        }
    }
};

const applyChecker = () => {
    const errors: string[] = [];
    for (const file in files) {
        const workbook = files[file];
        for (const sheetName in workbook.sheets) {
            const sheet = workbook.sheets[sheetName];
            for (const field of sheet.fields) {
                using _ = doing(`Checking field '${field.name}' in '${file}#${sheetName}'`);
                try {
                    invokeChecker(sheet, field, errors);
                } catch (e) {
                    console.error(e);
                    error(`Error checking field '${field.name}' in '${file}#${sheetName}'`);
                }
            }
        }
    }
    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }
};

const applyProcessor = () => {
    type ProcessorEntry = {
        processor: ProcessorType;
        sheet: Sheet;
        args: string[];
        name: string;
    };
    for (const file in files) {
        const workbook = files[file];
        const arr: ProcessorEntry[] = [];
        for (const sheetName in workbook.sheets) {
            const sheet = workbook.sheets[sheetName];
            for (const { name, args } of sheet.processors) {
                arr.push({
                    processor: processors[name],
                    sheet: sheet,
                    args: args,
                    name: name,
                });
            }
        }
        arr.sort((a, b) => a.processor.priority - b.processor.priority);
        for (const { processor, sheet, args, name } of arr) {
            using _ = doing(`Applying processor '${name}' in '${file}#${sheet.name}'`);
            processor.exec(workbook, sheet, ...args);
        }
    }
};

export const parse = (files: string[], headerOnly: boolean = false) => {
    for (const file of files) {
        console.log(`reading: '${file}'`);
        const data = xlsx.readFile(file, {
            dense: true,
            cellHTML: false,
            cellFormula: false,
            cellText: false,
            raw: true,
            sheetRows: headerOnly ? MAX_HEADERS : undefined,
        });
        readHeader(file, data);
        if (!headerOnly) {
            readBody(file, data);
        }
    }
    if (!headerOnly) {
        parseBody();
        applyChecker();
        applyProcessor();
    }
};

export const filter = (workbook: Workbook, writer: string, headerOnly: boolean = false) => {
    const result: Workbook = { ...workbook, sheets: {} };
    for (const sheetName in workbook.sheets) {
        const sheet = workbook.sheets[sheetName];
        const resultSheet: Sheet = { ...sheet, data: {} };
        result.sheets[sheetName] = resultSheet;
        if (!headerOnly) {
            for (const k in sheet.data) {
                const row = { ...sheet.data[k] };
                resultSheet.data[k] = row;
                for (const field of sheet.fields) {
                    if (!field.writers.includes(writer)) {
                        delete row[field.name];
                    }
                }
            }
        }
        resultSheet.fields = sheet.fields.filter((f) => f.writers.includes(writer));
    }
    return result;
};

/**
 * Get a workbook by path.
 * @param path - The path of the workbook.
 * @returns The workbook.
 * @throws An error if the workbook is not found.
 */
export const get = (path: string) => {
    for (const file in files) {
        if (file.endsWith(path)) {
            return files[file];
        }
    }
    throw new Error(`File not found: ${path}`);
};

export const getColumn = (path: string, sheet: string, field: string) => {
    const key = `${path}#${sheet}#${field}`;
    if (columnCaches[key]) {
        return columnCaches[key];
    }
    const workbook = get(path);
    const sheetData = workbook.sheets[sheet]?.data;
    if (!sheetData) {
        throw new Error(`Sheet not found: ${path}#${sheet}`);
    }
    const column = Object.values(sheetData).map((v) => v[field] ?? null);
    columnCaches[key] = column;
    return column as readonly (TCell | null)[];
};

export const getRows = (path: string, sheet: string) => {
    const key = `${path}#${sheet}`;
    if (rowCaches[key]) {
        return rowCaches[key];
    }
    const workbook = get(path);
    const sheetData = workbook.sheets[sheet]?.data;
    if (!sheetData) {
        throw new Error(`Sheet not found: ${path}#${sheet}`);
    }
    const rows = Object.values(sheetData);
    rowCaches[key] = rows;
    return rows as readonly TRow[];
};

export const getSheet = (path: string, sheetName: string) => {
    const workbook = get(path);
    const sheet = workbook.sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet not found: ${path}#${sheetName}`);
    }
    return sheet;
};

export type ColumnIndexer<T> = {
    has: (value: unknown) => boolean;
    get: (value: unknown) => T | null;
};

export const createColumnIndexer = <T = TRow>(
    path: string,
    sheetName: string,
    field: string,
    filter?: (row: T) => boolean
): ColumnIndexer<T> => {
    let workbook: Workbook | null = null;
    const cache: Map<unknown, TCell | null> = new Map();

    path = path.replace(/\.xlsx$/, "") + ".xlsx";

    const hasValue = (value: unknown): boolean => {
        if (cache.has(value)) {
            return !!cache.get(value);
        }
        workbook ??= get(path);
        for (const sheet of Object.values(workbook.sheets)) {
            if (sheet.name === sheetName || sheetName === "*") {
                getColumn(path, sheet.name, field).forEach((cell) => {
                    if (cell && (!filter || filter(cell["!row"] as T))) {
                        cache.set(cell.v, isNullOrUndefined(cell) ? null : cell);
                    }
                });
                if (cache.has(value)) {
                    return !!cache.get(value);
                }
            }
        }
        cache.set(value, null);
        return false;
    };

    const getRow = (value: unknown) => {
        if (hasValue(value)) {
            return cache.get(value)?.["!row"] as T | null;
        }
        return null;
    };

    return {
        has: hasValue,
        get: getRow,
    };
};

export interface RowIndexer<T> {
    has: (value: string | number) => boolean;
    get: (value: string | number) => T | null;
}

export const createRowIndexer = <T = TRow>(
    path: string,
    sheetName: string,
    filter?: (row: T) => boolean
): RowIndexer<T> => {
    let workbook: Workbook | null = null;
    const cache: Map<unknown, T | null> = new Map();

    path = path.replace(/\.xlsx$/, "") + ".xlsx";

    const hasValue = (value: string | number): boolean => {
        if (cache.has(value)) {
            return !!cache.get(value);
        }
        workbook ??= get(path);
        for (const sheet of Object.values(workbook.sheets)) {
            if (sheet.name === sheetName || sheetName === "*") {
                for (const k in sheet.data) {
                    const row = sheet.data[k] as TRow;
                    if (!filter || filter(row as T)) {
                        assert(!!row["!key"], "key not found");
                        cache.set(row["!key"]?.v, row as T);
                    }
                }
                if (cache.has(value)) {
                    return !!cache.get(value);
                }
            }
        }
        cache.set(value, null);
        return false;
    };

    const getRow = (value: string | number) => {
        if (hasValue(value)) {
            return cache.get(value) as T;
        }
        return null;
    };

    return {
        has: hasValue,
        get: getRow,
    };
};
