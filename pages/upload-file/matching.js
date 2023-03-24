/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import HeaderTable, {HeaderDivider, HeaderStatic1, 
    HeaderStatic2, HeaderInput1, HeaderInput2, ButtonsSection, HeaderInputInput, HeaderRow}
    from "../../components/header_table/header_table";


const FullButton = ({ children, onClick }) => {
    return (
    <button className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-primary hover:bg-gray-300 transition-all bg-primary w-full justify-center">
        {children}
    </button>
    );
}

const initialState = [
    {
        key: "Something",
        value: "Another Thing"
    },
    {
        key: "One Thing",
        value: "Or Another"
    }
]

export default function MatchReview() {
    const [detail, setDetail] = useState("bbb");
	return (
		<Container additional_class="full-height relative">
			<Container.Title>Data Matching</Container.Title>
            <HeaderTable>
                <HeaderDivider/>
                <HeaderInputInput
                    leftChildren={
                        <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Quarterly"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />}
                    rightChildren={
                        <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Quarterly"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />}
                />
                <HeaderDivider/>
                <HeaderInputInput
                    leftChildren={
                        <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Quarterly"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />}
                    rightChildren={
                        <Input
                        type="dropdown"
                        name={"submissionType"}
                        placeholder={"Quarterly"}
                        dropdown_items={["a", "b", "c"]}
                        required={true}
                        additional_styles="w-full"
                        onChange={(e) => setDetail(e.target.name)}
                    />}
                />
                <HeaderDivider/>
                <HeaderRow>
                    <FullButton>
                        +
                    </FullButton>
                </HeaderRow>
            </HeaderTable>
            <ButtonsSection>
                <Buttons path="" additional_styles="bg-primary">Save changes</Buttons>
                <Buttons path="" additional_styles="bg-primary">Save and exit</Buttons>
                <Buttons path="" additional_styles="text-error">Cancel</Buttons>
            </ButtonsSection>
        </Container>
	);
}
