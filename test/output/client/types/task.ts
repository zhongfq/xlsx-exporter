// AUTO GENERATED, DO NOT MODIFY!

// file: test/res/task.xlsx
export interface GeneratedTaskBranchRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 任务组 (checker: x)
     */
    readonly group: number;
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: number;
    /**
     * 任务类型 (checker: x)
     */
    readonly type: number;
    /**
     * 名字 (checker: x)
     */
    readonly name: string;
    /**
     * 描述 (checker: x)
     */
    readonly desc: string;
    /**
     * 后置任务 (checker: #branch.id)
     */
    readonly next_task?: number;
    /**
     * 条件 (checker: x)
     */
    readonly condition: string;
    /**
     * 累计 (checker: x)
     */
    readonly total?: boolean;
    /**
     * 参数 (checker: x)
     */
    readonly args: unknown;
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: unknown;
    /**
     * 任务icon (checker: x)
     */
    readonly icon: string;
    /**
     *  (checker: x)
     */
    readonly custom?: string;
    /**
     * 完成后自动提交 (checker: x)
     */
    readonly auto_submit?: number;
}

// file: test/res/task.xlsx
export interface GeneratedTaskBranchCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 任务组 (checker: x)
     */
    readonly group: (number)[];
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: (number)[];
    /**
     * 任务类型 (checker: x)
     */
    readonly type: (number)[];
    /**
     * 名字 (checker: x)
     */
    readonly name: (string)[];
    /**
     * 描述 (checker: x)
     */
    readonly desc: (string)[];
    /**
     * 后置任务 (checker: #branch.id)
     */
    readonly next_task: (number | undefined)[];
    /**
     * 条件 (checker: x)
     */
    readonly condition: (string)[];
    /**
     * 累计 (checker: x)
     */
    readonly total: (boolean | undefined)[];
    /**
     * 参数 (checker: x)
     */
    readonly args: (unknown)[];
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: (unknown)[];
    /**
     * 任务icon (checker: x)
     */
    readonly icon: (string)[];
    /**
     *  (checker: x)
     */
    readonly custom: (string | undefined)[];
    /**
     * 完成后自动提交 (checker: x)
     */
    readonly auto_submit: (number | undefined)[];
}

// file: test/res/task.xlsx
export interface GeneratedTaskConfRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 键 (checker: x)
     */
    readonly key: string;
    /**
     * 值 (checker: x)
     */
    readonly value: string;
    /**
     * 值类型 (checker: x)
     */
    readonly value_type: string;
    /**
     * 描述 (checker: x)
     */
    readonly desc: string;
}

// file: test/res/task.xlsx
export interface GeneratedTaskConfCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 键 (checker: x)
     */
    readonly key: (string)[];
    /**
     * 值 (checker: x)
     */
    readonly value: (string)[];
    /**
     * 值类型 (checker: x)
     */
    readonly value_type: (string)[];
    /**
     * 描述 (checker: x)
     */
    readonly desc: (string)[];
}

// file: test/res/task.xlsx
export interface GeneratedTaskEventsRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: number;
    /**
     * 任务类型 (checker: x)
     */
    readonly type: number;
    /**
     * 描述 (checker: x)
     */
    readonly desc: string;
    /**
     * 奖励 (checker: id=item#item.id)
     */
    readonly reward: unknown;
    /**
     * vip奖励 (checker: id=item#*.id)
     */
    readonly vip_reward: unknown;
    /**
     * 任务icon (checker: x)
     */
    readonly icon: string;
}

// file: test/res/task.xlsx
export interface GeneratedTaskEventsCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: (number)[];
    /**
     * 任务类型 (checker: x)
     */
    readonly type: (number)[];
    /**
     * 描述 (checker: x)
     */
    readonly desc: (string)[];
    /**
     * 奖励 (checker: id=item#item.id)
     */
    readonly reward: (unknown)[];
    /**
     * vip奖励 (checker: id=item#*.id)
     */
    readonly vip_reward: (unknown)[];
    /**
     * 任务icon (checker: x)
     */
    readonly icon: (string)[];
}

