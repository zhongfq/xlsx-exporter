import JSON5 from "json5";
import { TypeConvertor } from "./xlsx";

const bools: Record<string, boolean> = {
    ["true"]: true,
    ["1"]: true,
    ["✔︎"]: true,
    ["false"]: false,
    ["0"]: false,
    ["✖︎"]: false,
    ["x"]: false,
};

export const boolConvertor: TypeConvertor = (str) => {
    return bools[str] ?? null;
};

export const intConvertor: TypeConvertor = (str) => {
    const result = Number(str);
    if (isNaN(result) || result !== (result | 0)) {
        return null;
    }
    return result;
};

export const stringConvertor: TypeConvertor = (str) => {
    return str === "" ? null : str;
};

export const floatConvertor: TypeConvertor = (str) => {
    const result = Number(str);
    if (isNaN(result)) {
        return null;
    }
    return result;
};

export const jsonConvertor: TypeConvertor = (str) => {
    try {
        return JSON5.parse(str);
        // eslint-disable-next-line no-empty
    } catch (_) {}
    try {
        return JSON.parse(str);
        // eslint-disable-next-line no-empty
    } catch (_) {}
    return null;
};
