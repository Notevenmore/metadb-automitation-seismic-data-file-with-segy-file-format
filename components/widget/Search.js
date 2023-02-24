import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applySearch } from "../../store/searchSlice";
import Buttons from "../buttons/buttons";
import Input from "../input_form/input";

export default function SearchWidget() {
	const [expandSearch, setExpandSearch] = useState(true);
	const inputAdditionalStyle = "bg-searchbg text-black text-[14.5px] py-0 w-full";
	// search function when expand = false will directly go to the slice
	// implement search to store after apply filter
	const [searchValues, setSearchValues] = useState({
		searchAll: "",
		dataType: "",
		dataClass: "",
		subDataClassification: "",
		type: "",
		workingArea: "",
		AFE: "",
	});
	const handleChange = (e) => {
		const { name, value } = e.target;
		setSearchValues((prev) => ({
			...prev,
			[name]: value,
		}));
	};

    const dispatch = useDispatch()
    const searches = useSelector((state) => state.search.value)
    const applyFilter = (e) => {
        e.preventDefault();
        console.log(searchValues)
        dispatch(applySearch(searchValues))
    }

	return (
		<div className="w-full h-auto px-5 text-[14.5px]">
			{!expandSearch ? (
				<div className="flex flex-row items-center relative justify-between">
					<Image src="/icons/magnify.svg" width={30} height={30} className="w-[.9rem] h-[22px] absolute" />
					<Input
						type="string"
						name={"searchAll"}
						placeholder={"Search all"}
						additional_styles="flex-1"
						additional_styles_input="bg-transparent text-black text-[14.5px] indent-5 flex-1"
					/>
					<div
						className="flex flex-row items-center text-[11px] text-[#939393]"
						onClick={() => setExpandSearch(true)}>
						<div>Expand</div>
						<Image
							src="/icons/chevron-down.svg"
							width={30}
							height={30}
							className="w-[.9rem] h-[22px] fill-[#939393]"
						/>
					</div>
				</div>
			) : (
				<form className="relative flex flex-col gap-y-2 pb-2 w-full" onSubmit={applyFilter}>
					<div className="flex flex-row items-center relative w-full">
						<Image
							src="/icons/magnify.svg"
							width={30}
							height={30}
							className="w-[.9rem] h-[22px] absolute left-2"
						/>
						<Input
							type="string"
							name={"searchAll"}
							placeholder={"Search all"}
							additional_styles="w-full"
							onChange={handleChange}
							additional_styles_input="bg-searchbg text-black text-[14.5px] indent-5"
						/>
					</div>
					<div className="flex flex-row items-center gap-x-1 justify-between">
						<Input
							label="Data type"
							label_loc="above"
							type="dropdown"
							name={"dataType"}
							dropdown_items={["a", "b", "c"]}
							additional_styles="w-full"
							additional_styles_label="w-full"
							additional_styles_input={inputAdditionalStyle}
							onChange={handleChange}
						/>
						<Input
							label="Data class"
							label_loc="above"
							type="dropdown"
							name={"dataClass"}
							dropdown_items={["a", "b", "c"]}
							additional_styles="w-full"
							additional_styles_label="w-full"
							additional_styles_input={inputAdditionalStyle}
							onChange={handleChange}
						/>
					</div>
					<Input
						label="Sub-data classification"
						label_loc="above"
						type="dropdown"
						name={"subDataClassficiation"}
						dropdown_items={["a", "b", "c"]}
						additional_styles="w-full"
						additional_styles_label="w-full"
						additional_styles_input={inputAdditionalStyle}
						onChange={handleChange}
					/>
					<div className="flex flex-row items-center gap-x-1 justify-between">
						<Input
							label="Type"
							label_loc="above"
							type="dropdown"
							name={"type"}
							dropdown_items={["a", "b", "c"]}
							additional_styles="w-full"
							additional_styles_label="w-full"
							additional_styles_input={inputAdditionalStyle}
							onChange={handleChange}
						/>
						<Input
							label="Working area"
							label_loc="above"
							type="dropdown"
							name={"workingArea"}
							dropdown_items={["a", "b", "c"]}
							additional_styles="w-full"
							additional_styles_label="w-full"
							additional_styles_input={inputAdditionalStyle}
							onChange={handleChange}
						/>
					</div>
					<div className="relative">
						<Input
							label="AFE"
							label_loc="above"
							placeholder="0"
							type="number"
							name={"AFE"}
							additional_styles="w-full"
							additional_styles_label="w-full"
							additional_styles_input={inputAdditionalStyle}
							onChange={handleChange}
						/>
						<div className="absolute top-0 left-[30px] text-[13px] text-[#a3a3a3]">
							(Input 0 to search all)
						</div>
					</div>
					<div className="flex flex-row items-center justify-center mt-2">
						<Buttons
							path=""
							type="submit"
							button_description="Apply filters"
                            onClick={applyFilter}
							additional_styles="py-1 w-[160px] justify-center bg-searchbg"
						/>
					</div>
					<div className="absolute bottom-0 right-0">
						<Image
							src="/icons/chevron-double-up.svg"
							width={30}
							height={30}
							className="w-[.9rem] h-[22px] fill-[#939393]"
							onClick={() => setExpandSearch(false)}
						/>
					</div>
				</form>
			)}
			<div className="border-b border-b-[#dddddd]"></div>
		</div>
	);
}
