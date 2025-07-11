import assert from "node:assert";
import { convertToConfig, convertToFold, convertToKeyValue, convertToMap } from "./util";
import { filter, Processor, Sheet, TagType, TObject, TRow, Workbook, writers } from "./xlsx";

//-----------------------------------------------------------------------------
// Stringify
//-----------------------------------------------------------------------------
export type StringifyRule = (workbook: Workbook, writer: string) => TObject;
const rules: Record<string, StringifyRule> = {};

export const registerStringifyRule = (name: string, rule: StringifyRule) => {
    assert(!rules[name], `Stringify rule '${name}' already registered`);
    rules[name] = rule;
};

export const mergeSheet = (workbook: Workbook, writer: string) => {
    const result: TObject = {};
    for (const sheetName in workbook.sheets) {
        const sheet = workbook.sheets[sheetName];
        for (const k in sheet.data) {
            const row = sheet.data[k];
            if (result[k]) {
                throw new Error(`Duplicate key: ${k}`);
            }
            result[k] = row;
        }
    }
    return result;
};

export const simpleSheet = (workbook: Workbook, writer: string) => {
    const result: TObject = {};
    for (const k in workbook.sheets) {
        result[k] = workbook.sheets[k].data;
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
        throw new Error(`Stringify rule not found: ${ruleName}`);
    }
    for (const k in writers) {
        const filtered = filter(workbook, k);
        const writer = writers[k];
        writer(filtered.path, rule(filtered, k), "stringify");
    }
};

//-----------------------------------------------------------------------------
// KeyValue
//-----------------------------------------------------------------------------
export const KeyValueProcessor: Processor = (workbook: Workbook, sheet: Sheet) => {
    const config = convertToKeyValue(sheet);
    sheet.data = {};
    for (const k in config) {
        const v = config[k];
        const row: TRow = {};
        row["!type"] = TagType.Row;
        row["!value"] = v;
        sheet.data[k] = row;
    }
};

//-----------------------------------------------------------------------------
// Config
//-----------------------------------------------------------------------------
export const ConfigProcessor: Processor = (workbook: Workbook, sheet: Sheet) => {
    delete workbook.sheets[sheet.name];
    const config = convertToConfig(sheet);
    config["!name"] = sheet.name;
    for (const k in writers) {
        const writer = writers[k];
        writer(workbook.path, config, "config");
    }
};

//-----------------------------------------------------------------------------
// Map
//-----------------------------------------------------------------------------
export const MapProcessor: Processor = (workbook: Workbook, sheet: Sheet, ...keys: string[]) => {
    const result = convertToMap(sheet, ...keys);
    sheet.data = {};
    for (const k in result) {
        const v = result[k];
        const row: TRow = {};
        row["!type"] = TagType.Row;
        row["!value"] = v;
        sheet.data[k] = row;
    }
};

//-----------------------------------------------------------------------------
// Fold
//-----------------------------------------------------------------------------
export const FoldProcessor: Processor = (
    workbook: Workbook,
    sheet: Sheet,
    idxKey: string,
    ...foldKeys: string[]
) => {
    const result = convertToFold(sheet, idxKey, ...foldKeys);
    sheet.data = {};
    for (const k in result) {
        const v = result[k];
        const row: TRow = {};
        row["!type"] = TagType.Row;
        row["!value"] = v;
        sheet.data[k] = row;
    }
};

//-----------------------------------------------------------------------------
// Type Define
//-----------------------------------------------------------------------------
export const TypedefProcessor: Processor = (workbook: Workbook, sheet: Sheet) => {
    for (const k in writers) {
        const writer = writers[k];
        writer(workbook.path, workbook as unknown as TObject, "typedef");
    }
};
