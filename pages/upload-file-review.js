import { useEffect, useRef, useState } from "react";
import Buttons from "../components/buttons/buttons";
import Container from "../components/container/container.js";
import Input from "../components/input_form/input";
import { Divider } from "../components/float_dialog/float_dialog";
import TableComponent from "../components/table/table";

const TableContent1 = ({label1, label2, content}) => {
    return (
        <div className="flex lg:flex-row sm:flex-col w-full text-[16px]">
            <p className="font-semibold inline-block w-[368px]">
                {label1} <span className="font-light text-[#A3A3A3]">{label2}</span>
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
                additional_styles={"border border-solid border-float_dialog rounded-lg text-[16px]"}
                additional_styles_row={"border-t-[1px] border-solid border-float_dialog"}
                header={["Header"]}
                content={[
                    [
                        <TableContent1
                            label1={"Nama KKKS"}
                            label2={"(KKKS Name)"}
                            content={"Kangean Energy Indonesia"}
                        />    
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
            <section className="flex gap-x-3 mt-10">
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>          
            </section>
        </Container>
	);
}
