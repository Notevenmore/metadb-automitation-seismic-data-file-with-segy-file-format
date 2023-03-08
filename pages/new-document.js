import { useEffect, useRef, useState } from "react";
import Buttons from "../components/buttons/buttons";
import Container from "../components/container/container.js";
import Input from "../components/input_form/input";
// import { current } from "@reduxjs/toolkit";
import HeaderTable, {HeaderDivider, HeaderStatic1, HeaderInput1, HeaderInput2, ButtonsSection}
 from "../components/header_table/header_table";

// TODO: generalize this page structure to other pages that use header too
export default function NewDocumentPage() {
    const [detail, setDetail] = useState("bbb");
	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title back>New document</Container.Title>
            <HeaderTable>
                <HeaderStatic1 label1={"Nama KKKS"} label2={"(KKKS Name)"}
                    content="Kangean Energy Indonesia"/>
                <HeaderDivider/>
                <HeaderInput1 label1={"Nama wilayah kerja"} label2={"(Working Area)"}>
                    <Input
                        type="text"
                        name={"workingArea"}
                        placeholder={"Pulau Kangean"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput1>
                <HeaderDivider/>
                <HeaderInput1 label1={"Jenis penyerahan data"} label2={"(Submission Type)"}>
                    <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Quarterly"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput1>
                <HeaderDivider/>
                <HeaderInput1 label1={"Nomor AFE"} label2={"(AFE Number)"}>
                    <Input
                        type="text"
                        name={"AFE_Number"}
                        placeholder={"01"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput1>
                <HeaderDivider/>
                <HeaderInput2 label={"Data type"}>
                    <Input
                        type="dropdown"
                        name={"dataType"}
                        placeholder={"Seismic data"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        additional_styles_input="font-semibold"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput2>
                <HeaderDivider/>
                <HeaderInput2 label={"Data classification"}>
                    <Input
                        type="dropdown"
                        name={"dataClassification"}
                        placeholder={"3D"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        additional_styles_input="font-semibold"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput2>
                <HeaderDivider/>
                <HeaderInput2 label={"Data sub-classification"}>
                    <Input
                        type="dropdown"
                        name={"dataSubClassification"}
                        placeholder={"Stored in media"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        additional_styles_input="font-semibold"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </HeaderInput2>
            </HeaderTable>
            <ButtonsSection>
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>
            </ButtonsSection>
        </Container>
	);
}
