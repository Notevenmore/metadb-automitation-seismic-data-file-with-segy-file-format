import { Dispatch, PropsWithChildren, createContext, useEffect, useReducer } from "react";
import { DraggableAct, DraggableAction, DraggableState, INITIAL_DRAGGABLE_STATE } from "./types";
import { draggableReducer } from "./reducer";

export type DraggableContextProps = {
    state: DraggableState,
    dispatch: Dispatch<DraggableAction>,
};

export const DraggableContext = createContext<DraggableContextProps>({
    state: INITIAL_DRAGGABLE_STATE,
    dispatch: () => { },
});

export const DraggableProvider = ({ children }: PropsWithChildren<{}>) => {
    const [ state, dispatch ] = useReducer(draggableReducer, INITIAL_DRAGGABLE_STATE);

    useEffect(() => {
        function onMouseMove(event: MouseEvent) {
            dispatch({
                act: DraggableAct.SET_MOUSE_POSITION,
                x: event.clientX,
                y: event.clientY
            });
        }

        function onMouseDown(event: MouseEvent) {
            dispatch({
                act: DraggableAct.SET_MOUSE_DOWN,
                down: true
            });
        }

        function onMouseUp(event: MouseEvent) {
            dispatch({
                act: DraggableAct.SET_MOUSE_DOWN,
                down: false
            });
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }, []);

    return (
        <DraggableContext.Provider value={{ state, dispatch }}>
            {children}
        </DraggableContext.Provider>
    )
}