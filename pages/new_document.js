import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  HeaderDivider,
  HeaderInput,
  HeaderTable,
} from '../components/HeaderTable';
import Input from '../components/Input';
import Button from '../components/button';
import Container from '../components/container';
import Sheets from '../components/sheets/sheets';
import TableComponent from '../components/table/table';
import {saveDocument} from '../components/utility_functions';
import {setErrorMessage} from '../store/generalSlice';

export default function NewDocumentPage({setTitle, config}) {
  const router = useRouter();
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [spreadsheetID, setspreadsheetID] = useState();
  const [workspaceData, setworkspaceData] = useState();
  const [spreadsheetReady, setspreadsheetReady] = useState(false);

  const dispatch = useDispatch();
  const upload_document_settings = useSelector(
    state => state.general.upload_document_settings,
  );

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  useEffect(() => {
    if (!router.query.form_type) {
      router.push('/');
    } else {
      if (upload_document_settings?.afe_number) {
        setworkspaceData(upload_document_settings);
      }
    }
    setTitle('New document');
  }, []);

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
        setMessage,
        dispatch,
      );
      if (save_result.success) {
        dispatch(
          setErrorMessage({
            message: 'Record successfully saved',
            color: 'blue',
            show: true,
          }),
        );
        router.events.emit('routeChangeComplete');
        if (redirect) {
          await delay(1000);
          setTimeout(async () => {
            dispatch(
              setErrorMessage({
                message: 'Redirecting to homepage...',
                color: 'blue',
                show: true,
              }),
            );
            await delay(1500);
            dispatch(setErrorMessage({show: false}));
            await delay(500);
            dispatch(setErrorMessage({message: '', color: ''}));
          }, 0);
          await delay(1000);
          router.push('/');
        } else {
          await delay(3000);
          dispatch(setErrorMessage({show: false}));
          await delay(500);
          dispatch(setErrorMessage({message: '', color: ''}));
        }
      }
    } catch (error) {
      dispatch(
        setErrorMessage({
          message: `Failed to save record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
            error,
          )}`,
          color: 'red',
          show: true,
        }),
      );
    }
    router.events.emit('routeChangeComplete');
  };

  useEffect(() => {
    if (spreadsheetReady) {
      setTimeout(async () => {
        dispatch(
          setErrorMessage({
            message:
              'Please use DD/MM/YYYY format in any date field. You can set the date formatting by going to Format > Number and selecting the correct date format if the field insisted on inputting wrong date format.',
            color: 'blue',
            show: true,
          }),
        );
        await delay(10000);
        dispatch(setErrorMessage({show: false}));
        await delay(500);
        dispatch(setErrorMessage({message: '', color: ''}));
      }, 3000);
    }
  }, [spreadsheetReady]);

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
            value={router.query.form_type.replace(/\_/g, ' ')}
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
                <div className="h-[750px]">
                  <Sheets
                    form_type={router.query.form_type}
                    type="new"
                    getSpreadsheetID={setspreadsheetID}
                    finishedInitializing={setspreadsheetReady}
                    config={config}
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
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-[200px] justify-center"
          onClick={saveDocumentHandler}
          disabled={Message.message || !spreadsheetReady ? true : false}>
          <div className="flex space-x-2 items-center">
            <svg
              width="18"
              height="18"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M8.6 9H15.4C15.7314 9 16 8.73137 16 8.4V3.6C16 3.26863 15.7314 3 15.4 3H8.6C8.26863 3 8 3.26863 8 3.6V8.4C8 8.73137 8.26863 9 8.6 9Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M6 13.6V21H18V13.6C18 13.2686 17.7314 13 17.4 13H6.6C6.26863 13 6 13.2686 6 13.6Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            <p>Save changes</p>
          </div>
        </Button>
        <Button
          title="Save this record to the database and exit from this page"
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-[200px] justify-center"
          onClick={e => {
            saveDocumentHandler(e, true);
          }}
          disabled={
            !spreadsheetID || Message.message || !spreadsheetReady
              ? true
              : false
          }>
          <div className="flex space-x-2 items-center">
            <svg
              width="18"
              height="18"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M8.6 9H15.4C15.7314 9 16 8.73137 16 8.4V3.6C16 3.26863 15.7314 3 15.4 3H8.6C8.26863 3 8 3.26863 8 3.6V8.4C8 8.73137 8.26863 9 8.6 9Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M6 13.6V21H18V13.6C18 13.2686 17.7314 13 17.4 13H6.6C6.26863 13 6 13.2686 6 13.6Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
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

export async function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
