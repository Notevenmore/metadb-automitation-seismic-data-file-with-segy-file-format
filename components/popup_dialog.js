import {twMerge} from "tailwind-merge"
import Buttons from "./../buttons"
import Close from "../public/icons/close.svg"
import {FloatDivider} from "./float_dialog"

const PopupDialog = () => {
    return (
        <aside className="flex flex-col justify-between w-[470px] h-[280px]
         px-[26px] py-[24px] border-[1px] border-solid border-[#C9C9C9] rounded-[10px]">
            <PopupTitle></PopupTitle>
            <FloatDivider additional_styles={"-ml-[27px] w-[470px]"}></FloatDivider>
            <p className="text-[16px] w-[397px] text-center">You have not saved the document yet, are you sure you want to leave this page?
                <strong>This document will not be uploaded and will be deleted.</strong>
            </p>
            <ButtonsSection></ButtonsSection>
        </aside>
    )
}

const PopupTitle = () => {
    return (
        <section className="flex flex-row justify-between">
            <h2 className="text-[18px]"><strong>Are you sure?</strong></h2>
            <div className="flex bg-[#D9D9D9] w-[27px] h-[27px] rounded-[5px]">
                <Close className="my-auto mx-auto h-[13px] w-[13px]"></Close>
            </div>
        </section>    
    )
}
const ButtonsSection = () => {
    return (
        <section className="flex flex-row justify-around">
            <Buttons path='/' button_description='Save' additional_styles={"bg-[#63F48C]"}/>
            <Buttons path='/' button_description='Save and exit' additional_styles={"bg-[#63F48C]"}/>
            <Buttons path='/' button_description='Discard changes' additional_styles={"text-[#FF0000]"}/>
        </section>
    )
}
export default PopupDialog