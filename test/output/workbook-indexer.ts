// AUTO GENERATED, DO NOT MODIFY!

import { ColumnIndexer, RowIndexer } from "../..";
import {
    ItemDefineRow,
    ItemFollowRow,
    ItemItemRow,
    ItemMapRow,
    ItemMapArrRow,
    ItemMapFieldRow,
    ItemMapObjRow,
    TaskBranchRow,
    TaskConfRow,
    TaskDefineRow,
    TaskEventsRow,
    TaskExchangeRow,
    TaskMainRow,
    TaskWeeklyRow,
} from "./workbook-typedef";

type Filter<T> = (row: T) => boolean;

// file: test/res/item.xlsx
export class ItemIndexer {
    static createRowIndexer(sheet: "define", filter?: Filter<ItemDefineRow>): RowIndexer<ItemDefineRow>;
    static createRowIndexer(sheet: "follow", filter?: Filter<ItemFollowRow>): RowIndexer<ItemFollowRow>;
    static createRowIndexer(sheet: "item", filter?: Filter<ItemItemRow>): RowIndexer<ItemItemRow>;
    static createRowIndexer(sheet: "map", filter?: Filter<ItemMapRow>): RowIndexer<ItemMapRow>;
    static createRowIndexer(sheet: "map_arr", filter?: Filter<ItemMapArrRow>): RowIndexer<ItemMapArrRow>;
    static createRowIndexer(sheet: "map_field", filter?: Filter<ItemMapFieldRow>): RowIndexer<ItemMapFieldRow>;
    static createRowIndexer(sheet: "map_obj", filter?: Filter<ItemMapObjRow>): RowIndexer<ItemMapObjRow>;
    static createRowIndexer(sheet: "define" | "follow" | "item" | "map" | "map_arr" | "map_field" | "map_obj", filter?: Filter<ItemDefineRow> | Filter<ItemFollowRow> | Filter<ItemItemRow> | Filter<ItemMapRow> | Filter<ItemMapArrRow> | Filter<ItemMapFieldRow> | Filter<ItemMapObjRow>): unknown {
        return new RowIndexer("item.xlsx", sheet, filter as Filter<ItemDefineRow | ItemFollowRow | ItemItemRow | ItemMapRow | ItemMapArrRow | ItemMapFieldRow | ItemMapObjRow>);
    }
    
    static createColumnIndexer(sheet: "define", field: keyof ItemDefineRow, filter?: Filter<ItemDefineRow>): ColumnIndexer<ItemDefineRow>;
    static createColumnIndexer(sheet: "follow", field: keyof ItemFollowRow, filter?: Filter<ItemFollowRow>): ColumnIndexer<ItemFollowRow>;
    static createColumnIndexer(sheet: "item", field: keyof ItemItemRow, filter?: Filter<ItemItemRow>): ColumnIndexer<ItemItemRow>;
    static createColumnIndexer(sheet: "map", field: keyof ItemMapRow, filter?: Filter<ItemMapRow>): ColumnIndexer<ItemMapRow>;
    static createColumnIndexer(sheet: "map_arr", field: keyof ItemMapArrRow, filter?: Filter<ItemMapArrRow>): ColumnIndexer<ItemMapArrRow>;
    static createColumnIndexer(sheet: "map_field", field: keyof ItemMapFieldRow, filter?: Filter<ItemMapFieldRow>): ColumnIndexer<ItemMapFieldRow>;
    static createColumnIndexer(sheet: "map_obj", field: keyof ItemMapObjRow, filter?: Filter<ItemMapObjRow>): ColumnIndexer<ItemMapObjRow>;
    static createColumnIndexer(sheet: "define" | "follow" | "item" | "map" | "map_arr" | "map_field" | "map_obj", field: string, filter?: Filter<ItemDefineRow> | Filter<ItemFollowRow> | Filter<ItemItemRow> | Filter<ItemMapRow> | Filter<ItemMapArrRow> | Filter<ItemMapFieldRow> | Filter<ItemMapObjRow>): unknown {
        return new ColumnIndexer("item.xlsx", sheet, field, filter as Filter<ItemDefineRow | ItemFollowRow | ItemItemRow | ItemMapRow | ItemMapArrRow | ItemMapFieldRow | ItemMapObjRow>);
    }
    
}

