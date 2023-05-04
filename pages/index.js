import Buttons from "../components/buttons/buttons";
import FileIcon from "../public/icons/file.svg";
import { Divider } from "../components/float_dialog/float_dialog";
import Container from "../components/container/container";
import { useSelector } from "react-redux";
import TableComponent from "../components/table/table";
import draft from "../dummy-data/draft";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "../components/input_form/input";

export default function HomePage({ setTitle }) {
	setTitle("Home")
	// if the search state is true change the view of the home page
	const searches = useSelector((state) => state.search.search);
	return <>{!searches ? <HomeSection /> : <SearchResult />}</>;
}

const datatypes = {
	"Basin": "basin",
	"Working Area": "working_area",
	"Field Information ": "field_information",
	"2D Seismic Summary": "2d_seismic_summary",
	"2D Seismic Section": "2d_seismic_section",
	"Digital 2D Seismic Section": "digital_2d_seismic_section",
	"2D Seismic Field Data Stored In Media": "2d_seismic_field_data_stored_in_media",
	"2D Seismic Process Data Stored In Media": "2d_seismic_process_data_stored_in_media",
	"2D Seismic Field Digital Data": "2d_seismic_field_digital_data",
	"2D Seismic Processed Digital Data": "2d_seismic_processed_digital_data",
	"2D Seismic Navigation Digital Data": "2d_seismic_navigation_digital_data",
	"2D Seismic Navigation Data Stored In Media": "2d_seismic_navigation_data_stored_in_media",
	"3D Seismic Summary": "3d_seismic_summary",
	"3D Seismic Field Data Stored In Media": "3d_seismic_field_data_stored_in_media",
	"3D Seismic Process Data Stored In Media": "3d_seismic_process_data_stored_in_media",
	"3D Seismic Field Digital Data": "3d_seismic_field_digital_data",
	"3D Seismic Processed Digital Data": "3d_seismic_processed_digital_data",
	"3D Seismic Navigation Digital Data": "3d_seismic_navigation_digital_data",
	"3D Seismic Navigation Data Stored In Media": "3d_seismic_navigation_data_stored_in_media",
	"2D/3D Seismic Printer Report": "2d_3d_seismic_printer_report",
	"2D/3D Seismic Digital Report": "2d_3d_seismic_digital_report",
	"Seismic Interpretation Data": "seismic_interpretation_data",
	"Non-Seismic And Seismic Unconventional Survey Summary": "non-seismic_and_seismic_unconventional_survey_summary",
	"Non-Seismic And Seismic Unconventional Data Stored In Media": "non-seismic_and_seismic_unconventional_data_stored_in_media",
	"Non-Seismic And Seismic Unconventional Digital Data": "non-seismic_and_seismic_unconventional_digital_data",
	"Non-Seismic And Seismic Unconventional Printed Report": "non-seismic_and_seismic_unconventional_printed_report",
	"Non-Seismic And Seismic Unconventional Digital Report": "non-seismic_and_seismic_unconventional_digital_report",
	"Well Summary": "well_summary",
	"Printed Well Log": "printed_well_log",
	"Digital Image Well Log": "digital_image_well_log",
	"Digital Well Log": "digital_well_log",
	"Printed Well Report": "printed_well_report",
	"Digital Well Report": "digital_well_report",
	"Digital Well Seismic Profile": "digital_well_seismic_profile",
	"Well Seismic Profile Stored In Media": "well_seismic_profile_stored_in_media",
	"Well Sample": "well_sample",

	"Well Core Sample": "well_core_sample",
	"Outcrop Sample": "outcrop_sample",
	"Printed Technical Report": "printed_technical_report",
	"Digital Technical Report": "digital_technical_report",
	"Printed Maps And Technical Drawing": "printed_maps_and_technical_drawing",
	"Digital Maps And Technical Drawing": "digital_maps_and_technical_drawing",
	"Digital Project File": "digital_project_file",
	"Project File Data Stored In Media": "project_file_data_stored_in_media",
	"Bibliography": "bibliography"
}

