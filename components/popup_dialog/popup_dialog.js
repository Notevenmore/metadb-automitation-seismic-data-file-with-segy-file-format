import Buttons from "../buttons/buttons"
import Close from "../../public/icons/close.svg"
import {Divider} from "../float_dialog/float_dialog"

const PopupDialog = ({title="Are you sure?", content,
     button_desc1="Save", button_desc2="Save and exit",
      button_desc3="Discard changes"}) => 
{
    const DEFAULT_CONTENT = () => {
        return (
            <>
            You have not saved the document yet, are you sure you want to leave this page?
            <strong> This document will not be uploaded and will be deleted.</strong>            
            </>
        )
    }
    return (
        <aside className="flex flex-col justify-between w-[470px] h-[280px]
         px-[26px] py-[24px] border-[1px] border-solid border-[#C9C9C9] rounded-[10px]">
            <PopupTitle title={title}></PopupTitle>
            <Divider additional_styles={"-ml-[27px] w-[470px]"}></Divider>
            <p className="text-[16px] w-[397px] text-center">{content ? content : DEFAULT_CONTENT()}</p>
            <ButtonsSection
             button_desc1={button_desc1}
             button_desc2={button_desc2}
             button_desc3={button_desc3}/>
        </aside>
    )
}

const PopupTitle = ({title}) => {
    return (
        <section className="flex flex-row justify-between">
            <h2 className="text-[18px]"><strong>{title}</strong></h2>
            <div className="flex bg-[#D9D9D9] w-[27px] h-[27px] rounded-[5px]">
                <Close className="my-auto mx-auto h-[13px] w-[13px]"></Close>
            </div>
        </section>    
    )
}
const ButtonsSection = ({button_desc1="Save", button_desc2="Save and exit", button_desc3="Discard changes"}) => {
    return (
        <section className="flex flex-row justify-around">
            <Buttons path='/' button_description={button_desc1} additional_styles="bg-[#63F48C]" children="<h1>Hello<h1>"/>
            <Buttons path='/' button_description={button_desc2} additional_styles="bg-[#63F48C]"/>
            <Buttons path='/' button_description={button_desc3} additional_styles="text-[#FF0000]"/>
        </section>
    )
}
export default PopupDialog