import {HeaderDivider, HeaderInput, HeaderTable} from '@components/HeaderTable';
import Input from '@components/Input';
import Sheets from '@components/Sheets';
import Button from '@components/button';
import Container from '@components/container';
import TableComponent from '@components/table/table';
import {
  saveDocument,
  sendDeleteSpreadsheet,
  showErrorToast,
} from '@components/utility_functions';
import {UploadDocumentSettings, displayErrorMessage} from '@store/generalSlice';
import {useAppDispatch, useAppSelector} from '@store/index';
import {delay} from '@utils/common';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Save from '../../public/icons/save.svg';

export default function EditNewDocumentPage({setTitle, config}) {
  const router = useRouter();
  const [spreadsheetID, setspreadsheetID] = useState();
  const [workspaceData, setworkspaceData] = useState<UploadDocumentSettings>();
  const [spreadsheetReady, setspreadsheetReady] = useState(false);

  const dispatch = useAppDispatch();
  const upload_document_settings = useAppSelector(
    state => state.general.upload_document_settings,
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
    delay(500).then(() => {
      router.events.emit('routeChangeStart');
    });
  }, [router, setTitle, upload_document_settings]);

  useEffect(() => {
    window.addEventListener('pagehide', () => {
      sendDeleteSpreadsheet(config, spreadsheetID);
    });
    router.events.on('beforeHistoryChange', () => {
      sendDeleteSpreadsheet(config, spreadsheetID);
    });
    return () => {
      window.removeEventListener('pagehide', () => {
        sendDeleteSpreadsheet(config, spreadsheetID);
      });
      router.events.off('beforeHistoryChange', () => {
        sendDeleteSpreadsheet(config, spreadsheetID);
      });
    };
  }, [router, spreadsheetID]);

  const saveDocumentHandler = async (e, redirect = false) => {
    e.preventDefault();
    router.events.emit('routeChangeStart');
    try {
      const save_result = await saveDocument(
        e,
        router,
        config,
        spreadsheetID,
        workspaceData,
        dispatch,
      );
      if (save_result.success) {
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
          setTimeout(() => {
            dispatch(
              displayErrorMessage({
                message: 'Redirecting to homepage...',
                color: 'blue',
                duration: 1500,
              }),
            );
          }, 0);
          await delay(1000);
          router.push('/');
        }
      }
    } catch (error) {
      showErrorToast(dispatch, error);
    }
    router.events.emit('routeChangeComplete');
  };

  useEffect(() => {
    if (spreadsheetReady) {
      router.events.emit('routeChangeComplete');
      setTimeout(() => {
        dispatch(
          displayErrorMessage({
            message:
              'Please input dates using the YYYY-MM-DD format if you are using Google Spreadsheet as the interface. Spreadsheet will convert it to the correct format (DD/MM/YYYY) afterwards. You can set the date formatting by clicking the input column then going to Format > Number in the menu bar.',
            color: 'blue',
            duration: 20000,
          }),
        );
      }, 3000);
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
                <div className="h-750p">
                  <Sheets
                    form_type={router.query.form_type as string}
                    type="new"
                    getSpreadsheetID={setspreadsheetID}
                    finishedInitializing={setspreadsheetReady}
                    config={config}
                    data={undefined}
                  />
                </div>
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
          disabled={!spreadsheetReady ? true : false}>
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
          disabled={!spreadsheetID || !spreadsheetReady ? true : false}>
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
