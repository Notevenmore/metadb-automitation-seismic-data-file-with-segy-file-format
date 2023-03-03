import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container";

export default function UploadingPage({}) {
	const [load, setLoad] = useState("uploading");
	const file = useSelector((state) => state.general.file)
	const router = useRouter();

	useEffect(() => {
		if(file.length === 0) {
			router.push("/upload-file")
			return;
		}
		setTimeout(() => {
			setLoad("processing");
		}, 1500)
		setTimeout(() => {
			setLoad("completed");
		}, 1500)
	})

	return (
		<Container>
			<Container.Title>Upload file</Container.Title>
			<div className="full-height-container flex flex-col items-center justify-center">
				<div className="flex flex-col w-[526px] items-center justify-center">
					<Image src={load==="completed" ? "/icons/check.svg" : "/images/loading.png"} alt="loading" width={130} height={130} />
					<div className="text-[24px]">
						{load === "uploading"
							? "Uploading file..."
							: load === "processing"
							? "Processing file..."
							: "All process completed"}
					</div>
					<div className="underline font-medium">{file.length!==0 && file[0].name}</div>
					<div className="border-b border-b-[#7a7a7a] w-full my-5"></div>
					<div>
						{load === "completed" ? <div className="flex flex-row gap-x-3">
                            <Buttons path="/upload-file/review" button_description="Continue and review" additional_styles="bg-primary flex-1" />
                            <Buttons path="" button_description="Save draft" additional_styles="bg-primary flex-1" />
                            <Buttons path="" button_description="Cancel" additional_styles="bg-[#e0e4e9] text-error" />
                        </div> : "This process will take some time, please be patient..."}
					</div>
				</div>
			</div>
		</Container>
	);
}
