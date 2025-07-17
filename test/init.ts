import * as xlsx from "..";

{
    let types: Record<string, xlsx.TValue> | undefined;
    xlsx.registerType("quality", "int", (value) => {
        types ??= xlsx.decltype("item.xlsx", "define", "QUALITY");
        return types[value];
    });
}

{
    let types: Record<string, xlsx.TValue> | undefined;
    xlsx.registerType("task_type", "int", (value) => {
        types ??= xlsx.decltype("task.xlsx", "define", "TASK_TYPE");
        return types[value];
    });
}

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

{
    let types: Record<string, xlsx.TValue> | undefined;
    xlsx.registerType("item_type", "int", (value) => {
        types ??= xlsx.decltype("item.xlsx", "define", "ITEM_TYPE");
        return types[value];
    });
}

{
    let types: Record<string, xlsx.TValue> | undefined;
    xlsx.registerType("bag_type", "int", (value) => {
        types ??= xlsx.decltype("item.xlsx", "define", "BAG_TYPE");
        return types[value];
    });
}

xlsx.registerChecker("TaskArgsChecker", () => () => true);
xlsx.registerChecker("ItemArrayChecker", () => () => true);
