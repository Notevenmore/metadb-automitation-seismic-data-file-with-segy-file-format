import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import { storeFile } from "../../store/generalSlice";

export default function UploadFilePage({ setTitle }) {
	setTitle("Upload file")
	const router = useRouter();
	const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")
	const additional_styles_label = "w-[20%]";
	const [fileUpload, setFileUpload] = useState([]);
	const [DataType, setDataType] = useState()
	const [DataClassification, setDataClassification] = useState()
	const [DataSubClass, setDataSubClass] = useState()
	const [FileFormat, setFileFormat] = useState()
	const [Error, setError] = useState("")

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
	const handleSubmit = (e) => {
		e.preventDefault()
		if (fileUpload.length < 1) {
			setError("Please select a file before continuing to the next process")
			return
		}
		dispatch(storeFile(fileUpload))
		// router.push('/upload_file/uploading')
		// console.log("???")
	}

	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title back>
				<div className="-space-y-2">
					<p className="capitalize text-base font-normal">{path_query}</p>
					<p>Upload File</p>
				</div>
			</Container.Title>
			<form
				className="flex flex-col items-center justify-center gap-y-4 w-full"
				onSubmit={(e) => { handleSubmit(e); console.log("aaa") }}>
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
						dropdown_items={["Well summary"]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setDataType(e.target.value)}
						withSearch
					/>
					<Input
						label="Data classification"
						label_loc="beside"
						type="dropdown"
						name={"dataClassification"}
						placeholder={"Data classification"}
						dropdown_items={["Report"]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setDataClassification(e.target.value)}
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
						onChange={(e) => setDataSubClass(e.target.value)}
						withSearch
					/>
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
						onChange={(e) => setFileFormat(e.target.value)}
						withSearch
					/>
				</div>
				<div className="flex flex-row gap-x-3">
					<Link href={{ pathname: `${""}`, query: "" }}>
						<Buttons
							type="submit"
							path=""
							button_description="Upload and process file"
							additional_styles="bg-primary"
							onClick={handleSubmit}
						/>
					</Link>
					<Buttons type="submit" button_description="Cancel" path="" />
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
