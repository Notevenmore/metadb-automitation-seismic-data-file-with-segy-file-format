import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useEffect,
  useReducer,
} from 'react';
import {useScrollOffset} from '../HighlightViewer';
import {draggableReducer} from './reducer';
import {
  DraggableAct,
  DraggableAction,
  DraggableState,
  INITIAL_DRAGGABLE_STATE,
} from './types';

export type DraggableContextProps = {
  state: DraggableState;
  dispatch: Dispatch<DraggableAction>;
};

export const DraggableContext = createContext<DraggableContextProps>({
  state: INITIAL_DRAGGABLE_STATE,
  dispatch: () => {},
});

export const DraggableProvider = ({children}: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(
    draggableReducer,
    INITIAL_DRAGGABLE_STATE,
  );
  const offset = useScrollOffset();

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const [xOffset, yOffset] = offset;
      dispatch({
        act: DraggableAct.SET_MOUSE_POSITION,
        x: event.clientX + xOffset,
        y: event.clientY + yOffset,
      });
    }

    function onMouseDown() {
      dispatch({
        act: DraggableAct.SET_MOUSE_DOWN,
        down: true,
      });
    }

    function onMouseUp() {
      dispatch({
        act: DraggableAct.SET_MOUSE_DOWN,
        down: false,
      });
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [offset]);

  return (
    <DraggableContext.Provider value={{state, dispatch}}>
      {children}
    </DraggableContext.Provider>
  );
};
