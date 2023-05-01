import { useCallback, useEffect, useRef, useState } from "react"

interface IframeProps extends React.ComponentProps<"iframe"> {
    existingID: any,
    type: any,
    form_type: any,
    data: any,
    getSpreadsheetID: any
}

const Sheets: React.FunctionComponent<IframeProps> = ({ ...props }) => {
    const [sheetID, setsheetID] = useState()
    const [Loading, setLoading] = useState(true)
    const [LoadingMsg, setLoadingMsg] = useState("")
    const [hasError, sethasError] = useState(false)
    const [ErrorMessage, setErrorMessage] = useState("")
    const [SkipInitialization, setSkipInitialization] = useState(false)

    const init = useCallback(async () => {
        if (props.existingID) {
            console.log(props.existingID)
            setsheetID(props.existingID)
            setSkipInitialization(true)
            return;
        }
        const previousID = localStorage.getItem('spreadsheetID')
        if (previousID) {
            await fetch('http://localhost:5050/deleteSpreadsheet', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    spreadsheetID: previousID
                })
            }).catch(error => { throw error })
        }
        const makeTemp = await fetch('http://localhost:5050/createSpreadsheet')
        const spreadsheetID = await makeTemp.json()
        setsheetID(spreadsheetID.response)
        try {
            props.getSpreadsheetID(spreadsheetID.response)
        } catch (error) {
            console.log("hehe boi")
        }
        setSkipInitialization(false)
    }, [])

    const delay = delay_amount_ms =>
        new Promise(resolve => setTimeout(() => resolve("delay"), delay_amount_ms))

    useEffect(() => {
        console.log(props.type, props.form_type)
        const getInit = async () => {
            setLoading(true)
            try {
                setLoadingMsg("Initializing sheets, please wait...")
                await init()
            } catch (error) {
                sethasError(true)
                setErrorMessage(`{${error.message}}`)
            }
            setLoading(false)
        }
        getInit()
    }, [init])

    useEffect(() => {
        const updateSheet = async () => {
            setLoading(true)
            setLoadingMsg(`Initializing document form based on form type ${props.form_type}`)
            await fetch('http://localhost:5050/updateSpreadsheet/v2', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: props.type,
                    form_type: props.form_type,
                    spreadsheetID: sheetID
                })
            }).then(response => {
                return response.json()
            }).then(response => {
                if (response.status !== 200) {
                    sethasError(true)
                    setErrorMessage(response.response)
                }
            }).catch(error => { throw error })

            // FIXME this type is not currently used, remove if unused later. 2
            if (props.type === "update") {
                setLoadingMsg(`Fetching from database`)
                delay(3000)
                // const id = props.id
                const id = "Laporan Data 2023"
                let data, final = []
                const workspaces = JSON.parse(localStorage.getItem("workspaces"))
                workspaces.some(workspace => {
                    if (id === workspace.name) {
                        data = JSON.parse(localStorage.getItem(workspace.name))
                        return true
                    }
                })
                console.log(workspaces)
                console.log(data)
                data.some(item => {
                    final.push({ no: '-', ...item })
                })
                await fetch('http://localhost:5050/appendToSheets2', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        form_type: props.form_type,
                        spreadsheetID: sheetID,
                        data: JSON.stringify(final)
                    })
                }).then(response => {
                    return response.json()
                }).then(response => {
                    if (response.status !== 200) {
                        sethasError(true)
                        setErrorMessage(response.response)
                        console.log(response)
                    }
                }).catch(error => { throw error })

                // await fetch('http://localhost:5050/appendFromDatabase', {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({
                //         form_type: props.form_type,
                //         spreadsheetID: sheetID
                //     })
                // }).then(response => {
                //     return response.json()
                // }).then(response => {
                //     if (response.status !== 200) {
                //         sethasError(true)
                //         setErrorMessage(response.response)
                //         console.log(response)
                //     }
                // }).catch(error => { throw error })

            } else if (props.type === "review") {
                try {
                    console.log("first")
                    setLoadingMsg("Appending OCR data to the spreadsheet")
                    let data = props.data, final = []
                    console.log(data)
                    if (!data) {
                        throw new Error("Data not found. Make sure you correctly passed the data into the component.")
                    }

                    // TODO finish this new workflow
                    // ---| NEW WORKFLOW |---

                    await fetch('http://localhost:5050/appendToSheets2', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            form_type: props.form_type,
                            spreadsheetID: sheetID,
                            data: JSON.stringify(data)
                        })
                    }).then(response => {
                        return response.json()
                    }).then(response => {
                        if (response.status !== 200) {
                            sethasError(true)
                            setErrorMessage(response.response)
                            console.log(response)
                        }
                    }).catch(error => { throw error })

                    // ---| OLD WORKFLOW |---

                    // if (props.form_type !== "bibliography"){
                    //     data.forEach(item => {
                    //         final.push({ no: '-', ...item })
                    //     })
                    // } else {
                    //     final = data
                    // }

                    // await fetch('http://localhost:5050/appendToSheets2', {
                    //     method: "POST",
                    //     headers: {
                    //         "Content-Type": "application/json"
                    //     },
                    //     body: JSON.stringify({
                    //         form_type: props.form_type,
                    //         spreadsheetID: sheetID,
                    //         data: JSON.stringify(final)
                    //     })
                    // }).then(response => {
                    //     return response.json()
                    // }).then(response => {
                    //     if (response.status !== 200) {
                    //         sethasError(true)
                    //         setErrorMessage(response.response)
                    //         console.log(response)
                    //     }
                    // }).catch(error => { throw error })
                } catch (error) {
                    sethasError(true)
                    setErrorMessage(String(error))
                }
            }
            setLoadingMsg("All done")
            setLoading(false)
        }
        if (sheetID) {
            localStorage.setItem('spreadsheetID', sheetID)
            if (!SkipInitialization) {
                updateSheet()
            }
        }
    }, [sheetID, SkipInitialization])


    return (
        Loading ?
            <div className="flex flex-col items-center justify-center space-y-2 h-full" {...props}>
                <div className="w-5 h-5 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
                <p>{LoadingMsg}</p>
            </div>
            :
            hasError ?
                <div className="h-full flex items-center justify-center">
                    <p className="text-center text-red-500">Internal server error. Please contact maintainer. <br />---<br /><strong>{ErrorMessage}</strong></p>
                </div>
                :
                <div className="h-full">
                    <iframe {...props} className="w-full h-full" src={`https://docs.google.com/spreadsheets/d/${sheetID}?single=false&widget=false&headers=false&rm=embedded`}></iframe>
                </div>
    )
}

export default Sheets