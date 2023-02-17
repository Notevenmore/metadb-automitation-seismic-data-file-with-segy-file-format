import Link from "next/link"

const Buttons = ({ path, button_description, additional_styles = null }) => {
    return (
        <div className="w-fit">
            <Link href={path}>
                <button title={button_description} className={`block px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all  ${additional_styles}`}>
                    {button_description}
                </button>
            </Link>
        </div>
    )
}

const Buttons_Sidebar = ({ path, button_description, children = null, additional_styles = null }) => {
    return (
        <Link href={path}>
            <button id="bt_sidebar_parent" className={`text-left flex items-center justify-between w-full py-2 px-3.5 hover:bg-gray-200 rounded-md ${additional_styles}`}>
                <div className="flex space-x-3.5 items-center w-[85%]">
                    <div className="w-4 h-4">{children}</div>
                    <label>{button_description}</label>
                </div>
                <div id="bt_sidebar_right_arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[15px] h-w-[15px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </button>
        </Link>
    )
}

export default Buttons
export { Buttons_Sidebar }
