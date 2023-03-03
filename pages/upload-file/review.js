/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import TableComponent from "../../components/table/table";
import { twMerge } from "tailwind-merge";
import { Divider } from "../../components/float_dialog/float_dialog";

const TableContent1 = ({label1, label2, content=false}) => {
    return (
        <div className="flex items-center lg:flex-row sm:flex-col w-full text-[16px] h-[55px]">
            <p className="font-semibold min-w-[325px]">
                {label1} <span className="font-light text-[#A3A3A3]">{label2}</span>
            </p>
            <p className="inline lg:ml-[8px] w-full">{content}</p>
        </div>
    )
}

const InputComponent1 = ({label1, label2, children, absolute=false}) => {
    return (
        <div className={twMerge("flex items-center lg:flex-row sm:flex-col w-full h-[55px]", absolute ? "absolute" : null)}>
            <div className="flex space-x-2 min-w-[325px] mt-[5px]">
                <label>{label1}</label>
                <label className="text-[#A3A3A3]">{label2}</label>
            </div>
            <>{children}</>
        </div>
    )
}

const HeaderDivider = () => {
    return (
        <Divider additional_styles={"-ml-[20px] w-[calc(100%+40px)]"}></Divider>
    )
}

const TableContent2 = ({label, content}) => {
    return (
        <div className="flex items-center lg:flex-row sm:flex-col w-full text-[16px] h-[55px]">
            <p className="font-semibold min-w-[325px]">{label}</p>
            <p className="lg:ml-[8px] w-full">{content}</p>
        </div>
    )
}
export default function UploadFileReview() {
	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title>Review</Container.Title>
            <section className="-mt-5 mb-5">
                <p className="font-bold">Name</p>
                <h1 className="font-bold text-[36px]">Lorem ipsum laporan 2008</h1>
            </section>
            <section className="border border-solid border-float_dialog rounded-md px-5">
                <section className="font-bold py-2">Header</section>
                <HeaderDivider/>
                <TableContent1
                    label1={"Nama KKKS"} label2={"(KKKS Name)"}
                    content={"Kangean Energy Indonesia"}
                />
                <HeaderDivider/>
                <InputComponent1 label1={"Nama wilayah kerja"} label2={"(Working Area)"}>
                    <Input
                        type="text"
                        name={"workingArea"}
                        placeholder={"Pulau Kangean"}
                        required={true}
                        additional_styles="w-full"
                        
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
                        
                    />
                </InputComponent1>
                <HeaderDivider/>
                <TableContent2
                    label={"Data type"}
                    content={"Seismic data"}
                />
                <HeaderDivider/>
                <TableContent2
                    label={"Data classification"}
                    content={"3D"}
                />
                <HeaderDivider/>
                <TableContent2
                    label={"Data sub-classification"}
                    content={"Stored in media"}
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
