import {
  AddDraggableAction,
  AddDroppableAction,
  DraggableAct,
  DraggableAction,
  DraggableItemData,
  DraggableState,
  DroppableItemData,
  EMPTY_DRAGGABLE_ITEM_DATA,
  EMPTY_DROPPABLE_ITEM_DATA,
  SetDragItemCanHoldAction,
  SetDragItemHoldingAction,
  SetDraggablePositionAction,
  SetDroppableCanDropAction,
  SetDroppableDataAction,
  SetMouseDownAction,
  SetMouseMousePositionAction,
  Tuple2,
} from './types';

export const draggableReducer = (
  state: DraggableState,
  action: DraggableAction,
): DraggableState => {
  console.log(state);
  switch (action.act) {
    case DraggableAct.SET_DRAGGABLE_POSITION: {
      // private
      return actor.reduceSetDraggablePosition(state, action);
    }
    case DraggableAct.ADD_DRAGGABLE: {
      return actor.reduceAddDraggable(state, action);
    }
    case DraggableAct.ADD_DROPPABLE: {
      return actor.reduceAddDroppable(state, action);
    }
    case DraggableAct.SET_DRAG_ITEM_HOLDING: {
      // private
      return actor.reduceSetDragItemHolding(state, action);
    }
    case DraggableAct.SET_DRAG_ITEM_CAN_HOLD: {
      // public
      return actor.reduceSetDragItemCanHold(state, action);
    }
    case DraggableAct.SET_DROPPABLE_CAN_DROP: {
      return actor.reduceSetDroppableCanDrop(state, action);
    }
    case DraggableAct.SET_DROPPABLE_DATA: {
      return actor.reduceSetDroppableData(state, action);
    }
    case DraggableAct.CLEAR_ALL_DRAG_ITEM_CAN_HOLD: {
      // private
      // clear all drag item that is holding
      return actor.reduceClearAllDragItemCanHold(state);
    }
    case DraggableAct.CLEAR_ALL_DROP_ITEM_CAN_DROP: {
      return actor.reduceClearAllDropItemCanDrop(state);
    }
    case DraggableAct.CLEAR_ALL_DRAG_ITEM_HOLDING: {
      return actor.reduceClearAllDragItemHolding(state);
    }
    case DraggableAct.SET_MOUSE_POSITION: {
      // private
      // set the position of draggable items that are being held
      return actor.reduceSetMousePosition(state, action);
    }
    case DraggableAct.SET_MOUSE_DOWN: {
      // private
      return actor.reduceSetMouseDown(state, action);
    }
  }
};

