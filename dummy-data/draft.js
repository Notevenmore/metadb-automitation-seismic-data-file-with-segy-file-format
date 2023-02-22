import Image from "next/image"
import Buttons from "../components/buttons/buttons"

const Action = () => {
    return (
        <div className="flex flex-row gap-x-1 items-center">
            <Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " />
            <Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " />
            <Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " />
        </div>
    )
}

export default {
    header: ["no", "name", "KKS", "wilayah kerja", "jenis", "AFE", "action"], 
    content:[
        {no: 1, name: "Lorem ipsum1", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 2, name: "Lorem ipsum2", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 3, name: "Lorem ipsum3", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 4, name: "Lorem ipsum4", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 5, name: "Lorem ipsum5", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 6, name: "Lorem ipsum6", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 7, name: "Lorem ipsum7", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 8, name: "Lorem ipsum8", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 9, name: "Lorem ipsum9", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 10, name: "Lorem ipsum10", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 11, name: "Lorem ipsum11", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 12, name: "Lorem ipsum12", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 13, name: "Lorem ipsum13", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 14, name: "Lorem ipsum14", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 15, name: "Lorem ipsum15", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
        {no: 16, name: "Lorem ipsum16", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <Action />},
    ]
}