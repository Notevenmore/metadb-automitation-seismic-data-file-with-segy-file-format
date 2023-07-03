import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {
  HeaderDivider,
  HeaderInput,
  HeaderTable,
} from '../components/HeaderTable';
import Button from '../components/button';
import Container from '../components/container';
import Input from '../components/input_form/input';
import Sheets from '../components/sheets/sheets';
import TableComponent from '../components/table/table';
import Toast from '../components/toast/toast';
import {saveDocument} from '../components/utility_functions';
import { setErrorMessage } from '../store/generalSlice';

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

  const saveDocumentHandler = async e => {
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
        dispatch
      );
      if (save_result.success) {

        dispatch(setErrorMessage({
          message: 'Record successfully saved',
          color: 'blue',
          show: true,
        }))
          router.events.emit('routeChangeComplete');
        await delay(3000);
        dispatch(setErrorMessage({message: '', color: '', show: false}));
      }
    } catch (error) {
      dispatch(setErrorMessage({
        message: `Failed to save record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
          error,
        )}`,
        color: 'red',
        show: true,
      }));
    }
    router.events.emit('routeChangeComplete');
  };

  useEffect(() => {
    if (spreadsheetReady) {
      setTimeout(async () => {
        dispatch(setErrorMessage({
          message:
            'Please use DD-MM-YYYY format in any date field. You can set the date formatting by going to Format > Number and selecting the correct date format if the field insisted on inputting wrong date format.',
          color: 'blue',
          show: true,
        }));
        await delay(10000);
        dispatch(setErrorMessage({message: '', color: '', show: false}));

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
          path=""
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          onClick={saveDocumentHandler}
          disabled={Message.message || !spreadsheetReady ? true : false}>
          Save changes
        </Button>
        <Button
          path=""
          additional_styles="text-error"
          onClick={router.back}
          disabled={Message.message || !spreadsheetReady ? true : false}>
          Cancel
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