const actor = {
  reduceSetDraggablePosition: function (
    state: DraggableState,
    action: SetDraggablePositionAction,
  ): DraggableState {
    const {id: itemId, x, y} = action;
    const query = Query.from(state);
    const mutate = Mutate.from(state);

    const item = query.getDraggableItemDataById(itemId);
    if (!item) return state;
    const newItem = {...item, x, y};
    const newState = mutate.setDraggableItemDataById(itemId, newItem);

    return newState;
  },

  reduceAddDraggable: function (
    state: DraggableState,
    action: AddDraggableAction,
  ): DraggableState {
    const query = Query.from(state);
    const mutate = Mutate.from(state);
    const item = query.getDraggableItemDataById(action.id);
    if (item) return state;
    const {id, initialPos, snapToOrigin, data} = action;
    let newItem: DraggableItemData = {...EMPTY_DRAGGABLE_ITEM_DATA, id};
    if (initialPos) {
      const y = initialPos[0];
      const x = initialPos[1];
      newItem = {...newItem, y, x, initialPos};
    }

    if (snapToOrigin) {
      newItem = {...newItem, snapToOrigin};
    }

    if (data) {
      newItem = {...newItem, data};
    }

    return mutate.addDraggableItemData(newItem);
  },

  reduceAddDroppable: function (
    state: DraggableState,
    action: AddDroppableAction,
  ): DraggableState {
    const query = Query.from(state);
    const mutate = Mutate.from(state);
    const {id} = action;
    const item = query.getDroppableItemById(id);
    if (item) return state;
    const newItem = {...EMPTY_DROPPABLE_ITEM_DATA, id};
    return mutate.addDroppableItemData(newItem);
  },

  reduceSetDragItemHolding: function (
    state: DraggableState,
    action: SetDragItemHoldingAction,
  ): DraggableState {
    const query = Query.from(state);
    const mutate = Mutate.from(state);
    const {id, holding} = action;
    const item = query.getDraggableItemDataById(id);
    if (!item) return state;
    const newItem = {...item, holding};
    return mutate.setDraggableItemDataById(id, newItem);
  },

  reduceSetDragItemCanHold: function (
    state: DraggableState,
    action: SetDragItemCanHoldAction,
  ): DraggableState {
    const query = Query.from(state);
    const mutate = Mutate.from(state);
    const {id, canHold} = action;
    const item = query.getDraggableItemDataById(id);
    if (!item) return state;
    const newItem = {...item, canHold};
    const res = mutate.setDraggableItemDataById(id, newItem);
    return res;
  },

  reduceSetDroppableCanDrop: function (
    state: DraggableState,
    action: SetDroppableCanDropAction,
  ): DraggableState {
    const query = Query.from(state);
    const mutate = Mutate.from(state);
    const {id, canDrop} = action;
    const item = query.getDroppableItemById(id);
    if (!item) return state;
    const newItem = {...item, canDrop};
    return mutate.setDroppableItemDataById(id, newItem);
  },

  reduceSetDroppableData: function (
    state: DraggableState,
    action: SetDroppableDataAction,
  ): DraggableState {
    const query = Query.from(state);
    const mutate = Mutate.from(state);
    const {id, data} = action;
    const item = query.getDroppableItemById(id);
    if (!item) return state;
    const newItem = {...item, data};
    const res = mutate.setDroppableItemDataById(id, newItem);
    return res;
  },

  reduceClearAllDragItemCanHold: function (
    state: DraggableState,
  ): DraggableState {
    const items = state.draggableItems.map(it => ({...it, canHold: false}));
    return {
      ...state,
      draggableItems: items,
    };
  },

  reduceClearAllDropItemCanDrop: function (
    state: DraggableState,
  ): DraggableState {
    const items = state.droppableItems.map(it => ({...it, canDrop: false}));
    return {
      ...state,
      droppableItems: items,
    };
  },

  reduceClearAllDragItemHolding: function (
    state: DraggableState,
  ): DraggableState {
    const items = state.draggableItems.map(it => ({...it, holding: false}));
    return {
      ...state,
      draggableItems: items,
    };
  },

  reduceSetMousePosition: function (
    state: DraggableState,
    action: SetMouseMousePositionAction,
  ): DraggableState {
    const {x, y} = action;
    const setMouseState = {
      ...state,
      mousePosition: [y, x] as Tuple2<number>,
    };
    const holdingItem = state.draggableItems.filter(it => it.holding)[0];
    if (!holdingItem) return setMouseState;

    return draggableReducer(setMouseState, {
      act: DraggableAct.SET_DRAGGABLE_POSITION,
      id: holdingItem.id,
      y: action.y - holdingItem.mouseD[0],
      x: action.x - holdingItem.mouseD[1],
    });
  },

  reduceSetMouseDown: function (
    state: DraggableState,
    action: SetMouseDownAction,
  ): DraggableState {
    const {down: mouseDown} = action;
    const setDownState = {...state, mouseDown};

    if (mouseDown) {
      return actor.reduceWhenMouseDown(setDownState);
    } else {
      return actor.reduceWhenMouseUp(setDownState);
    }
  },

  reduceWhenMouseDown: function (state: DraggableState): DraggableState {
    const act = DraggableAct.CLEAR_ALL_DROP_ITEM_CAN_DROP;
    const clearAllCanDropState = draggableReducer(state, {act});

    const oldDraggableItems = clearAllCanDropState.draggableItems;
    const oldItem = oldDraggableItems.find(item => item.canHold);
    if (!oldItem) return clearAllCanDropState;
    const newItem = {
      ...oldItem,
      holding: true,
      canHold: false,
      moveStart: [oldItem.y, oldItem.x],
      mouseD: [
        Math.abs(state.mousePosition[0] - oldItem.y),
        Math.abs(state.mousePosition[1] - oldItem.x),
      ],
    } as DraggableItemData;
    const clearHolding = DraggableAct.CLEAR_ALL_DRAG_ITEM_HOLDING;
    const clearedHoldingState = draggableReducer(clearAllCanDropState, {
      act: clearHolding,
    });
    const res = Mutate.from(clearedHoldingState).setDraggableItemDataById(
      newItem.id,
      newItem,
    );
    return res;
  },

  reduceWhenMouseUp: function (state: DraggableState): DraggableState {
    // for every item that is set to snap origin, set their position to initial position
    let newState = state;
    const oldDraggableItems = newState.draggableItems;
    const oldDroppableItems = newState.droppableItems;
    let newDraggableItems = [...oldDraggableItems];

    const holdingItemInd = newDraggableItems.findIndex(item => item.holding);
    const dropItemInd = oldDroppableItems.findIndex(item => item.canDrop);
    const holdingItem = newDraggableItems[holdingItemInd];
    if (!holdingItem) return state;
    const dropItem = oldDroppableItems[dropItemInd];
    if (dropItem) {
      const newDropItem = {
        ...dropItem,
        data: holdingItem.data,
      };
      newState = Mutate.from(newState).setDroppableItemDataById(
        newDropItem.id,
        newDropItem,
      );
    }

    newDraggableItems = newDraggableItems.map(it => {
      if (!it.snapToOrigin) return it;
      const [y, x] = it.initialPos;
      const newItem = {...it, y, x};
      return newItem;
    });
    newState = {
      ...newState,
      draggableItems: newDraggableItems,
    };
    newState = draggableReducer(newState, {
      act: DraggableAct.CLEAR_ALL_DRAG_ITEM_CAN_HOLD,
    });
    newState = draggableReducer(newState, {
      act: DraggableAct.CLEAR_ALL_DRAG_ITEM_HOLDING,
    });
    return newState;
  },
};

