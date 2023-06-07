import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "../../components/container/container";
import Input from "../../components/input_form/input";
import TableComponent from "../../components/table/table";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../../components/buttons/buttons";
import { datatypes } from "../config";

const PrintedWellReport = ({ setTitle }) => {
    const [data, setData] = useState([]);
    const [searchData, setsearchData] = useState([-1]) // for saving a backup when searching
    const [error, seterror] = useState("")
    const [toggleOverlay, settoggleOverlay] = useState(false)
    const [newWorkspace, setnewWorkspace] = useState({
        workspace_name: "",
        kkks_name: "",
        working_area: "",
        submission_type: "",
        afe_number: "",
    })

    const router = useRouter()
    const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")
    let selectedTableData = [[]];

    const handleEditClick = (e, workspace_name) => {
        let final = workspace_name.toLocaleLowerCase().replace(/\s/g, '_')
        router.push(`/edit/${final}`)
    }

    // const get_workspace_name = (workspace_name) => {
    //     let final = workspace_name.toLocaleLowerCase().replace(/\s/g, '_')
    //     return final
    // }

    // let table_data = [
    //     {
    //         No: 1, Name: "PWR 2023 Report", KKS: "Geodwipa Teknika Nusantara", "wilayah kerja": "Jakarta", jenis: "Printed well report", AFE: "2893728901",
    //         action:
    //             <div className="flex flex-row gap-x-1 items-center">
    //                 <Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
    //                 {/* <Link title="Edit workspace" path="" className="" onClick={(e) => handleEditClick(e, 'Laporan Data 2023')}> */}
    //                 <Link title="Edit workspace" path="" className=""
    //                     href={{
    //                         pathname: `/edit/temp/${get_workspace_name("PWR 2023 Report")}`,
    //                         query: {
    //                             form_type: "printed_well_report"
    //                         }
    //                     }}>
    //                     <Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
    //                 </Link>
    //                 <Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
    //             </div>
    //     },
    //     {
    //         No: 2, Name: "New Document", KKS: "Geodwipa Teknika Nusantara", "wilayah kerja": "Jakarta", jenis: "Printed well report", AFE: "2023032801",
    //         action:
    //             <div className="flex flex-row gap-x-1 items-center">
    //                 <Image src="/icons/magnify.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
    //                 {/* <Button title="Edit workspace" path="" className="" onClick={(e) => handleEditClick(e, 'New workspace from uploaded file')}> */}
    //                 <Link title="Edit workspace" path="" className=""
    //                     href={{
    //                         pathname: `/edit/temp/${get_workspace_name("New Document")}`,
    //                         query: {
    //                             form_type: "printed_well_report"
    //                         }
    //                     }}>
    //                     <Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
    //                 </Link>
    //                 <Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
    //             </div>
    //     },
    // ]
    useEffect(() => {
        const init = async () => {
            try {
                // get workspaces 
                // TODO: could later be used as a dynamic route for multiple data types, 
                // meaning only need to change the fetch link and page title and it's good to go. 
                await fetch("http://localhost:8080/api/v1/print-well-report-workspace-afe/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                }).then(res => {
                    if (res.status !== 200) {
                        throw res.statusText
                    }
                    return res.json()
                }).then(res => {
                    let final = []
                    res.forEach((workspace, idx) => {
                        final.push({
                            Name: workspace.workspace_name,
                            KKKS: workspace.kkks_name,
                            "Working area": workspace.working_area,
                            AFE: workspace.afe_number,
                            Type: workspace.submission_type,
                            Action:
                                <div className="flex flex-row gap-x-4 items-center">
                                    <Button title="Download" additional_styles="px-3 hover:bg-green-300" className="flex">
                                        <div className="w-[18px] h-[18px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polyline points="86 110 128 152 170 110" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><line x1="128" y1="40" x2="128" y2="152" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><path d="M216,152v56a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /></svg>
                                        </div>
                                    </Button>
                                    <Button title="Edit workspace"
                                        additional_styles="px-3" className="flex"
                                        path={`/edit/temp/${workspace.workspace_name}`}
                                        query={{ form_type: "printed_well_report", workspace_data: workspace.afe_number }}
                                    >
                                        <div className="w-[18px] h-[18px] flex items-center">
                                            <Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                                        </div>
                                    </Button>
                                    <Button additional_styles="px-3 hover:bg-red-400" className="flex" title="Delete workspace">
                                        <div className="w-[18px] h-[18px] flex items-center">
                                            <Image src="/icons/delete.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                                        </div>
                                    </Button>
                                </div>
                        })
                    });
                    setData(final)
                })
            } catch (error) {
                seterror(String(error))
            }
        }
        setTitle("Printed Well Report")
        init();
    }, [])


    const onSearch = (e) => {
        const name = e.target.value.toLocaleLowerCase();
        let temp = data;
        temp = temp.filter((item) => {
            return item.Name.toLocaleLowerCase().includes(name);
        });
        if (name) {
            setsearchData(temp);
        } else {
            setsearchData([-1])
        }
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
                header={searchData[0] !== -1 ? searchData.length === 0 ? ["Workspace not found"] : ["Name", "KKKS", "Working area", "Type", "AFE", "Action"] : data.length !== 0 ? ["Name", "KKKS", "Working area", "Type", "AFE", "Action"] : ["Loading..."]}
                content={searchData[0] !== -1 ? searchData.length === 0 ? [{ "Workspace not found": "No workspaces with such name" }] : searchData : data.length === 0 ? [{ "Loading...": "Getting workspace list..." }] : data} setSelectedRows={selectedTableData} with_checkbox contentAlignWithHeader additional_styles="mb-20" />
            {error ? <p className="text-xl font-bold">{error}</p> : null}
            <Button className="shadow-black/10 shadow-lg drop-shadow-lg hover:w-[205px] w-[60px] h-[60px] border rounded-full fixed bottom-9 right-12 bg-gray-200 flex items-center transition-all overflow-hidden outline-none"
                onClick={(e) => { e.preventDefault; settoggleOverlay(true) }}
            >
                <div className="flex items-center justify-center space-x-5 pl-[16px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <p className="whitespace-nowrap font-bold">New workspace</p>
                </div>
            </Button>
            <div className={`fixed w-screen h-screen bg-black/[.5] top-0 left-0 ${toggleOverlay ? "opacity-100 visible" : "opacity-0 invisible"} transition-all`}>
                <div className="flex items-center justify-center w-full h-full">
                    <div className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${toggleOverlay ? "" : "-translate-y-10 opacity-0"} transition-all`}>
                        <Button path="" additional_styles="absolute top-2 right-2 px-1 py-1 text-black" title="Cancel" onClick={(e) => { e.preventDefault(); settoggleOverlay(false); setnewWorkspace({ workspace_name: "", kkks_name: "", working_area: "", afe_number: "", submission_type: "" }) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                        <h1 className="font-bold text-3xl">New workspace</h1>
                        <hr />
                        <p className="font-semibold">Select the appropriate configuration for the new workspace:</p>
                        <form onSubmit={console.log("hooray")} className="space-y-3 flex flex-col items-center justify-center">
                            <div className="w-full space-y-2 border-2 p-2 rounded-lg">
                                <p>Workspace name</p>
                                <Input
                                    type="text"
                                    name={"workingArea"}
                                    placeholder={"Workspace name"}
                                    value={newWorkspace.kkks_name}
                                    required={true}
                                    additional_styles="w-full"
                                    autoComplete="off"
                                    onChange={(e) => setnewWorkspace({ ...newWorkspace, workspace_name: e.target.value })}
                                />
                                <p>AFE number</p>
                                <Input
                                    type="number"
                                    name={"AFE_Number"}
                                    placeholder={"1945"}
                                    value={newWorkspace.afe_number}
                                    required={true}
                                    additional_styles="w-full"
                                    autoComplete="off"
                                    onChange={(e) => setnewWorkspace({ ...newWorkspace, afe_number: e.target.value })}
                                />
                                <p>KKKS name</p>
                                <Input
                                    type="text"
                                    name={"kkksName"}
                                    placeholder={"Geodwipa Teknika Nusantara"}
                                    value={newWorkspace.kkks_name}
                                    required={true}
                                    additional_styles="w-full"
                                    autoComplete="off"
                                    onChange={(e) => setnewWorkspace({ ...newWorkspace, kkks_name: e.target.value })}
                                />
                                <p>Working area</p>
                                <Input
                                    type="text"
                                    name={"workingArea"}
                                    placeholder={"Pulau Geodwipa"}
                                    value={newWorkspace.working_area}
                                    required={true}
                                    additional_styles="w-full"
                                    autoComplete="off"
                                    onChange={(e) => setnewWorkspace({ ...newWorkspace, working_area: e.target.value })}
                                />
                                <p>Submission type</p>
                                <Input
                                    type="dropdown"
                                    name={"submissionType"}
                                    placeholder={"Select an item"}
                                    value={newWorkspace.submission_type}
                                    dropdown_items={[
                                        "Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"
                                    ]}
                                    required={true}
                                    additional_styles="w-full"
                                    onChange={(e) => setnewWorkspace({ ...newWorkspace, submission_type: e.target.value })}
                                    withSearch
                                />
                            </div>
                            <div className="space-x-2 flex">
                                <Button
                                    type="submit"
                                    button_description="Confirm"
                                    path="/new_document"
                                    query={{ form_type: "printed_well_report" }}
                                    disabled={Object.values(newWorkspace).some(x => { return x === null || x === "" }) ? true : false}
                                    additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
                                />
                                <Button
                                    button_description="Cancel"
                                    onClick={(e) => { e.preventDefault(); settoggleOverlay(false); setnewWorkspace({ workspace_name: "", kkks_name: "", working_area: "", afe_number: "", submission_type: "" }) }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default PrintedWellReport