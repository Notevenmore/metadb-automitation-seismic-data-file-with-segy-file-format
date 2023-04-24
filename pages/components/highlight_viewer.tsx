import { Context, createContext, Dispatch, MutableRefObject, PropsWithChildren, ReactNode, useContext, useEffect, useReducer, useRef, useState } from "react";
// import { useMouseDown, useMouseWithin } from "./custom-hook";

export type Tuple4<T> = [T, T, T, T];
export type Tuple2<T> = [T, T];

/**
 *  * |----------------| STATE & ACTION TYPES |----------------|
 */

export enum NavbarButton {
    MOVE_BUTTON = "MOVE_BUTTON",
    SELECT_BUTTON = "SELECT_BUTTON"
}

/**
 * * |----------------| SELECTOR STATE |----------------|
 */

export enum SelectorStateType {
    // In the first bound state, the user is trying to set the first bound
    FIRST_BOUND = "FIRST_BOUND",
    // In the second bound state, the user has finished finding the first bound is finding the second bound
    SECOND_BOUND = "SECOND_BOUND",
    // In complete the user has completed finding the first and second bound.
    // At this state, the bounds should be moved to the bounds array
    // within the image editor state
    COMPLETE = "COMPLETE",
}

type SelectorState =
    { stateType: SelectorStateType.FIRST_BOUND, bounds: Tuple4<number> }
    | { stateType: SelectorStateType.SECOND_BOUND, bounds: Tuple4<number> }
    | { stateType: SelectorStateType.COMPLETE }
    ;

/**
 * * |----------------| SELECTOR ACTION |----------------|
 */

export enum SelectorActionType {
    SELECTING_BOUND_START = "SELECTING_BOUND_START",
    SELECT_BOUND_START = "SELECT_BOUND_START",
    SELECTING_BOUND_END = "SELECTING_BOUND_END",
    SELECT_BOUND_END = "SELECT_BOUND_END",
    // When the bound end has been selected, we want to move the bounds
    // from the selector state to the bounds array in the image editor
    // state
}

type SelectorAction =
    { actionType: SelectorActionType.SELECTING_BOUND_START, bounds: Tuple2<number> }
    | { actionType: SelectorActionType.SELECT_BOUND_START }
    | { actionType: SelectorActionType.SELECTING_BOUND_END, bounds: Tuple2<number> }
    | { actionType: SelectorActionType.SELECT_BOUND_END }

/**
 * * |----------------| ROOT STATE |----------------|
 */
interface ImageEditorState {
    selectedNavbarButton: NavbarButton,

    translate: Tuple2<number>,
    scale: number,
    mousePositionRelativeToImage: Tuple2<number>,

    selectorState: SelectorState,
    editorDim: Tuple2<number>,
    bounds: Tuple4<number>[]
};

/**
 * * |----------------| ROOT ACTION |----------------|
 */

export enum ImageEditorActionType {
    SET_TRANSLATE = "SET_TRANSLATE",
    SET_MODE_MOVE = "SELECT_MOVE",
    SET_MODE_SELECT = "SET_MODE_SELECT",

    SET_SELECT_STAGE = "SET_SELECT_STAGE",
    SET_SCALE = "SET_SCALE",
    SET_MOUSE_POS_RELATIVE_TO_IMAGE = "SET_MOUSE_POS_RELATIVE_TO_IMAGE",

    SET_EDITOR_DIM = "SET_EDITOR_DIM",
    ADD_BOUND = "ADD_BOUND",
    CLEAR_BOUNDS = "CLEAR_BOUNDS"
};

