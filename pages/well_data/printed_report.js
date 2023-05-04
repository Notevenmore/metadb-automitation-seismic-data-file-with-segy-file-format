import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "../../components/container/container";
import Input from "../../components/input_form/input";
import TableComponent from "../../components/table/table";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../../components/buttons/buttons";

const PrintedWellReport = ({ setTitle }) => {
    setTitle("Printed Well Report")
    const router = useRouter()
    const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")
    let selectedTableData = [[]];

    const handleEditClick = (e, workspace_name) => {
        let final = workspace_name.toLocaleLowerCase().replace(/\s/g, '_')
        router.push(`/edit/${final}`)
    }

    const get_workspace_name = (workspace_name) => {
        let final = workspace_name.toLocaleLowerCase().replace(/\s/g, '_')
        return final
    }

    let table_data = [
        {
            No: 1, Name: "PWR 2023 Report", KKS: "Geodwipa Teknika Nusantara", "wilayah kerja": "Jakarta", jenis: "Printed well report", AFE: "2893728901",
            action:
                <div className="flex flex-row gap-x-1 items-center">
                    <Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                    {/* <Link title="Edit workspace" path="" className="" onClick={(e) => handleEditClick(e, 'Laporan Data 2023')}> */}
                    <Link title="Edit workspace" path="" className=""
                        href={{
                            pathname: `/edit/${get_workspace_name("PWR 2023 Report")}`,
                            query: {
                                form_type: "printed_well_report"
                            }
                        }}>
                        <Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                    </Link>
                    <Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                </div>
        },
        {
            No: 2, Name: "New Document", KKS: "Geodwipa Teknika Nusantara", "wilayah kerja": "Jakarta", jenis: "Printed well report", AFE: "2023032801",
            action:
                <div className="flex flex-row gap-x-1 items-center">
                    <Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                    {/* <Button title="Edit workspace" path="" className="" onClick={(e) => handleEditClick(e, 'New workspace from uploaded file')}> */}
                    <Link title="Edit workspace" path="" className=""
                        href={{
                            pathname: `/edit/${get_workspace_name("New Document")}`,
                            query: {
                                form_type: "printed_well_report"
                            }
                        }}>
                        <Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                    </Link>
                    <Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                </div>
        },
    ]
    const [data, setData] = useState(table_data);
    const onSearch = (e) => {
        const name = e.target.value.toLocaleLowerCase();
        let temp = table_data;
        temp = temp.filter((item) => {
            return item.Name.toLocaleLowerCase().includes(name);
        });
        console.log("search", temp);
        setData(temp);
    };
    return (
        <Container>
            <Container.Title>
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <p className="text-sm font-normal capitalize">{path_query}</p>
                        <p>Printed Well Report</p>
                    </div>
                    <div className="w-[80%] lg:w-[40%] relative">
                        <Input
                            label=""
                            type="text"
                            name="search"
                            additional_styles_input="px-4 rounded-full text-base"
                            additional_styles="flex flex-col items-center justify-center"
                            onChange={(e) => onSearch(e)}
                            autoComplete="off"
                            placeholder="Search workspace name"
                        />
                        <Image
                            src="/icons/magnify.svg"
                            width="20"
                            height="20"
                            // className="absolute right-[10px] top-[2.5px]"
                            className="absolute top-[50%] right-3 translate-y-[-50%]"
                            alt="search"
                        />
                    </div>
                </div>
            </Container.Title>
            <TableComponent
                header={["No", "Name", "KKS", "Working area", "Type", "AFE", "Action"]}
                content={data} setSelectedRows={selectedTableData} with_checkbox />
        </Container>
    )
}

export default PrintedWellReport