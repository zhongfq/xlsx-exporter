// AUTO GENERATED, DO NOT MODIFY!

// file: test/res/item.xlsx
export interface GeneratedItemFollowRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 物品类型 (checker: x)
     */
    readonly name?: string;
    /**
     *  (checker: @follow(name))
     */
    readonly value?: string;
}

// file: test/res/item.xlsx
export interface GeneratedItemFollowCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 物品类型 (checker: x)
     */
    readonly name: (string | undefined)[];
    /**
     *  (checker: @follow(name))
     */
    readonly value: (string | undefined)[];
}

// file: test/res/item.xlsx
export interface GeneratedItemItemRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 注释 (checker: x)
     */
    readonly comment: string;
    /**
     * 物品名称 (checker: x)
     */
    readonly name: string;
    /**
     * 物品说明 (checker: x)
     */
    readonly desc: string;
    /**
     * 物品类型\nconfig.ITEM_TYPE (checker: x)
     */
    readonly item_type: number;
    /**
     * 背包类型\nconfig.BAG_TYPE (checker: x)
     */
    readonly bag_id: number;
    /**
     * 可否堆叠 (checker: x)
     */
    readonly stack?: number;
    /**
     * 品质(颜色) (checker: x)
     */
    readonly quality: number;
    /**
     * 参数 (checker: x)
     */
    readonly args?: unknown;
    /**
     * 背包是否隐藏 (checker: x)
     */
    readonly hide?: boolean;
}

// file: test/res/item.xlsx
export interface GeneratedItemItemCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 注释 (checker: x)
     */
    readonly comment: (string)[];
    /**
     * 物品名称 (checker: x)
     */
    readonly name: (string)[];
    /**
     * 物品说明 (checker: x)
     */
    readonly desc: (string)[];
    /**
     * 物品类型\nconfig.ITEM_TYPE (checker: x)
     */
    readonly item_type: (number)[];
    /**
     * 背包类型\nconfig.BAG_TYPE (checker: x)
     */
    readonly bag_id: (number)[];
    /**
     * 可否堆叠 (checker: x)
     */
    readonly stack: (number | undefined)[];
    /**
     * 品质(颜色) (checker: x)
     */
    readonly quality: (number)[];
    /**
     * 参数 (checker: x)
     */
    readonly args: (unknown | undefined)[];
    /**
     * 背包是否隐藏 (checker: x)
     */
    readonly hide: (boolean | undefined)[];
}

// file: test/res/item.xlsx
export interface GeneratedItemMapRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 注释 (checker: x)
     */
    readonly comment: string;
    /**
     *  (checker: x)
     */
    readonly kind: number;
    /**
     *  (checker: x)
     */
    readonly level: number;
    /**
     * 物品名称 (checker: x)
     */
    readonly name: string;
}

// file: test/res/item.xlsx
export interface GeneratedItemMapCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 注释 (checker: x)
     */
    readonly comment: (string)[];
    /**
     *  (checker: x)
     */
    readonly kind: (number)[];
    /**
     *  (checker: x)
     */
    readonly level: (number)[];
    /**
     * 物品名称 (checker: x)
     */
    readonly name: (string)[];
}

