import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "../../components/container/container";
import Input from "../../components/input_form/input";
import TableComponent from "../../components/table/table";
import Link from "next/link";

const PrintedWellReport = () => {
    let selectedTableData = [[]];
    let table_data = [
        { No: 1, Name: "Laporan Data 2023", KKS: "GTN", "wilayah kerja": "Jakarta", jenis: "Not set", AFE: "28937289", action: <div className="flex flex-row gap-x-1 items-center"><Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /><Link href="/well_data/edit"><Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></Link><Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" /></div> },
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
                header={["No", "Name", "KKS", "Wilayah Kerja", "Jenis", "AFE", "Action"]}
                content={data} setSelectedRows={selectedTableData} with_checkbox />
        </Container>
    )
}

export default PrintedWellReport