
import { twMerge } from "tailwind-merge"

const FloatDialogNotification = () => {
    return (
        <section className="p-[25px] border-2 border-solid border-float_dialog rounded-[10px] w-[340px] h-[453px]">
            <h2 className="text-[16px] font-bold mb-[20px]">Notifications</h2>
            <NotificationSection></NotificationSection>
            <NotificationSection></NotificationSection>
            <NotificationSection></NotificationSection>
            <NotificationSection></NotificationSection>
        </section>
    )
}

const FloatDialogProfile = () => {
    return (
        <section className = "p-[19px] border-2 border-solid border-float_dialog rounded-[10px] w-[263px] h-[201px] text-[16px]">
            <section className="flex flex-col justify-between h-[59px] mb-[17px]">
                <h2 className="leading-[15px] font-bold">Profile Name</h2>
                <h2 className="leading-[15px] font-regular">emailaddress@email.com</h2>
                <h2 className="leading-[15px] font-medium">Occupation</h2>
            </section>
            <ProfileDivider></ProfileDivider>
            <h2 className="leading-[15px] font-medium my-[17px]">Account settings</h2>
            <ProfileDivider></ProfileDivider>
            <h2 className="leading-[15px] font-medium my-[17px]">Sign out</h2>
        </section>
    )
}

const FloatDivider = ({additional_styles=null}) => {
    return (
        <hr className= {twMerge(`border-1 border-solid border-float_section_divider`, additional_styles)}></hr>
    )
}

const NotificationDivider = () => {
    return (
        <FloatDivider additional_styles={"-ml-[26px] w-[340px]"}></FloatDivider>
    )
}

const ProfileDivider = () => {
    return (
        <FloatDivider additional_styles={"-ml-[19px] w-[263px]"}></FloatDivider>
    )
}

const NotificationSection = () => {
    return (
        <section>
            <NotificationDivider></NotificationDivider>
            <section className="my-[12px]">
                <h2 className="text-[16px] font-semibold">Notification Title</h2>
                <p className="text-[13px] leading-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                 Alias amet delectus quibusdam id provident, reiciendis quam!
                </p>
            </section>
        </section>
    )
}



export default FloatDialogNotification
export {FloatDialogProfile, FloatDivider}