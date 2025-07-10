// AUTO GENERATED, DO NOT MODIFY!

// file: test/res/item.xlsx
export interface ItemFollow {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 物品类型 (checker: x) (writer: client|server)
     */
    readonly name: { v?:string };
    /**
     *  (checker: @follow(name)) (writer: client|server)
     */
    readonly value: { v?:string };
}

// file: test/res/item.xlsx
export interface ItemItem {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 注释 (checker: x) (writer: client|server)
     */
    readonly comment: { v:string };
    /**
     * 物品名称 (checker: x) (writer: client|server)
     */
    readonly name: { v:string };
    /**
     * 物品说明 (checker: x) (writer: client)
     */
    readonly desc: { v:string };
    /**
     * 物品类型\nconfig.ITEM_TYPE (checker: x) (writer: client|server)
     */
    readonly item_type: { v:number };
    /**
     * 背包类型\nconfig.BAG_TYPE (checker: x) (writer: client|server)
     */
    readonly bag_id: { v:number };
    /**
     * 可否堆叠 (checker: x) (writer: client|server)
     */
    readonly stack: { v?:number };
    /**
     * 品质(颜色) (checker: x) (writer: client|server)
     */
    readonly quality: { v:number };
    /**
     * 参数 (checker: x) (writer: client|server)
     */
    readonly args: { v?:unknown };
    /**
     * 背包是否隐藏 (checker: x) (writer: client|server)
     */
    readonly hide: { v?:boolean };
}

// file: test/res/item.xlsx
export interface ItemMap {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 注释 (checker: x) (writer: client|server)
     */
    readonly comment: { v:string };
    /**
     *  (checker: x) (writer: client|server)
     */
    readonly kind: { v:number };
    /**
     *  (checker: x) (writer: client|server)
     */
    readonly level: { v:number };
    /**
     * 物品名称 (checker: x) (writer: client|server)
     */
    readonly name: { v:string };
}

// file: test/res/task.xlsx
export interface TaskBranch {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 任务组 (checker: x) (writer: client|server)
     */
    readonly group: { v:number };
    /**
     * 显示排序 (checker: x) (writer: client|server)
     */
    readonly sort: { v:number };
    /**
     * 任务类型 (checker: x) (writer: client|server)
     */
    readonly type: { v:number };
    /**
     * 名字 (checker: x) (writer: client)
     */
    readonly name: { v:string };
    /**
     * 描述 (checker: x) (writer: client|server)
     */
    readonly desc: { v:string };
    /**
     * 后置任务 (checker: #branch.id) (writer: client|server)
     */
    readonly next_task: { v?:number };
    /**
     * 条件 (checker: x) (writer: client|server)
     */
    readonly condition: { v:string };
    /**
     * 累计 (checker: x) (writer: client|server)
     */
    readonly total: { v?:boolean };
    /**
     * 参数 (checker: x) (writer: client|server)
     */
    readonly args: { v:unknown };
    /**
     * 奖励 (checker: @ItemArrayChecker) (writer: client|server)
     */
    readonly reward: { v:unknown };
    /**
     * 任务icon (checker: x) (writer: client)
     */
    readonly icon: { v:string };
    /**
     *  (checker: x) (writer: client)
     */
    readonly custom: { v?:string };
    /**
     * 完成后自动提交 (checker: x) (writer: client)
     */
    readonly auto_submit: { v?:number };
}

// file: test/res/task.xlsx
export interface TaskConf {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 键 (checker: x) (writer: client|server)
     */
    readonly key: { v:string };
    /**
     * 值 (checker: x) (writer: client|server)
     */
    readonly value: { v:string };
    /**
     * 值类型 (checker: x) (writer: client|server)
     */
    readonly value_type: { v:string };
    /**
     * 描述 (checker: x) (writer: client|server)
     */
    readonly desc: { v:string };
}

