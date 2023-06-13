/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import HeaderTable, { HeaderDivider, HeaderStatic, HeaderInput, ButtonsSection, HeaderRow }
    from "../../components/header_table/header_table";
import Sheets from "../../components/sheets/sheets"
import Table from "../../components/table/table"
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Highlight from 'react-highlight'
import ChevronLeft from '../../public/icons/chevron-left.svg'
import ChevronRight from '../../public/icons/chevron-right.svg'
import { ImageEditor } from "../components/highlight_viewer";
import config from "../../config";

export default function UploadFileReview({ setTitle }) {
    const [ReviewData, setReviewData] = useState([])
    const [ImageReview, setImageReview] = useState("")
    const [Message, setMessage] = useState({ message: "", color: "" })
    const [PageNo, setPageNo] = useState(0)
    const [ImageURL, setImageURL] = useState("")
    const [error, setError] = useState("")
    const [spreadsheetID, setspreadsheetID] = useState("")
    const [loading, setloading] = useState("")
    const [spreadsheetReady, setspreadsheetReady] = useState(false)
    const [workspaceData, setworkspaceData] = useState()

    const router = useRouter()
    const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")

    const files = useSelector((state) => state.general.file)
    const review_data = useSelector((state) => state.general.review_data)
    const document_summary = useSelector((state) => state.general.document_summary)
    const upload_document_settings = useSelector((state) => state.general.upload_document_settings)

    // TODO fix the workflow to get the data from redux instead of local storage
    useEffect(() => {
        // ---| NEW WORKFLOW |---
        const init = async () => {
            try {
                setImageURL(_ => `${process.env.OCR_SERVICE_URL}/ocr_service/v1/image/${document_summary?.document_id}/${PageNo + 1}`)
                setloading(`Reformatting OCR data`)
                let final = []
                for (let idx = 0; idx < document_summary.body.page_count; idx++) {
                    let row = {}
                    Object.values(review_data[idx]).map((item) => {
                        row[item.key.toLowerCase()] = item.value
                    })
                    final.push(row)
                }
                // const promisedsetReviewData = (newState) => new Promise(resolve => setReviewData(newState, resolve))
                // await promisedsetReviewData(final).then(res => { console.log(res); return true })
                setReviewData(final)
                const workspace_data = {
                    "afe_number": parseInt(upload_document_settings.afe_number),
                    "workspace_name": upload_document_settings.workspace_name,
                    "kkks_name": upload_document_settings.kkks_name,
                    "working_area": upload_document_settings.working_area,
                    "submission_type": upload_document_settings.submission_type
                }
                setworkspaceData(workspace_data)

                // get ID for each page if more than 1
                // setloading(`Creating new spreadsheet`)
                // const init_id = await fetch('http://localhost:5050/createSpreadsheet', {
                //     method: "GET",
                //     headers: {
                //         "Content-Type": "application/json"
                //     }
                // }).then(response => {
                //     return response.json()
                // }).catch(e => { throw new Error(String(e)) })
                // console.log(idx)
                // console.log(init_id)
                // console.log(review_data[idx])
                // if (init_id.status !== 200) {
                //     throw new Error("Something happened in the Sheets service. Please try again or contact maintainer if the problem still persists.")
                // }
                // // setting the ID to include in the object
                // setspreadsheetIDs((ids) => {
                //     let updated = ids
                //     updated[idx] = init_id.response
                //     return updated
                // })
                // setloading(`Updating spreadsheet for page ${idx + 1} to display proper data type: printed_well_report`)
                // // updating the spreadsheet to display proper data type
                // await fetch('http://localhost:5050/updateSpreadsheet/v2', {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({
                //         type: "review",
                //         form_type: "printed_well_report", // TODO change to dynamic later
                //         spreadsheetID: init_id.response
                //     })
                // }).then(response => {
                //     return response.json()
                // }).then(response => {
                //     if (response.status !== 200) {
                //         throw new Error(`${response.status}: ${response.response}`)
                //     }
                // })

                // setloading(`Appending OCR data for page ${idx + 1}`)
                // // updating the spreadsheet based on the reviewed data (OCR)
                // await fetch('http://localhost:5050/appendToSheets2', {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({
                //         form_type: "printed_well_report", // TODO change to dynamic later
                //         spreadsheetID: init_id.response,
                //         data: JSON.stringify([final])
                //     })
                // }).then(response => {
                //     return response.json()
                // }).then(response => {
                //     if (response.status !== 200) {
                //         throw new Error(`${response.status}: ${response.response}`)
                //     }
                // })

                setloading("")
            } catch (error) {
                setloading("")
                setError(String(error))
            }
        }
        if (files.length < 1) {
            router.push("/upload_file")
        } else {
            init();
        }

        // ---| OLD WORKFLOW |---
        // const review_data = localStorage.getItem("reviewData")
        // if (review_data) {
        //     setReviewData(review_data)
        // }
    }, [])

    // useEffect(() => {
    //     console.log(spreadsheetIDs)
    // }, [spreadsheetIDs])

    useEffect(() => {
        setImageURL(_ => `${process.env.OCR_SERVICE_URL}/ocr_service/v1/image/${document_summary?.document_id}/${PageNo + 1}`)
    }, [PageNo])

    // TODO fix the workflow to get the data from redux instead of local storage
    const setImage = (e) => {
        e.preventDefault()
        // const uploaded_img = localStorage.getItem("reviewUploadedImage")
        // if (uploaded_img) {
        //     setImageReview(uploaded_img)
        // } else {
        //     setImageReview("Cannot find uploaded image. Please retry the process or see the original image by opening it directly from your computer.")
        // }
        setImageReview(ImageURL)
    }

    // TODO save to db instead of localstorage later on
    // const saveWorkspace = async (e, redirect = false) => {
    //     e.preventDefault()
    //     // let counter = 0, name = ""
    //     // while (true) {
    //     //     const workspace_exist = localStorage.getItem("new_workspace_from_uploaded_file")
    //     //     if (workspace_exist) {
    //     //         counter = counter + 1
    //     //     } else {
    //     //         name = !counter ? "new_workspace_from_uploaded_file" : `new_workspace_from_uploaded_file_${counter}`
    //     //         localStorage.setItem(name, ReviewData)
    //     //         break
    //     //     }
    //     // }
    //     // let workspaces = JSON.parse(localStorage.getItem("workspaces"))
    //     // workspaces.push({ "name": name })
    //     // console.log("first")
    //     // localStorage.setItem("new_workspace_from_uploaded_file", ReviewData)
    //     try {
    //         setMessage({ message: "Saving workspace... Please don't close this page or click anything", color: "blue" })
    //         console.log(spreadsheetID)
    //         if (!spreadsheetID) {
    //             setMessage({ message: "Spreadsheet not yet initialized. Please wait for a moment.", color: "red" })
    //             return
    //         }
    //         const spreadsheet_data = await fetch(`http://127.0.0.1:5050/getRows`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 form_type: String(router.query.form_type),
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

    //         console.log(spreadsheet_data.response[0])
    //         let final = []
    //         for (let idx_row = 1; idx_row < spreadsheet_data.response.length; idx_row++) {
    //             let row = {}
    //             console.log(idx_row)
    //             spreadsheet_data.response[0].forEach((header, idx_col) => {
    //                 row[header.toLowerCase()] = spreadsheet_data?.response[idx_row][idx_col] || ""
    //             });
    //             console.log(row)
    //             final.push(row)
    //         }
    //         if (final.length === 0) { final.push({}) }
    //         localStorage.setItem("ocr_data", JSON.stringify(final))

    //         setMessage({ message: "Workspace successfully saved.", color: "blue" })

    //         if (redirect) {
    //             router.push("/")
    //         }
    //     } catch (error) {
    //         setMessage({ message: `Failed to save workspace. Please try again. Additional error message: ${error}`, color: "red" })
    //         throw error
    //     }
    // }

    const init_data = async () => {
        // ----| OLD TEMPORARY WORKFLOW |----
        // check github
        // ----| NEW WORKFLOW |----
        if (!workspaceData.afe_number) {
            throw "Workspace data not found, please try again. Additionally, try opening other workspaces if the problem persists. If other workspaces behave the same, please contact maintainer."
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

    const saveDocument = async (e) => {
        e.preventDefault();
        try {
            // Check if spreadsheetId is available
            if (!spreadsheetID) {
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
                        throw `Service returned with status ${res.status}; ${res.statusText}`
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
            setMessage({ message: "Workspace successfully saved", color: "blue" });
        } catch (error) {
            // Handle error and display error message
            setMessage({ message: `Failed to save workspace. Please try again. Additional error message: ${String(error)}`, color: "red" });
        }
    }

    return ((error) ? (
        <div className="w-full h-full flex flex-col p-10 space-y-4">
            <p className="font-bold text-lg text-red-500">Something happened. Please try again or contact administrator/maintainer if the problem still persists by giving them the information below:</p>
            <Highlight className='html rounded-md border-2'>{error}</Highlight>
            {/* @ts-ignore */}
            <Buttons path="/" button_description="Go back home" />
        </div>
    ) : (workspaceData) ?
        (
            <Container additional_class="full-height relative">
                <Container.Title>
                    <div className="-space-y-2">
                        <p className="capitalize text-sm font-normal">{path_query}</p>
                        <p>Review</p>
                    </div>
                </Container.Title>
                <section className="-mt-5 mb-5 space-y-2">
                    <p className="font-bold">Name</p>
                    {/* <h1 className="font-bold text-[36px]">Lorem ipsum laporan 2008</h1> */}
                    <Input type={"text"} additional_styles_input="text-xl py-3 px-3 font-bold placeholder:italic" value={workspaceData.workspace_name} placeholder="Workspace name" onChange={(e) => setworkspaceData({ ...workspaceData, workspace_name: e.target.value })} />
                </section>
                <HeaderTable>
                    <HeaderInput label1={"Nama KKKS"} label2={"(KKKS Name)"}>
                        <Input
                            type="text"
                            name={"workingArea"}
                            placeholder={"Geodwipa Teknika Nusantara"}
                            value={workspaceData.kkks_name}
                            required={true}
                            additional_styles="w-full"
                            onChange={(e) => setworkspaceData({ ...workspaceData, kkks_name: e.target.value })}
                        />
                    </HeaderInput>
                    <HeaderDivider />
                    <HeaderInput label1={"Nama wilayah kerja"} label2={"(Working Area)"}>
                        <Input
                            type="text"
                            name={"workingArea"}
                            placeholder={"Pulau Geodwipa"}
                            value={workspaceData.working_area}
                            required={true}
                            additional_styles="w-full"
                            onChange={(e) => setworkspaceData({ ...workspaceData, working_area: e.target.value })}
                        />
                    </HeaderInput>
                    <HeaderDivider />
                    <HeaderInput label1={"Jenis penyerahan data"} label2={"(Submission Type)"}>
                        <Input
                            type="dropdown"
                            name={"submissionType"}
                            placeholder={"Select a submission type"}
                            dropdown_items={[
                                "Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"
                            ]}
                            value={workspaceData.submission_type}
                            required={true}
                            additional_styles="w-full"
                            onChange={(e) => setworkspaceData({ ...workspaceData, submission_type: e.target.value })}
                            withSearch
                        />
                    </HeaderInput>
                    <HeaderDivider />
                    <HeaderInput label1={"Nomor AFE"} label2={"(AFE Number)"}>
                        <Input
                            type="number"
                            name={"AFE_Number"}
                            value={workspaceData.afe_number}
                            additional_styles="w-full"
                            onChange={(e) => setworkspaceData({ ...workspaceData, afe_number: e.target.value })}
                            disabled
                        />
                    </HeaderInput>
                    <HeaderDivider />
                    <HeaderInput label1={"Data type"}>
                        <Input
                            type="text"
                            name={"dataType"}
                            defaultValue={router.query.form_type?.replace(/\_/g, " ") || "basin"}
                            additional_styles="w-full"
                            additional_styles_input="font-semibold capitalize"
                            disabled
                        />
                    </HeaderInput>
                </HeaderTable>
                <div className="pt-3">
                    <Table
                        header={[<div className="flex justify-between items-center">
                            <p>Data</p>
                            {ImageReview ?
                                <Buttons button_description="Hide image" additional_styles="bg-white" path="" onClick={(e) => { e.preventDefault(); setImageReview("") }} />
                                :
                                // <Buttons button_description="View uploaded picture below" additional_styles="bg-white" path="" onClick={(setImage)} />}
                                <Buttons button_description="View uploaded picture below" additional_styles="bg-white" path="" onClick={(e) => { e.preventDefault(); setImageReview(ImageURL) }} />}
                        </div>]}
                        content={[
                            [<div className="h-[750px]">
                                {(loading && !ReviewData.length >= 1) ? (
                                    <div className="flex flex-col items-center justify-center space-y-2 h-full">
                                        <div className="w-5 h-5 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
                                        <p>{loading}</p>
                                    </div>) : (
                                    // TODO change to dynamic later
                                    // FINISHED TODO
                                    <Sheets type={"review"} form_type={router.query.form_type} data={ReviewData} getSpreadsheetID={setspreadsheetID} finishedInitializing={setspreadsheetReady} />
                                )}
                            </div>]
                        ]}
                        additional_styles='overflow-hidden'
                        additional_styles_row='p-0'
                    />
                </div>
                {ImageReview ?
                    <div className="pt-3 bg-">
                        <Table
                            header={[<div className="flex justify-between items-center"><p>Data</p><Buttons button_description="Hide image" additional_styles="bg-white" path="" onClick={(e) => { setImageReview("") }} /></div>]}
                            content={[
                                // [<div className="h-max justify-center flex"><img src={ImageReview} className="h-max w-max" alt="Processed image preview" /></div>]
                                [<ImageEditor boundsObserver={() => { }} imageUrl={ImageURL} />]
                            ]}
                            additional_styles='overflow-hidden'
                            additional_styles_row='p-0'
                        />
                    </div>
                    :
                    null}
                {(document_summary?.body.page_count > 1) ? (
                    <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full pointer-events-none">
                        <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border pointer-events-auto">
                            <Buttons path="" title="Previous page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={(e) => { e.preventDefault(); setPageNo(page_no => { return page_no - 1 }) }} disabled={PageNo <= 0 ? true : false} ><div className="w-5 h-5"><ChevronLeft /></div></Buttons>
                            <div title="Page number" className="bg-white border-2 p-3 cursor-default select-none rounded-lg text-center"><p className="w-5 h-5">{PageNo + 1}</p></div>
                            <Buttons path="" title="Next page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={(e) => { e.preventDefault(); setPageNo(page_no => { return page_no + 1 }) }} disabled={PageNo >= document_summary.body.page_count - 1 ? true : false}><div className="w-5 h-5"><ChevronRight /></div></Buttons>
                        </div>
                    </div>
                ) : null}
                <div className="flex space-x-3 py-4">
                    <Buttons path="" additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold" onClick={saveDocument} disabled={!spreadsheetID || Message.message || !spreadsheetReady ? true : false}>Save changes</Buttons>
                    <Buttons path="" additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold" onClick={(e) => { saveDocument(e, true) }} disabled={!spreadsheetID || Message.message || !spreadsheetReady ? true : false}>Save and exit</Buttons>
                </div>
                {/* <Buttons path="" additional_styles="text-error">Cancel</Buttons> */}
                {/* <ButtonsSection>
            </ButtonsSection> */}
                <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-${Message.color || "blue"}-500 text-white px-3 rounded-lg py-2 transition-transform ${Message.message ? "" : "-translate-y-20"}`}>
                    <p>{Message.message}</p>
                    <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={(e) => { e.preventDefault(); setMessage({ message: "", color: "orange" }) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Buttons>
                </div>
            </Container>
        ) : (
            <p>Loading...</p>
        ));
}
