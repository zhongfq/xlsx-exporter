import { StringBuffer } from "./stringify";
import { basename, toPascalCase } from "./util";
import { Context, convertors, Workbook } from "./xlsx";

const basicTypes = ["string", "number", "boolean", "unknown", "object"];

export type TypeResolver = (typename: string) => { type: string; path?: string };

export const genTsTypedef = (workbook: Workbook, resolver: TypeResolver) => {
    const buffer = new StringBuffer(4);
    buffer.writeLine(`// AUTO GENERATED, DO NOT MODIFY!`);
    buffer.writeLine(`// file: ${workbook.path}`);
    buffer.writeLine("");

    const sheets = workbook.sheets.filter((s) => !s.ignore);
    const typeBuffer = new StringBuffer(4);
    const name = basename(workbook.path);
    const namedTypes: Record<string, Set<string>> = {};
    for (const sheet of sheets) {
        const className = toPascalCase(`Generated_${name}_${sheet.name}_Row`);
        typeBuffer.writeLine(`export interface ${className} {`);
        typeBuffer.indent();
        for (const field of sheet.fields.filter((f) => !f.ignore)) {
            const checker = field.checker.map((v) => v.source).join(";");
            const comment = field.comment.replaceAll(/[\r\n]+/g, " ");
            typeBuffer.writeLine(`/**`);
            typeBuffer.writeLine(
                ` * ${comment} (location: ${field.refer}) (checker: ${checker || "x"})`
            );
            typeBuffer.writeLine(` */`);
            let typename = field.realtype ?? field.typename;
            const optional = typename.endsWith("?") ? "?" : "";
            const array = typename.match(/[[\]]+/)?.[0] ?? "";
            typename = typename.replaceAll("?", "").replaceAll("[]", "");
            if (typename === "int" || typename === "float" || typename === "auto") {
                typeBuffer.writeLine(`readonly ${field.name}${optional}: number${array};`);
            } else if (typename === "string") {
                typeBuffer.writeLine(`readonly ${field.name}${optional}: string${array};`);
            } else if (typename === "bool") {
                typeBuffer.writeLine(`readonly ${field.name}${optional}: boolean${array};`);
            } else if (
                typename.startsWith("json") ||
                typename.startsWith("table") ||
                typename.startsWith("unknown") ||
                typename.startsWith("@")
            ) {
                typeBuffer.writeLine(`readonly ${field.name}${optional}: unknown${array};`);
            } else {
                const ret = resolver(typename);
                if (ret.path) {
                    namedTypes[ret.path] ||= new Set();
                    namedTypes[ret.path].add(ret.type);
                }
                typeBuffer.writeLine(`readonly ${field.name}${optional}: ${ret.type}${array};`);
            }
        }
        typeBuffer.unindent();
        typeBuffer.writeLine(`}`);
        typeBuffer.writeLine("");
    }

    if (Object.keys(namedTypes).length > 0) {
        for (const entry of Object.entries(namedTypes)) {
            const types = Array.from(entry[1])
                .filter((t) => !basicTypes.includes(t))
                .sort();
            if (types.length > 0) {
                buffer.writeLine(`import {`);
                for (const typename of types) {
                    buffer.writeLine(`    ${typename},`);
                }
                buffer.writeLine(`} from "${entry[0]}";`);
            }
        }
        buffer.writeLine("");
    }

    buffer.writeString(typeBuffer.toString());

    return buffer.toString();
};

export const genLuaTypedef = (workbook: Workbook, resolver: TypeResolver) => {
    const sheets = workbook.sheets.filter((s) => !s.ignore);
    const buffer = new StringBuffer(4);
    const name = basename(workbook.path);
    for (const sheet of sheets) {
        const className =
            `xlsx.${workbook.context.writer}.` + toPascalCase(`${name}_${sheet.name}`);
        buffer.writeLine(`---file: ${workbook.path}`);
        buffer.writeLine(`---@class ${className}`);
        for (const field of sheet.fields.filter((f) => !f.ignore)) {
            const optional = field.typename.endsWith("?") ? "?" : "";
            const array = field.typename.match(/[[\]]+/)?.[0] ?? "";
            let typename = field.typename.replaceAll("?", "").replaceAll("[]", "");
            typename = typename.startsWith("@") ? "table" : typename;
            const comment = field.comment.replaceAll(/[\r\n]+/g, " ");
            if (typename === "int" || typename === "auto") {
                buffer.writeLine(`---@field ${field.name}${optional} integer${array} ${comment}`);
            } else if (typename === "float") {
                buffer.writeLine(`---@field ${field.name}${optional} number${array} ${comment}`);
            } else if (typename === "string" || typename.startsWith("@")) {
                buffer.writeLine(`---@field ${field.name}${optional} string${array} ${comment}`);
            } else if (typename === "bool") {
                buffer.writeLine(`---@field ${field.name}${optional} boolean${array} ${comment}`);
            } else {
                const ret = resolver(typename);
                buffer.writeLine(
                    `---@field ${field.name}${optional} ${ret.type}${array} ${comment}`
                );
            }
        }
        buffer.writeLine("");
    }
    return buffer.toString();
};