// file: test/res/task.xlsx
export interface TaskEvents {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 显示排序 (checker: x) (writer: client|server)
     */
    readonly sort: { v:number };
    /**
     * 任务类型 (checker: x) (writer: client|server)
     */
    readonly type: { v:number };
    /**
     * 描述 (checker: x) (writer: client|server)
     */
    readonly desc: { v:string };
    /**
     * 条件 (checker: x) (writer: server)
     */
    readonly condition: { v:string };
    /**
     * 参数 (checker: x) (writer: server)
     */
    readonly args: { v:unknown };
    /**
     * 奖励 (checker: id=item#item.id) (writer: client|server)
     */
    readonly reward: { v:unknown };
    /**
     * vip奖励 (checker: id=item#*.id) (writer: client|server)
     */
    readonly vip_reward: { v:unknown };
    /**
     * 任务icon (checker: x) (writer: client)
     */
    readonly icon: { v:string };
}

// file: test/res/task.xlsx
export interface TaskExchange {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 显示排序 (checker: x) (writer: client|server)
     */
    readonly sort: { v:number };
    /**
     * 任务类型 (checker: x) (writer: client|server)
     */
    readonly type: { v:number };
    /**
     * 描述 (checker: x) (writer: client|server)
     */
    readonly desc: { v:string };
    /**
     * 后置任务 (checker: task#*.id) (writer: client|server)
     */
    readonly next_task: { v?:number };
    /**
     * 条件 (checker: x) (writer: server)
     */
    readonly condition: { v:string };
    /**
     * 累计 (checker: x) (writer: client|server)
     */
    readonly total: { v?:boolean };
    /**
     * 参数 (checker: x) (writer: client|server)
     */
    readonly args: { v:unknown };
    /**
     * 奖励 (checker: @ItemArrayChecker) (writer: client|server)
     */
    readonly reward: { v:unknown };
    /**
     * 任务icon (checker: x) (writer: client)
     */
    readonly icon: { v:string };
    /**
     * 任务npc和对话 (checker: x) (writer: client)
     */
    readonly custom: { v?:unknown };
}

// file: test/res/task.xlsx
export interface TaskMain {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 显示排序 (checker: value > 0 && value < 20) (writer: client|server)
     */
    readonly sort: { v:number };
    /**
     * 任务类型 (checker: x) (writer: client|server)
     */
    readonly type: { v:number };
    /**
     * 描述 (checker: x) (writer: client|server)
     */
    readonly desc: { v:string };
    /**
     * 后置任务 (checker: task#*.id) (writer: client|server)
     */
    readonly next_task: { v?:number };
    /**
     * 支线任务 (checker: #branch.id) (writer: client|server)
     */
    readonly branch_tasks: { v?:unknown };
    /**
     * 条件 (checker: x) (writer: client|server)
     */
    readonly condition: { v:string };
    /**
     * 累计 (checker: x) (writer: client|server)
     */
    readonly total: { v?:boolean };
    /**
     * 参数 (checker: @TaskArgsChecker) (writer: client|server)
     */
    readonly args: { v:unknown };
    /**
     * 奖励 (checker: @ItemArrayChecker) (writer: client|server)
     */
    readonly reward: { v:unknown };
    /**
     * 任务icon (checker: x) (writer: client)
     */
    readonly icon: { v:string };
    /**
     *  (checker: x) (writer: client)
     */
    readonly custom: { v?:unknown };
    /**
     * 完成后自动提交 (checker: [1]) (writer: client)
     */
    readonly auto_submit: { v?:number };
}

// file: test/res/task.xlsx
export interface TaskWeekly {
    /**
     * ### (checker: x) (writer: client|server)
     */
    readonly id: { v:number };
    /**
     * 显示排序 (checker: x) (writer: client|server)
     */
    readonly sort: { v:number };
    /**
     * 任务类型 (checker: x) (writer: client|server)
     */
    readonly type: { v:number };
    /**
     * 描述 (checker: x) (writer: client|server)
     */
    readonly desc: { v:string };
    /**
     * 条件 (checker: x) (writer: server)
     */
    readonly condition: { v:string };
    /**
     * 参数 (checker: x) (writer: server)
     */
    readonly args: { v:unknown };
    /**
     * 奖励 (checker: @ItemArrayChecker) (writer: client|server)
     */
    readonly reward: { v:unknown };
    /**
     * 任务icon (checker: x) (writer: client)
     */
    readonly icon: { v:string };
}

