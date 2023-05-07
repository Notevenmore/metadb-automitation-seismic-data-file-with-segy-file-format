import { Dispatch, SetStateAction } from "react";

export type ItemData = string;
export type Tuple2<T> = [T, T];

export interface DraggableItemData {
    id: number,
    moveStart: Tuple2<number>,
    mouseD: Tuple2<number>,
    initialPos: Tuple2<number>,
    x: number,
    y: number,
    canHold: boolean,
    holding: boolean,
    snapToOrigin: boolean,
    height: number,
    width: number
    data: ItemData
}

export interface DroppableItemData {
    id: number,
    canDrop: boolean,
    data: ItemData
}

export interface DraggableState {
    draggableItems: DraggableItemData[],
    droppableItems: DroppableItemData[],
    mousePosition: Tuple2<number>,
    mouseDown: boolean,
};

export const EMPTY_DRAGGABLE_ITEM_DATA: DraggableItemData = {
    id: 0,
    moveStart: [0, 0],
    mouseD: [0, 0],
    initialPos: [0, 0],
    x: 0,
    y: 0,
    canHold: false,
    holding: false,
    snapToOrigin: false,
    height: 0,
    width: 0,
    data: ""
};

export const EMPTY_DROPPABLE_ITEM_DATA: DroppableItemData = {
    id: 0,
    canDrop: false,
    data: "",
}

export const INITIAL_DRAGGABLE_STATE: DraggableState = {
    draggableItems: [ ],
    droppableItems: [ ],
    mousePosition: [0, 0],
    mouseDown: false
};

export enum DraggableAct {
    ADD_DRAGGABLE = "ADD_DRAGGABLE",
    ADD_DROPPABLE = "ADD_DROPPABLE",
    SET_DRAGGABLE_POSITION = "SET_DRAGGABLE_POSITION",
    SET_DRAG_ITEM_CAN_HOLD = "SET_DRAG_ITEM_CAN_HOLD",
    SET_DRAG_ITEM_HOLDING = "SET_DRAG_ITEM_HOLDING",
    CLEAR_ALL_DRAG_ITEM_CAN_HOLD = "CLEAR_ALL_DRAG_ITEM_CAN_HOLD",
    CLEAR_ALL_DRAG_ITEM_HOLDING = "CLEAR_ALL_DRAG_ITEM_HOLDING",
    SET_MOUSE_POSITION = "SET_MOUSE_POSITION",
    SET_MOUSE_DOWN = "SET_MOUSE_DOWN",

    SET_DROPPABLE_CAN_DROP = "SET_DROPPABLE_CAN_DROP",
    SET_DROPPABLE_DATA = "SET_DROPPABLE_DATA",
    CLEAR_ALL_DROP_ITEM_CAN_DROP = "CLEAR_ALL_DROP_ITEM_CAN_DROP"
}

export type SetDraggablePositionAction = { act: DraggableAct.SET_DRAGGABLE_POSITION, id: number, x: number, y: number };
export type AddDraggableAction = { act: DraggableAct.ADD_DRAGGABLE, id: number, initialPos?: Tuple2<number>, snapToOrigin?: boolean, data?: ItemData };
export type AddDroppableAction = { act: DraggableAct.ADD_DROPPABLE, id: number };
export type SetDragItemCanHoldAction = { act: DraggableAct.SET_DRAG_ITEM_CAN_HOLD, id: number, canHold: boolean };
export type SetDragItemHoldingAction = { act: DraggableAct.SET_DRAG_ITEM_HOLDING, id: number, holding: boolean };
export type SetDroppableCanDropAction = { act: DraggableAct.SET_DROPPABLE_CAN_DROP, id: number, canDrop: boolean };
export type SetDroppableDataAction = { act: DraggableAct.SET_DROPPABLE_DATA, id: number, data: ItemData }
export type ClearAllDragItemHoldingAction = { act: DraggableAct.CLEAR_ALL_DRAG_ITEM_HOLDING };
export type ClearAllDragItemCanHoldAction = { act: DraggableAct.CLEAR_ALL_DRAG_ITEM_CAN_HOLD };
export type ClearAllDropItemCanDropAction = { act: DraggableAct.CLEAR_ALL_DROP_ITEM_CAN_DROP };
export type SetMouseMousePositionAction = { act: DraggableAct.SET_MOUSE_POSITION, x: number, y: number };
export type SetMouseDownAction = { act: DraggableAct.SET_MOUSE_DOWN, down: boolean };

export type DraggableAction = 
    SetDraggablePositionAction
    | AddDraggableAction
    | AddDroppableAction
    | SetDragItemCanHoldAction
    | SetDragItemHoldingAction
    | SetDroppableCanDropAction
    | SetDroppableDataAction
    | ClearAllDragItemHoldingAction
    | ClearAllDragItemCanHoldAction
    | ClearAllDropItemCanDropAction
    | SetMouseMousePositionAction
    | SetMouseDownAction
    ;

export type BooleanStateSetter = Dispatch<SetStateAction<boolean>>;