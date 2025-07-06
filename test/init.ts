import * as xlsx from "..";

{
    let qualityTypes: Map<string, unknown> | undefined;
    xlsx.registerType("quality", "int", (value) => {
        qualityTypes ??= xlsx.convertToType("item.xlsx", "config", "QUALITY");
        return qualityTypes.get(value);
    });
}

{
    let taskTypes: Map<string, unknown> | undefined;
    xlsx.registerType("task_type", "int", (value) => {
        taskTypes ??= xlsx.convertToType("task.xlsx", "config", "TASK_TYPE");
        return taskTypes.get(value);
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
    let itemTypes: Map<string, unknown> | undefined;
    xlsx.registerType("item_type", "int", (value) => {
        itemTypes ??= xlsx.convertToType("item.xlsx", "config", "ITEM_TYPE");
        return itemTypes.get(value);
    });
}

{
    let bagTypes: Map<string, unknown> | undefined;
    xlsx.registerType("bag_type", "int", (value) => {
        bagTypes ??= xlsx.convertToType("item.xlsx", "config", "BAG_TYPE");
        return bagTypes.get(value);
    });
}

xlsx.registerChecker("TaskArgsChecker", () => () => true);
xlsx.registerChecker("ItemArrayChecker", () => () => true);
