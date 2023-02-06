import { useEffect, useState } from 'react'
import Arrow from '../public/icons/arrow_notrail.svg'
/**
 * This component is meant to be used for text inputs only:
 * inline-text, e-mail, and password. 
 * 
 * @param label string 
 */
const Input = ({ label = "none", label_loc = "none", type, dropdown_items = [], name, placeholder, onChange, onClick, autoComplete, required, additional_styles_label, additional_styles_input, additional_styles_menu_container, additional_styles }) => {
    const [Selected, setSelected] = useState()
    const [CurrentlyFocused, setCurrentlyFocused] = useState()
    const handleUnfocus = (e) => {
        e.preventDefault()
        if (document.activeElement === CurrentlyFocused) {
            document.activeElement.blur()
            setCurrentlyFocused()
        } else {
            setCurrentlyFocused(document.activeElement)
        }
    }
    return (
        <div className={`${label_loc.toLowerCase() === "beside" ? "flex items-center space-x-2" : label_loc.toLowerCase() === "above" ? "flex flex-col items-start" : ""} ${additional_styles}`}>
            <label className={`${label.toLowerCase() !== "none" ? "block" : "hidden"} w-[45%]  border-black ${additional_styles_label}`}>
                {label}
            </label>
            {type.toLowerCase() !== "dropdown" ?
                <input
                    className={`rounded-md bg-gray-200 placeholder:text-gray-500 outline-none px-2 py-1.5 w-full hover:bg-gray-300 focus:bg-gray-300 focus:outline-[2px] focus:outline-gray-400 transition-all ${additional_styles_input}`}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    required={required}
                />
                :
                <div tabIndex={0} className="group relative select-none w-full" onClick={handleUnfocus} onBlur={e => { setCurrentlyFocused() }}>
                    <div className={`flex justify-between items-center rounded-md bg-gray-200 placeholder:text-gray-500 outline-none px-2 py-1.5 w-full hover:bg-gray-300 focus:bg-gray-300 focus:outline-[2px] focus:outline-gray-400 transition-all ${additional_styles_input}`}>
                        <label className='truncate max-w-[80%]'>{Selected ? Selected : "Select an item"}</label>
                        <Arrow className="w-2.5 rotate-90" />
                    </div>
                    <div className={`hidden group-focus:block z-[50] absolute bg-gray-200 shadow-md mt-1 overflow-x-hidden overflow-y-auto left-0 rounded-md w-full min-h-[3px] ${additional_styles_menu_container}`}>
                        <ul className='list-none max-h-[230px]'>
                            {dropdown_items.map((item, index) => {
                                return (<li key={index} className='hover:bg-gray-300 py-1 px-2 transition-all' onClick={e => { setSelected(item); document.activeElement.blur() }}>{item}</li>)
                            })}
                        </ul>
                    </div>
                </div>
            }
        </div>
    )
}

export default Input