import {HeaderDivider, HeaderInput, HeaderTable} from '@components/HeaderTable';
import Input from '@components/Input';
import TableEditor from '@components/TableEditor';
import Button from '@components/button';
import Container from '@components/container';
import TableComponent from '@components/table/table';
import {UploadDocumentSettings, displayErrorMessage} from '@store/generalSlice';
import {useAppDispatch, useAppSelector} from '@store/index';
import {delay} from '@utils/common';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useTableEditor} from '../../hooks/useTableEditor';
import Save from '../../public/icons/save.svg';

export default function TableNewDocumentPage({setTitle}) {
  const router = useRouter();
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [workspaceData, setworkspaceData] = useState<UploadDocumentSettings>();
  const [spreadsheetReady, setspreadsheetReady] = useState(false);

  const dispatch = useAppDispatch();
  const upload_document_settings = useAppSelector(
    state => state.general.upload_document_settings,
  );

  const {finalData, finalColumns, tableRef, tableOptions, sendData, getRow} =
    useTableEditor(
      setspreadsheetReady,
      upload_document_settings.afe_number,
      workspaceData,
    );

  useEffect(() => {
    if (!router.query.form_type) {
      router.push('/');
    } else {
      if (upload_document_settings?.afe_number) {
        setworkspaceData(upload_document_settings);
      }
    }
    setTitle('New document');

    router.events.emit('routeChangeStart');
  }, [router, setTitle, upload_document_settings]);

  const saveDocumentHandler = async (e, redirect = false) => {
    e.preventDefault();
    router.events.emit('routeChangeStart');
    try {
      sendData(finalData);

      dispatch(
        displayErrorMessage({
          message: 'Record successfully saved',
          color: 'blue',
          duration: 3000,
        }),
      );
      router.events.emit('routeChangeComplete');
      if (redirect) {
        await delay(1000);
        dispatch(
          displayErrorMessage({
            message: 'Redirecting to homepage...',
            color: 'blue',
            duration: 1500,
          }),
        );

        await delay(1000);
        router.push('/');
      }

      await delay(1000);
      getRow(workspaceData);
    } catch (error) {
      dispatch(
        displayErrorMessage({
          message: `Failed to save record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
            error,
          )}`,
          color: 'red',
          duration: 5000,
        }),
      );
    }
    router.events.emit('routeChangeComplete');
  };

  useEffect(() => {
    if (spreadsheetReady) {
      router.events.emit('routeChangeComplete');
      dispatch(
        displayErrorMessage({
          message:
            'Please use DD/MM/YYYY format in any date field. You can set the date formatting by going to Format > Number and selecting the correct date format if the field insisted on inputting wrong date format.',
          color: 'blue',
          duration: 10000,
        }),
      );
    }
  }, [dispatch, router.events, spreadsheetReady]);

  return workspaceData ? (
    <Container additional_class="full-height relative">
      <Container.Title back>
        <p>New record</p>
      </Container.Title>
      <HeaderTable>
        <HeaderInput label1={'Nama KKKS'} label2={'(KKKS Name)'}>
          <Input
            type="text"
            name={'workingArea'}
            placeholder={'Input KKKS name'}
            required={true}
            additional_styles="w-full"
            value={workspaceData.kkks_name}
            disabled
            onChange={e =>
              setworkspaceData({...workspaceData, kkks_name: e.target.value})
            }
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput label1={'Nama wilayah kerja'} label2={'(Working Area)'}>
          <Input
            type="text"
            name={'workingArea'}
            placeholder={'Input working area'}
            required={true}
            additional_styles="w-full"
            value={workspaceData.working_area}
            onChange={e =>
              setworkspaceData({...workspaceData, working_area: e.target.value})
            }
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput
          label1={'Jenis penyerahan data'}
          label2={'(Submission Type)'}>
          <Input
            type="dropdown"
            name={'submissionType'}
            placeholder={'Select a submission type'}
            dropdown_items={[
              'Quarterly',
              'Relinquishment',
              'Termination',
              'Spec New',
              'Spec Ext',
              'Spec Term',
              'Joint Study',
              'DIPA',
            ]}
            required={true}
            additional_styles="w-full"
            value={workspaceData.submission_type}
            onChange={e =>
              setworkspaceData({
                ...workspaceData,
                submission_type: e.target.value,
              })
            }
            withSearch
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput label1={'Nomor AFE'} label2={'(AFE Number)'}>
          <Input
            type="text"
            name={'AFE_Number'}
            placeholder={'1'}
            required={true}
            value={workspaceData.afe_number}
            additional_styles="w-full"
            disabled
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput label1={'Data type'}>
          <Input
            type="text"
            name={'dataType'}
            value={(router.query.form_type as string).replace(/\_/g, ' ')}
            additional_styles="w-full"
            additional_styles_input="font-semibold capitalize"
            disabled
          />
        </HeaderInput>
      </HeaderTable>
      <div className="pt-3">
        <TableComponent
          header={['Data']}
          content={[
            [
              workspaceData && router.query.form_type ? (
                <TableEditor
                  data={finalData}
                  columns={finalColumns}
                  tableRef={tableRef}
                  options={tableOptions}
                  hideButton={true}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                  <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
                  <p className="text-xl font-semibold text-gray-500">
                    Waiting for initialization process to finish
                  </p>
                </div>
              ),
            ],
          ]}
          additional_styles="overflow-hidden"
          additional_styles_row="p-0"
        />
      </div>
      <div className="flex space-x-2 py-10">
        <Button
          title="Save this record to the database"
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p justify-center"
          onClick={saveDocumentHandler}
          disabled={Message.message || !spreadsheetReady ? true : false}>
          <div className="flex space-x-2 items-center">
            <Save className="w-4 h-4" />
            <p>Save changes</p>
          </div>
        </Button>
        <Button
          title="Save this record to the database and exit from this page"
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p justify-center"
          onClick={e => {
            saveDocumentHandler(e, true);
          }}
          disabled={Message.message || !spreadsheetReady ? true : false}>
          <div className="flex space-x-2 items-center">
            <Save className="w-4 h-4" />
            <p>Save and exit</p>
          </div>
        </Button>
      </div>
    </Container>
  ) : (
    <div className="h-full flex flex-col justify-center border-collapse space-y-5 overflow-auto">
      <div className="flex p-5 space-y-5 flex-col items-center overflow-auto">
        <h1 className="font-bold text-3xl text-center">Information</h1>
        <p className="text-center">
          Page reload or manual address input detected. If you accidentally
          reload this page or something forced you to reload this page, you can
          go to the record list of the data type you have just entered. The
          record along with its details you have just inputted will be there.
          You can add data relating to the record there afterwards.
        </p>
        <Button
          onClick={e => {
            e.preventDefault();
            router.push('/');
          }}>
          Go home
        </Button>
      </div>
    </div>
  );
}
