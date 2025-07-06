import * as fs from "node:fs";
import { basename as _basename, dirname, extname } from "node:path";
import {
    assert,
    convertValue,
    get,
    isNullOrUndefined,
    Sheet,
    TArray,
    TCell,
    TObject,
    toString,
    TValue,
} from "./xlsx";

export const checkValue = (value: TValue): TValue => {
    if (value && typeof value === "object" && value["!value"]) {
        return checkValue(value["!value"]);
    }
    return value;
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

/**
 * Sort keys of object, ignore null or undefined value
 */
export const sortKeys = (value: TObject) => {
    const keys = Object.keys(value)
        .filter((k) => !k.startsWith("!"))
        .filter((k) => !isNullOrUndefined(checkValue(value[k])));

    if (value["!enum"]) {
        return keys.sort((a, b) => {
            const v1 = value[a] as TCell;
            const v2 = value[b] as TCell;
            if (typeof v1.v === "number" && typeof v2.v === "number") {
                return v1.v - v2.v;
            }
            return String(a).localeCompare(String(b));
        });
    } else {
        return keys.sort();
    }
};

export const toPascalCase = (str: string): string => {
    return str
        .replace(/^_+/, "")
        .replace(/_([a-zA-Z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^[a-zA-Z]/, (match) => match.toUpperCase());
};

export const convertToConfig = (sheet: Sheet) => {
    const keys = Object.keys(sheet.data)
        .map((k) => Number(k))
        .filter((v) => !isNaN(v));

    const config: TObject = {};
    const enumOptions: TObject[] = [];

    for (let i = 0; i < keys.length; i++) {
        const idx = keys[i];
        assert(idx === i, `Key '${idx}' is not found`);

        const row = sheet.data[idx];
        const value = convertValue(row["value"], row["value_type"].v as string);
        let t = config;
        for (let n = 1; n <= 10; n++) {
            const key = toString(row[`key${n}`]);
            if (key) {
                const nextKey = toString(row[`key${n + 1}`]);
                if (nextKey) {
                    t[key] ||= {};
                    t = t[key] as TObject;
                } else {
                    value["!comment"] = toString(row["value_comment"]);
                    t[key] = value;
                }
            } else {
                if (!t["!enum"]) {
                    t["!enum"] = toString(row["enum"]);
                    t["!comment"] = toString(row["comment"]);
                }
                if (row["enum_option"]?.v && t["!enum"]) {
                    enumOptions.push(t);
                }
                break;
            }
        }
    }

    for (const entry of enumOptions) {
        const enumName = entry["!enum"];
        const options: { name: string; value: unknown; desc: unknown }[] = [];
        for (const k of Object.keys(entry).filter((k) => !k.startsWith("!"))) {
            const v = entry[k] as TCell;
            const comment = v["!comment"] ?? "";
            let name: string, desc: string | undefined;
            if (comment.includes("-")) {
                [name, desc] = comment.split("-", 2);
            } else {
                name = comment;
            }
            if (!name) {
                name = k;
            }
            options.push({
                name: `${name}(${k})`,
                value: v.v,
                desc: desc,
            });
        }
        options.sort((a, b) => {
            if (typeof a.value === "number" && typeof b.value === "number") {
                return a.value - b.value;
            }
            return a.name.localeCompare(b.name);
        });
        config[`${enumName}Options`] = options as TArray;
    }

    return config;
};

export const convertToKeyValue = (
    sheet: Sheet,
    nameKey = "key",
    valueKey = "value",
    typeKey = "value_type",
    commentKey = "desc"
) => {
    const result: { [key: string]: TCell } = {};
    for (const row of Object.values(sheet.data)) {
        assert(row[nameKey]?.v !== undefined, `Key '${nameKey}' is not found`);
        assert(row[valueKey]?.v !== undefined, `Value '${valueKey}' is not found`);
        assert(row[typeKey]?.v !== undefined, `Type '${typeKey}' is not found`);
        assert(row[commentKey]?.v !== undefined, `Comment '${commentKey}' is not found`);
        const key = row[nameKey].v as string;
        const value = convertValue(row[valueKey], row[typeKey].v as string);
        value["!comment"] = row[commentKey].v as string;
        result[key] = value;
    }
    return result;
};

export const convertToType = (
    path: string,
    sheetName: string,
    typeValue: string,
    typeKey: string = "key1",
    fieldKey: string = "key2"
) => {
    const types = new Map<string, unknown>();
    const workbook = get(path);
    for (const row of Object.values(workbook.sheets[sheetName].data)) {
        const key1 = row[typeKey];
        const key2 = row[fieldKey];
        const value = row["value"];
        const type = row["value_type"];
        if (key1.v === typeValue) {
            types.set(String(key2.v), convertValue(value, type.v as string).v);
        }
    }
    return types;
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

export const basename = (path: string, suffix: boolean = false) => {
    return _basename(path, !suffix ? extname(path) : undefined);
};