type ImageEditorAction =
    { actionType: ImageEditorActionType.SET_TRANSLATE, translate: Tuple2<number> }
    | { actionType: ImageEditorActionType.SET_MODE_MOVE }
    | { actionType: ImageEditorActionType.SET_MODE_SELECT }
    | SelectorAction
    | { actionType: ImageEditorActionType.SET_SCALE, scale: number }
    | { actionType: ImageEditorActionType.SET_MOUSE_POS_RELATIVE_TO_IMAGE, mousePos: Tuple2<number> }
    | { actionType: ImageEditorActionType.SET_EDITOR_DIM, editorDim: Tuple2<number> }
    | { actionType: ImageEditorActionType.ADD_BOUND, bound: Tuple4<number> }
    | { actionType: ImageEditorActionType.CLEAR_BOUNDS }

export type ImageEditorContextType = { state: ImageEditorState, dispatch: Dispatch<ImageEditorAction> };

interface ImageEditorProviderProps {
    boundsObserver?: (bounds: Tuple4<number>[]) => void,
}

function imageEditorReducer(state: ImageEditorState, action: ImageEditorAction): ImageEditorState {
    switch (action.actionType) {
        case ImageEditorActionType.SET_TRANSLATE:
            return {
                ...state,
                translate: action.translate
            };

        case ImageEditorActionType.SET_MODE_MOVE:
            return {
                ...state,
                selectorState: { stateType: SelectorStateType.COMPLETE },
                selectedNavbarButton: NavbarButton.MOVE_BUTTON
            };

        case ImageEditorActionType.SET_MODE_SELECT:
            if (state.selectorState.stateType !== SelectorStateType.COMPLETE) return state;
            return {
                ...state,
                selectorState: { stateType: SelectorStateType.FIRST_BOUND, bounds: [0, 0, 0, 0] },
                selectedNavbarButton: NavbarButton.SELECT_BUTTON
            };

        // case ImageEditorActionType.SET_SELECT_STAGE:
        case SelectorActionType.SELECTING_BOUND_START:
            if (state.selectorState.stateType !== SelectorStateType.FIRST_BOUND) return state;
            return {
                ...state,
                selectorState: { ...state.selectorState, bounds: [...action.bounds, ...action.bounds] }
            };

        case SelectorActionType.SELECT_BOUND_START:
            if (state.selectorState.stateType !== SelectorStateType.FIRST_BOUND) return state;
            return {
                ...state,
                selectorState: { ...state.selectorState, stateType: SelectorStateType.SECOND_BOUND }
            };

        case SelectorActionType.SELECTING_BOUND_END:
            if (state.selectorState.stateType !== SelectorStateType.SECOND_BOUND) return state;
            const [x1, y1] = state.selectorState.bounds;
            return {
                ...state,
                selectorState: { ...state.selectorState, bounds: [x1, y1, ...action.bounds] }
            };

        case SelectorActionType.SELECT_BOUND_END:
            if (state.selectorState.stateType !== SelectorStateType.SECOND_BOUND) return state;
            const [fx1, fy1, fx2, fy2] = state.selectorState.bounds;
            return {
                ...state,
                selectedNavbarButton: NavbarButton.MOVE_BUTTON,
                selectorState: { stateType: SelectorStateType.COMPLETE },
                // bounds: [ ...state.bounds, [ fx1, fy1, fx2, fy2 ] ]
                bounds: [[fx1, fy1, fx2, fy2]]
            };
        case ImageEditorActionType.SET_SCALE:
            return {
                ...state,
                scale: action.scale
            };

        case ImageEditorActionType.SET_MOUSE_POS_RELATIVE_TO_IMAGE:
            const relX = Math.ceil((action.mousePos[0] - state.translate[0]) / (state.scale));
            const relY = Math.ceil((action.mousePos[1] - state.translate[1]) / (state.scale));
            return {
                ...state,
                mousePositionRelativeToImage: [relX, relY]
            };

        case ImageEditorActionType.SET_EDITOR_DIM:
            return {
                ...state,
                editorDim: action.editorDim
            };

        case ImageEditorActionType.ADD_BOUND:
            return {
                ...state,
                bounds: [...state.bounds, action.bound]
            };
        case ImageEditorActionType.CLEAR_BOUNDS:
            return {
                ...state,
                bounds: []
            };

        default:
            return state;
    }
}