// file: test/res/task.xlsx
export class TaskIndexer {
    static createRowIndexer(sheet: "branch", filter?: Filter<TaskBranchRow>): RowIndexer<TaskBranchRow>;
    static createRowIndexer(sheet: "conf", filter?: Filter<TaskConfRow>): RowIndexer<TaskConfRow>;
    static createRowIndexer(sheet: "define", filter?: Filter<TaskDefineRow>): RowIndexer<TaskDefineRow>;
    static createRowIndexer(sheet: "events", filter?: Filter<TaskEventsRow>): RowIndexer<TaskEventsRow>;
    static createRowIndexer(sheet: "exchange", filter?: Filter<TaskExchangeRow>): RowIndexer<TaskExchangeRow>;
    static createRowIndexer(sheet: "main", filter?: Filter<TaskMainRow>): RowIndexer<TaskMainRow>;
    static createRowIndexer(sheet: "weekly", filter?: Filter<TaskWeeklyRow>): RowIndexer<TaskWeeklyRow>;
    static createRowIndexer(sheet: "branch" | "conf" | "define" | "events" | "exchange" | "main" | "weekly", filter?: Filter<TaskBranchRow> | Filter<TaskConfRow> | Filter<TaskDefineRow> | Filter<TaskEventsRow> | Filter<TaskExchangeRow> | Filter<TaskMainRow> | Filter<TaskWeeklyRow>): unknown {
        return new RowIndexer("task.xlsx", sheet, filter as Filter<TaskBranchRow | TaskConfRow | TaskDefineRow | TaskEventsRow | TaskExchangeRow | TaskMainRow | TaskWeeklyRow>);
    }
    
    static createColumnIndexer(sheet: "branch", field: keyof TaskBranchRow, filter?: Filter<TaskBranchRow>): ColumnIndexer<TaskBranchRow>;
    static createColumnIndexer(sheet: "conf", field: keyof TaskConfRow, filter?: Filter<TaskConfRow>): ColumnIndexer<TaskConfRow>;
    static createColumnIndexer(sheet: "define", field: keyof TaskDefineRow, filter?: Filter<TaskDefineRow>): ColumnIndexer<TaskDefineRow>;
    static createColumnIndexer(sheet: "events", field: keyof TaskEventsRow, filter?: Filter<TaskEventsRow>): ColumnIndexer<TaskEventsRow>;
    static createColumnIndexer(sheet: "exchange", field: keyof TaskExchangeRow, filter?: Filter<TaskExchangeRow>): ColumnIndexer<TaskExchangeRow>;
    static createColumnIndexer(sheet: "main", field: keyof TaskMainRow, filter?: Filter<TaskMainRow>): ColumnIndexer<TaskMainRow>;
    static createColumnIndexer(sheet: "weekly", field: keyof TaskWeeklyRow, filter?: Filter<TaskWeeklyRow>): ColumnIndexer<TaskWeeklyRow>;
    static createColumnIndexer(sheet: "branch" | "conf" | "define" | "events" | "exchange" | "main" | "weekly", field: string, filter?: Filter<TaskBranchRow> | Filter<TaskConfRow> | Filter<TaskDefineRow> | Filter<TaskEventsRow> | Filter<TaskExchangeRow> | Filter<TaskMainRow> | Filter<TaskWeeklyRow>): unknown {
        return new ColumnIndexer("task.xlsx", sheet, field, filter as Filter<TaskBranchRow | TaskConfRow | TaskDefineRow | TaskEventsRow | TaskExchangeRow | TaskMainRow | TaskWeeklyRow>);
    }
    
}


