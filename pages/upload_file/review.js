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

export default function UploadFileReview({ setTitle }) {
    setTitle("Upload File - Review")
    const [detail, setDetail] = useState("bbb");
    const [ReviewData, setReviewData] = useState([])
    const [ImageReview, setImageReview] = useState("")
    const [Message, setMessage] = useState()
    const [PageNo, setPageNo] = useState(0)
    const [ImageURL, setImageURL] = useState("")
    const [error, setError] = useState("")
    const [spreadsheetIDs, setspreadsheetIDs] = useState({})
    const [loading, setloading] = useState("")

    const router = useRouter()
    const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")

    const files = useSelector((state) => state.general.file)
    const review_data = useSelector((state) => state.general.review_data)
    const document_summary = useSelector((state) => state.general.document_summary)

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
                        row[item.key] = item.value
                    })
                    final.push(row)
                }
                // const promisedsetReviewData = (newState) => new Promise(resolve => setReviewData(newState, resolve))
                // await promisedsetReviewData(final).then(res => { console.log(res); return true })
                setReviewData(final)

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

    const saveWorkspace = (e) => {
        e.preventDefault()
        // let counter = 0, name = ""
        // while (true) {
        //     const workspace_exist = localStorage.getItem("new_workspace_from_uploaded_file")
        //     if (workspace_exist) {
        //         counter = counter + 1
        //     } else {
        //         name = !counter ? "new_workspace_from_uploaded_file" : `new_workspace_from_uploaded_file_${counter}`
        //         localStorage.setItem(name, ReviewData)
        //         break
        //     }
        // }
        // let workspaces = JSON.parse(localStorage.getItem("workspaces"))
        // workspaces.push({ "name": name })
        console.log("first")
        // localStorage.setItem("new_workspace_from_uploaded_file", ReviewData)
        setMessage("Workspace successfully saved.")
    }

    useEffect(() => {
        console.log(PageNo)
    }, [PageNo])


    return ((error) ? (
        <div className="w-full h-full flex flex-col p-10 space-y-4">
            <p className="font-bold text-lg text-red-500">Something happened. Please try again or contact administrator/maintainer if the problem still persists by giving them the information below:</p>
            <Highlight className='html rounded-md border-2'>{error}</Highlight>
            {/* @ts-ignore */}
            <Buttons path="/" button_description="Go back home" />
        </div>
    ) : (
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
                <Input type={"text"} additional_styles_input="text-xl py-3 px-3 font-bold placeholder:italic" defaultValue={files[0]?.name || ""} placeholder="Workspace name" />
            </section>
            <HeaderTable>
                <HeaderStatic label1={"Nama KKKS"} label2={"(KKKS Name)"}
                    content="Geodwipa Teknika Nusantara" />
                <HeaderDivider />
                <HeaderInput label1={"Nama wilayah kerja"} label2={"(Working Area)"}>
                    <Input
                        type="text"
                        name={"workingArea"}
                        placeholder={"Pulau Geodwipa"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Jenis penyerahan data"} label2={"(Submission Type)"}>
                    <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Quarterly"}
                        dropdown_items={[
                            "Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"
                        ]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                        withSearch
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Nomor AFE"} label2={"(AFE Number)"}>
                    <Input
                        type="number"
                        name={"AFE_Number"}
                        // placeholder={"01"}
                        defaultValue='1'
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderStatic label1={"Data type"} content={"Well data"} />
                <HeaderDivider />
                <HeaderStatic label1={"Data classification"} content={"Report"} />
                <HeaderDivider />
                <HeaderStatic label1={"Data sub-classification"} content={"Printed"} />
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
                                </div>) : (<Sheets type={"review"} form_type={"printed_well_report"} data={ReviewData} />)}
                        </div>]
                    ]}
                    additional_styles='overflow-hidden'
                    additional_styles_row='p-0'
                />
            </div>
            {ImageReview ?
                <div className="pt-3">
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
                <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full">
                    <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border">
                        <Buttons path="" title="Previous page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={(e) => { e.preventDefault(); setPageNo(page_no => { return page_no - 1 }) }} disabled={PageNo <= 0 ? true : false} ><div className="w-5 h-5"><ChevronLeft /></div></Buttons>
                        <Buttons path="" title="" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-white cursor-default"><p className="w-5 h-5">{PageNo + 1}</p></Buttons>
                        <Buttons path="" title="Next page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={(e) => { e.preventDefault(); setPageNo(page_no => { return page_no + 1 }) }} disabled={PageNo >= document_summary.body.page_count - 1 ? true : false}><div className="w-5 h-5"><ChevronRight /></div></Buttons>
                    </div>
                </div>
            ) : null}
            <ButtonsSection>
                <Buttons path="" additional_styles="bg-primary" onClick={saveWorkspace}>Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary" onClick={(e) => { router.push("/") }}>Save and exit</Buttons>
                {/* <Buttons path="" additional_styles="text-error">Cancel</Buttons> */}
            </ButtonsSection>
            <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-green-500 text-white px-3 rounded-lg py-2 transition-all ${Message ? "" : "-translate-y-20"}`}>
                <p>{Message}</p>
                <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setMessage("") }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Buttons>
            </div>
        </Container>
    )
    );
}
