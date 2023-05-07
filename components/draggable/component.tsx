import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { DraggableContext } from "./provider";
import { useRandomId } from "./util";
import { DraggableAct, ItemData, Tuple2 } from "./types";

interface DraggableBoxProps {
    id: number,
    initialPos?: Tuple2<number>,
    snapToOrigin?: boolean,
    data?: ItemData
}

export function DraggableBox({
    id,
    children,
    initialPos,
    snapToOrigin,
    data
}: PropsWithChildren<DraggableBoxProps>) {
    const [mouseWithin, setMouseWithin] = useState(false);
    const { dispatch, state } = useContext(DraggableContext);
    // const id = useRandomId();
    const item = state.draggableItems.find(item => item.id === id);
    useEffect(() => {
        console.log(initialPos);
        if (Number.isNaN(initialPos[0])) return;
        dispatch({
            act: DraggableAct.ADD_DRAGGABLE,
            id: id,
            initialPos: initialPos,
            snapToOrigin, data
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPos, id]);
    return (
        <div style={{
            height: "0px",
            width: "0px",
            position: "relative",
        }}>
            <div
                draggable={false}
                onMouseEnter={() => {
                    console.log("Mouse Enter");
                    setMouseWithin(true);
                    dispatch({
                        act: DraggableAct.SET_DRAG_ITEM_CAN_HOLD,
                        id: id,
                        canHold: true,
                    });
                }}
                onMouseLeave={() => {
                    console.log("Mouse Leave");
                    setMouseWithin(false);
                    dispatch({
                        act: DraggableAct.SET_DRAG_ITEM_CAN_HOLD,
                        id: id,
                        canHold: false,
                    });
                }}
                style={{
                    position: "absolute",
                    zIndex: "30",
                    top: `${item?.y ?? 0}px`,
                    left: `${item?.x ?? 0}px`,
                    border: "1px solid blue",
                    // ...(!item?.holding ? ({transition: "all 300ms ease-out"}) : ({}))
                    
                }}>
                    {children}
            </div>
        </div>
    )
}

interface DroppableBoxProps {
    onDrop?: (data: ItemData) => void
}

export function DroppableBox({ children, onDrop}: PropsWithChildren<DroppableBoxProps>) {
    const { state, dispatch } = useContext(DraggableContext);
    const isHolding = state.draggableItems.some(item => item.holding);
    const id = useRandomId();
    const item = state.droppableItems.find(item => item.id === id.current);
    const itemData = item?.data ?? "";
    useEffect(() => {
        if (itemData === "") return;
        if (onDrop) onDrop(itemData);
        dispatch({
            act: DraggableAct.SET_DROPPABLE_DATA, 
            id: id.current,
            data: "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemData]);
    const onMouseEnter = () => {
        dispatch({
            act: DraggableAct.SET_DROPPABLE_CAN_DROP,
            id: id.current,
            canDrop: true
        });
    };
    const onMouseLeave = () => {
        dispatch({
            act: DraggableAct.SET_DROPPABLE_CAN_DROP,
            id: id.current,
            canDrop: false
        })
    };

    useEffect(() => {
        dispatch({
            act: DraggableAct.ADD_DROPPABLE,
            id: id.current
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<div
        style={{
            position: "relative",
            height: "fit-content",
            width: "fit-content",
            display: "inline-block"
        }}
    >
        {children}
        {
            isHolding ? (
                <div
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    style={{
                    ...(isHolding ? ({zIndex: "100"}) : ({})),
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    border: "1px solid red",
                    top: 0
                }}></div>
            ) : (
                ""
            )
        }
    </div>);
}