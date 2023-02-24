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
			<Container.Title back>Edit file</Container.Title>
            <Input
                    label="Currently editing:"
                    label_loc="beside"
                    type="text"
                    name="fileName"
                    placeholder="2008-Laporan Akhir Pembuatan Portofolio Eksplorasi Hidrokarbon di KKKS Indonesia"
                    additional_styles="w-full -mt-[35px] mb-[22px]"
                    additional_styles_label="font-semibold w-fit"
                    additional_styles_input="font-semibold w-[70%]"
                    onChange={(e) => setDetail(e.target.name)}
                />
            {/* <p className="-mt-[35px] mb-[22px]">Currently editing: <strong>2008-Laporan Akhir Pembuatan Portofolio Eksplorasi Hidrokarbon di KKKS Indonesia</strong></p> */}
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
            </section>
            <section className="flex gap-x-3 mt-10">
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>
                <Buttons path="" additional_styles="text-error">Delete file</Buttons>          
            </section>
        </Container>
	);
}
