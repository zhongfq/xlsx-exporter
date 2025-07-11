import assert from "assert";
import { sortKeys } from "./util";
import {
    Sheet,
    TArray,
    TCell,
    TObject,
    TValue,
    convertValue,
    getSheet,
    isNullOrUndefined,
    toString,
} from "./xlsx";

export const convertToConfig = (sheet: Sheet) => {
    const keys = Object.keys(sheet.data)
        .map((k) => Number(k))
        .filter((v) => !isNaN(v))
        .sort((a, b) => a - b);

    const config: TObject = {};
    const enumOptions: TObject[] = [];

    for (let i = 0; i < keys.length; i++) {
        const idx = keys[i];
        assert(idx === i + 1, `Key '${idx}' is not found`);

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
                    const enumName = toString(row["enum"]);
                    if (enumName) {
                        t["!enum"] = enumName;
                    }
                }
                if (!t["!comment"]) {
                    const comment = toString(row["comment"]);
                    if (comment) {
                        t["!comment"] = comment;
                    }
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
            return String(a.value).localeCompare(String(b.value));
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

/**
 * Convert a single key table to a multi-key table
        example:
        
        t = {
            {id1: 1, id2: 1, data: 1111},
            {id1: 1, id2: 5, data: 2222},
        }

        convertToMap(t, "id1", "id2")
        =>
        t = {
            [1] = {
                [1] = {id1: 1, id2: 1, data: 1111},
                [5] = {id1: 1, id2: 5, data: 2222},
            }
        }
 */
export const convertToMap = (sheet: Sheet, ...keys: string[]) => {
    const result: { [key: string]: TValue } = {};
    for (const k of sortKeys(sheet.data)) {
        const row = sheet.data[k];
        let t = result;
        for (let i = 0; i < keys.length; i++) {
            const key = row[keys[i]]?.v as string;
            if (isNullOrUndefined(key)) {
                throw new Error(
                    `Key '${keys[i]}' is not found at row ${row["!index"]} of sheet ${sheet.name}`
                );
            }
            if (i === keys.length - 1) {
                t[key] = row;
            } else {
                if (!t[key]) {
                    t[key] = {};
                }
                t = t[key] as TObject;
            }
        }
    }
    return result;
};

export const convertToFold = (sheet: Sheet, idxKey: string, ...foldKeys: string[]) => {
    const result: { [key: string]: TObject } = {};
    for (const key of sortKeys(sheet.data)) {
        const row = sheet.data[key];
        const idx = row[idxKey]?.v as string;
        if (isNullOrUndefined(idx)) {
            throw new Error(
                `Key '${idxKey}' is not found at row ${row["!index"]} of sheet ${sheet.name}`
            );
        }
        let value = result[idx];
        if (!value) {
            result[idx] = { ...row };
            value = result[idx];
            delete value[sheet.fields[0].name];
            for (const k of foldKeys) {
                value[k] = [];
            }
        }
        for (const k of foldKeys) {
            const v = row[k];
            if (!isNullOrUndefined(v)) {
                (value[k] as TArray).push(v);
            }
        }
    }
    return result;
};

export const convertToType = <T>(
    path: string,
    sheetName: string,
    typeValue: string,
    typeKey: string = "key1",
    fieldKey: string = "key2"
) => {
    const types: Record<string, T> = {};
    const sheet = getSheet(path, sheetName);
    for (const k of sortKeys(sheet.data)) {
        const row = sheet.data[k];
        const key1 = row[typeKey];
        const key2 = row[fieldKey];
        const value = row["value"];
        const type = row["value_type"];
        if (key1.v === typeValue) {
            types[String(key2.v)] = convertValue(value, type.v as string).v as T;
        }
    }
    return types;
};
