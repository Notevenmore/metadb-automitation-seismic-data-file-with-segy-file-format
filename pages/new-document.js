import { useEffect, useRef, useState } from "react";
import Buttons from "../components/buttons/buttons";
import Container from "../components/container/container.js";
import Input from "../components/input_form/input";
import { Divider } from "../components/float_dialog/float_dialog";

const HeaderDivider = () => {
    return (
        <Divider additional_styles={"-ml-[20px] w-[1207px]"}></Divider>
    )
}

export default function NewDocumentPage() {
    const [detail, setDetail] = useState("bbb");
	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title back>New document</Container.Title>
            <section className="border border-solid border-float_dialog rounded-md px-5">
                <section className="font-bold py-2">Header</section>
                <HeaderDivider/>
                <div className="relative">
                    <Input
                        label="Nama KKKS"
                        label_loc="beside"
                        type="text"
                        name={"KKKS_Name"}
                        placeholder={"Kangean Energy Indonesia"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                    <div className="absolute top-[6px] left-[90px] text-[#A3A3A3]">(KKKS Name)</div>
                </div>
                <HeaderDivider/>
                <div className="relative">
                    <Input
                        label="Nama wilayah kerja"
                        label_loc="beside"
                        type="text"
                        name={"workingArea"}
                        placeholder={"Pulau Kangean"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                    <div className="absolute top-[6px] left-[145px] text-[#A3A3A3]">(Working Area)</div>
                </div>
                <HeaderDivider/>
                <div className="relative">
                    <Input
                        label="Jenis penyerahan data"
                        label_loc="beside"
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Kangean Energy Indonesia"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                    <div className="absolute top-[6px] left-[163px] text-[#A3A3A3]">(Submission Type)</div>
                </div>
                <HeaderDivider/>
                <div className="relative">
                    <Input
                        label="Nomor AFE"
                        label_loc="beside"
                        type="text"
                        name={"AFE_Number"}
                        placeholder={"01"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                    <div className="absolute top-[6px] left-[87px] text-[#A3A3A3]">(AFE Number)</div>
                </div>
                <HeaderDivider/>
                <Input
                    label="Data type"
                    label_loc="beside"
                    type="dropdown"
                    name="dataType"
                    placeholder="Seismic data"
                    dropdown_items={["a", "b", "c"]}
                    additional_styles="w-full"
                    additional_styles_label="font-semibold"
                    additional_styles_input="font-semibold"
                    onChange={(e) => setDetail(e.target.name)}
                />
                <HeaderDivider/>
                <Input
                    label="Data classification"
                    label_loc="beside"
                    type="dropdown"
                    name="dataClassification"
                    placeholder="Seismic data"
                    dropdown_items={["a", "b", "c"]}
                    additional_styles="w-full"
                    additional_styles_label="font-semibold"
                    additional_styles_input="font-semibold"
                    onChange={(e) => setDetail(e.target.name)}
                />
                <HeaderDivider/>
                <Input
                    label="Data sub-classification"
                    label_loc="beside"
                    type="dropdown"
                    name="dataSubClassification"
                    placeholder="2D field data"
                    dropdown_items={["a", "b", "c"]}
                    additional_styles="w-full"
                    additional_styles_label="font-semibold"
                    additional_styles_input="font-semibold"
                    onChange={(e) => setDetail(e.target.name)}
                />
            </section>
            <section className="flex gap-x-3 mt-10">
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>          
            </section>
        </Container>
	);
}
