import Buttons from "../components/buttons/buttons";
import FileIcon from "../public/icons/file.svg";
import { Divider } from "../components/float_dialog/float_dialog";
import Container from "../components/container/container";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "../components/table/table";
import draft from "../dummy-data/draft";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "../components/input_form/input";
import config, { datatypes } from "./config";
import { setUploadDocumentSettings } from "../store/generalSlice";


export default function HomePage({ setTitle }) {
	setTitle("Home")
	// if the search state is true change the view of the home page
	const searches = useSelector((state) => state.search.search);
	return <>{!searches ? <HomeSection /> : <SearchResult />}</>;
}

const HomeSection = () => {
	const [toggleOverlay, settoggleOverlay] = useState(false)
	const [dataType, setdataType] = useState("")
	const [newWorkspace, setnewWorkspace] = useState({
		workspace_name: "",
		kkks_name: "",
		working_area: "",
		submission_type: "",
		afe_number: 0,
	})
	const [Message, setMessage] = useState({ message: "", color: "" })

	const router = useRouter()
	const dispatch = useDispatch()
	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		router.push('/upload_file')
	}

	const delay = delay_amount_ms =>
		new Promise(resolve => setTimeout(() => resolve("delay"), delay_amount_ms))

	const makenew = async (e) => {
		e.preventDefault()
		if (dataType) {
			try {
				settoggleOverlay(false)
				setMessage({ message: "Creating a new workspace... Please don't leave this page or click anything", color: "blue" });
				await fetch(`${config[datatypes[dataType]]["afe"]}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(newWorkspace)
				}).then(res => {
					if (res.status === 200) {
						return res.statusText
					} else {
						return res.text()
					}
				}).then(res => {
					if (res.toLowerCase() === "ok") {
						return true
					} else if (res.toLowerCase().includes("workspace_name_unique")) {
						throw `A workspace with the name "${newWorkspace.workspace_name}" already exists. Please choose a different name.`
					} else if (res.toLowerCase().includes("afe_pk_error")) {
						throw `A workspace with AFE number ${newWorkspace.afe_number} already exists. Please choose a different AFE number.`
					} else {
						throw res || "Something happened while updating workspace information data. Please try again or contact maintainer if the problem persists."
					}
				})
				dispatch(setUploadDocumentSettings(newWorkspace))
				setMessage({ message: "Success. Redirecting to the next page...", color: "blue" });
				await delay(1000)
				router.push({
					pathname: "/new_document",
					query: { form_type: datatypes[dataType] }
				})
			} catch (error) {
				// Handle error and display error message
				setMessage({ message: String(error), color: "red" });
			}
		}
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
					<Buttons path="" button_description="Make a new workspace" onClick={(e) => { e.preventDefault(); settoggleOverlay(true) }}></Buttons>
					{/* <Buttons path={"/drafts"} button_description="View drafts"></Buttons> */}
					{/* <Buttons path={"/database"} button_description="Connect with database"></Buttons> */}
				</section>
			</section>
			<div className={`fixed w-screen h-screen bg-black/[.5] top-0 left-0 ${toggleOverlay ? "opacity-100 visible" : "opacity-0 invisible"} transition-all`}>
				<div className="flex items-center justify-center w-full h-full">
					<div className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${toggleOverlay ? "" : "-translate-y-10 opacity-0"} transition-all`}>
						<Buttons path="" additional_styles="absolute top-2 right-2 px-1 py-1 text-black" title="Cancel" onClick={(e) => { e.preventDefault(); settoggleOverlay(false); setdataType(""); setnewWorkspace({ workspace_name: "", kkks_name: "", working_area: "", afe_number: 0, submission_type: "" }) }}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</Buttons>
						<h1 className="font-bold text-3xl">New workspace</h1>
						<hr />
						<p className="font-semibold">Select the appropriate configuration for the new workspace:</p>
						<form onSubmit={console.log("hooray")} className="space-y-3 flex flex-col items-center justify-center">
							<div className="w-full space-y-1 border-2 p-2 rounded-lg">
								<p>Data type</p>
								<Input
									type="dropdown"
									name={"submissionType"}
									placeholder={"Select a data type"}
									value={dataType}
									dropdown_items={Array.from(Object.keys(datatypes))}
									required={true}
									additional_styles="w-full"
									onChange={(e) => setdataType(e.target.value)}
									withSearch
								/>
								<p>Workspace name</p>
								<Input
									type="text"
									name={"workingArea"}
									placeholder={"Workspace name"}
									value={newWorkspace.workspace_name}
									required={true}
									additional_styles="w-full"
									autoComplete="off"
									onChange={(e) => setnewWorkspace({ ...newWorkspace, workspace_name: e.target.value })}
								/>
								<p>AFE number</p>
								<Input
									type="number"
									name={"AFE_Number"}
									placeholder={"1945"}
									value={newWorkspace.afe_number}
									required={true}
									additional_styles="w-full"
									autoComplete="off"
									onChange={(e) => setnewWorkspace({ ...newWorkspace, afe_number: parseInt(e.target.value) })}
								/>
								<p>KKKS name</p>
								<Input
									type="text"
									name={"kkksName"}
									placeholder={"Geodwipa Teknika Nusantara"}
									value={newWorkspace.kkks_name}
									required={true}
									additional_styles="w-full"
									autoComplete="off"
									onChange={(e) => setnewWorkspace({ ...newWorkspace, kkks_name: e.target.value })}
								/>
								<p>Working area</p>
								<Input
									type="text"
									name={"workingArea"}
									placeholder={"Pulau Geodwipa"}
									value={newWorkspace.working_area}
									required={true}
									additional_styles="w-full"
									autoComplete="off"
									onChange={(e) => setnewWorkspace({ ...newWorkspace, working_area: e.target.value })}
								/>
								<p>Submission type</p>
								<Input
									type="dropdown"
									name={"submissionType"}
									placeholder={"Select a submission type"}
									value={newWorkspace.submission_type}
									dropdown_items={[
										"Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"
									]}
									required={true}
									additional_styles="w-full"
									onChange={(e) => setnewWorkspace({ ...newWorkspace, submission_type: e.target.value })}
									withSearch
								/>
							</div>
							<div className="space-x-2 flex">
								<Buttons
									type="submit"
									button_description="Confirm"
									disabled={Object.values(newWorkspace).some(x => { return x === null || x === "" }) ? true : false}
									additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
									onClick={makenew}
								/>
								<Buttons
									button_description="Cancel"
									onClick={(e) => { e.preventDefault(); settoggleOverlay(false); setdataType(""); setnewWorkspace({ workspace_name: "", kkks_name: "", working_area: "", afe_number: 0, submission_type: "" }) }}
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className={`flex items-center space-x-2 fixed top-5 left-[50%]
                 translate-x-[-50%] bg-${Message.color || "blue"}-500 text-white
                 px-3 rounded-lg py-2 transition-all ${Message.message ? "" : "-translate-y-20"}`}>
				<p>{Message.message}</p>
				<Buttons
					additional_styles="px-1 py-1 text-black" path=""
					onClick={(e) => { e.preventDefault(); setMessage({ message: "", color: "" }) }}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
						strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</Buttons>
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
