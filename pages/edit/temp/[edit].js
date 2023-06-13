/* eslint-disable react/jsx-key */
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Button from '../../../components/buttons/buttons'
import Sheets from "../../../components/sheets/sheets"
import TableComponent from "../../../components/table/table"
import Input from "../../../components/input_form/input"
import Container from "../../../components/container/container"
import config from "../../../config"
import Highlight from "react-highlight"

const DocEditor = ({ workspace_name, setTitle }) => {
    // note: workspaceName, workspace_name, workspace_names, and workspace_name_space is different
    const [IsSaved, setIsSaved] = useState(false)
    const [Message, setMessage] = useState({ message: "", color: "" })
    const [error, seterror] = useState("")
    const [Data, setData] = useState([-1])
    const [dataContentDetails, setdataContentDetails] = useState([-1])
    const [spreadsheetReady, setspreadsheetReady] = useState(false)
    const [workspaceData, setworkspaceData] = useState()
    const [spreadsheetId, setspreadsheetId] = useState()
    const [triggerSave, settriggerSave] = useState(false)

    const warningText
        = 'You have unsaved changes - Are you sure you want to leave this page?'

    const router = useRouter()
    const handleWindowClose = (e) => {
        e.preventDefault();
        if (!IsSaved) return (e.returnValue = warningText);
        return;
    };

    // This function handles navigation away from the current page by checking whether unsaved changes are present and displaying a warning dialog if necessary
    const handleBrowseAway = (url) => {
        if (!IsSaved) {
            // If there are unsaved changes, prompt the user with a warning dialog
            if (url === router.asPath || !window.confirm(warningText)) {
                // Emit a routeChangeError event and throw an error to prevent navigation away from the page
                router.events.emit('routeChangeError');
                throw 'routeChange aborted.';
            }
        }
        // If there are no unsaved changes, allow navigation away from the page
        return;
    };

    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [IsSaved])

    const init_data = async () => {
        // ----| OLD TEMPORARY WORKFLOW |----
        // check github
        // ----| NEW WORKFLOW |----
        if (!router.query.workspace_data) {
            throw "Workspace data not found, please try again. Additionally, try opening other workspaces if the problem persists. If other workspaces behave the same, please contact maintainer."
        }
        const workspace_data = await fetch(`${config[router.query.form_type]["afe"]}${router.query.workspace_data}`, {
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

        const data = await fetch(`${config[router.query.form_type]["workspace"]}${router.query.workspace_data}`, {
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

    // This useEffect hook sets up the initial data for the workspace based on the workspace name and form type
    useEffect(() => {
        // Call init_data to set up the workspace data
        const init_call = async () => {
            try {
                const initial_data = await init_data()
                setData(initial_data.data ? initial_data.data : [{}])
                setdataContentDetails(initial_data.data ? initial_data.data_content : [{}])
                setworkspaceData(initial_data.workspace_data)
                setTitle(`${workspace_name} | ${router.query.form_type.split("_").map(x => { return x.charAt(0).toUpperCase() + x.slice(1) }).join(" ")} - Edit Workspace`)

            } catch (error) {
                // Handle any errors that occur during initialization
                seterror(String(error))
            }
        }
        init_call()
    }, [])

    // TODO change to POST and PUT request to backend
    // This function handles the saving of the document/workspace
    const saveDocument = async (e) => {
        e.preventDefault();
        try {
            // Check if spreadsheetId is available
            if (!spreadsheetId) {
                setMessage({ message: "Failed to get spreadsheet information, please reload this page. Changes will not be saved", color: "red" });
                return;
            }

            // Set saving message
            setMessage({ message: "Checking changes in workspace information... Please don't leave this page or click anything", color: "blue" });

            // check for changes in the workspace data, if there are any then push the updates to the db
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
                setMessage({ message: "Saving workspace information... Please don't leave this page or click anything", color: "blue" });
                await fetch(`${config[router.query.form_type]["afe"]}${workspaceData['afe_number']}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(workspaceData)
                }).then(res => {
                    if (res.status !== 200) {
                        return res.text()
                    }
                }).then(res => {
                    if (res.toLowerCase().includes("workspace_name_unique")) {
                        throw `A workspace with the name "${workspaceData.workspace_name}" already exists. Please choose a different name.`
                    } else {
                        throw res || "Something happened while updating workspace information data. Please try again or contact maintainer if the problem persists."
                    }
                })
            }

            setMessage({ message: "Checking changes in workspace data... Please don't leave this page or click anything", color: "blue" });
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
                    spreadsheetID: spreadsheetId,
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

            setMessage({ message: "Saving workspace data... Please don't leave this page or click anything", color: "blue" });
            var idx_row = 0
            for (idx_row; idx_row < Math.max(spreadsheet_data.response.length, old_data.data_content.length); idx_row++) {
                let row = {}
                let changed = false
                spreadsheet_header.response.forEach((header, idx_col) => {
                    // try converting any string to integer if possible, if fails then just skip and append the raw string
                    try {
                        row[header.toLowerCase()] = spreadsheet_data?.response[idx_row][idx_col] * 1 || spreadsheet_data?.response[idx_row][idx_col] || "";
                        if (row[header.toLowerCase()] === "") {
                            throw "Please fill out every column in a row although there is no data to be inserted based on the reference document. Make sure to insert correct value types based on their own respective column types."
                        }
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
                            const input = spreadsheet_data?.response[idx_row][idx_col]
                            const parts = input.split("-");
                            const day = parts[0];
                            const month = parts[1];
                            const year = parts[2];
                            const date = new Date(`${month} ${day}, ${year}`);
                            row[header.toLowerCase()] = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
                        } catch (error) {
                            row[header.toLowerCase()] = ""
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
                            console.log("success POSTING new record, appending to workspace...")
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
                                    throw res.statusText || "Something happened while posting (POST) a record to the workspace table which resulted in a failure. Please contact maintainer."
                                }
                            })
                            console.log("success")
                        }
                    }
                }
            }

            // TODO: FINALIZE THIS WORKFLOW TO COMPARE PREVIOUS DATA WITH NEW DATA THEN DO THINGS BASED ON THE COMPARISON
            // TODO: you need to first check if there's any ppdm guid deleted, then check if there's any data that's changed. 
            // maybe compare with the data to get the ID of the things??

            // console.log(ppdm_guid_array)
            // if (final.length > dataContentDetails.length) {

            // }

            // TODO: make workspace_data real-time update
            // const workspace_data_post = {
            //     "afe_number": parseInt(workspaceData.AFE),
            //     "workspace_name": workspace_name,
            //     "kkks_name": workspaceData.KKS,
            //     "working_area": workspaceData.wilayah_kerja,
            //     "submission_type": workspaceData.submission,
            //     "data_type": router.query.form_type
            // }

            // const { data_type, afe_number, ...workspace_data_put } = Object.assign(workspace_data_post);
            // console.log(workspace_data_put);

            // Save the data based on the workspace_name and form_type
            // if (workspace_name === "new_document") {
            //     localStorage.setItem("ocr_data", JSON.stringify(final));
            // } else {
            //     if (router.query.form_type === "printed_well_report") {
            //         localStorage.setItem("pwr_2023_report", JSON.stringify(final));
            //     } else if (router.query.form_type === "bibliography") {
            //         // localStorage.setItem("bibliography_report_final", JSON.stringify(final));
            //         final.forEach((row) => {
            //             post_data("bibliography", row).catch(
            //                 (err) => put_data("bibliography", row.ppdm_guid, row));
            //         })
            //         post_workspace("bibliography", workspace_data_post).catch(
            //             (err) => put_workspace("bibliography", workspace_name, workspace_data_put)
            //         );
            //         ppdm_guid_array.forEach((ppdm_guid) => {
            //             upload_afeguid_new("bibliography", parseInt(workspaceData.AFE), ppdm_guid);
            //         });
            //     }
            // }

            // Set IsSaved to true and display success message
            setIsSaved(true);
            setMessage({ message: "Workspace successfully saved", color: "blue" });
        } catch (error) {
            // Handle error and display error message
            setMessage({ message: `Failed to save workspace. Please try again. Additional error message: ${String(error)}`, color: "red" });
        }
    }

    const delay = delay_amount_ms =>
        new Promise(resolve => setTimeout(() => resolve("delay"), delay_amount_ms))


    // these two below are bound together basically
    const downloadSpreadsheet = (e) => {
        e.preventDefault()
        setIsSaved(true)
        settriggerSave(true)
    }

    useEffect(() => {
        const saveDoc = async () => {
            router.events.emit("routeChangeStart")
            try {
                setMessage({ message: "Downloading workspace as XLSX file, please wait...", color: "blue" });
                if (spreadsheetId && router.query.form_type && workspaceData.afe_number) {
                    const spreadsheet_download = await fetch(`${config.services.sheets}/downloadSheet`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            form_type: router.query.form_type,
                            spreadsheetID: spreadsheetId,
                            workspace_data: workspaceData
                        })
                    }).then(res => {
                        return res.json()
                    }).then(res => {
                        if (res.status !== 200) {
                            throw `Response returned with status code ${res.status}: ${res.response}`
                        }
                        return res
                    })
                    console.log(`new temp spreadsheet download: ${spreadsheet_download.response}`)
                    await fetch(`https://docs.google.com/spreadsheets/d/${spreadsheet_download.response}/export?format=xlsx&id=${spreadsheet_download.response}`)
                        .then(response => response.blob())
                        .then(blob => {
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(blob);
                            link.download = `${workspaceData.workspace_name}`;
                            link.click();
                        })
                        .catch(console.error);
                    await fetch(`${config.services.sheets}/deleteSpreadsheet`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ spreadsheetID: spreadsheet_download.response })
                    }).catch(err => { console.log(err) })
                    setMessage({ message: `Success. Workspace converted to XLSX with file name "${workspaceData.workspace_name}.xlsx"`, color: "blue" });
                }
            } catch (error) {
                setMessage({ message: `${String(error)}`, color: "red" });
            }
            router.events.emit("routeChangeComplete")
            settriggerSave(false)
            setIsSaved(false)
            await delay(3500)
            setMessage({ message: "", color: "" });
        }
        if (triggerSave && IsSaved) {
            saveDoc()
        }
    }, [triggerSave, IsSaved])

    // detect changes in the workspace data inputs
    const handleWorkspaceChange = (event) => {
        const { name, value } = event.target;
        setworkspaceData((prevInputValues) => ({
            ...prevInputValues,
            [name]: value
        }));
        console.log(workspaceData);
    };


    const submission_types = [
        "Quarterly", "Relinquishment", "Termination", "Spec New",
        "Spec Ext", "Spec Term", "Joint Study", "DIPA"
    ]

    return (
        (error) ? (
            <div className="w-full h-full flex flex-col p-10 space-y-4">
                <p className="font-bold text-lg text-red-500">Something happened. Please try again or contact administrator/maintainer if the problem still persists by giving them the information below:</p>
                <Highlight className='html rounded-md border-2'>{error}</Highlight>
                <Button path="/well_data/printed_report" button_description="Go back" />
            </div>
        ) : (Data[0] !== -1 && dataContentDetails[0] !== -1) ? (
            <Container additional_class='space-y-3'>
                <Container.Title back>Edit Document</Container.Title>
                {/* TODO: find out what is workspaceName */}
                <Input
                    name="workspace_name" type='text' placeholder='Workspace name'
                    additional_styles_input='text-xl font-semibold p-3'
                    value={workspaceData?.workspace_name} onChange={handleWorkspaceChange}
                />
                <TableComponent additional_styles_column="overflow-visible" header={workspaceData?.kkks_name ? ["Header", ""] : ["Header"]} content={
                    (workspaceData?.kkks_name) ? (
                        [
                            [
                                <div className="flex space-x-2">
                                    <p>Nama KKKS</p>
                                    <p className="text-gray-400">(KKKS Name)</p>
                                </div>,
                                <Input name="kkks_name" type={"text"}
                                    defaultValue={workspaceData?.kkks_name || "Geodwipa Teknika Nusantara"}
                                    onChange={handleWorkspaceChange}
                                />
                            ],
                            [
                                <div className="flex space-x-2">
                                    <p>Nama wilayah kerja</p>
                                    <p className="text-gray-400">(Working area)</p>
                                </div>,
                                <Input name="working_area" type={"text"}
                                    defaultValue={workspaceData?.working_area || "Geodwipa Teknika Nusantara"}
                                    onChange={handleWorkspaceChange}
                                />
                            ],
                            [
                                <div className="flex space-x-2">
                                    <p>Jenis penyerahan data</p>
                                    <p className="text-gray-400">(Submission type)</p>
                                </div>,
                                <Input name="submission_type" type={"dropdown"}
                                    defaultValue={workspaceData?.submission_type || "Select an item"}
                                    dropdown_items={submission_types} onChange={handleWorkspaceChange} />
                            ],
                            [
                                <div className="flex space-x-2">
                                    <p>Nomor AFE</p>
                                    <p className="text-gray-400">(AFE number)</p>
                                </div>,
                                <Input name="afe_number" type={"number"}
                                    defaultValue={String(workspaceData?.afe_number) || "1"} disabled />
                            ],
                            [
                                <p className="font-bold">Data type</p>,
                                <Input type={"text"} defaultValue={router.query.form_type.replace(/\_/g, " ")}
                                    additional_styles_input="capitalize font-semibold" disabled />
                            ],
                        ]
                    ) : ([[
                        <div className="flex space-x-3 justify-center items-center p-2">
                            <div className="w-5 h-5 border-t-transparent rounded-full border-2 border-black animate-spin" />
                            <p>Getting data... Please wait</p>
                        </div>
                    ]])
                } />
                <div className="h-full">
                    <TableComponent header={[
                        <div className="flex justify-between items-center">
                            <p>Data</p>
                        </div>
                    ]} content={[
                        (Data) ? (
                            [<div className="h-[750px]"><Sheets type="review" form_type={router?.query.form_type || "basin"} data={dataContentDetails} finishedInitializing={setspreadsheetReady} getSpreadsheetID={setspreadsheetId} /></div>]
                        ) : ([
                            <div className="flex space-x-3 justify-center items-center p-2">
                                <div className="w-5 h-5 border-t-transparent rounded-full border-2 border-black animate-spin" />
                                <p>Getting data... Please wait</p>
                            </div>
                        ])
                    ]} additional_styles_row='p-0' additional_styles="overflow-hidden" />
                </div>
                <div className="flex space-x-2 w-full pt-5">
                    <Button
                        path="" button_description="Save workspace" onClick={saveDocument}
                        additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
                        disabled={spreadsheetReady ? false : true}
                    />
                    <Button
                        path="" button_description="Download workspace" onClick={downloadSpreadsheet}
                        additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
                        disabled={spreadsheetReady ? false : true}
                    />
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
                {/* <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${Error ? "" : "-translate-y-20"}`}>
                    <p>{Error}</p>
                    <Button additional_styles="px-1 py-1 text-black" path="" onClick={(e) => { e.preventDefault(); setError("") }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div> */}
            </Container>
        ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center space-y-3`}>
                <div className={`animate-spin border-4 border-t-transparent
                 border-gray-500/[.7] rounded-full w-14 h-14`}></div>
                <p className="text-xl font-semibold text-gray-500">Getting data from database... Please wait</p>
            </div>
        )
    )
}

export async function getServerSideProps(context) {
    return {
        props: { workspace_name: context.params.edit }, // will be passed to the page component as props
    }
}

export default DocEditor