import { useCallback, useEffect, useRef, useState } from "react"

interface IframeProps extends React.ComponentProps<"iframe"> {
    existingID: "",
    type: "",
    form_type: ""
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
            setsheetID(props.existingID)
            setSkipInitialization(true)
            return;
        }
        const previousID = localStorage.getItem('spreadsheetID')
        if (previousID) {
            await fetch('http://localhost:5000/deleteSpreadsheet', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    spreadsheetID: previousID
                })
            }).catch(error => { throw error })
        }
        const makeTemp = await fetch('http://localhost:5000/createSpreadsheet')
        const spreadsheetID = await makeTemp.json()
        setsheetID(spreadsheetID.response)
        setSkipInitialization(false)
    }, [])
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
            await fetch('http://localhost:5000/updateSpreadsheet/v2', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    type: props.type,
                    form_type: props.form_type,
                    spreadsheetID: sheetID
                })
            }).then(res => {
                console.log(res)
            }).catch(error => { throw error })
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
            <div className="flex flex-col items-center justify-center space-y-2" {...props}>
                <div className="w-5 h-5 border-black border-2 rounded-full border-t-transparent animate-spin"></div>
                <p>{LoadingMsg}</p>
            </div>
            :
            hasError ?
                <p className="text-center text-red-500">Internal server error. Please contact maintainer. <br />---<br /><strong>{ErrorMessage}</strong></p>
                :
                <div className="h-full">
                    <iframe {...props} className="w-full h-full" src={`https://docs.google.com/spreadsheets/d/${sheetID}?single=false&widget=false&headers=false&rm=embedded`}></iframe>
                </div>
    )
}

export default Sheets