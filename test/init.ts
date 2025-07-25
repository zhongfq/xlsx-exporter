import * as xlsx from "..";

{
    xlsx.registerType("items", (value) => {
        try {
            type ItemArray = [number, number][];
            const items = xlsx.convertValue(value, "table") as ItemArray;
            if (Array.isArray(items)) {
                return items.map((v) => ({ id: v[0], count: v[1] }));
            }
            return null;
        } catch {
            return null;
        }
    });
}

xlsx.registerChecker("TaskArgsChecker", () => () => true);
xlsx.registerChecker("ItemArrayChecker", () => () => true);
