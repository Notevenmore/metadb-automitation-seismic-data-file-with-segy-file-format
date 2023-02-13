import Link from "next/link"
import { twMerge } from "tailwind-merge"

interface ButtonProps extends React.ComponentProps<"button"> {
    path: "";
    button_description: "";
    additional_styles: "";
}

const Buttons: React.FunctionComponent<ButtonProps> = ({ path, button_description, children = null, additional_styles = '', ...buttonProps }) => {
    return (
        <div className="w-fit">
            <Link href={path}>
                <button title={button_description} className={twMerge(`flex items-center space-x-2 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all`, additional_styles)} {...buttonProps}>
                    {children ? <div className="w-4 h-4">{children}</div> : null}
                    <label>{button_description}</label>
                </button>
            </Link>
        </div>
    )
}

const Buttons_Sidebar: React.FunctionComponent<ButtonProps> = ({ path, button_description, children = null, additional_styles = '', ...buttonProps }) => {
    return (
        <Link href={path}>
            <button id="bt_sidebar_parent" className={twMerge('text-left flex items-center justify-between w-full py-2 px-3.5 hover:bg-gray-200 rounded-md', additional_styles)} {...buttonProps}>
                <div className="flex space-x-3.5 items-center w-[85%]">
                    {children ? <div className="w-4 h-4">{children}</div> : null}
                    <label>{button_description}</label>
                </div>
                <div id="bt_sidebar_right_arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-[15px] h-w-[15px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </button>
        </Link>
    )
}

export default Buttons
export { Buttons_Sidebar }
