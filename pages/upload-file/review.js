/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import HeaderTable, {HeaderDivider, HeaderStatic, HeaderInput, ButtonsSection}
    from "../../components/header_table/header_table";
import Sheets from "../../components/sheets/sheets"
import Table from "../../components/table/table"

export default function UploadFileReview() {
    const [detail, setDetail] = useState("bbb");
    return (
        <Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
            <Container.Title>Review</Container.Title>
            <section className="-mt-5 mb-5">
                <p className="font-bold">Name</p>
                <h1 className="font-bold text-[36px]">Lorem ipsum laporan 2008</h1>
            </section>
            <HeaderTable>
                <HeaderStatic label1={"Nama KKKS"} label2={"(KKKS Name)"}
                 content="Geodwipa Teknika Nusantara"/>
                <HeaderDivider/>
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
                <HeaderDivider/>
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
                    />
                </HeaderInput>
                <HeaderDivider/>
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
                <HeaderDivider/>
                <HeaderStatic label1={"Data type"} content={"Seismic data"}/>
                <HeaderDivider/>
                <HeaderStatic label1={"Data classification"} content={"3D"}/>
                <HeaderDivider/>
                <HeaderStatic label1={"Data sub-classification"} content={"Stored in media"}/>
            </HeaderTable>
            <div className="pt-3">
                <Table
                    header={["Data"]}
                    content={[
                        [<div className="h-[750px]"><Sheets existingID='1hvMSFfTRb8JLqDDqfRPLG7EpbwbUYiB8XlPUZaPFGWQ' /></div>]
                    ]}
                    additional_styles='overflow-hidden'
                    additional_styles_row='p-0'
                />
            </div>
            <ButtonsSection>
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>
            </ButtonsSection>
        </Container>
    );
}
