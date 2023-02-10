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
        <div>profile floating dialog</div>
    )
}

const FloatSectionDivider = () => {
    return (
        <hr className="ml-[-26px] border-1 border-solid border-float_section_divider w-[340px]"></hr>
    )
}

const NotificationSection = () => {
    return (
        <section>
            <FloatSectionDivider></FloatSectionDivider>
            <section className="my-[12px]">
                <h2 className="text-[16px] font-semibold">Notification Title</h2>
                <p className="leading-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                 Alias amet delectus quibusdam id provident, reiciendis quam!
                </p>
            </section>
        </section>
    )
}



export default FloatDialogNotification
export {FloatDialogProfile}
// export default FloatDialogProfile
// const Buttons = ({ path, button_description, additional_styles = null }) => {
//     return (
//         <div className="w-fit">
//             <Link href={path}>
//                 <button title={button_description} className={`block px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all  ${additional_styles}`}>
//                     {button_description}
//                 </button>
//             </Link>
//         </div>
//     )
// }