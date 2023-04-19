import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import Button from '../../components/buttons/buttons'
import Sheets from "../../components/sheets/sheets"
import TableComponent from "../../components/table/table"
import Input from "../../components/input_form/input"
import Container from "../../components/container/container"

const DocEditor = ({ spreadsheetID }) => {
    const [IsSaved, setIsSaved] = useState(false)
    const iframe_ref = useRef()
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
        <Container additional_class='space-y-3'>
            <Container.Title back>Edit Document</Container.Title>
            <Input type='text' placeholder='Document title' additional_styles_input='text-xl font-semibold p-3' defaultValue={'Laporan Data 2023'} />
            <TableComponent additional_styles_column="overflow-visible" header={["Header", ""]} content={
                [
                    [<div className="flex space-x-2"><p>Nama KKKS</p><p className="text-gray-400">(KKKS Name)</p></div>, <Input type={"text"} defaultValue="Geodwipa Teknika Nusantara" />],
                    [<div className="flex space-x-2"><p>Nama wilayah kerja</p><p className="text-gray-400">(Working area)</p></div>, <Input type={"text"} defaultValue="Geodwipa Teknika Nusantara" />],
                    [<div className="flex space-x-2"><p>Jenis penyerahan data</p><p className="text-gray-400">(Submission type)</p></div>, <Input type={"dropdown"} dropdown_items={["Quarterly", "Relinquishment", "Termination", "Spec New", "Spec Ext", "Spec Term", "Joint Study", "DIPA"]} />],
                    [<div className="flex space-x-2"><p>Nomor AFE</p><p className="text-gray-400">(AFE number)</p></div>, <Input type={"number"} defaultValue='1' />],
                    [<p className="font-bold">Data type</p>, <Input type={"dropdown"} dropdown_items={["Well data"]} />],
                    [<p className="font-bold">Data classification</p>, <Input type={"dropdown"} dropdown_items={["Report"]} />],
                    [<p className="font-bold">Data sub-classification</p>, <Input type={"dropdown"} dropdown_items={["Printed"]} />]
                ]
            } />
            <div className="h-full">
                <TableComponent header={[
                    <div className="flex justify-between items-center">
                        <p>Data</p>
                    </div>
                ]} content={[
                    [<div className="h-[750px]"><Sheets ref={iframe_ref} type='update' form_type='printed_well_report' /></div>]
                ]} additional_styles_row='p-0' additional_styles="overflow-hidden" />
            </div>
            <div className="flex space-x-2 w-full">
                <Button path="" button_description="Save document" onClick={(e) => { e.preventDefault(); setIsSaved(true) }} />
                <Button path="" button_description="Unsave document" onClick={(e) => { e.preventDefault(); setIsSaved(false) }} />
            </div>
            {/* <p className="bg-black text-white p-2">document saved: {String(IsSaved)}</p> */}
        </Container>
    )
}

export default DocEditor