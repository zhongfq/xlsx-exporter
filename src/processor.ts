import { collapseSheet, columnSheet, configSheet, defineSheet, mapSheet } from "./transform";
import { keys } from "./util";
import { assert, copyOf, error, Processor, Sheet, TObject, Workbook, writers } from "./xlsx";

export type StringifyRule = (workbook: Workbook, writer: string) => TObject;
const rules: Record<string, StringifyRule> = {};

export const registerStringifyRule = (name: string, rule: StringifyRule) => {
    assert(!rules[name], `Stringify rule '${name}' already registered`);
    rules[name] = rule;
};

export const mergeSheet = (workbook: Workbook, writer: string, sheetNames?: string[]) => {
    const result: TObject = {};
    for (const k in workbook.sheets) {
        if (!sheetNames || sheetNames.includes(k)) {
            const sheet = workbook.sheets[k];
            for (const k of keys(sheet.data)) {
                const row = sheet.data[k];
                if (result[k]) {
                    error(`Duplicate key: ${k}`);
                }
                result[k] = row;
            }
        }
    }
    return result;
};

export const simpleSheet = (workbook: Workbook, writer: string, sheetNames?: string[]) => {
    const result: TObject = {};
    for (const k in workbook.sheets) {
        if (!sheetNames || sheetNames.includes(k)) {
            result[k] = workbook.sheets[k].data;
        }
    }
    return result;
};

export const StringifyProcessor: Processor = (
    workbook: Workbook,
    sheet: Sheet,
    ruleName?: string
) => {
    const rule = rules[ruleName ?? "simple"];
    if (!rule) {
        error(`Stringify rule not found: ${ruleName}`);
    }
    for (const k in writers) {
        const filtered = copyOf(workbook, k);
        const writer = writers[k];
        writer(filtered.path, rule(filtered, k), "stringify");
    }
};

export const DefineProcessor: Processor = (workbook: Workbook, sheet: Sheet, action?: string) => {
    const data = defineSheet(sheet);
    for (const k in writers) {
        const writer = writers[k];
        writer(workbook.path, data, "define");
    }
    if (action !== "keep_sheet") {
        delete workbook.sheets[sheet.name];
    }
};

export const ConfigProcessor: Processor = (workbook: Workbook, sheet: Sheet) => {
    sheet.data = configSheet(sheet);
};

export const MapProcessor: Processor = (
    workbook: Workbook,
    sheet: Sheet,
    value: string,
    ...keys: string[]
) => {
    sheet.data = mapSheet(sheet, value, ...keys);
};

export const CollapseProcessor: Processor = (
    workbook: Workbook,
    sheet: Sheet,
    ...keys: string[]
) => {
    sheet.data = collapseSheet(sheet, ...keys);
};

export const ColumnProcessor: Processor = (
    workbook: Workbook,
    sheet: Sheet,
    idxKey: string,
    ...foldKeys: string[]
) => {
    sheet.data = columnSheet(sheet, idxKey, ...foldKeys);
};

export const TypedefProcessor: Processor = (workbook: Workbook, sheet: Sheet) => {
    for (const k in writers) {
        const writer = writers[k];
        writer(workbook.path, workbook as unknown as TObject, "typedef");
    }
};
