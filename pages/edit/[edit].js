/* eslint-disable react/jsx-key */
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import Button from '../../components/buttons/buttons'
import Sheets from "../../components/sheets/sheets"
import TableComponent from "../../components/table/table"
import Input from "../../components/input_form/input"
import Container from "../../components/container/container"
import bibliography from "../../dummy-data/bibliography.json"
import bibliography_data from "../../dummy-data/bibliography_data.json"
import pwr from "../../dummy-data/pwr.json"
import pwr_data from "../../dummy-data/pwr_1.json"

const DocEditor = ({ spreadsheetID, workspace_name }) => {
    // note: workspaceName, workspace_name, workspace_names, and workspace_name_space is different
    const [IsSaved, setIsSaved] = useState(false)
    const [Message, setMessage] = useState({ message: "", color: "" })
    const [Data, setData] = useState([])
    const [WorkspaceName, setWorkspaceName] = useState("")
    const [spreadsheetReady, setspreadsheetReady] = useState(false)
    // TODO: change setworkspaceData flow to database
    const [workspaceData, setworkspaceData] = useState()
    
    const [spreadsheetId, setspreadsheetId] = useState()

    const iframe_ref = useRef()
    const warningText
        = 'You have unsaved changes - Are you sure you want to leave this page?'
    // const sheetID = spreadsheetID.response

    const router = useRouter()
    // console.log(router.query)
    const handleWindowClose = (e) => {
        e.preventDefault();
        if (!IsSaved) return (e.returnValue = warningText);
        return;
    };

    // This function handles navigation away from the current page by checking whether unsaved changes are present and displaying a warning dialog if necessary
    const handleBrowseAway = (url, { shallow }) => {
        if (!IsSaved) {
            // If there are unsaved changes, prompt the user with a warning dialog
            if (url === router.asPath || !window.confirm(warningText)) {
                // Emit a routeChangeError event and throw an error to prevent navigation away from the page
                router.events.emit('routeChangeError');
                throw 'routeChange aborted.';
            }
        }
        // If there are no unsaved changes, allow navigation away from the page
        return;
    };


    const put_workspace = async(form_type, afe, workspace_data) => {
        const data = await fetch(`http://localhost:9090/api/v1/${form_type}-workspace-afe/${afe}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workspace_data)
        }).then(response => {
            // Handle non-200 response status
            if (response.status === 200) {
                console.log(response);
            }
            else{
                throw response;
            }
            return response;
        }).catch(err => {throw err})
    }

    const post_workspace = async(form_type, workspace_data) => {
        const data = await fetch(`http://localhost:9090/api/v1/${form_type}-workspace-afe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workspace_data)
        }).then(response => {
            // Handle non-200 response status
            if (response.status === 200) {
                console.log(response);
            }
            else{
                throw response;
            }
            return response;
        }).catch(err => {throw err})
    }

    const upload_afeguid_new = async(form_type, afe, guid) => {
        const data = await fetch(`http://localhost:9090/api/v1/${form_type}-workspace`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "afe_number": afe,
                "ppdm_guid": guid
            })
        }).then(response => {
            // Handle non-200 response status
            if (response.status === 200) {
                console.log(response);
            }
            else{
                throw response;
            }
            return response;
        }).catch(err => {throw err})
    }
    
    const delete_data = async (form_type, data_id, new_data) => {
        const data = await fetch(`http://localhost:9090/api/v1/${form_type}/${data_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            console.log(response)
            return response
        }).catch(err => { throw err;  })
    }

    const put_data = async (form_type, data_id, new_data) => {
        const data = await fetch(`http://localhost:9090/api/v1/${form_type}/${data_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new_data)
        // }).then(response => {
        //     return response.json()
        }).then(response => {
            console.log(response)
            return response
        }).catch(err => { throw err;  })
    }

    const post_data = async (form_type, new_data) => {
        const data = await fetch(`http://localhost:9090/api/v1/${form_type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new_data)
        // }).then(response => {
        //     return response.json()
        }).then(response => {
            // Handle non-200 response status
            if (response.status === 200) {
                console.log(response);
            }
            else{
                throw response;
            }
            return response;
        }).catch(err => {throw err})
    }

    
    // This function retrieves data from a server API based on the form_type parameter, and updates the state with the retrieved data
    const get_data = async (form_type) => {

        // Make an HTTP GET request to the server API
        const data = await fetch(`http://localhost:9090/api/v1/${form_type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response => {
            // Parse the response into JSON format
            return response.json()
        })
        .then(response => {
            // Log the response to the console for debugging purposes
            console.log(response);
            // Return the response data
            return response;
        })
        .catch(err => { 
            // If there is an error, throw it
            throw err;
        });

        // Set the state data using the retrieved data
        await setData(data);
    }


    // TODO TEMPORARY WORKFLOW FOR DEMO, CHANGE LATER TO USE DATABASE
    // This useEffect hook sets up the initial data for the workspace based on the workspace name and form type
    useEffect(() => {
        const init_data = async () => {
            try {
                // setting the workspace data
                const workspace_name_space = workspace_name.replace(/\_/g, ' ')
                let workspace_data_array
                // Get the list of workspace names from local storage based on the form type
                if (router?.query?.form_type === "printed_well_report") {
                    workspace_data_array = JSON.parse(localStorage.getItem("pwr")) || pwr
                } else if (router?.query?.form_type === "bibliography") {
                    workspace_data_array = JSON.parse(localStorage.getItem("bibliography")) || bibliography
                }
                
                // Check if the current workspace name is in the list of workspace names
                workspace_data_array.some((workspace_data) => {
                    // workspace_name_space is current workspace name
                    // name is current workspace from the workspace lists that is being evaluated (workspace_names)
                    if (workspace_name_space.toLowerCase() === workspace_data.Name.toLowerCase()) {
                        setworkspaceData(workspace_data)
                        return true
                    }
                });

                console.log(workspaceData);
                // Get the data for the current workspace from local storage
                let data
                if (workspace_name === "new_document") {
                    data = JSON.parse(localStorage.getItem("ocr_data"))
                } else {
                    data = JSON.parse(localStorage.getItem(workspace_name))
                    if (!data) {
                        // If there is no data for the workspace, use the default data for the form type
                        if (router.query.form_type === "printed_well_report") {
                            data = pwr_data
                        } else if (router.query.form_type === "bibliography") {
                            data = bibliography_data
                        }
                    }
                    console.log(data)
                }

                // Set the data and workspace name in state
                setData(data)
                setWorkspaceName(workspace_name.replace(/\_/g, ' '))

            } catch (error) {
                // Handle any errors that occur during initialization
                setMessage({ message: String(error), color: "red" })
                console.log(error)
            }
        }
        // Call init_data to set up the workspace data
        init_data();
    }, [])
    
    useEffect(() => {
        console.log(Data.length)
    }, [Data])

    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [IsSaved])

    // TODO change to POST and PUT request to backend
    // This function handles the saving of the document/workspace
    const saveDocument = async (e) => {
        e.preventDefault();
        try {
            // Check if spreadsheetId is available
            if (!spreadsheetId) {
                setMessage({ message: "Failed to get spreadsheet information, please reload this page. Changes will not be saved", color: "red" });
                return;
            }

            // Set saving message
            setMessage({ message: "Saving workspace... Please don't leave this page or click anything", color: "blue" });

            // Fetch spreadsheet data from the server
            const spreadsheet_data = await fetch("http://localhost:5050/getRows", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    form_type: router.query.form_type,
                    spreadsheetID: spreadsheetId
                })
            }).then(response => {
                return response.json();
            }).then(response => {
                // Handle non-200 response status
                if (response.status !== 200) {
                    throw response.response;
                }
                return response;
            }).catch(err => { throw err; });

            // Prepare the final data to be saved
            let final = [];
            let ppdm_guid_array = [];
            for (let idx_row = 1; idx_row < spreadsheet_data.response.length; idx_row++) {
                let row = {};
                console.log(idx_row);
                spreadsheet_data.response[0].forEach((header, idx_col) => {
                    row[header.toLowerCase()] = spreadsheet_data?.response[idx_row][idx_col] || "";
                });
                final.push(row);
                // console.log(typeof row.ppdm_guid);
                ppdm_guid_array.push(row.ppdm_guid);
            }

            // TODO: make workspace_data real-time update
            const workspace_data_post = {
                "afe_number": parseInt(workspaceData.AFE),
                "workspace_name": workspace_name,
                "kkks_name": workspaceData.KKS,
                "working_area": workspaceData.wilayah_kerja,
                "submission_type": workspaceData.submission,
                "data_type": router.query.form_type
            }

            const {data_type, afe_number, ...workspace_data_put} = Object.assign(workspace_data_post);
            console.log(workspace_data_put);

            // Save the data based on the workspace_name and form_type
            if (workspace_name === "new_document") {
                localStorage.setItem("ocr_data", JSON.stringify(final));
            } else {
                if (router.query.form_type === "printed_well_report") {
                    localStorage.setItem("pwr_2023_report", JSON.stringify(final));
                } else if (router.query.form_type === "bibliography") {
                    // localStorage.setItem("bibliography_report_final", JSON.stringify(final));
                    final.forEach((row) => {
                        post_data("bibliography", row).catch(
                            (err) => put_data("bibliography", row.ppdm_guid, row));
                    })
                    post_workspace("bibliography", workspace_data_post).catch(
                        (err) => put_workspace("bibliography", workspace_name, workspace_data_put)
                    );
                    ppdm_guid_array.forEach((ppdm_guid) => {
                        upload_afeguid_new("bibliography", parseInt(workspaceData.AFE), ppdm_guid);
                    });
                }
            }

            // Set IsSaved to true and display success message
            setIsSaved(true);
            setMessage({ message: "Workspace successfully saved", color: "blue" });
        } catch (error) {
            // Handle error and display error message
            setMessage({ message: `Failed to save workspace. Please try again. Additional error message: ${String(error)}`, color: "red" });
        }
    }



    // detect changes in the workspace data inputs
    const handleWorkspaceChange = (event) => {
        const { name, value } = event.target;
        setworkspaceData((prevInputValues) => ({
            ...prevInputValues,
            [name]: value
        }));
        console.log(workspaceData);
    };

    
    const submission_types = [
        "Quarterly", "Relinquishment", "Termination", "Spec New",
        "Spec Ext", "Spec Term", "Joint Study", "DIPA"
    ]

    return (
        (Data.length >= 1) ? (
            <Container additional_class='space-y-3'>
                <Container.Title back>Edit Document</Container.Title>
                {/* TODO: find out what is workspaceName */}
                <Input
                 name="Name" type='text' placeholder='Document title'
                 additional_styles_input='text-xl font-semibold p-3 capitalize'
                 defaultValue={WorkspaceName} onChange={handleWorkspaceChange}
                />
                <TableComponent additional_styles_column="overflow-visible" header={["Header", ""]} content={
                    (workspaceData?.Name) ? (
                        [
                            [
                            <div className="flex space-x-2">
                                <p>Nama KKKS</p>
                                <p className="text-gray-400">(KKKS Name)</p>
                            </div>,
                            <Input name="KKS" type={"text"} 
                                defaultValue={workspaceData?.KKS || "Geodwipa Teknika Nusantara"}
                                onChange={handleWorkspaceChange}
                            />
                            ],
                            [
                            <div className="flex space-x-2">
                                <p>Nama wilayah kerja</p>
                                <p className="text-gray-400">(Working area)</p>
                            </div>,
                            <Input name="wilayah_kerja" type={"text"} 
                                defaultValue={workspaceData?.wilayah_kerja || "Geodwipa Teknika Nusantara"}
                                onChange={handleWorkspaceChange}
                            />
                            ],
                            [
                            <div className="flex space-x-2">
                                <p>Jenis penyerahan data</p>
                                <p className="text-gray-400">(Submission type)</p>
                            </div>,
                            <Input name="submission" type={"dropdown"}
                                defaultValue={workspaceData?.submission || "Select an item"}
                                dropdown_items={submission_types} onChange={handleWorkspaceChange} />
                            ],
                            [
                            <div className="flex space-x-2">
                                <p>Nomor AFE</p>
                                <p className="text-gray-400">(AFE number)</p>
                            </div>,
                            <Input name="AFE" type={"number"}
                                 defaultValue={String(workspaceData?.AFE) || "1"} disabled/>
                            ],
                            [
                            <p className="font-bold">Data type</p>,
                            <Input type={"text"} defaultValue={router.query.form_type.replace(/\_/g, " ")}
                              additional_styles_input="capitalize font-semibold" disabled />
                            ],
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
                            [<div className="h-[750px]"><Sheets type="review" form_type={router?.query.form_type || "basin"} data={Data} finishedInitializing={setspreadsheetReady} getSpreadsheetID={setspreadsheetId} /></div>]
                        ) : (
                            [<p>Getting data... Please wait</p>]
                        )
                    ]} additional_styles_row='p-0' additional_styles="overflow-hidden" />
                </div>
                <div className="flex space-x-2 w-full pt-5">
                    <Button 
                     path="" button_description="Save document" onClick={saveDocument}
                     additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
                     disabled={spreadsheetReady ? false : true}
                    />
                    {/* <Button path="" button_description="Unsave document" onClick={(e) => { e.preventDefault(); setIsSaved(false) }} /> */}
                </div>
                {/* <p className="bg-black text-white p-2">document saved: {String(IsSaved)}</p> */}
                <div className={`flex items-center space-x-2 fixed top-5 left-[50%]
                 translate-x-[-50%] bg-${Message.color || "blue"}-500 text-white
                 px-3 rounded-lg py-2 transition-all ${Message.message ? "" : "-translate-y-20"}`}>
                    <p>{Message.message}</p>
                    <Button
                     additional_styles="px-1 py-1 text-black" path=""
                      onClick={(e) => { e.preventDefault(); setMessage({ message: "", color: "" }) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>
                {/* <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${Error ? "" : "-translate-y-20"}`}>
                    <p>{Error}</p>
                    <Button additional_styles="px-1 py-1 text-black" path="" onClick={(e) => { e.preventDefault(); setError("") }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div> */}
            </Container>
        ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center space-y-3`}>
                <div className={`animate-spin border-4 border-t-transparent
                 border-gray-500/[.7] rounded-full w-14 h-14`}></div>
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