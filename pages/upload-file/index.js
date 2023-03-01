import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import { storeFile } from "../../store/generalSlice";

export default function UploadFilePage() {
	const additional_styles_label = "w-[20%]";
	const [fileUpload, setFileUpload] = useState([]);

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

	const router = useRouter();
	const dispatch = useDispatch()
	const handleSubmit = (e) => {
		e.preventDefault()
		dispatch(storeFile(fileUpload))
		router.push('/upload-file/uploading')
		console.log("???")
	}

	return (
		<Container additional_class="full-height relative" onDragEnter={(e) => handleDrag(e)}>
			<Container.Title back>Upload File</Container.Title>
			<form
				className="flex flex-col items-center justify-center gap-y-4 w-full"
				onSubmit={(e) =>{ handleSubmit(e); console.log("aaa")}}>
				<div className="flex flex-col items-center gap-y-1">
					<div className="font-medium">Choose the right settings for the uploaded file</div>
					{fileUpload.length > 0 && <div className="underline">{fileUpload[0].name}</div>}
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
						dropdown_items={["a", "b", "c"]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setDetail(e.target.name)}
					/>
					<Input
						label="Data classification"
						label_loc="beside"
						type="dropdown"
						name={"dataClassification"}
						placeholder={"Data classification"}
						dropdown_items={["d", "e", "f"]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
						onChange={(e) => setDetail(e.target.value)}
					/>
					<Input
						label="Sub data classification"
						label_loc="beside"
						type="dropdown"
						name={"subDataClassification"}
						placeholder={"Sub data classification"}
						dropdown_items={[]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
					/>
					<Input
						label="File format"
						label_loc="beside"
						type="dropdown"
						name={"fileFormat"}
						placeholder={"File format"}
						dropdown_items={[]}
						required={true}
						additional_styles="w-full"
						additional_styles_label={additional_styles_label}
					/>
				</div>
				<div className="flex flex-row gap-x-3">
					<Buttons
						type="submit"
						path=""
						button_description="Upload and process file"
						additional_styles="bg-primary"
						onClick={handleSubmit}
					/>
					<button type="submit"> Cancel</button>
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
		</Container>
	);
}
