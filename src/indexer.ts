import { keys } from "./util";
import { checkType, get, isNotNull, TCell, TRow, Type, Workbook } from "./xlsx";

/** string '2' and number 2 are considered the same */
const isSame = (a: unknown, b: unknown) => {
    const ta = typeof a;
    const tb = typeof b;
    if ((ta === "string" || ta === "number") && (tb === "string" || tb === "number")) {
        return ta === tb ? a === b : String(a) === String(b);
    } else {
        return a === b;
    }
};

export type RowFilter = { readonly key: string; readonly value: string | number };

export class ColumnIndexer<T = TRow> {
    private _workbook: Workbook | null = null;
    private _cache: Record<string | number, T[]> = {};
    private _filtered: Map<unknown, T[]> = new Map();
    private _rows: TRow[] = [];

    constructor(
        private readonly path: string,
        private readonly sheetName: string,
        private readonly field: string,
        private readonly filter?: (row: T) => boolean
    ) {}

    private _init() {
        if (this._workbook) {
            return;
        }
        this._workbook = get(this.path);
        for (const sheet of Object.values(this._workbook.sheets)) {
            if (sheet.name === this.sheetName || this.sheetName === "*") {
                if (!sheet.fields.find((f) => f.name === this.field)) {
                    continue;
                }
                for (const key of keys(sheet.data)) {
                    const row = checkType<TRow>(sheet.data[key], Type.Row);
                    const cell = checkType<TCell>(row[this.field], Type.Cell);
                    if (isNotNull(cell) && (!this.filter || this.filter(row as T))) {
                        this._rows.push(row);
                        const value = cell.v as string | number;
                        if (this._cache[value]) {
                            this._cache[value].push(row as T);
                        } else {
                            this._cache[value] = [row as T];
                        }
                    }
                }
            }
        }
    }

    has(key: string | number): boolean;
    has(key: string | number, filter: readonly RowFilter[]): boolean;
    has(key: string | number, filter?: readonly RowFilter[]): boolean {
        this._init();
        if (!filter) {
            return !!this._cache[key];
        } else {
            return this.get(filter).some((v) => isSame((v as TRow)[this.field]?.v, key));
        }
    }

    get(key: string | number): T[];
    get(filter: readonly RowFilter[]): T[];
    get(cond: (v: T) => boolean): T[];
    get(cond: string | number | readonly RowFilter[] | ((v: T) => boolean)): T[] {
        this._init();
        if (typeof cond === "string" || typeof cond === "number") {
            return this._cache[cond] ?? [];
        } else if (typeof cond === "function") {
            return this._rows.filter((v) => cond(v as T)) as T[];
        } else {
            let result = this._filtered.get(cond);
            if (!result) {
                result = [];
                this._filtered.set(cond, result);
                for (const row of this._rows) {
                    if (cond.every((c) => isSame(row[c.key]?.v, c.value))) {
                        result.push(row as T);
                    }
                }
            }
            return result;
        }
    }
}

export class RowIndexer<T = TRow> {
    private _workbook: Workbook | null = null;
    private _cache: Record<string | number, T> = {};
    private _filtered: Map<unknown, T[]> = new Map();
    private _rows: TRow[] = [];

    constructor(
        private readonly path: string,
        private readonly sheetName: string,
        private readonly filter?: (row: T) => boolean
    ) {}

    private _init() {
        if (this._workbook) {
            return;
        }
        this._workbook = get(this.path);
        for (const sheet of Object.values(this._workbook.sheets)) {
            if (sheet.name === this.sheetName || this.sheetName === "*") {
                for (const key of keys(sheet.data)) {
                    const row = checkType<TRow>(sheet.data[key], Type.Row);
                    if (!this.filter || this.filter(row as T)) {
                        this._cache[key] = row as T;
                        this._rows.push(row);
                    }
                }
            }
        }
    }

    has(key: string | number): boolean;
    has(key: string | number, filter: readonly RowFilter[]): boolean;
    has(key: string | number, filter?: readonly RowFilter[]): boolean {
        this._init();
        const row = this.get(key) as TRow | null;
        if (!row || !filter) {
            return !!row;
        } else {
            return filter.every((c) => row[c.key]?.v === c.value);
        }
    }

    get(key: string | number): T | null;
    get(filter: readonly RowFilter[]): T[];
    get(filter: (v: T) => boolean): T[];
    get(cond: string | number | readonly RowFilter[] | ((v: T) => boolean)): T | T[] | null {
        this._init();
        if (typeof cond === "string" || typeof cond === "number") {
            return this._cache[cond] ?? null;
        } else if (typeof cond === "function") {
            return this._rows.filter((v) => cond(v as T)) as T[];
        } else {
            let result = this._filtered.get(cond);
            if (!result) {
                result = [];
                this._filtered.set(cond, result);
                for (const row of this._rows) {
                    if (cond.every((c) => isSame(row[c.key]?.v, c.value))) {
                        result.push(row as T);
                    }
                }
            }
            return result;
        }
    }
}
