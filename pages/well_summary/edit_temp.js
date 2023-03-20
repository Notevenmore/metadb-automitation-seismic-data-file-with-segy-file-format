import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import Button from '../../components/buttons/buttons'
import Sheets from "../../components/sheets/sheets"
import TableComponent from "../../components/table/table"
import Input from "../../components/input_form/input"
import Container from "../../components/container/container"

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
    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
        };
    }, [IsSaved])
    return (
        <Container additional_class='space-y-3'>
            <Container.Title back>Edit Document</Container.Title>
            <Input type='text' placeholder='Document title' additional_styles_input='text-xl font-semibold p-3' defaultValue={'Lorem ipsum'} />
            <TableComponent additional_styles_column="overflow-visible" header={["Header", ""]} content={
                [
                    [<div className="flex space-x-2"><p>Nama KKKS</p><p className="text-gray-400">(KKKS Name)</p></div>, <p>Kangean Energy Indonesia</p>],
                    [<div className="flex space-x-2"><p>Nama wilayah kerja</p><p className="text-gray-400">(Working area)</p></div>, <p>Kangean Energy Indonesia</p>],
                    [<div className="flex space-x-2"><p>Jenis penyerahan data</p><p className="text-gray-400">(Submission type)</p></div>, <p>Quarterly</p>],
                    [<div className="flex space-x-2"><p>Nomor AFE</p><p className="text-gray-400">(AFE number)</p></div>, <p>2023</p>],
                    [<p className="font-semibold">Data type</p>, <p>Well summary</p>],
                    [<p className="font-semibold">Data classification</p>, <p>Report</p>],
                    [<p className="font-semibold">Data sub-classification</p>, <p>Printed</p>]
                ]
            } />
            <div className="h-full">
                <TableComponent header={[
                    <div className="flex justify-between items-center">
                        <p>Data</p>
                    </div>
                ]} content={[
                    [<div className="h-[750px]"><Sheets existingID='1gT18bQYG2ZRSS3mW1paHSn012L917jAuUDweXBGQdWc' /></div>]
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

export default DocEditor