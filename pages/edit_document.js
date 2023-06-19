/* eslint-disable */
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import Button from '../components/buttons/buttons'
import Sheets from "../components/sheets/sheets"
import TableComponent from "../components/table/table"
import Input from "../components/input_form/input"
import Container from "../components/container/container"

const DocEditor = ({ spreadsheetID }) => {
    const [IsSaved, setIsSaved] = useState(false)
    const warningText
        = 'You have unsaved changes - Are you sure you want to leave this page?'
    // const sheetID = spreadsheetID.response
    const router = useRouter()
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
    // const init = useCallback(async () => {
    //     const previousID = localStorage.getItem('spreadsheetID')
    //     console.log(previousID + " | " + sheetID)
    //     if (previousID) {
    //         await fetch('http://localhost:5000/deleteSpreadsheet', {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 spreadsheetID: previousID
    //             })
    //         })
    //     }
    //     localStorage.setItem('spreadsheetID', sheetID)
    // }, [])
    // useEffect(() => {
    //     if (!spreadsheetID.response){
    //         setIsSaved(true)
    //         router.push('/503')
    //         return;
    //     }
    //     init()
    // }, [init])
    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [IsSaved])
    return (
        // <div className="w-full h-full p-3 space-y-3"></div>
        <Container additional_class='space-y-3'>
            <Container.Title back>Edit Document (DEMO)</Container.Title>
            {/* <p className="text-4xl font-bold">Edit document</p> */}
            {/* <iframe className="w-full h-full" src="https://docs.google.com/spreadsheets/d/1DvODJvgqoVp2Dxvv-0ebWVm65VLIzXD4ir8gULGKK6k/edit?usp=sharing?single=false&widget=false&headers=false&rm=embedded"></iframe> */}
            {/* <iframe className="w-full h-full" src={`https://docs.google.com/spreadsheets/d/${sheetID}?single=false&widget=false&headers=false&rm=embedded`}></iframe> */}
            <Input type='text' placeholder='Document title' additional_styles_input='text-xl font-semibold p-3' />
            <TableComponent additional_styles_column="overflow-visible" header={["Header", ""]} content={
                [
                    [<div key={2} className="flex space-x-2"><p>Nama KKKS</p><p className="text-gray-400">(KKKS Name)</p></div>, <Input type={"text"} defaultValue="Geodwipa Teknika Nusantara" readOnly />],
                    [<div key={3} className="flex space-x-2"><p>Nama wilayah kerja</p><p className="text-gray-400">(Working area)</p></div>, <Input type={"text"} defaultValue="Geodwipa Teknika Nusantara" readOnly />],
                    [<div key={4} className="flex space-x-2"><p>Jenis penyerahan data</p><p className="text-gray-400">(Submission type)</p></div>, <Input type={"dropdown"} dropdown_items={[1, 2, 3]} />],
                    [<div key={5} className="flex space-x-2"><p>Nomor AFE</p><p className="text-gray-400">(AFE number)</p></div>, <Input type={"number"} defaultValue='1' />],
                    [<p key={7} className="font-bold">Data type</p>, <Input type={"dropdown"} dropdown_items={[1, 2, 3]} />],
                    [<p key={8} className="font-bold">Data classification</p>, <Input type={"dropdown"} dropdown_items={[1, 2, 3]} />],
                    [<p key={9} className="font-bold">Data sub-classification</p>, <Input type={"dropdown"} dropdown_items={[1, 2, 3]} />]
                ]
            } />
            {/* <div className="border-2 rounded-md min-h-full">
                <Sheets />
            </div> */}
            <div className="h-full">
                <TableComponent header={[
                    <div className="flex justify-between items-center">
                        <p>Data</p>
                        <Button path="" button_description="Show preview below" additional_styles='bg-gray-100' />
                    </div>
                ]} content={[
                    [<div className="h-[750px]"><Sheets type='new' form_type='basin' /></div>]
                ]} additional_styles_row='p-0' additional_styles="overflow-hidden" />
            </div>
            <div className="flex space-x-2 w-full">
                <Button path="" button_description="Save document" onClick={(e) => { e.preventDefault(); setIsSaved(true) }} />
                <Button path="" button_description="Unsave document" onClick={(e) => { e.preventDefault(); setIsSaved(false) }} />
            </div>
            <p className="bg-black text-white p-2">document saved: {String(IsSaved)}</p>
        </Container>
    )
}

// export async function getServerSideProps(context) {
//     let spreadsheetID;
//     try {
//         const makeTemp = await fetch('http://localhost:5000/createSpreadsheet')
//         spreadsheetID = await makeTemp.json()
//     } catch (error) {
//         spreadsheetID = {response: null}
//     }
//     return {
//         props: { spreadsheetID: spreadsheetID }, // will be passed to the page component as props
//     }
// }

export default DocEditor