const HomeSection = () => {
	const [toggleOverlay, settoggleOverlay] = useState(false)
	const [dataType, setdataType] = useState()

	const router = useRouter()
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		router.push('/upload_file')
	}
	return (
		<section className="flex flex-col justify-center items-center w-full h-full" onDragEnter={(e) => handleDrag(e)}>
			<section className="flex flex-col justify-around w-[944px] h-[426px] items-center">
				<FileIcon className="w-[114px] h-[132px]"></FileIcon>
				<h1 className="text-[24px] leading-[30px] font-semibold opacity-50 text-center">
					Choose the record of which data type to be shown by selecting from the side bar,
					<br></br>or drag and drop a document here to be uploaded
				</h1>
				<div className="flex justify-center">
					<Buttons path={"/upload_file"} button_description="Choose file manually"></Buttons>
				</div>
				<p className="text-center opacity-50">
					The document to be uploaded must be in either JPG, PNG, PDF, PPTX, CSV, XLSX, LAS, or SEGY format.
				</p>
				<section className="flex justify-center items-center">
					<Divider additional_styles={"w-[284px]"}></Divider>
					<h1 className="text-[24px] font-semibold opacity-50 mx-[37px]">or</h1>
					<Divider additional_styles={"w-[284px]"}></Divider>
				</section>
				<section className="flex flex-row gap-x-3">
					<Buttons path="" button_description="Make a new document" onClick={(e) => { e.preventDefault(); settoggleOverlay(true) }}></Buttons>
					{/* <Buttons path={"/drafts"} button_description="View drafts"></Buttons> */}
					{/* <Buttons path={"/database"} button_description="Connect with database"></Buttons> */}
				</section>
			</section>
			<div className={`fixed w-screen h-screen bg-black/[.5] top-0 left-0 ${toggleOverlay ? "opacity-100 visible" : "opacity-0 invisible"} transition-all`}>
				<div className="flex items-center justify-center w-full h-full">
					<div className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${toggleOverlay ? "" : "-translate-y-10 opacity-0"} transition-all`}>
						<Buttons path="" additional_styles="absolute top-2 right-2 px-1 py-1 text-black" title="Cancel" onClick={(e) => { e.preventDefault(); settoggleOverlay(false) }}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</Buttons>
						<p className="font-semibold">Select the data type for the new document:</p>
						<form onSubmit={console.log("hooray")} className="space-y-3 flex flex-col items-center justify-center">
							<Input
								type="dropdown"
								dropdown_items={Object.keys(datatypes)}
								withSearch
								onChange={(e) => { setdataType(e.target.value) }}
								additional_styles="w-full"
							/>
							<div className="space-x-2 flex">
								<Buttons
									type="submit"
									button_description="Confirm"
									path="/new_document"
									query={{ form_type: datatypes[dataType] }}
									disabled={dataType ? false : true}
									additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
								/>
								<Buttons
									button_description="Cancel"
									onClick={(e) => { e.preventDefault(); settoggleOverlay(false) }}
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

const SearchResult = () => {
	const [data, setData] = useState(draft.content);
	const searches = useSelector((state) => state.search.value)

	useEffect(() => {
		const name = searches.searchAll.toLocaleLowerCase();
		let temp = draft.content;
		temp = temp.filter((item) => {
			return item.name.toLocaleLowerCase().includes(name);
		});

		const workingArea = searches.workingArea.toLocaleLowerCase();
		if (workingArea !== "select an item") {
			temp = temp.filter(item => {
				return item["wilayah kerja"].toLocaleLowerCase().includes(workingArea)
			})
		}
		console.log(workingArea)

		console.log("search", temp);
		setData(temp);
	}, [searches])

	return (
		<Container>
			<Container.Title>Search result</Container.Title>
			<TableComponent header={draft.header} content={data} />
		</Container>
	);
};
