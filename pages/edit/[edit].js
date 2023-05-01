import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import Button from '../../components/buttons/buttons'
import Sheets from "../../components/sheets/sheets"
import TableComponent from "../../components/table/table"
import Input from "../../components/input_form/input"
import Container from "../../components/container/container"

const DocEditor = ({ spreadsheetID, workspace_name }) => {
    console.log(workspace_name)
    const [IsSaved, setIsSaved] = useState(false)
    const [Message, setMessage] = useState("")
    const [Data, setData] = useState([{}])
    const [WorkspaceName, setWorkspaceName] = useState("")
    const [Error, setError] = useState("")
    const [workspaceData, setworkspaceData] = useState()

    const iframe_ref = useRef()
    const warningText
        = 'You have unsaved changes - Are you sure you want to leave this page?'
    // const sheetID = spreadsheetID.response

    const router = useRouter()
    console.log(router.query)
    const handleWindowClose = (e) => {
        e.preventDefault();
        if (!IsSaved) return (e.returnValue = warningText);
        return;
    };
    const handleBrowseAway = (url, { shallow }) => {
        if (!IsSaved) {
            if (url === router.asPath || !window.confirm(warningText)) {
                router.events.emit('routeChangeError');
                throw 'routeChange aborted.';
            }
        }
        return;
    };
    const get_data = async (form_type) => {
        const data = await fetch(`http://127.0.0.1:8080/api/v1/${form_type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => {
            return response.json()
        }).then(response => {
            console.log(response)
            return response
        }).catch(err => { throw err })
        await setData(data)
    }

    // TODO TEMPORARY WORKFLOW FOR DEMO, CHANGE LATER TO USE DATABASE
    useEffect(() => {
        try {
            // setting the workspace data
            const workspace_name_space = workspace_name.replace(/\_/g, ' ')
            let workspace_names
            if (router?.query?.form_type === "printed_well_report") {
                workspace_names = JSON.parse(localStorage.getItem("pwr"))

            } else if (router?.query?.form_type === "bibliography") {
                workspace_names = JSON.parse(localStorage.getItem("bibliography"))
            }
            workspace_names.some((name) => {
                console.log(workspace_name_space, name)
                if (workspace_name_space.toLowerCase() === name.Name.toLowerCase()) {
                    setworkspaceData(name)
                    return true
                }
            });

            // getting and setting the data
            let data
            if (workspace_name === "new_document") {
                data = JSON.parse(localStorage.getItem("ocr_data"))
            } else {
                data = JSON.parse(localStorage.getItem(workspace_name))
            }

            setData(data)
            setWorkspaceName(workspace_name.replace(/\_/g, ' '))

        } catch (error) {
            setError(String(error))
        }
    }, [])

    useEffect(() => {
        console.log(workspaceData)
    }, [workspaceData])


    // TODO UNUSED WORKFLOW, PREVIOUS ONE BEFORE DEMO
    // useEffect(() => {
    //     try {
    //         // for printed well report, temporary, since backend view is not finished yet
    //         if (router?.query?.form_type === "printed_well_report") {
    //             const data = localStorage.getItem(workspace_name) // change local storage to redux
    //             if (data) {
    //                 setData(JSON.parse(data))
    //             }
    //         } else { // for bibliography
    //             get_data(router.query.form_type)
    //         }
    //         setWorkspaceName(workspace_name.replace(/\_/g, ' '))
    //     } catch (error) {
    //         setError(String(error))
    //     }
    // }, [])

    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [IsSaved])
    useEffect(() => {
        console.log(iframe_ref.current)
    }, [iframe_ref])

    return (
        (Data) ? (
            <Container additional_class='space-y-3'>
                <Container.Title back>Edit Document</Container.Title>
                <Input type='text' placeholder='Document title' additional_styles_input='text-xl font-semibold p-3 capitalize' defaultValue={WorkspaceName} />
                <TableComponent additional_styles_column="overflow-visible" header={["Header", ""]} content={
                    (workspaceData?.Name) ? (
                        [
                            [<div className="flex space-x-2"><p>Nama KKKS</p><p className="text-gray-400">(KKKS Name)</p></div>, <Input type={"text"} defaultValue={workspaceData?.KKS || "Geodwipa Teknika Nusantara"} />],
                            [<div className="flex space-x-2"><p>Nama wilayah kerja</p><p className="text-gray-400">(Working area)</p></div>, <Input type={"text"} defaultValue={workspaceData?.wilayah_kerja || "Geodwipa Teknika Nusantara"} />],
                            [<div className="flex space-x-2"><p>Jenis penyerahan data</p><p className="text-gray-400">(Submission type)</p></div>, <Input type={"dropdown"} dropdown_items={["Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"]} />],
                            [<div className="flex space-x-2"><p>Nomor AFE</p><p className="text-gray-400">(AFE number)</p></div>, <Input type={"number"} defaultValue={String(workspaceData?.AFE) || "1"} />],
                            // [<p className="font-bold">Data type</p>, <Input type={"dropdown"} dropdown_items={["Well data"]} />],
                            [<p className="font-bold">Data type</p>, <Input type={"text"} defaultValue={router.query.form_type.replace(/\_/g, " ")} additional_styles_input="capitalize font-semibold" disabled />],
                            // [<p className="font-bold">Data classification</p>, <Input type={"dropdown"} dropdown_items={["Report"]} />],
                            // [<p className="font-bold">Data sub-classification</p>, <Input type={"dropdown"} dropdown_items={["Printed"]} />]
                        ]
                    ) : ([
                        [<p>Getting data... Please wait</p>]
                    ])
                } />
                <div className="h-full">
                    <TableComponent header={[
                        <div className="flex justify-between items-center">
                            <p>Data</p>
                        </div>
                    ]} content={[
                        (Data) ? (
                            [<div className="h-[750px]"><Sheets type="review" form_type={router?.query.form_type || "basin"} data={Data} /></div>]
                        ) : (
                            [<p>Getting data... Please wait</p>]
                        )
                    ]} additional_styles_row='p-0' additional_styles="overflow-hidden" />
                </div>
                <div className="flex space-x-2 w-full">
                    <Button path="" button_description="Save document" onClick={(e) => { e.preventDefault(); setIsSaved(true); setMessage("Workspace successfully saved.") }} />
                    {/* <Button path="" button_description="Unsave document" onClick={(e) => { e.preventDefault(); setIsSaved(false) }} /> */}
                </div>
                {/* <p className="bg-black text-white p-2">document saved: {String(IsSaved)}</p> */}
                <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-blue-500 text-white px-3 rounded-lg py-2 transition-all ${Message ? "" : "-translate-y-20"}`}>
                    <p>{Message}</p>
                    <Button additional_styles="px-1 py-1 text-black" path="" onClick={(e) => { e.preventDefault(); setMessage("") }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>
                <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${Error ? "" : "-translate-y-20"}`}>
                    <p>{Error}</p>
                    <Button additional_styles="px-1 py-1 text-black" path="" onClick={(e) => { e.preventDefault(); setError("") }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>
            </Container>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
                <p className="text-xl font-semibold text-gray-500">Getting data from database... Please wait</p>
            </div>
        )
    )
}

export async function getServerSideProps(context) {
    // console.log(context.params.edit)
    return {
        props: { workspace_name: context.params.edit }, // will be passed to the page component as props
    }
}

export default DocEditor