const initialImageEditorState: ImageEditorState = {
    selectedNavbarButton: NavbarButton.MOVE_BUTTON,

    translate: [10, 60],
    scale: 1,
    mousePositionRelativeToImage: [0, 0],

    selectorState: { stateType: SelectorStateType.COMPLETE },
    editorDim: [0, 0],
    bounds: []
};

export const ImageEditorContext = createContext<ImageEditorContextType>({
    state: initialImageEditorState,
    dispatch: () => { }
});

export const ImageEditorProvider = ({ children, boundsObserver }: PropsWithChildren<ImageEditorProviderProps>) => {
    const [state, dispatch] = useReducer(imageEditorReducer, initialImageEditorState);
    const { bounds, mousePositionRelativeToImage } = state;
    useEffect(() => {
        if (boundsObserver) boundsObserver(bounds);
    }, [bounds]);

    useEffect(() => {
        // console.log(`mousePosition: ${mousePositionRelativeToImage}`);
    }, [mousePositionRelativeToImage])

    return (
        <ImageEditorContext.Provider value={{ state, dispatch }}>
            {children}
        </ImageEditorContext.Provider>

    )
}

/**
 *  * |--------------| Hooks |----------------|
 */

export const useMouseDown = () => {
    const [mouseDown, setMouseDown] = useState(false);

    function onMouseDown() {
        setMouseDown(_ => true);
    }

    function onMouseUp() {
        setMouseDown(_ => false);
    }

    useEffect(() => {
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
        };
    }, []);
    return mouseDown;
}

export const useMouseWithin = (ref: MutableRefObject<null>) => {
    const [within, setWithin] = useState(false);

    function onMouseMove(event: MouseEvent) {
        if (ref.current === null) { return }
        const element = (ref.current as unknown) as Node;
        if (!element.contains(event.target as Node)) {
            setWithin(_ => false);
            return;
        }
        setWithin(_ => true);
    }

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
        }
    }, []);

    return within;
}

export const useElementOffset = (ref: MutableRefObject<null>) => {
    const [elementOffset, setElementOffset] = useState([0, 0]);
    function calculateOffset() {
        if (ref.current === null) { return }
        const element = (ref.current as unknown) as HTMLElement;
        const { top, left } = element.getBoundingClientRect();
        setElementOffset(_ => [left, top]);
    }
    useEffect(() => {
        calculateOffset();
    }, []);
    useEffect(() => {
        window.addEventListener('resize', calculateOffset);

        return () => {
            window.removeEventListener('resize', calculateOffset);
        }
    }, []);
    return elementOffset
}

export const useScrollOffset = () => {
    const [scrollOffset, setScrollOffset] = useState([0, 0]);

    function onScroll(_: Event) {
        const parent = document.getElementById("layout-icon");
        setScrollOffset(_ => [parent.scrollLeft, parent.scrollTop]);;
    }
    useEffect(() => {
        const parent = document.getElementById("layout-icon");
        // the line below was commented since it throws null error // FIXME fix the scroll problem
        parent.addEventListener('scroll', onScroll);
        setScrollOffset(_ => [ parent.scrollLeft, parent.scrollTop ]);
        return () => {
            parent.removeEventListener('scroll', onScroll);
        }
    }, []);
    return scrollOffset;
}

const useInitialScrollOffset = () => {
    const [scrollOffset, setScrollOffset] = useState([0, 0]);

    useEffect(() => {
        const parent = document.getElementById("layout-icon");
        console.log(parent)
        // the line below was commented since it throws null error // FIXME fix the scroll problem
        setScrollOffset(_ => [ parent.scrollLeft, parent.scrollTop ]);;
    }, []);

    return scrollOffset;
}

