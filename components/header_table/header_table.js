import { Divider } from "../float_dialog/float_dialog"

const HeaderTable = ({children}) => {
    return (
        <section className="border border-solid border-float_dialog rounded-md lg:pl-4 px-2">
            <section className="font-bold py-2 bg-black/[.16] lg:pl-4 pl-2 -mr-2 lg:-ml-4 -ml-2 rounded-t">Header</section>
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
         lg:flex-row sm:flex-col w-full py-[10px] lg:h-[55px]">
            <>{children}</>
        </div>
    )
}

const HeaderLabel = ({children}) => {
    return (
        <div className="flex space-x-2 lg:min-w-[325px] mb-[7px] lg:my-[5px]">
            <>{children}</>
        </div>
    )
}

const HeaderLabel1 = ({label1, label2}) => {
    return (
        <HeaderLabel>
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



export default HeaderTable;
export {HeaderDivider, HeaderRow, HeaderLabel, HeaderLabel1, HeaderLabel2, HeaderInput1, HeaderInput2};