// file: test/res/task.xlsx
export interface GeneratedTaskExchangeRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: number;
    /**
     * 任务类型 (checker: x)
     */
    readonly type: number;
    /**
     * 描述 (checker: x)
     */
    readonly desc: string;
    /**
     * 后置任务 (checker: task#*.id)
     */
    readonly next_task?: number;
    /**
     * 累计 (checker: x)
     */
    readonly total?: boolean;
    /**
     * 参数 (checker: x)
     */
    readonly args: unknown;
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: unknown;
    /**
     * 任务icon (checker: x)
     */
    readonly icon: string;
    /**
     * 任务npc和对话 (checker: x)
     */
    readonly custom?: unknown;
}

// file: test/res/task.xlsx
export interface GeneratedTaskExchangeCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: (number)[];
    /**
     * 任务类型 (checker: x)
     */
    readonly type: (number)[];
    /**
     * 描述 (checker: x)
     */
    readonly desc: (string)[];
    /**
     * 后置任务 (checker: task#*.id)
     */
    readonly next_task: (number | undefined)[];
    /**
     * 累计 (checker: x)
     */
    readonly total: (boolean | undefined)[];
    /**
     * 参数 (checker: x)
     */
    readonly args: (unknown)[];
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: (unknown)[];
    /**
     * 任务icon (checker: x)
     */
    readonly icon: (string)[];
    /**
     * 任务npc和对话 (checker: x)
     */
    readonly custom: (unknown | undefined)[];
}

// file: test/res/task.xlsx
export interface GeneratedTaskMainRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 显示排序 (checker: value > 0 && value < 20)
     */
    readonly sort: number;
    /**
     * 任务类型 (checker: x)
     */
    readonly type: number;
    /**
     * 描述 (checker: x)
     */
    readonly desc: string;
    /**
     * 后置任务 (checker: task#*.id)
     */
    readonly next_task?: number;
    /**
     * 支线任务 (checker: #branch.id)
     */
    readonly branch_tasks?: unknown;
    /**
     * 条件 (checker: x)
     */
    readonly condition: string;
    /**
     * 累计 (checker: x)
     */
    readonly total?: boolean;
    /**
     * 参数 (checker: @TaskArgsChecker)
     */
    readonly args: unknown;
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: unknown;
    /**
     * 任务icon (checker: x)
     */
    readonly icon: string;
    /**
     *  (checker: x)
     */
    readonly custom?: unknown;
    /**
     * 完成后自动提交 (checker: [1])
     */
    readonly auto_submit?: number;
}

// file: test/res/task.xlsx
export interface GeneratedTaskMainCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 显示排序 (checker: value > 0 && value < 20)
     */
    readonly sort: (number)[];
    /**
     * 任务类型 (checker: x)
     */
    readonly type: (number)[];
    /**
     * 描述 (checker: x)
     */
    readonly desc: (string)[];
    /**
     * 后置任务 (checker: task#*.id)
     */
    readonly next_task: (number | undefined)[];
    /**
     * 支线任务 (checker: #branch.id)
     */
    readonly branch_tasks: (unknown | undefined)[];
    /**
     * 条件 (checker: x)
     */
    readonly condition: (string)[];
    /**
     * 累计 (checker: x)
     */
    readonly total: (boolean | undefined)[];
    /**
     * 参数 (checker: @TaskArgsChecker)
     */
    readonly args: (unknown)[];
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: (unknown)[];
    /**
     * 任务icon (checker: x)
     */
    readonly icon: (string)[];
    /**
     *  (checker: x)
     */
    readonly custom: (unknown | undefined)[];
    /**
     * 完成后自动提交 (checker: [1])
     */
    readonly auto_submit: (number | undefined)[];
}

// file: test/res/task.xlsx
export interface GeneratedTaskWeeklyRow {
    /**
     * ### (checker: x)
     */
    readonly id: number;
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: number;
    /**
     * 任务类型 (checker: x)
     */
    readonly type: number;
    /**
     * 描述 (checker: x)
     */
    readonly desc: string;
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: unknown;
    /**
     * 任务icon (checker: x)
     */
    readonly icon: string;
}

// file: test/res/task.xlsx
export interface GeneratedTaskWeeklyCol {
    /**
     * ### (checker: x)
     */
    readonly id: (number)[];
    /**
     * 显示排序 (checker: x)
     */
    readonly sort: (number)[];
    /**
     * 任务类型 (checker: x)
     */
    readonly type: (number)[];
    /**
     * 描述 (checker: x)
     */
    readonly desc: (string)[];
    /**
     * 奖励 (checker: @ItemArrayChecker)
     */
    readonly reward: (unknown)[];
    /**
     * 任务icon (checker: x)
     */
    readonly icon: (string)[];
}