export const useScrolling = () => {
    const [scroll, setScroll] = useState(true);

    useEffect(() => {
        if (document === null) { return }
        // left: 37, up: 38, right: 39, down: 40,
        // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
        var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

        // @ts-ignore
        function preventDefault(e) {
            e.preventDefault();
        }

        // @ts-ignore
        function preventDefaultForScrollKeys(e) {
            // @ts-ignore
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        }

        // modern Chrome requires { passive: false } when adding event
        var supportsPassive = false;
        try {
            // @ts-ignore
            window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function () { supportsPassive = true; }
            }));
        } catch (e) { }

        var wheelOpt = supportsPassive ? { passive: false } : false;
        var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

        // call this to Disable
        function disableScroll() {
            window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
            window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
            window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
            window.addEventListener('keydown', preventDefaultForScrollKeys, false);
        }

        // call this to Enable
        function enableScroll() {
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
            // @ts-ignore
            window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
            // @ts-ignore
            window.removeEventListener('touchmove', preventDefault, wheelOpt);
            window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
        }

        if (scroll) {
            enableScroll();
        } else {
            disableScroll();
        }
        return () => {
            enableScroll();
        };
    }, [scroll]);
    return { setScroll };
}

export const useScrollingValueWithin = (
    context: Context<ImageEditorContextType>,
    ref: MutableRefObject<null>,
    initial: number,
    min: number,
    max: number,
    offset: number,
) => {
    const { dispatch } = useContext(context);
    const [value, setValue] = useState(initial);
    const mouseWithin = useMouseWithin(ref);
    const { setScroll } = useScrolling();
    useEffect(() => {
        function onWheel(event: WheelEvent) {
            if (!mouseWithin) {
                setScroll(_ => true);
                return
            }
            setScroll(_ => false);
            const dy = event.deltaY;
            const up = dy < 0;
            if (up) {
                setValue(v => {
                    if (v >= max) { return max; }
                    return v + offset;
                })
            } else {
                setValue(v => {
                    if (v <= min) { return min; }
                    return v - offset;
                })
            }
        }

        window.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            window.removeEventListener('wheel', onWheel);
        }
    }, [mouseWithin]);

    useEffect(() => {
        dispatch({
            actionType: ImageEditorActionType.SET_SCALE,
            scale: value
        });

        return () => {
        }
    }, [value]);
}

export const useElementDim = (ref: MutableRefObject<null>) => {
    const [dim, setDim] = useState<Tuple2<number>>([0, 0]);
    useEffect(() => {
        if (ref.current === null) { return }
        const element = (ref.current as unknown) as HTMLElement;
        const { width, height } = element.getBoundingClientRect();
        setDim(_ => [width, height]);
    }, [ref]);
    return dim;
}


export const useMousePosition = () => {
    const [mousePos, setMousePos] = useState([0, 0]);
    const [finalPos, setFinalPos] = useState([0, 0]);
    const scrollOffset = useScrollOffset();
    function onMouseMove(event: MouseEvent) {
        setMousePos(_ => [event.clientX, event.clientY]);
    }

    useEffect(() => {
        const [mX, mY] = mousePos;
        const [soX, soY] = scrollOffset;
        setFinalPos(_ => [mX + soX, mY + soY]);
    }, [scrollOffset, mousePos]);
    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
        }
    }, []);

    return finalPos;
}

export const useMousePositionRelativeTo = (ref: MutableRefObject<null>) => {
    const scrollOffset = useInitialScrollOffset();
    const elementOffset = useElementOffset(ref);
    const mousePos = useMousePosition();
    const [pos, setPos] = useState<Tuple2<number>>([0, 0]);

    useEffect(() => {
        const [elX, elY] = elementOffset;
        const [scX, scY] = scrollOffset;
        const [mX, mY] = mousePos;
        // console.log(`left: ${scX}`)
        // console.log(`top: ${scY}`)
        setPos(_ => [mX - elX + scX, mY - elY - scY]);
    }, [scrollOffset, mousePos, elementOffset]);

    return pos;
};

