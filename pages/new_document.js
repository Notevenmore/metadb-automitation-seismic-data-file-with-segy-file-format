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

export default function NewDocumentPage({ setTitle }) {
    setTitle("New document")
    const router = useRouter()
    const [detail, setDetail] = useState("bbb");
    const [Message, setMessage] = useState({ message: "", color: "" })
    const [dataType, setdataType] = useState()
    const [spreadsheetID, setspreadsheetID] = useState()

    const saveChanges = async (e) => {
        e.preventDefault()
        try {
            setMessage({ message: "Saving workspace... Please don't leave this page or click anything.", color: "blue" })
            const spreadsheet_data = await fetch("http://www.localhost:5050/getRows", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    form_type: dataType,
                    spreadsheetID: spreadsheetID
                })
            }).then(response => {
                return response.json()
            }).then(response => {
                console.log(response)
                if (response.status !== 200) {
                    throw response.response
                }
                return response
            }).catch(err => { throw err })

            let final = []
            for (let idx_row = 1; idx_row < spreadsheet_data.response.length; idx_row++) {
                let row = {}
                console.log(idx_row)
                spreadsheet_data.response[0].forEach((header, idx_col) => {
                    row[header] = spreadsheet_data?.response[idx_row][idx_col] || ""
                });
                console.log(row)
                final.push(row)
            }

            if (dataType === "printed_well_report") {
                localStorage.setItem("new_pwr", JSON.stringify(final))
            } else if (dataType === "bibliography") {
                localStorage.setItem("new_bibliography", JSON.stringify(final))
            }
            setMessage({ message: "Workspace successfully saved.", color: "blue" })
        } catch (error) {
            setMessage({ message: `Failed to save workspace. Please try again. Additional error message: ${error}`, color: "red" })
        }
    }

    useEffect(() => {
        setdataType(String(router.query.form_type))
    }, [router])

    return (
        <Container additional_class="full-height relative">
            <Container.Title back>
                <Input type={"text"} defaultValue="New document" />
            </Container.Title>
            <HeaderTable>
                <HeaderInput label1={"Nama KKKS"} label2={"(KKKS Name)"}>
                    <Input
                        type="text"
                        name={"workingArea"}
                        placeholder={"Geodwipa Teknika Nusantara"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput>
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
                        dropdown_items={["Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                        withSearch
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Nomor AFE"} label2={"(AFE Number)"}>
                    <Input
                        type="text"
                        name={"AFE_Number"}
                        placeholder={"01"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput>
                <HeaderDivider />
                <HeaderInput label1={"Data type"}>
                    <Input
                        // type="dropdown"
                        type="text"
                        name={"dataType"}
                        defaultValue={router.query.form_type.replace(/\_/g, " ")}
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
                            (dataType) ? (
                                <div className="h-[750px]"><Sheets form_type={dataType} type="new" getSpreadsheetID={setspreadsheetID} /></div>
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
            <ButtonsSection>
                <Buttons path="" additional_styles="bg-primary" onClick={saveChanges}>Save changes</Buttons>
                <Buttons path="" additional_styles="text-error" onClick={router.back}>Cancel</Buttons>
            </ButtonsSection>
            <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-${Message.color || "blue"}-500 text-white px-3 rounded-lg py-2 transition-all ${Message.message ? "" : "-translate-y-20"}`}>
                <p>{Message.message}</p>
                <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setMessage({ message: "", color: "" }) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Buttons>
            </div>
        </Container>
    );
}
