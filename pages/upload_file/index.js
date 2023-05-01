import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import { storeFile } from "../../store/generalSlice";

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

export default function UploadFilePage({ setTitle }) {
	setTitle("Upload file")
	const router = useRouter();
	const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")
	const additional_styles_label = "w-[20%]";
	const [fileUpload, setFileUpload] = useState([]);
	// const [DataType, setDataType] = useState()
	// const [DataClassification, setDataClassification] = useState()
	// const [DataSubClass, setDataSubClass] = useState()
	// const [FileFormat, setFileFormat] = useState()
	const [Error, setError] = useState("")
	const [UplSettings, setUplSettings] = useState({
		DataType: "",
		// DataClassification: "",
		// DataSubClass: "",
		FileFormat: ""
	})

	const fileUploadRef = useRef(null);

	const changeFile = (e) => {
		if (e.target.files.length == 0) setFileUpload([]);
		else setFileUpload(e.target.files);
	};

	const [dragActive, setDragActive] = useState(false);
	const handleDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		fileUploadRef.current.files = e.dataTransfer.files;
		setFileUpload(e.dataTransfer.files)
		setDragActive(false);
	};
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	useEffect(() => {
		console.log("detail", dragActive);
	}, [dragActive]);

	const dispatch = useDispatch()

	const handleSubmit = () => {
		// e.preventDefault()
		// if (fileUpload.length < 1 || !UplSettings.DataType || !UplSettings.DataClassification || !UplSettings.DataSubClass || !UplSettings.FileFormat ) {
		if (fileUpload.length < 1 || !UplSettings.DataType || !UplSettings.FileFormat) {
			setError("Please select a file before continuing to the next process. Make sure to also fill in the appropriate settings for the uploaded file.")
			return false
		}
		dispatch(storeFile(fileUpload))
		// router.push('/upload_file/matching')
		// console.log("???")
		return true
	}

	useEffect(() => {
		console.log(UplSettings)
	}, [UplSettings])


	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title back>
				<div className="-space-y-2">
					<p className="capitalize text-sm font-normal">{path_query}</p>
					<p>Upload File</p>
				</div>
			</Container.Title>
			<form
				className="flex flex-col items-center justify-center gap-y-4 w-full"
				onSubmit={(e) => { handleSubmit(); console.log("aaa") }}>
				<div className="flex flex-col items-center gap-y-1">
					<div className="font-medium">Choose the right settings for the uploaded file</div>
					{fileUpload.length > 0 && <div className="underline flex space-x-2 items-center">
						<p>{fileUpload[0].name}</p>
						<Buttons path="" additional_styles="px-1 py-1 text-black" title="Remove file" onClick={(e) => { setFileUpload([]) }}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</Buttons>
					</div>}
					<Buttons path="" button_description="Choose a file" onClick={() => fileUploadRef.current.click()} />
					<input type="file" className="hidden" ref={fileUploadRef} onChange={(e) => changeFile(e)} />
				</div>
				<div className="border border-b-[#7a7a7a] w-full lg:w-[95%]"></div>
				<div className="w-[100%] lg:w-[80%] flex flex-col gap-y-3">
					<Input
						label="Data type"
						label_loc="beside"
						type="dropdown"
						name={"dataType"}
						placeholder={"Data type"}
						dropdown_items={Object.keys(datatypes)}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setUplSettings({ ...UplSettings, DataType: e.target.value })}
						withSearch
					/>
					{/* <Input
						label="Data classification"
						label_loc="beside"
						type="dropdown"
						name={"dataClassification"}
						placeholder={"Data classification"}
						dropdown_items={["Report"]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setUplSettings({ ...UplSettings, DataClassification: e.target.value })}
						withSearch
					/>
					<Input
						label="Sub data classification"
						label_loc="beside"
						type="dropdown"
						name={"subDataClassification"}
						placeholder={"Sub data classification"}
						dropdown_items={["Printed"]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setUplSettings({ ...UplSettings, DataSubClass: e.target.value })}
						withSearch
					/> */}
					<Input
						label="File format"
						label_loc="beside"
						type="dropdown"
						name={"fileFormat"}
						placeholder={"File format"}
						dropdown_items={["Image", "PDF", "PPTX", "CSV", "LAS", "SEGY"]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setUplSettings({ ...UplSettings, FileFormat: e.target.value })}
						withSearch
					/>
				</div>
				<div className="flex flex-row gap-x-3">
					<Buttons
						type="submit"
						path={(fileUpload.length >= 1 && UplSettings.DataType && UplSettings.FileFormat) ? '/upload_file/matching' : ''}
						query={
							{ form_type: datatypes[UplSettings.DataType] }
						}
						button_description="Upload and process file"
						additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
						onClick={handleSubmit}
						disabled={(fileUpload.length >= 1 && UplSettings.DataType && UplSettings.FileFormat) ? false : true}
					/>
					<Buttons type="submit" button_description="Cancel" path="" onClick={router.back} />
				</div>
			</form>
			{dragActive && (
				<div
					className="absolute w-full h-full top-0 right-0 z-[50] bg-primary/[20%]"
					onDragEnter={(e) => handleDrag(e)}
					onDragLeave={(e) => handleDrag(e)}
					onDragOver={(e) => handleDrag(e)}
					onDrop={(e) => handleDrop(e)}></div>
			)}
			<div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${Error ? "" : "-translate-y-20"}`}>
				<p>{Error}</p>
				<Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setError("") }}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</Buttons>
			</div>
		</Container>
	);
}