export const useMouseDrag = () => {
    const mousePos = useMousePosition();
    const mouseDown = useMouseDown();
    const [origin, setOrigin] = useState([0, 0]);
    const [offset, setOffset] = useState([0, 0]);
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {
        if (mouseDown) {
            setOffset(_ => [0, 0]);
            setOrigin(_ => mousePos);
            setIsDragging(_ => true);
        } else {
            setIsDragging(_ => false);
        }
    }, [mouseDown]);

    useEffect(() => {
        if (isDragging) {
            const [orX, orY] = origin;
            const [mX, mY] = mousePos;
            setOffset(_ => [mX - orX, mY - orY]);
        }
    }, [mousePos]);
    return { isDragging, offset };
}

export const useTranslateDraggable = (
    context: Context<ImageEditorContextType>,
    dragWithinRef: MutableRefObject<null>
) => {
    const { state: { translate, selectedNavbarButton }, dispatch } = useContext(context);
    const [lastTranslate, setLastTranslate] = useState(translate);
    const { isDragging, offset } = useMouseDrag();
    const mouseWithin = useMouseWithin(dragWithinRef);

    const setTranslate = (tr: Tuple2<number>) => {
        dispatch({
            actionType: ImageEditorActionType.SET_TRANSLATE,
            translate: tr
        });
    }

    // When Dragging
    useEffect(() => {
        const enabled = selectedNavbarButton === NavbarButton.MOVE_BUTTON;
        if (enabled && mouseWithin && isDragging) {
            const [offX, offY] = offset;
            const [orX, orY] = lastTranslate;
            setTranslate([orX + offX, orY + offY]);
        }
    }, [isDragging, selectedNavbarButton, offset]);

    // on Finished Dragging
    useEffect(() => {
        if (!isDragging) {
            setLastTranslate(_ => translate);
        }
    }, [isDragging]);
}

export const useMousePositionRelative = (
    context: Context<ImageEditorContextType>,
    editorRef: MutableRefObject<null>
) => {
    const { dispatch } = useContext(context);
    const mousePos = useMousePositionRelativeTo(editorRef);
    useEffect(() => {
        dispatch({
            actionType: ImageEditorActionType.SET_MOUSE_POS_RELATIVE_TO_IMAGE,
            mousePos
        });
    }, [mousePos]);
}

export const useEditorDim = (
    context: Context<ImageEditorContextType>,
    editorRef: MutableRefObject<null>
) => {
    const { dispatch } = useContext(context);
    const editorDim = useElementDim(editorRef);
    useEffect(() => {
        dispatch({
            actionType: ImageEditorActionType.SET_EDITOR_DIM,
            editorDim: editorDim
        });
    }, [editorDim]);
}

export const useBoundingBox = (
    context: Context<ImageEditorContextType>,
) => {
    const { state, dispatch } = useContext(context);
    const {
        selectorState,
        mousePositionRelativeToImage
    } = state;
    const mouseDown = useMouseDown();

    const setDrawingFirstBound = (bounds: Tuple2<number>) => {
        dispatch({
            actionType: SelectorActionType.SELECTING_BOUND_START,
            bounds: [...bounds]
        });
    };

    const setFinishDrawingFirstBound = () => {
        dispatch({
            actionType: SelectorActionType.SELECT_BOUND_START
        });
    };

    const setDrawingSecondBound = (bounds: Tuple2<number>) => {
        dispatch({
            actionType: SelectorActionType.SELECTING_BOUND_END,
            bounds: [...bounds]
        });
    };

    const setFinishDrawingSecondBound = () => {
        dispatch({
            actionType: SelectorActionType.SELECT_BOUND_END
        });
    };

    useEffect(() => {
        const [relX, relY] = mousePositionRelativeToImage;
        const startDrawing = selectorState.stateType === SelectorStateType.FIRST_BOUND;
        const drawing = selectorState.stateType === SelectorStateType.SECOND_BOUND;
        if (startDrawing && !mouseDown) {
            setDrawingFirstBound([relX, relY]);
        } else if (startDrawing && mouseDown) {
            setFinishDrawingFirstBound()
        } else if (drawing && !mouseDown) {
            setDrawingSecondBound([relX, relY]);
        } else if (drawing && mouseDown) {
            setFinishDrawingSecondBound()
        }
    }, [mouseDown, mousePositionRelativeToImage]);
}


