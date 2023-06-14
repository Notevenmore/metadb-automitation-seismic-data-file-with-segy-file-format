import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "../../components/container/container";
import Input from "../../components/input_form/input";
import TableComponent from "../../components/table/table";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../../components/buttons/buttons";
import config, { datatypes } from "../../config";
import Highlight from "react-highlight";
import { setUploadDocumentSettings } from "../../store/generalSlice";
import { useDispatch } from "react-redux";

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
    const [Message, setMessage] = useState({ message: "", color: "" })

    const router = useRouter()
    const dispatch = useDispatch()

    const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")
    let selectedTableData = [[]];

    const init = async () => {
        try {
            // get workspaces 
            // TODO: could later be used as a dynamic route for multiple data types, 
            // meaning only need to change the fetch link and page title and it's good to go. 
            await fetch(`${config["printed_well_report"]["afe"]}`, {
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
                res.forEach((workspace) => {
                    final.push({
                        Name: workspace.workspace_name,
                        KKKS: workspace.kkks_name,
                        "Working area": workspace.working_area,
                        AFE: workspace.afe_number,
                        Type: workspace.submission_type,
                        Action:
                            <div className="flex flex-row gap-x-4 items-center">
                                {/* <Button title="Download" additional_styles="px-3 hover:bg-green-300" className="flex" onClick={(e) => { downloadWorkspace(e, workspace.afe_number) }}>
                                    <div className="w-[18px] h-[18px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none" /><polyline points="86 110 128 152 170 110" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><line x1="128" y1="40" x2="128" y2="152" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /><path d="M216,152v56a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" /></svg>
                                    </div>
                                </Button> */}
                                <Button title="Edit workspace"
                                    additional_styles="px-3" className="flex"
                                    path={`/edit/temp/${workspace.workspace_name}`}
                                    query={{ form_type: "printed_well_report", workspace_data: workspace.afe_number }}
                                >
                                    <div className="w-[18px] h-[18px] flex items-center">
                                        <Image src="/icons/pencil.svg" width={50} height={50} className="w-[25px] h-[15px] alt='' " alt="icon" />
                                    </div>
                                </Button>
                                <Button additional_styles="px-3 hover:bg-red-400" className="flex" title="Delete workspace" onClick={(e) => { deleteWorkspace(e, workspace.afe_number) }}>
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

    useEffect(() => {
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

    const delay = delay_amount_ms =>
        new Promise(resolve => setTimeout(() => resolve("delay"), delay_amount_ms))

    const makenew = async (e) => {
        e.preventDefault()
        router.events.emit("routeChangeStart")
        try {
            settoggleOverlay(false)
            setMessage({ message: "Creating a new workspace... Please don't leave this page or click anything", color: "blue" })
            await fetch(`${config["printed_well_report"]["afe"]}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newWorkspace)
            }).then(res => {
                if (res.status === 200) {
                    return res.statusText
                } else {
                    return res.text()
                }
            }).then(res => {
                if (res.toLowerCase() === "ok") {
                    return true
                } else if (res.toLowerCase().includes("workspace_name_unique")) {
                    throw `A workspace with the name "${newWorkspace.workspace_name}" already exists. Please choose a different name.`
                } else if (res.toLowerCase().includes("afe_pk_error")) {
                    throw `A workspace with AFE number ${newWorkspace.afe_number} already exists. Please choose a different AFE number.`
                } else {
                    throw res || "Something happened while updating workspace information data. Please try again or contact maintainer if the problem persists."
                }
            })
            dispatch(setUploadDocumentSettings(newWorkspace))
            setMessage({ message: "Success. Redirecting to the next page...", color: "blue" });
            router.events.emit("routeChangeComplete")
            await delay(1500)
            router.push({
                pathname: "/new_document",
                query: { form_type: "printed_well_report" }
            })
        } catch (error) {
            // Handle error and display error message
            setMessage({ message: String(error), color: "red" });
        }
        router.events.emit("routeChangeComplete")
    }

    const deleteWorkspace = async (e, afe_number) => {
        e.preventDefault()
        router.events.emit("routeChangeStart")
        try {
            setMessage({ message: "Deleting workspace... Please don't leave this page or click anything", color: "blue" });
            await fetch(`${config["printed_well_report"]["afe"]}${afe_number}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status !== 200) {
                    throw `Response returned with status code ${res.status}: ${res.statusText}`
                }
            })
            setMessage({ message: "Success", color: "blue" });
            init()
            router.events.emit("routeChangeComplete")
            await delay(2000)
            setMessage({ message: "", color: "" });
            // router.reload(window.location.pathname)
        } catch (error) {
            setMessage({ message: String(error), color: "red" });
        }
        router.events.emit("routeChangeComplete")
    }

    const downloadWorkspace = async (e, afe_number) => {
        e.preventDefault()

    }

    const reset = (element = false) => {
        if (element) {
            const comparator = document.getElementById("overlay")
            if (element !== comparator) { return }
        }
        settoggleOverlay(false)
        setnewWorkspace({
            workspace_name: "",
            kkks_name: "",
            working_area: "",
            afe_number: 0,
            submission_type: ""
        })
    }

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
                header={searchData[0] !== -1 ? searchData.length === 0 ? ["Workspace not found"] : ["Name", "KKKS", "Working area", "Type", "AFE", "Action"] : data.length !== 0 ? ["Name", "KKKS", "Working area", "Type", "AFE", "Action"] : error ? ["Connection error"] : ["Loading..."]}
                content={searchData[0] !== -1 ? searchData.length === 0 ? [{ "Workspace not found": "No workspaces with such name" }] : searchData : data.length === 0 ? error ? [{ "Connection error": "Error getting workspace list. Please try again or contact maintainer if the problem persists by giving them the information below" }] : [{ "Loading...": "Getting workspace list..." }] : data}
                setSelectedRows={selectedTableData}
                // with_checkbox 
                contentAlignWithHeader
                additional_styles="mb-20" />
            {error ? <Highlight className='html rounded-md border-2'>{error}</Highlight> : null}
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
            <div
                className={`fixed w-screen h-screen bg-black/[.5] top-0 left-0 ${toggleOverlay ? "opacity-100 visible" : "opacity-0 invisible"} transition-all`}
                onClick={(e) => { e.preventDefault(); reset(e.target) }}
            >
                <div id="overlay" className="flex items-center justify-center w-full h-full">
                    <div className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${toggleOverlay ? "" : "-translate-y-10 opacity-0"} transition-all`}>
                        <Button path="" additional_styles="absolute top-2 right-2 px-1 py-1 text-black" title="Cancel" onClick={(e) => { e.preventDefault(); reset() }}>
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
                                    value={newWorkspace.workspace_name}
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
                                    onChange={(e) => setnewWorkspace({ ...newWorkspace, afe_number: parseInt(e.target.value) })}
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
                                    disabled={Object.values(newWorkspace).some(x => { return x === null || x === "" }) ? true : false}
                                    additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
                                    onClick={makenew}
                                />
                                <Button
                                    button_description="Cancel"
                                    onClick={(e) => { e.preventDefault(); reset() }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`flex items-center space-x-2 fixed top-5 left-[50%]
                 translate-x-[-50%] bg-${Message.color || "blue"}-500 text-white
                 px-3 rounded-lg py-2 transition-all ${Message.message ? "" : "-translate-y-20"}`}>
                <p>{Message.message}</p>
                <Button
                    additional_styles="px-1 py-1 text-black" path=""
                    onClick={(e) => { e.preventDefault(); setMessage({ message: "", color: "" }) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Button>
            </div>
        </Container>
    )
}

export default PrintedWellReport