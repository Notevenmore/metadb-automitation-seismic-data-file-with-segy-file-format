import { Divider } from "../float_dialog/float_dialog"
import { twMerge } from "tailwind-merge"
// TODO: complete the components

const HeaderTable = ({children}) => {
    return (
        <section className="border border-solid 
        border-float_dialog rounded-md lg:pl-4 px-2">
            <section className="font-bold py-2 bg-black/[.16]
             lg:pl-4 pl-2 -mr-2 lg:-ml-4 -ml-2 rounded-t">
                Header
             </section>
            <HeaderDivider/>
            <>{children}</>
        </section>
    )
}

const HeaderDivider = () => {
    return (
        <Divider 
        additional_styles={
            `-ml-2 w-[calc(100%+16px)]
             lg:-ml-4 lg:w-[calc(100%+25px)]`
            }
        />
    )
}

const HeaderRow = ({children}) => {
    return (
        <div className="flex justify-center lg:items-center
         lg:flex-row flex-col w-full py-[10px] lg:h-[55px]">
            <>{children}</>
        </div>
    )
}

const HeaderLabel = ({children, className}) => {
    return (
        <div className={twMerge("flex space-x-2 lg:min-w-[325px] mb-[7px] lg:my-[5px]", className)}>
            <>{children}</>
        </div>
    )
}

const HeaderLabel1 = ({label1, label2}) => {
    return (
        <HeaderLabel className={"flex-wrap"}>
            <label>{label1}</label>
            <label className="text-[#A3A3A3]">{label2}</label>
        </HeaderLabel>
    )
}

const HeaderLabel2 = ({label}) => {
    return (
        <HeaderLabel>
            <label className="font-semibold">{label}</label>
        </HeaderLabel>
    )
}

const HeaderStatic1 = ({label1, label2, content=false}) => {
    return (
        <HeaderRow>
            <p className="font-semibold lg:min-w-[325px] max-lg:mb-2">
                {label1} <span className="font-light text-[#A3A3A3]">{label2}</span>
            </p>
            <p className="inline lg:ml-[8px] w-full">{content}</p>
        </HeaderRow>
        
    )
}

const HeaderStatic2 = ({label, content}) => {
    return (
        <HeaderRow>
            <p className="font-semibold min-w-[325px]">{label}</p>
            <p className="lg:ml-[8px] w-full">{content}</p>
        </HeaderRow>
    )
}
const HeaderInput1 = ({label1, label2, children}) => {
    return (
        <HeaderRow>
            <HeaderLabel1 label1={label1} label2={label2}/>
            <>{children}</>
        </HeaderRow>
    )
}

const HeaderInput2 = ({label, children}) => {
    return (
        <HeaderRow>
            <HeaderLabel2 label={label}/>
            <>{children}</>
        </HeaderRow>
    )
}

const ButtonsSection = ({children, className=""}) => {
    return (
        <section className={twMerge(`flex flex-wrap gap-x-3 mt-10
            max-lg:justify-center items-center gap-y-3 max-lg:mt-5 h-5`, className)}>
            <>{children}</>         
        </section>
    )
}

export default HeaderTable;
export {HeaderDivider, HeaderRow, HeaderLabel, HeaderLabel1,
    HeaderLabel2, HeaderStatic1, HeaderStatic2, HeaderInput1,
    HeaderInput2, ButtonsSection};