interface NavbarButtonConfig {
    id: string,
    selected: boolean,
    imgSrc: string,
    onClick?: () => void
}

function Navbar() {

    const [buttonConfig, setButtonConfig] = useState<NavbarButtonConfig[]>([]);
    const { state, dispatch } = useContext(ImageEditorContext);
    const {
        selectedNavbarButton,
        editorDim: [editorWidth]
    } = state;
    useEffect(() => {
        const newButtonConfig: NavbarButtonConfig[] = [
            {
                id: "1",
                selected: selectedNavbarButton === NavbarButton.MOVE_BUTTON,
                imgSrc: "/icons/all-directions_32.png",
                onClick: () => dispatch({ actionType: ImageEditorActionType.SET_MODE_MOVE })
            },
            {
                id: "2",
                selected: selectedNavbarButton === NavbarButton.SELECT_BUTTON,
                imgSrc: "/icons/select_32.png",
                onClick: () => dispatch({ actionType: ImageEditorActionType.SET_MODE_SELECT })
            }
        ];
        setButtonConfig(_ => newButtonConfig)

    }, [selectedNavbarButton]);

    const buttonConfigToButton = (config: NavbarButtonConfig, index: number) => (
        <button
            key={config.id}
            className={`${config.selected ? "bg-blue-500" : ""} rounded-md aspect-square text-white flex justify-center align-middle p-1`}
            onClick={config.onClick}
        >
            <img src={config.imgSrc} alt=""
                style={{
                    filter: "invert(1)"
                }}
            />
        </button>
    )

    return (
        <div style={{
            zIndex: "10",
            position: "relative",
            width: "0px",
            height: "0px",
        }}>
            <div
                style={{
                    position: "absolute",
                    width: `${editorWidth}px`,
                    height: "45px",
                }}
                className="bg-gray-800 h-10 flex align-middle p-2 gap-1"
            >
                {buttonConfig.map(buttonConfigToButton)}
            </div>
        </div>
    );
}

interface SelectionBoxProps {
    bound: Tuple4<number>,
}

export const SelectionBox = (({ bound }: SelectionBoxProps) => {
    const [x1, y1, x2, y2] = bound;
    let fx = x1;
    let fy = y1;
    if (x1 > x2) {
        fx = x2;
    }
    if (y1 > y2) {
        fy = y2;
    }
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    return (
        <div style={{
            position: "absolute",
            top: `${fy}px`,
            left: `${fx}px`,
            width: `${width}px`,
            height: `${height}px`,
            zIndex: "9",
            backgroundColor: "rgba(89, 190, 233, 0.5)"
        }}>
        </div>
    )
})


const useNaturalImageDim = (ref: MutableRefObject<null>) => {
    const [dim, setDim] = useState([0, 0]);
    const [check, setCheck] = useState(false);
    function reload() {
        setCheck(t => !t);
    }
    useEffect(() => {
        if (ref.current === null) { return }
        const element = (ref.current as unknown) as HTMLImageElement;
        setDim(_ => [element.naturalWidth, element.naturalHeight]);
    }, [check]);

    return { dim, reload };
}

interface ImageEditorViewProps {
    imageUrl: string
}

