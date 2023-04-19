/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import HeaderTable, { HeaderDivider, HeaderStatic, HeaderInput, ButtonsSection }
    from "../../components/header_table/header_table";
import Sheets from "../../components/sheets/sheets"
import Table from "../../components/table/table"
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function UploadFileReview({ setTitle }) {
    setTitle("Upload File - Review")
    const [detail, setDetail] = useState("bbb");
    const [ReviewData, setReviewData] = useState({})
    const [ImageReview, setImageReview] = useState("")
    const [Message, setMessage] = useState()
    const router = useRouter()
    const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")
    useEffect(() => {
        const review_data = localStorage.getItem("reviewData")
        if (review_data) {
            setReviewData(review_data)
        }
    }, [])
    const setImage = (e) => {
        e.preventDefault()
        const uploaded_img = localStorage.getItem("reviewUploadedImage")
        if (uploaded_img) {
            setImageReview(uploaded_img)
        } else {
            setImageReview("Cannot find uploaded image. Please retry the process or see the original image by opening it directly from your computer.")
        }
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
        localStorage.setItem("new_workspace_from_uploaded_file", ReviewData)
        setMessage("Workspace successfully saved.")
    }

    const files = useSelector((state) => state.general.file)
    return (
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
                            <Buttons button_description="Hide image" additional_styles="bg-white" path="" onClick={(e) => { setImageReview("") }} />
                            :
                            <Buttons button_description="View uploaded picture below" additional_styles="bg-white" path="" onClick={setImage} />}
                    </div>]}
                    content={[
                        [<div className="h-[750px]"><Sheets form_type={"printed_well_report"} type="review" data={ReviewData} /></div>]
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
                            [<div className="h-max justify-center flex"><img src={ImageReview} className="h-max w-max" alt="Processed image preview" /></div>]
                        ]}
                        additional_styles='overflow-hidden'
                        additional_styles_row='p-0'
                    />
                </div>
                :
                null}
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
    );
}