export const genWorkbookTypedef = (ctx: Context, resolver: TypeResolver) => {
    const buffer = new StringBuffer(4);
    buffer.writeLine(`// AUTO GENERATED, DO NOT MODIFY!\n`);

    const typeBuffer = new StringBuffer(4);
    const namedTypes: Record<string, Set<string>> = {};

    const TCellImport = resolver("TCell");
    namedTypes[TCellImport.path!] ||= new Set();
    namedTypes[TCellImport.path!].add(TCellImport.type);

    for (const workbook of ctx.workbooks) {
        const name = basename(workbook.path);
        for (const sheet of workbook.sheets) {
            const className = toPascalCase(`${name}_${sheet.name}_Row`);

            // row
            typeBuffer.writeLine(`// file: ${workbook.path}`);
            if (sheet.processors.length > 0) {
                typeBuffer.writeLine(`// processors:`);
                for (const p of sheet.processors) {
                    typeBuffer.writeString(`//  - @${p.name}`);
                    if (p.args.length > 0) {
                        typeBuffer.writeString(`(${p.args.join(", ")})`);
                    }
                    typeBuffer.writeLine("");
                }
            }
            typeBuffer.writeLine(`export interface ${className} {`);
            typeBuffer.indent();
            for (const field of sheet.fields) {
                if (field.name.startsWith("--")) {
                    continue;
                }
                const checker = field.checker.map((v) => v.source).join(";");
                const optional = field.typename.endsWith("?") ? "?" : "";
                const comment = field.comment.replaceAll(/[\r\n]+/g, " ");
                const array = field.typename.match(/[[\]]+/)?.[0] ?? "";
                let typename = field.typename.replaceAll("?", "").replaceAll("[]", "");
                if (typename.startsWith("@")) {
                    typename = "unknown";
                } else if (!convertors[typename]) {
                    const where = `file: ${workbook.path}#${sheet.name}#${field.refer}:${field.name}`;
                    throw new Error(`convertor not found: ${typename} (${where})`);
                }
                typeBuffer.writeLine(`/**`);
                typeBuffer.writeLine(
                    ` * ${comment} (location: ${field.refer}) (checker: ${checker || "x"}) ` +
                        `(writer: ${field.writers.join("|")})`
                );
                typeBuffer.writeLine(` */`);
                typeBuffer.padding();
                typeBuffer.writeString(`${field.name}: { v${optional}: `);
                if (typename === "int" || typename === "float" || typename === "auto") {
                    typeBuffer.writeString(`number`);
                } else if (typename === "string") {
                    typeBuffer.writeString(`string`);
                } else if (typename === "bool") {
                    typeBuffer.writeString(`boolean`);
                } else if (
                    typename.startsWith("json") ||
                    typename.startsWith("table") ||
                    typename.startsWith("unknown") ||
                    typename.startsWith("@")
                ) {
                    typeBuffer.writeString(`unknown`);
                } else {
                    const ret = resolver(typename);
                    if (ret.path) {
                        namedTypes[ret.path] ||= new Set();
                        namedTypes[ret.path].add(ret.type);
                    }
                    typeBuffer.writeString(`${ret.type}`);
                }
                typeBuffer.writeString(`${array} } & TCell;`);
                typeBuffer.linefeed();
            }
            typeBuffer.unindent();
            typeBuffer.writeLine(`}`);
            typeBuffer.writeLine("");
        }
    }

    if (Object.keys(namedTypes).length > 0) {
        for (const entry of Object.entries(namedTypes)) {
            const types = Array.from(entry[1])
                .filter((t) => !basicTypes.includes(t))
                .sort();
            if (types.length > 0) {
                buffer.writeLine(`import {`);
                for (const typename of types) {
                    buffer.writeLine(`    ${typename},`);
                }
                buffer.writeLine(`} from "${entry[0]}";`);
            }
        }
        buffer.writeLine("");
    }

    buffer.writeLine(`type TCell = Omit<_TCell, "v">;`);
    buffer.writeLine("");
    buffer.writeLine(typeBuffer.toString());
    return buffer.toString();
};
