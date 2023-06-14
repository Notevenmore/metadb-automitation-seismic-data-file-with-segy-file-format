import { useEffect, useRef, useState } from "react";
import Buttons from "../components/buttons/buttons";
import Container from "../components/container/container.js";
import Input from "../components/input_form/input";
// import { current } from "@reduxjs/toolkit";
import HeaderTable, { HeaderDivider, HeaderStatic, HeaderInput, ButtonsSection }
    from "../components/header_table/header_table";
import Sheets from "../components/sheets/sheets";
import TableComponent from "../components/table/table";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import config from "../config";

export default function NewDocumentPage({ setTitle }) {
    const router = useRouter()
    const [detail, setDetail] = useState("bbb");
    const [Message, setMessage] = useState({ message: "", color: "" })
    const [dataType, setdataType] = useState()
    const [spreadsheetID, setspreadsheetID] = useState()
    const [workspaceData, setworkspaceData] = useState()

    const upload_document_settings = useSelector((state) => state.general.upload_document_settings)

    // const saveChanges = async (e) => {
    //     e.preventDefault()
    //     try {
    //         setMessage({ message: "Saving workspace... Please don't leave this page or click anything.", color: "blue" })
    //         const spreadsheet_data = await fetch("http://www.localhost:5050/getRows", {
    //             method: "POST",
    //             headers: {
    //                 "Content-type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 form_type: dataType,
    //                 spreadsheetID: spreadsheetID
    //             })
    //         }).then(response => {
    //             return response.json()
    //         }).then(response => {
    //             console.log(response)
    //             if (response.status !== 200) {
    //                 throw response.response
    //             }
    //             return response
    //         }).catch(err => { throw err })

    //         let final = []
    //         for (let idx_row = 1; idx_row < spreadsheet_data.response.length; idx_row++) {
    //             let row = {}
    //             console.log(idx_row)
    //             spreadsheet_data.response[0].forEach((header, idx_col) => {
    //                 row[header] = spreadsheet_data?.response[idx_row][idx_col] || ""
    //             });
    //             console.log(row)
    //             final.push(row)
    //         }

    //         if (dataType === "printed_well_report") {
    //             localStorage.setItem("new_pwr", JSON.stringify(final))
    //         } else if (dataType === "bibliography") {
    //             localStorage.setItem("new_bibliography", JSON.stringify(final))
    //         }
    //         setMessage({ message: "Workspace successfully saved.", color: "blue" })
    //     } catch (error) {
    //         setMessage({ message: `Failed to save workspace. Please try again. Additional error message: ${error}`, color: "red" })
    //     }
    // }

    const init_data = async () => {
        // ----| OLD TEMPORARY WORKFLOW |----
        // check github
        // ----| NEW WORKFLOW |----
        if (!workspaceData.afe_number) {
            throw "Record data not found, please try again. Additionally, try opening other records if the problem persists. If other records behave the same, please contact maintainer."
        }
        const workspace_data = await fetch(`${config[router.query.form_type]["afe"]}${workspaceData.afe_number}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status !== 200) {
                throw `Service returned with status ${res.status}; ${res.statusText}`
            }
            return res.json()
        })

        const data = await fetch(`${config[router.query.form_type]["workspace"]}${workspaceData.afe_number}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status !== 200) {
                throw `Service returned with status ${res.status}; ${res.statusText}`
            }
            return res.json()
        })

        // if data is not null (workspace is not empty), then get every data details within the workspace.
        // since the 'data' variable above only holds the ids of the data, along with the ppdm guid it's referencing
        // to and the workspace afe number it's referencing to. 
        let final = []
        // let ppdm_guids = []
        if (data) {
            for (const pwr_id of data) {
                const data_details = await fetch(`${config[router.query.form_type]["view"]}${pwr_id.pwr_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    if (res.status !== 200) {
                        throw `Response returned with status code ${res.status}: ${res.statusText}`
                    }
                    return res.json()
                }).then(res => { return res })
                final.push(data_details[0])
            }
        }
        return { data: data, data_content: final, workspace_data: workspace_data[0] }
    }

    const delay = delay_amount_ms =>
        new Promise(resolve => setTimeout(() => resolve("delay"), delay_amount_ms))

    const saveDocument = async (e) => {
        e.preventDefault();
        router.events.emit("routeChangeStart")
        try {
            // Check if spreadsheetId is available
            if (!spreadsheetID) {
                setMessage({ message: "Failed to get spreadsheet information, please reload this page. Changes will not be saved", color: "red" });
                return;
            }

            // Set saving message
            setMessage({ message: "Checking changes in record information... Please don't leave this page or click anything", color: "blue" });

            // check for changes in the record data, if there are any then push the updates to the db
            let workspace_data_changed = false
            const old_workspace_data = await fetch(`${config[router.query.form_type]["afe"]}${workspaceData['afe_number']}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.status !== 200) {
                    throw `Service returned with status ${res.status}; ${res.statusText}`
                }
                return res.json()
            })

            Object.keys(old_workspace_data[0]).some(key => {
                if (old_workspace_data[0][key] !== workspaceData[key]) {
                    workspace_data_changed = true
                    return true
                }
            });

            if (workspace_data_changed) {
                setMessage({ message: "Saving record information... Please don't leave this page or click anything", color: "blue" });
                await fetch(`${config[router.query.form_type]["afe"]}${workspaceData['afe_number']}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(workspaceData)
                }).then(res => {
                    if (res.status !== 200) {
                        throw `Service returned with status ${res.status}; ${res.statusText}`
                    }
                })
            }

            setMessage({ message: "Checking changes in record data... Please don't leave this page or click anything", color: "blue" });
            // fetch original data from database
            const old_data = await init_data()

            // Fetch header from spreadsheet
            const spreadsheet_header = await fetch(`${config.services.sheets}/getHeaders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    form_type: router.query.form_type
                })
            }).then(response => {
                return response.json();
            }).then(response => {
                // Handle non-200 response status
                if (response.status !== 200) {
                    throw response.response;
                }
                return response;
            })

            // Fetch spreadsheet data from the server
            const spreadsheet_data = await fetch(`${config.services.sheets}/getRows`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    form_type: router.query.form_type,
                    spreadsheetID: spreadsheetID,
                    without_header: true
                })
            }).then(response => {
                return response.json();
            }).then(response => {
                // Handle non-200 response status
                if (response.status !== 200) {
                    throw response.response;
                }
                return response;
            }).catch(err => { throw err; });

            setMessage({ message: "Saving record data... Please don't leave this page or click anything", color: "blue" });
            var idx_row = 0
            if (spreadsheet_data.response) {
                for (idx_row; idx_row < Math.max(spreadsheet_data.response.length, old_data.data_content.length); idx_row++) {
                    let row = {}
                    let changed = false
                    spreadsheet_header.response.forEach((header, idx_col) => {
                        // try converting any string to integer if possible, if fails then just skip and append the raw string
                        try {
                            row[header.toLowerCase()] = spreadsheet_data?.response[idx_row][idx_col] * 1 || spreadsheet_data?.response[idx_row][idx_col] || null;
                            // if (row[header.toLowerCase()] === "") {
                            //     throw "Please fill out every column in a row although there is no data to be inserted based on the reference document. Make sure to insert correct value types based on their own respective column types."
                            // }
                        } catch (error) { }

                        // try checking if the data is different. if index out of range it means that the size of the array of either
                        // the old data has surpassed the new data, or vice versa, so skip the step. 
                        try {
                            if (!changed && row[header.toLowerCase()] !== (old_data.data_content[idx_row][header.toLowerCase()] || old_data.data_content[idx_row][header])) {
                                changed = true
                            }
                        } catch (error) { }

                        // convert date gotten from the database to appropriate format after the checking, to avoid 
                        // misinterpretating different date formats as different values although the date is the same
                        if (header.toLowerCase().includes("date")) {
                            // try to convert, if the input is null then just pass
                            try {
                                let day, month, year, parts;
                                const input = spreadsheet_data?.response[idx_row][idx_col]
                                if (input.includes("-")) {
                                    parts = input.split("-");
                                } else if (input.trim().includes(" ")) {
                                    parts = input.split(" ");
                                } else {
                                    parts = input.split("/")
                                }
                                day = parts[0];
                                month = parts[1];
                                year = parts[2];
                                const date = new Date(`${month}-${day}-${year}`);
                                row[header.toLowerCase()] = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
                            } catch (error) {
                                row[header.toLowerCase()] = null
                            }
                        }
                    });
                    console.log(row, idx_row)
                    // if change in row is detected then update the data in the database
                    if (changed && idx_row < old_data.data_content.length - 1) {
                        console.log("trying to PUT", idx_row)
                        await fetch(`${config[router.query.form_type]["view"]}${old_data.data_content[idx_row]["id"]}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ id: old_data.data_content[idx_row]["id"], ...row })
                        }).then(res => {
                            if (res.status !== 200) {
                                throw res.statusText || "Something happened while updating (PUT) a record which resulted in failure. Please contact maintainer."
                            }
                        })
                    } else {
                        // else if current index is already beyond the length of original data or the new data
                        if (idx_row > spreadsheet_data.response.length - 1 || idx_row > old_data.data_content.length - 1) {
                            // if the new data length is shorter than the new data then the old data is deleted
                            if (spreadsheet_data.response.length < old_data.data_content.length) {
                                console.log("trying to DELETE", idx_row)
                                await fetch(`${config[router.query.form_type]["view"]}${old_data.data_content[idx_row]["id"]}`, {
                                    method: "DELETE",
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }).then(res => {
                                    if (res.status !== 200) {
                                        throw res.statusText || "Something happened while deleting (DELETE) a record which resulted in a failure. Please contact maintainer. "
                                    }
                                })
                                console.log("success")
                            }
                            // else if the new data length is greater than the old data then there's a new row appended
                            else if (spreadsheet_data.response.length > old_data.data_content.length) {
                                console.log("trying to POST", idx_row)
                                const upload = await fetch(`${config[router.query.form_type]["view"]}`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(row)
                                }).then(res => {
                                    if (res.status !== 200) {
                                        throw res.statusText || "Something happened while posting (POST) a record which resulted in a failure. Please contact maintainer."
                                    }
                                    return res.text()
                                })
                                console.log("success POSTING new record, appending to record...")
                                let uploaded_id = upload.split(":")
                                uploaded_id = parseInt(uploaded_id[uploaded_id.length - 1].trim())
                                await fetch(`${config[router.query.form_type]["workspace"]}`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        afe_number: workspaceData.afe_number,
                                        pwr_id: uploaded_id
                                    })
                                }).then(res => {
                                    if (res.status !== 200) {
                                        throw res.statusText || "Something happened while posting (POST) a record to the record table which resulted in a failure. Please contact maintainer."
                                    }
                                })
                                console.log("success")
                            }
                        }
                    }
                }
            } else {
                if (old_data.data_content.length > 0) {
                    old_data.data_content.forEach(async (record, idx_row_del) => {
                        console.log("trying to DELETE", idx_row_del)
                        await fetch(`${config[router.query.form_type]["view"]}${record["id"]}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(res => {
                            if (res.status !== 200) {
                                throw res.statusText || "Something happened while deleting (DELETE) a record which resulted in a failure. Please contact maintainer. "
                            }
                        })
                        console.log("success")
                    });
                }
            }
            setMessage({ message: "Record successfully saved", color: "blue" });
            router.events.emit("routeChangeComplete")
            await delay(3000)
            setMessage({ message: "", color: "" });
        } catch (error) {
            // Handle error and display error message
            setMessage({ message: `Failed to save record. Please try again. Additional error message: ${String(error)}`, color: "red" });
        }
        router.events.emit("routeChangeComplete")
    }

    useEffect(() => {
        if (!router.query.form_type) {
            router.push("/")
        } else {
            if (upload_document_settings?.afe_number) {
                setworkspaceData(upload_document_settings)
            }
        }
        setTitle("New document")
    }, [])

    return ((workspaceData) ? (
        <Container additional_class="full-height relative">
            <Container.Title back>
                {/* <Input
                    type={"text"}
                    value={workspaceData.workspace_name}
                    placeholder="Workspace name"
                    onChange={(e) => { setworkspaceData({ ...workspaceData, workspace_name: e.target.value }) }}
                /> */}
                <p>New record</p>
            </Container.Title>
            <HeaderTable>
                <HeaderInput label1={"Nama KKKS"} label2={"(KKKS Name)"}>
                    <Input
                        type="text"
                        name={"workingArea"}
                        placeholder={"Input KKKS name"}
                        required={true}
                        additional_styles="w-full"
                        value={workspaceData.kkks_name}
                        onChange={(e) => setworkspaceData({ ...workspaceData, kkks_name: e.target.value })}
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Nama wilayah kerja"} label2={"(Working Area)"}>
                    <Input
                        type="text"
                        name={"workingArea"}
                        placeholder={"Input working area"}
                        required={true}
                        additional_styles="w-full"
                        value={workspaceData.working_area}
                        onChange={(e) => setworkspaceData({ ...workspaceData, working_area: e.target.value })}
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Jenis penyerahan data"} label2={"(Submission Type)"}>
                    <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Select a submission type"}
                        dropdown_items={["Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"]}
                        required={true}
                        additional_styles="w-full"
                        value={workspaceData.submission_type}
                        onChange={(e) => setworkspaceData({ ...workspaceData, submission_type: e.target.value })}
                        withSearch
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Nomor AFE"} label2={"(AFE Number)"}>
                    <Input
                        type="text"
                        name={"AFE_Number"}
                        placeholder={"1"}
                        required={true}
                        value={workspaceData.afe_number}
                        additional_styles="w-full"
                        disabled
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Data type"}>
                    <Input
                        // type="dropdown"
                        type="text"
                        name={"dataType"}
                        value={router.query.form_type.replace(/\_/g, " ")}
                        // placeholder={"Seismic data"}
                        // dropdown_items={["Well"]}
                        // required={true}
                        additional_styles="w-full"
                        additional_styles_input="font-semibold capitalize"
                        disabled
                    // onChange={(e) => setDetail(e.target.name)}
                    // withSearch
                    />
                </HeaderInput>
                {/* <HeaderDivider />
                <HeaderInput label1={"Data classification"}>
                    <Input
                        type="dropdown"
                        name={"dataClassification"}
                        placeholder={"3D"}
                        dropdown_items={["Report"]}
                        required={true}
                        additional_styles="w-full"
                        additional_styles_input="font-semibold"
                        onChange={(e) => setDetail(e.target.name)}
                        withSearch
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Data sub-classification"}>
                    <Input
                        type="dropdown"
                        name={"dataSubClassification"}
                        placeholder={"Stored in media"}
                        dropdown_items={["Printed"]}
                        required={true}
                        additional_styles="w-full"
                        additional_styles_input="font-semibold"
                        onChange={(e) => setDetail(e.target.name)}
                        withSearch
                    />
                </HeaderInput> */}
            </HeaderTable>
            <div className="pt-3">
                <TableComponent
                    header={["Data"]}
                    content={[
                        [
                            (workspaceData && router.query.form_type) ? (
                                <div className="h-[750px]"><Sheets form_type={router.query.form_type} type="new" getSpreadsheetID={setspreadsheetID} /></div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                                    <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
                                    <p className="text-xl font-semibold text-gray-500">Waiting for initialization process to finish</p>
                                </div>
                            )
                        ]
                    ]}
                    additional_styles='overflow-hidden'
                    additional_styles_row='p-0'
                />
            </div>
            <div className="flex space-x-2 py-10">
                <Buttons path="" additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold" onClick={saveDocument} disabled={Message.message ? true : false}>Save changes</Buttons>
                <Buttons path="" additional_styles="text-error" onClick={router.back} disabled={Message.message ? true : false}>Cancel</Buttons>
            </div>
            {/* <ButtonsSection className="pb-2 border-2 border-black">
            </ButtonsSection> */}
            <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-${Message.color || "blue"}-500 text-white px-3 rounded-lg py-2 transition-all ${Message.message ? "" : "-translate-y-20"}`}>
                <p>{Message.message}</p>
                <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={(e) => { e.preventDefault(); setMessage({ message: "", color: "" }) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Buttons>
            </div>
        </Container>
    ) : (<p>Loading...</p>));
}
