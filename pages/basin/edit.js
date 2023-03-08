import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import { Divider } from "../../components/float_dialog/float_dialog";
import HeaderTable, {HeaderDivider, HeaderStatic1, HeaderInput1, HeaderInput2, ButtonsSection}
 from "../../components/header_table/header_table";
import SideBar from "../../components/navigation_bar/SideBar";
// TODO: generalize NewDocument's structure to this page

// const HeaderDivider = () => {
//     return (
//         <Divider additional_styles={"-ml-[20px] w-[calc(100%+40px)]"}></Divider>
//     )
// }

// const InputComponent1 = ({label1, label2, children}) => {
//     return (
//         <div className="flex lg:flex-row sm:flex-col w-full">
//             <div className="flex space-x-2 w-[535px] mt-[5px]">
//                 <label>{label1}</label>
//                 <label className="text-[#A3A3A3]">{label2}</label>
//             </div>
//             <>{children}</>
//         </div>
//     )
// }

export default function BasinEditPage() {
    const [detail, setDetail] = useState("bbb");
	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title back>Edit file</Container.Title>
            <div className="flex flex-wrap lg:items-center -mt-5 mb-3 lg:mb-[22px] gap-x-2">
                <p className="font-semibold min-w-[130px] mb-3">Currently editing:</p>
                <Input
                    type="text"
                    name="fileName"
                    placeholder="2008-Laporan Akhir Pembuatan Portofolio Eksplorasi Hidrokarbon di KKKS Indonesia"
                    additional_styles="lg:w-full w-[90%]"
                    additional_styles_input="font-semibold w-full"
                    onChange={(e) => setDetail(e.target.name)}
                />
            </div>
            <HeaderTable>
                <HeaderStatic1 label1={"Nama KKKS"} label2={"(KKKS Name)"} content={"Kangean Energy Indonesia"}/>
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
            </HeaderTable>
            {/* <section className="border border-solid border-float_dialog rounded-md px-5">
                <section className="font-bold py-2">Header</section>
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
            </section> */}
            <ButtonsSection className={"max-lg:mt-5"}>
            {/* <ButtonsSection className={"md:max-lg:flex-col max-lg:mt-5"}> */}
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>
                <Buttons path="" additional_styles="text-error">Delete file</Buttons>          
            </ButtonsSection>
        </Container>
	);
}