const ImageEditorView = ({ imageUrl }: ImageEditorViewProps) => {


    const viewerRef = useRef(null);
    const imageWrapperRef = useRef(null);
    const imageRef = useRef(null);

    const { dispatch } = useContext(ImageEditorContext);
    useTranslateDraggable(ImageEditorContext, viewerRef);
    useBoundingBox(ImageEditorContext);
    useScrollingValueWithin(ImageEditorContext, viewerRef, 1, 1, 5, 0.05);
    useMousePositionRelative(ImageEditorContext, viewerRef);
    useEditorDim(ImageEditorContext, viewerRef);

    const { state } = useContext(ImageEditorContext);
    const {
        bounds,
        scale,
        translate,
        selectedNavbarButton,
        selectorState,
        editorDim: [editorWidth, editorHeight]
    } = state;

    const mouseDown = useMouseDown();
    // imageUrl listener to clear bounds, whenever the imageUrl changes
    const { dim: [width, height], reload } = useNaturalImageDim(imageRef);
    useEffect(() => {
        dispatch({
            actionType: ImageEditorActionType.CLEAR_BOUNDS
        });
    }, [imageUrl]);
    const InsetShadow = () => (<>
        <div
            style={{
                zIndex: "1",
                position: "relative",
                width: "0px",
                height: "0px"
            }}
        >
            <div style={{
                position: "absolute",
                boxShadow: "0px 0px 5px 1px inset",
                width: `${editorWidth}px`,
                height: `${editorHeight}px`,
            }}>
            </div>
        </div>
    </>);

    const SelectingBox = () => {
        if (selectorState.stateType !== SelectorStateType.COMPLETE) {
            return <SelectionBox bound={selectorState.bounds} />
        }
        return <></>;
    }

    return (<>
        <div
            // w-[1000px] h-[1000px] 
            className={`bg-slate-500 relative overflow-hidden`}
            ref={viewerRef}
            style={{
                cursor: (selectedNavbarButton === NavbarButton.MOVE_BUTTON) ? (mouseDown ? "grabbing" : "grab") : "default"
            }}
        >
            <Navbar />
            <InsetShadow />
            <div
                ref={imageWrapperRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    position: "relative",
                    left: `${translate[0]}px`,
                    top: `${translate[1]}px`,
                    overflow: 'visible',
                    width: `${width}px`,
                    height: `${height}px`,
                    boxShadow: "0px 0px 10px 1px",
                }}
            >
                <SelectingBox />
                {bounds.map(b => (<SelectionBox key={b.toString()} bound={b} />))}
                <img src={imageUrl} alt=""
                    ref={imageRef}
                    onLoad={_ => reload()}
                    draggable={false}
                    style={{
                        width: `${width}px`,
                        height: `${height}px`
                    }}
                />
            </div>
        </div>
    </>);
}

interface ImageEditorProps {
    boundsObserver?: (bounds: Tuple4<number>[]) => void,
    imageUrl: string,
}

export const ImageEditor = ({ boundsObserver, imageUrl }: ImageEditorProps) => {
    return (
        <ImageEditorProvider
            boundsObserver={boundsObserver}
        >
            <ImageEditorView imageUrl={imageUrl} />
        </ImageEditorProvider>
    )
}

// export default function Index() {
//     const doc_id: string = "c5fd3ac264d654b04b759f193a16254b8eb0c878a3f0de0f914aaf2cae3da47f";
//     const page_no: number = 2;

//     function boundsObserver(bounds: Tuple4<number>[]) {
//         if (bounds.length === 0) return;
//         const last = bounds.length - 1;
//         const bound = bounds[last];
//         extractTextFromBounds(doc_id, page_no, bound);
//     }

//     return (<>
//         <main className="flex justify-center align-middle pt-10 pb-10">
//             <ImageEditor boundsObserver={boundsObserver} imageUrl={`http://localhost:7000/ocr_service/v1/image/${doc_id}/${page_no}`}/>
//         </main>
//     </>)
// }