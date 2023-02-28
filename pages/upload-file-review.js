import { useEffect, useRef, useState } from "react";
import Buttons from "../components/buttons/buttons";
import Container from "../components/container/container.js";
import Input from "../components/input_form/input";
import { Divider } from "../components/float_dialog/float_dialog";
import TableComponent from "../components/table/table";

const ContentDivider = () => {
    return (
        <Divider additional_styles={"-ml-[60px] w-[calc(100%+60px)]"}></Divider>
    )
}

const HeaderDivider = () => {
    return (
        <Divider additional_styles={"-ml-[20px] w-[calc(100%+29px)]"}></Divider>
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

const TableContent1 = ({label1, label2, content}) => {
    return (
        <div className="flex lg:flex-row sm:flex-col w-full text-[16px]">
            <p className="font-semibold inline-block w-[368px]">
                {label1} <span className="text-[#A3A3A3]">{label2}</span>
            </p>
            <p>{content}</p>
        </div>
    )
}

const TableContent2 = ({label, content}) => {
    return (
        <div className="flex lg:flex-row sm:flex-col w-full text-[16px]">
            <p className="font-semibold w-[368px]">{label}</p>
            <p>{content}</p>
        </div>
    )
}
export default function UploadFileReview() {
    const [detail, setDetail] = useState("bbb");
	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title>Review</Container.Title>
            <section className="-mt-5 mb-5">
                <p className="font-bold">Name</p>
                <h1 className="font-bold text-[36px]">Lorem ipsum laporan 2008</h1>
            </section>
            <TableComponent
                additional_styles="border border-solid border-float_dialog rounded-md text-[16px]"
                header={[
                    <div>
                        <h1>Header</h1>
                        <HeaderDivider></HeaderDivider>
                    </div>
                ]}
                content={[
                    [
                        <div>
                            <TableContent1
                            label1={"Nama KKKS"}
                            label2={"(KKKS Name)"}
                            content={"Kangean Energy Indonesia"}
                            />
                            <ContentDivider/>
                        </div>
                            
                    ],
                    [
                        <TableContent1
                            label1={"Nama wilayah kerja"}
                            label2={"(Working Area)"}
                            content={"Pulau Kangean"}
                        />
                    ],
                    [
                        <TableContent1
                            label1={"Jenis penyerahan data"}
                            label2={"(Submission Type)"}
                            content={"Quarterly"}
                        />  
                    ],
                    [
                        <TableContent1
                            label1={"Nomor AFE"}
                            label2={"(AFE Number)"}
                            content={"01"}
                        />  
                    ],
                    [
                        <TableContent2
                            label={"Data type"}
                            content={"Seismic Data"}
                        />
                    ],
                    [
                        <TableContent2
                            label={"Data classification"}
                            content={"3D"}
                        />
                    ],
                    [
                        <TableContent2
                            label={"Data sub-classification"}
                            content={"Stored in media"}
                        />
                    ]
                ]}
            />
            <section className="border border-solid border-float_dialog rounded-md px-5">
                <section className="font-bold py-2">Header</section>
                <ContentDivider/>                    
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
                <ContentDivider/>
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
                <ContentDivider/>
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
                <ContentDivider/>
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
                <ContentDivider/>
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
                <ContentDivider/>
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
                <ContentDivider/>
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
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>          
            </section>
        </Container>
	);
}
