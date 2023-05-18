import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import { storeFile } from "../../store/generalSlice";
import Select from "../../public/icons/selection_tool.svg"

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
	const additional_styles_label = "w-[20%] font-semibold";
	const [fileUpload, setFileUpload] = useState([]);
	const [previousSelectedMethod, setpreviousSelectedMethod] = useState()
	// const [DataType, setDataType] = useState()
	// const [DataClassification, setDataClassification] = useState()
	// const [DataSubClass, setDataSubClass] = useState()
	// const [FileFormat, setFileFormat] = useState()
	const [Error, setError] = useState("")
	const [UplSettings, setUplSettings] = useState({
		DataType: "",
		// DataClassification: "",
		// DataSubClass: "",
		FileFormat: "",
		Method: ""
	})

	// test commit

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
		// router.push('/upload_file/matching_guided');
		// router.push('/upload_file/matching');
		// router.push('/upload_file/matching_auto');
		// router.push('/upload_file/matching_draggable');
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
				{/* <div className="flex flex-col items-center gap-y-1">
					
				</div> */}
				<div className="border-dashed border-2 border-black/30 rounded-lg p-10 flex space-x-3 items-center w-[80%] bg-searchbg/[.5]">
					<svg className="w-16 h-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
					</svg>
					<div className="w-full">
						<div>
							<div className="flex space-x-2 items-center justify-center">
								<Buttons path="" additional_styles="bg-gray-300 hover:bg-gray-400/60 font-bold" button_description="Choose a file" onClick={() => fileUploadRef.current.click()} />
								<p>or</p>
								<p className="font-bold">drag and drop a file here.</p>
							</div>
							{fileUpload.length > 0 &&
								<div className="flex space-x-2 items-center justify-center pt-1">
									<p className="">Uploaded file:</p>
									<p className="underline">{fileUpload[0].name}</p>
									<Buttons path="" additional_styles="px-1 py-1 bg-black/20 hover:bg-red-600 hover:text-white" title="Remove file" onClick={(e) => { setFileUpload([]) }}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
											<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</Buttons>
								</div>}
							<p className="text-sm text-black/70 text-center pt-2">*Supported file formats: JPG, PNG, PDF, PPTX, CSV, XLSX, LAS, or SEGY</p>
						</div>
						<input type="file" className="hidden" ref={fileUploadRef} onChange={(e) => changeFile(e)} />

					</div>
				</div>
				{/* <div className="border border-b-[#7a7a7a] w-full lg:w-[95%]"></div> */}
				<h2 className="text-xl font-bold py-3">Choose the right settings for the uploaded file</h2>
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
				<h2 className="text-xl font-bold py-3">Choose your preferred method of data matching</h2>
				<div className="w-[80%] max-w-[80%] flex items-center justify-center">
					<div className="flex space-x-3 overflow-auto">
						<Buttons id="dropdown" title="" additional_styles={`h-full active:bg-gray-400/60 outline-none ${UplSettings.Method === "dropdown" ? "bg-searchbg/60" : ""}`} onClick={(e) => { setUplSettings({ ...UplSettings, Method: "dropdown" }) }}>
							<div className="flex space-x-2 min-w-max items-center p-2">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
									<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
								</svg>
								<section className="w-[150px]">
									<h3 className="text-lg font-bold">Drop down</h3>
									<p className="text-sm">Choose the correct data matches using drop downs.</p>
								</section>
							</div>
						</Buttons>
						<Buttons id="highlight" title="" additional_styles={`h-full active:bg-gray-400/60 outline-none ${UplSettings.Method === "highlight" ? "bg-searchbg/60" : ""}`} onClick={(e) => { setUplSettings({ ...UplSettings, Method: "highlight" }) }}>
							<div className="flex space-x-2 min-w-max items-center p-2">
								<Select className="w-10 h-10"/>
								<section className="w-[150px]">
									<h3 className="text-lg font-bold">Highlighting</h3>
									<p className="text-sm">Match the data by highlighting the document preview.</p>
								</section>
							</div>
						</Buttons>
						<Buttons id="dragdrop" title="" additional_styles={`h-full active:bg-gray-400/60 outline-none ${UplSettings.Method === "dragdrop" ? "bg-searchbg/60" : ""}`} onClick={(e) => { setUplSettings({ ...UplSettings, Method: "dragdrop" }) }}>
							<div className="flex space-x-2 min-w-max items-center p-2">
								<svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
								</svg>
								<section className="w-[150px]">
									<h3 className="text-lg font-bold">Drag and drop</h3>
									<p className="text-sm">Choose the correct data matches using drag and drop method.</p>
								</section>
							</div>
						</Buttons>
						<Buttons id="automatic" title="" additional_styles={`h-full active:bg-gray-400/60 outline-none ${UplSettings.Method === "automatic" ? "bg-searchbg/60" : ""}`} onClick={(e) => { setUplSettings({ ...UplSettings, Method: "automatic" }) }} >
							<div className="flex space-x-2 min-w-max items-center p-2">
								<svg role="img" className="w-10 h-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Robot Framework</title><path d="M4.9565 10.2246c0-1.8766 1.5257-3.4023 3.4-3.4023 1.8766 0 3.4024 1.5257 3.4024 3.4023 0 .6838-.5526 1.2364-1.2341 1.2364-.6818 0-1.2344-.5526-1.2344-1.2364 0-.513-.4185-.9296-.9338-.9296-.5129 0-.9317.4165-.9317.9296 0 .6838-.5523 1.2364-1.234 1.2364-.6818 0-1.2344-.5526-1.2344-1.2364m14.0868 5.717c0 .6842-.5524 1.2363-1.2341 1.2363H6.3575c-.6818 0-1.2344-.552-1.2344-1.2363 0-.6837.5526-1.2363 1.2344-1.2363h11.4517c.6817 0 1.234.5526 1.234 1.2363m-5.351-5.0244c-.3814-.5657-.2323-1.3328.3334-1.7143l2.8628-1.9334c.5613-.3902 1.3329-.2324 1.7144.3289.3815.5654.2323 1.3329-.3334 1.7144l-2.8628 1.9333c-.5442.3831-1.3348.2379-1.7144-.3289zm7.8393 7.6018a.8815.8815 0 0 1-.258.6227l-2.1277 2.1277a.8822.8822 0 0 1-.623.258H5.4772a.8822.8822 0 0 1-.623-.258l-2.1277-2.1277a.8815.8815 0 0 1-.258-.6227V5.4818a.8797.8797 0 0 1 .258-.6228l2.1277-2.1282a.8816.8816 0 0 1 .623-.2578h13.0456a.8816.8816 0 0 1 .623.2578l2.1277 2.1282a.8797.8797 0 0 1 .258.6228V18.519zm1.811-15.0835L20.5644.6577A2.2454 2.2454 0 0 0 18.9775 0H5.0207A2.2445 2.2445 0 0 0 3.433.658L.657 3.4359A2.2449 2.2449 0 0 0 0 5.0228v13.9547c0 .5953.2366 1.1667.6575 1.5872l2.778 2.7779c.421.421.9918.6573 1.5871.6573h13.9548a2.2448 2.2448 0 0 0 1.5872-.6573l2.7779-2.7779A2.2436 2.2436 0 0 0 24 18.9775V5.023a2.2451 2.2451 0 0 0-.6575-1.5875z" /></svg>
								<section className="w-[150px]">
									<h3 className="text-lg font-bold">Automatic</h3>
									<p className="text-sm">Automatically try to predict data and their respective matches.</p>
								</section>
							</div>
						</Buttons>
					</div>
				</div>
				<div className="flex flex-row gap-x-3 pt-3 pb-16">
					<Buttons
						type="submit"
						path={(fileUpload.length >= 1 && UplSettings.DataType && UplSettings.FileFormat && UplSettings.Method) ? UplSettings.Method === "dropdown" ? '/upload_file/matching_dropdown' : UplSettings.Method === "highlight" ? '/upload_file/matching_highlight' : UplSettings.Method === "dragdrop" ? '/upload_file/matching_draggable' : '/upload_file/matching_auto' : ''}
						query={
							{ form_type: datatypes[UplSettings.DataType] }
						}
						button_description="Upload and process file"
						additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
						onClick={handleSubmit}
						disabled={(fileUpload.length >= 1 && UplSettings.DataType && UplSettings.FileFormat && UplSettings.Method) ? false : true}
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
