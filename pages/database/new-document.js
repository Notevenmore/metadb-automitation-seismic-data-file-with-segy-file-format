import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import { Divider } from "../../components/float_dialog/float_dialog";
import TableComponent from "../../components/table/table";

const HeaderDivider = () => {
    return (
        <Divider additional_styles={"-ml-[20px] w-[calc(100%+40px)]"}></Divider>
    )
}

const InputComponent1 = ({label1, label2, children}) => {
    return (
        <div className="flex lg:flex-row sm:flex-col w-full">
            <div className="flex space-x-2 w-[535px] mt-[5px]">
                <label>{label1}</label>
                <label className="text-[#A3A3A3]">{label2}</label>
            </div>
            <>{children}</>
        </div>
    )
}

const InputComponent2 = ({label, children}) => {
    return (
        <div className="flex lg:flex-row sm:flex-col w-full">
            <div className="flex space-x-2 w-[535px] mt-[5px]">
                <label className="font-semibold">{label}</label>
            </div>
            <>{children}</>
        </div>
    )
}

export default function NewDocumentPage() {
    const [detail, setDetail] = useState("bbb");
	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title >New document</Container.Title>
            <Input
                label="Name"
                label_loc="above"
                type="text"
                name={"documentName"}
                placeholder={"Lorem ipsum laporan 2008"}
                additional_styles={"-mt-[20px] mb-[20px]"}
                additional_styles_label={"font-bold text-[16px]"}
                additional_styles_input={"font-bold text-[36px]"}
            />
            <section className="border border-solid border-float_dialog rounded-md px-5">
                <section className="font-bold py-2">Header</section>
                <HeaderDivider/>
                <InputComponent1 label1={"Nama KKKS"} label2={"(KKKS Name)"}>
                    <Input
                        type="text"
                        name={"KKKS_Name"}
                        placeholder={"Kangean Energy Indonesia"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </InputComponent1>
                <HeaderDivider/>
                <InputComponent1 label1={"Nama wilayah kerja"} label2={"(Working Area)"}>
                    <Input
                        type="text"
                        name={"workingArea"}
                        placeholder={"Pulau Kangean"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </InputComponent1>
                <HeaderDivider/>
                <InputComponent1 label1={"Jenis penyerahan data"} label2={"(Submission Type)"}>
                    <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Quarterly"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </InputComponent1>
                <HeaderDivider/>
                <InputComponent1 label1={"Nomor AFE"} label2={"(AFE Number)"}>
                    <Input
                        type="text"
                        name={"AFE_Number"}
                        placeholder={"01"}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />
                </InputComponent1>
                <HeaderDivider/>
                <InputComponent2 label={"Data type"}>
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
                </InputComponent2>
                <HeaderDivider/>
                <InputComponent2 label={"Data classification"}>
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
                </InputComponent2>
                <HeaderDivider/>
                <InputComponent2 label={"Data sub-classification"}>
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
                </InputComponent2>
            </section>
            <section className="flex gap-x-3 mt-10">
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel and discard all</Buttons>          
            </section>
        </Container>
	);
}