class Query {
  private state: DraggableState;

  constructor(state: DraggableState) {
    this.state = state;
  }

  static from(state: DraggableState) {
    return new Query(state);
  }

  getDraggableItemDataById(itemId: number): DraggableItemData | null {
    const state = this.state;
    const items = state.draggableItems;
    const item = items.find(it => it.id === itemId);
    if (item) return item;
    return null;
  }

  getDroppableItemById(itemId: number): DroppableItemData | null {
    const state = this.state;
    const items = state.droppableItems;
    const item = items.find(it => it.id === itemId);
    if (item) return item;
    return null;
  }
}

class Mutate {
  private state: DraggableState;

  constructor(state: DraggableState) {
    this.state = state;
  }

  static from(state: DraggableState) {
    return new Mutate(state);
  }

  setDraggableItemDataById(
    itemId: number,
    item: DraggableItemData,
  ): DraggableState {
    const state = this.state;
    const items = state.draggableItems;
    const index = items.findIndex(it => it.id === itemId);
    if (index === -1) return state;

    return {
      ...state,
      draggableItems: [
        ...items.slice(0, index),
        {...item, id: itemId},
        ...items.slice(index + 1),
      ],
    };
  }

  setDroppableItemDataById(
    itemId: number,
    item: DroppableItemData,
  ): DraggableState {
    const state = this.state;
    const items = state.droppableItems;
    const index = items.findIndex(it => it.id === item.id);
    if (index === -1) return state;
    return {
      ...state,
      droppableItems: [
        ...items.slice(0, index),
        {...item, id: itemId},
        ...items.slice(index + 1),
      ],
    };
  }

  addDraggableItemData(item: DraggableItemData): DraggableState {
    const state = this.state;
    const query = Query.from(state);
    if (query.getDraggableItemDataById(item.id)) return state;
    const items = state.draggableItems;
    return {
      ...state,
      draggableItems: [...items, item],
    };
  }

  addDroppableItemData(item: DroppableItemData): DraggableState {
    const state = this.state;
    const query = Query.from(state);
    if (query.getDroppableItemById(item.id)) return state;
    const items = state.droppableItems;
    return {
      ...state,
      droppableItems: [...items, item],
    };
  }
}
