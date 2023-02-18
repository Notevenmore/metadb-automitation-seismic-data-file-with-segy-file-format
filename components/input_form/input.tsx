import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Arrow from '../../public/icons/arrow_notrail.svg'

interface InputProps extends React.ComponentProps<"input"> {
    label: "";
    label_loc: "";
    dropdown_items: [];
    additional_styles_label: "";
    additional_styles_input: "";
    additional_styles_menu_container: "";
    additional_styles: "";
    setSelectedItem;
}

const Input: React.FunctionComponent<InputProps> = ({ label = "none", label_loc = "none", type, dropdown_items = [], additional_styles_label = '', additional_styles_input = '', additional_styles_menu_container = '', additional_styles = '', setSelectedItem, ...inputProps }) => {
    const [Selected, setSelected] = useState()
    const [CurrentlyFocused, setCurrentlyFocused] = useState<Element>()
    const selectorRef = useRef()
    const handleUnfocus = (e) => {
        e.preventDefault()
        if (document.activeElement === CurrentlyFocused) {
            (document.activeElement as HTMLElement).blur()
            setCurrentlyFocused(null)
        } else {
            setCurrentlyFocused(document.activeElement)
        }
    }
    useEffect(() => {
        // directly using the setState function is prevented for performance sake 
        // (to prevent re-render, which is very expensive in resource in this case)
        if (setSelectedItem) {
            setSelectedItem[0] = [Selected]
        }
        // forcefully trigger onChange event to make onChange on parent component works
        if (Selected) {
            const selector = (document.getElementById('selected_item') as any)
            const lastValue = selector.value
            selector.value = Selected;
            const event = new Event("input", { bubbles: true });
            const tracker = selector._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            selector.dispatchEvent(event);
        }
    }, [Selected])

    return (
        <div className={twMerge(`${label_loc.toLowerCase() === "beside" ? "flex items-center space-x-2" : label_loc.toLowerCase() === "above" ? "flex flex-col items-start" : ""}`, additional_styles)}>
            <label className={twMerge(`${label.toLowerCase() !== "none" ? "block" : "hidden"} w-[45%]  border-black`, additional_styles_label)}>
                {label}
            </label>
            {type.toLowerCase() !== "dropdown" ?
                <input
                    type={type}
                    className={twMerge("rounded-md bg-gray-200 placeholder:text-gray-500 outline-none px-2 py-1.5 w-full hover:bg-gray-300 focus:bg-gray-300 focus:outline-[2px] focus:outline-gray-400 transition-all", additional_styles_input)}
                    {...inputProps}
                />
                :
                <div tabIndex={0} className="group relative select-none w-full" onClick={handleUnfocus} onBlur={e => { setCurrentlyFocused(null) }}>
                    <div className={twMerge(`flex justify-between items-center rounded-md bg-gray-200 placeholder:text-gray-500 outline-none px-2 py-1.5 w-full hover:bg-gray-300 focus:bg-gray-300 focus:outline-[2px] focus:outline-gray-400 transition-all`, additional_styles_input)}>
                        <input ref={selectorRef} id='selected_item' onClick={(e) => { e.preventDefault(); (e as any).target.parentElement.parentElement.focus(); handleUnfocus }} className='truncate max-w-[80%] bg-transparent outline-none cursor-default select-none' defaultValue={"Select an Item"} readOnly {...inputProps} />
                        <Arrow className="w-2.5 rotate-90" />
                    </div>
                    <div className={twMerge(`hidden group-focus:block z-[50] absolute bg-gray-200 shadow-md mt-1 overflow-x-hidden overflow-y-auto left-0 rounded-md w-full min-h-[3px]`, additional_styles_menu_container)}>
                        <ul className='list-none max-h-[230px]'>
                            {dropdown_items.map((item, index) => {
                                return (<li key={index} className='hover:bg-gray-300 py-1 px-2 transition-all' onClick={e => { setSelected(item); (document.activeElement as HTMLElement).blur() }}>{item}</li>)
                            })}
                        </ul>
                    </div>
                </div>
            }
        </div>
    )
}

export default Input