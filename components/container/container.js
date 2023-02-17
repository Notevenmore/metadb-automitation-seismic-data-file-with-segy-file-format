import { useRouter } from "next/router"

export default function Container({children}) {
    return(
        <div className="w-full flex flex-col p-10">
            {children}
        </div>
    )
}

Container.Title = ({children, back=false}) => {
    const router = useRouter();
    return (
    <div className="flex flex-row items-center text-[30px] mb-10 gap-x-5">
        {back && <div className="bg-[#d9d9d9]/[49%] rounded w-[35px] h-[35px] flex justify-center items-center" onClick={() => router.back()}>
            <img src="/icons/chevron-left.svg" className="w-[25px] h-[25px]" />
        </div>}
        <div className="font-medium">
            {children}
        </div>
    </div>
)}

Container.Subtitle = ({children, additional_class, tab=false}) => {
    return (
        <div className={`text-[12px] -mt-10 lg:text-[16px] mb-10 ${additional_class}`} style={{marginLeft: tab && "58px"}}>
            {children}
        </div>
    )
}