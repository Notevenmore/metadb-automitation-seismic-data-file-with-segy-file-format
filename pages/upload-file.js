import { useEffect, useRef, useState } from "react";
import Buttons from "../components/buttons/buttons";
import Container from "../components/container/container";
import Input from "../components/input_form/input";

export default function UploadFilePage() {
    const additional_styles_label = "w-[20%]"
    const [detail, setDetail] = useState("bbb");
    const [fileUpload, setFileUpload] = useState([]);

    const fileUploadRef = useRef(null)

    const changeFile = (e) => {
        if(e.target.files.length == 0) setFileUpload([])
        else setFileUpload(e.target.files)
    }

    useEffect(() => {
        console.log("detail", detail)
    }, [detail])
    useEffect(() => {
        console.log(fileUpload)
    }, [fileUpload])

	return (
		<Container additional_class="full-height">
			<Container.Title back>Upload File</Container.Title>
			<form className="flex flex-col items-center justify-center gap-y-4 w-full" onSubmit={(e) => {e.preventDefault()}}>
				<div className="flex flex-col items-center gap-y-1">
					<div className="font-medium">Choose the right settings for the uploaded file</div>
					{fileUpload.length > 0 && <div className="underline">{fileUpload[0].name}</div>}
                    <Buttons path="" button_description="Choose a file" onClick={() => fileUploadRef.current.click()} />
					<input
                        type="file"
                        className="hidden"
                        ref={fileUploadRef}
                        onChange={(e) => changeFile(e)}
                    />
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
						type="text"
						name={"dataClassification"}
						placeholder={"Data classification"}
                        dropdown_items={[]}
						required={true}
                        additional_styles="w-full"
						additional_styles_label={additional_styles_label}
                        value={detail}
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
                    <Buttons type="submit" path="" button_description="Upload and process file" additional_styles="bg-primary" />
                    <button type="submit"> Cancel</button>
                </div>
			</form>
		</Container>
	);
}
