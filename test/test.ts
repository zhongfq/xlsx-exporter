import * as xlsx from "..";

import "./init";

const t = Date.now();

const OUTPUT_DIR = "test/output";

xlsx.registerWriter("client", (path, data, processor) => {
    if (processor === "config") {
        const name = xlsx.toPascalCase(`${xlsx.basename(path)}_${data["!name"]}`);
        const marshal = `export const ${name} = `;
        xlsx.writeFile(
            `${OUTPUT_DIR}/client/config/${name}.ts`,
            xlsx.stringifyTs(data, { indent: 4, marshal })
        );
    } else if (processor === "stringify") {
        const name = xlsx.basename(path);
        xlsx.writeFile(
            `${OUTPUT_DIR}/client/data/${name}.json`,
            xlsx.stringifyJson(data, { indent: 2 })
        );
    } else if (processor === "typedef") {
        const name = xlsx.basename(path);
        const types = xlsx.generateTsTypedef(path, "client");
        xlsx.writeFile(
            `${OUTPUT_DIR}/client/types/${name}.ts`,
            xlsx.outdent(`
                // AUTO GENERATED, DO NOT MODIFY!

                ${types}
            `)
        );
    } else {
        throw new Error(`Unknown handler processor: ${processor}`);
    }
});

xlsx.registerWriter("server", (path, data, processor) => {
    if (processor === "config") {
        const name = `${xlsx.basename(path)}_${data["!name"]}`;
        const marshal = `return `;
        xlsx.writeFile(
            `${OUTPUT_DIR}/server/config/${name}.lua`,
            xlsx.stringifyLua(data, { indent: 4, marshal })
        );
    } else if (processor === "stringify") {
        const name = xlsx.basename(path);
        const marshal = `return `;
        xlsx.writeFile(
            `${OUTPUT_DIR}/server/data/${name}.lua`,
            xlsx.stringifyLua(data, { indent: 2, marshal })
        );
    } else if (processor === "typedef") {
        const name = xlsx.basename(path);
        const types = xlsx.generateLuaTypedef(path, "server");
        xlsx.writeFile(
            `${OUTPUT_DIR}/server/types/${name}.lua`,
            xlsx.outdent(`
                -- AUTO GENERATED, DO NOT MODIFY!
                
                ${types}
            `)
        );
    } else {
        throw new Error(`Unknown handler processor: ${processor}`);
    }
});

xlsx.parse(["test/res/item.xlsx", "test/res/task.xlsx"]);

console.log(Date.now() - t);
