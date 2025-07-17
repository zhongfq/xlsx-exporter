import * as fs from "node:fs";
import { basename, dirname, extname } from "node:path";
import { TCell, TObject, TValue, Type } from "./xlsx";

export const typeOf = (value: TValue) => {
    if (value && typeof value === "object" && value["!type"]) {
        return value["!type"];
    }
    return typeof value;
};

export const checkType = <T>(value: TValue, type: Type | string) => {
    const t = typeOf(value);
    if (t === type) {
        return value as T;
    }
    console.error(`checking value: `, value);
    throw new Error(`Expect type '${type}', but got '${t}'`);
};

export const isNull = (value: TValue): value is null | undefined => {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === "object" && value["!type"] === Type.Cell) {
        const cell = value as unknown as TCell;
        if (cell.v === null || cell.v === undefined) {
            return true;
        }
    }
    return false;
};

export const isNotNull = (value: TValue): value is Exclude<TValue, null | undefined> => {
    return !isNull(value);
};

/**
 * Convert a cell to a string.
 * @param cell - The cell to convert.
 * @returns The string value of the cell, or empty string if the cell.v is null or undefined.
 */
export const toString = (cell?: TCell) => {
    if (isNull(cell)) {
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

export const isNumericKey = (key: string) => {
    if (typeof key !== "string") return false;

    // integer or bigint
    if (/^-?\d+$/.test(key)) {
        try {
            return String(BigInt(key)) === key;
        } catch {
            return false;
        }
    }

    // float
    const num = Number(key);
    return !isNaN(num) && String(num) === key;
};

export const escape = (value: string) => {
    return value
        .replaceAll("\r\n", "\n")
        .replaceAll("\\", "\\\\")
        .replaceAll('"', '\\"')
        .replaceAll("\n", "\\n")
        .replaceAll("\t", "\\t")
        .replaceAll("\r", "\\r")
        .replaceAll("\b", "\\b")
        .replaceAll("\f", "\\f");
};

export const outdent = (value: string) => {
    value = value.replace(/^\n/, "");
    value = value.replace(/\n *$/, "");
    const space = value.match(/^ +/gm)?.[0];
    return space ? value.replace(new RegExp(`^${space}`, "gm"), "") : value;
};

export const format = (str: string, vars: Record<string, string>) => {
    const lines: string[] = [];
    for (const line of str.split(/\n|\r\n/)) {
        if (line.match(/^\s*%{\w+}\s*$/)) {
            const [_, space, key] = line.match(/^(\s*)%{(\w+)}$/)!;
            if (vars[key] !== undefined && vars[key] !== null) {
                for (const l of vars[key].split(/\n|\r\n/)) {
                    lines.push(space + l);
                }
            } else {
                throw new Error(`variable '${key}' not found`);
            }
        } else {
            lines.push(
                line.replaceAll(/%{(\w+)}/g, (_, key) => {
                    if (vars[key] !== undefined && vars[key] !== null) {
                        return vars[key];
                    }
                    throw new Error(`variable '${key}' not found`);
                })
            );
        }
    }
    return lines.join("\n");
};

export const keys = (o: object, filter?: (v: TValue) => boolean) => {
    const value = o as TObject;
    const ks = Object.keys(value).filter(
        (k) => !k.startsWith("!") && (!filter || filter(value[k]))
    );

    if (value["!enum"]) {
        return ks.sort((a, b) => {
            const v1 = value[a] as TCell;
            const v2 = value[b] as TCell;
            if (typeof v1.v === "number" && typeof v2.v === "number") {
                return v1.v - v2.v;
            }
            return a.localeCompare(b);
        });
    } else {
        const numKeys: string[] = [];
        const strKeys: string[] = [];
        for (const k of ks) {
            const num = Number(k);
            if (!isNaN(num) && isFinite(num)) {
                numKeys.push(k);
            } else {
                strKeys.push(k);
            }
        }
        numKeys.sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
        strKeys.sort((a, b) => a.localeCompare(b));
        return [...numKeys, ...strKeys];
    }
};

export const values = <T>(o: TObject, filter?: (v: TValue) => boolean): T[] => {
    return keys(o, filter).map((k) => o[k] as T);
};

export const toPascalCase = (str: string): string => {
    return str
        .replace(/^_+/, "")
        .replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^[a-zA-Z]/, (match) => match.toUpperCase());
};

export const readFile = (path: string) => {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, "utf-8");
    }
    return null;
};

export const writeFile = (path: string, data: string) => {
    const dir = dirname(path);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(path) && readFile(path) === data) {
        console.log(`up-to-date: ${path}`);
    } else {
        console.log(`write: ${path}`);
        fs.writeFileSync(path, data, { encoding: "utf-8" });
    }
};

export const filename = (path: string, suffix: boolean = false) => {
    return basename(path, !suffix ? extname(path) : undefined);
};
