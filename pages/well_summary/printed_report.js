import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "../../components/container/container";
import Input from "../../components/input_form/input";
import TableComponent from "../../components/table/table";
import Link from "next/link";

const PrintedWellReport = () => {
    let selectedTableData = [[]];
    let table_data = [
        { no: 1, name: "Lorem ipsum1", KKS: "kKEI", "wilayah kerja": "jakarta", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 2, name: "Lorem ipsum2", KKS: "kKEI", "wilayah kerja": "jakarta", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 3, name: "Lorem ipsum3", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 4, name: "document 1", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 5, name: "document 2", KKS: "kKEI", "wilayah kerja": "jakarta", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 6, name: "document 3", KKS: "kKEI", "wilayah kerja": "jakarta", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 7, name: "file 1", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 8, name: "file 2", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 9, name: "file 3", KKS: "kKEI", "wilayah kerja": "bandung", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 10, name: "Lorem ipsum10", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 11, name: "Lorem ipsum11", KKS: "kKEI", "wilayah kerja": "bandung", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 12, name: "Lorem ipsum12", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 13, name: "document 5", KKS: "kKEI", "wilayah kerja": "somewhere", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 14, name: "document 6", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 15, name: "000", KKS: "kKEI", "wilayah kerja": "somewhere", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
        { no: 16, name: "111", KKS: "kKEI", "wilayah kerja": "not set", jenis: "not set", AFE: "not set", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_summary/edit_temp"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> }
    ]
    const [data, setData] = useState(table_data);
    const onSearch = (e) => {
        const name = e.target.value.toLocaleLowerCase();
        let temp = table_data;
        temp = temp.filter((item) => {
            return item.name.toLocaleLowerCase().includes(name);
        });
        console.log("search", temp);
        setData(temp);
    };
    return (
        <Container>
            <Container.Title>
                <div className="flex flex-row items-center justify-between">
                    <div>Printed Well Report</div>
                    <div className="w-[80%] lg:w-[40%] relative">
                        <Input
                            label=""
                            type="text"
                            name="search"
                            additional_styles_input="h-[25px] !rounded-full text-[12px]"
                            additional_styles="flex flex-col items-center justify-center"
                            onChange={(e) => onSearch(e)}
                        />
                        <Image
                            src="/icons/magnify.svg"
                            width="20"
                            height="20"
                            className="absolute right-[10px] top-[2.5px]"
                            alt="search"
                        />
                    </div>
                </div>
            </Container.Title>
            <TableComponent
                header={["no", "name", "KKS", "wilayah kerja", "jenis", "AFE", "action"]}
                content={data} setSelectedRows={selectedTableData} with_checkbox />
        </Container>
    )
}

export default PrintedWellReport