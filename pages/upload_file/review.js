import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import Highlight from 'react-highlight';
import Button from '../../components/button';
import Container from '../../components/container/container.js';
import Input from '../../components/input_form/input';
import {
  HeaderTable,
  HeaderDivider,
  HeaderInput,
} from '../../components/header_table/header_table';
import Sheets from '../../components/sheets/sheets';
import Table from '../../components/table/table';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import {ImageEditor} from '../components/highlight_viewer';
import {saveDocument} from '../../components/utility_functions';
import Toast from '../../components/toast/toast';

export default function UploadFileReview({setTitle, config}) {
  const [ReviewData, setReviewData] = useState([]);
  const [ImageReview, setImageReview] = useState('');
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [PageNo, setPageNo] = useState(0);
  const [ImageURL, setImageURL] = useState('');
  const [error, setError] = useState('');
  const [spreadsheetID, setspreadsheetID] = useState('');
  const [loading, setloading] = useState('');
  const [spreadsheetReady, setspreadsheetReady] = useState(false);
  const [workspaceData, setworkspaceData] = useState();

  const router = useRouter();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');

  const files = useSelector(state => state.general.file);
  const review_data = useSelector(state => state.general.review_data);
  const document_summary = useSelector(state => state.general.document_summary);
  const upload_document_settings = useSelector(
    state => state.general.upload_document_settings,
  );

  useEffect(() => {
    setTitle('Review - Upload Document');
  }, []);

  useEffect(() => {
    // ---| NEW WORKFLOW |---
    const init = async () => {
      try {
        setImageURL(
          _ =>
            `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/image/${
              document_summary?.document_id
            }/${PageNo + 1}`,
        );
        setloading(`Reformatting OCR data`);
        let final = [];
        for (let idx = 0; idx < document_summary.body.page_count; idx++) {
          let row = {};
          Object.values(review_data[idx]).map(item => {
            row[item.key.toLowerCase()] = item.value;
          });
          final.push(row);
        }
        setReviewData(final);
        const workspace_data = {
          afe_number: parseInt(upload_document_settings.afe_number),
          workspace_name: upload_document_settings.workspace_name,
          kkks_name: upload_document_settings.kkks_name,
          working_area: upload_document_settings.working_area,
          submission_type: upload_document_settings.submission_type,
          email: 'john.richardson@gtn.id', // TODO: SET THIS TO BE BASED ON THE CURRENTLY LOGGED IN USER
        };
        setworkspaceData(workspace_data);
        setloading('');
      } catch (error) {
        setloading('');
        setError(String(error));
      }
    };
    if (files.length < 1) {
      router.push('/upload_file');
    } else {
      init();
    }

    // ---| OLD WORKFLOW |---
    // check github
  }, []);

  useEffect(() => {
    setImageURL(
      _ =>
        `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/image/${
          document_summary?.document_id
        }/${PageNo + 1}`,
    );
  }, [PageNo]);

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  const saveDocumentHandler = async (e, redirect = false) => {
    router.events.emit('routeChangeStart');
    try {
      const save_result = await saveDocument(
        e,
        router,
        config,
        spreadsheetID,
        workspaceData,
        setMessage,
      );
      if (save_result.success) {
        setMessage({
          message: 'Record successfully saved',
          color: 'blue',
          show: true,
        });
        router.events.emit('routeChangeComplete');
        if (redirect) {
          await delay(1000);
          setMessage({
            message: 'Redirecting to homepage...',
            color: 'blue',
            show: true,
          });
          await delay(1000);
          router.push('/');
        } else {
          await delay(3000);
          setMessage({message: '', color: '', show: false});
        }
      }
    } catch (error) {
      setMessage({
        message: `Failed to save record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
          error,
        )}`,
        color: 'red',
        show: true,
      });
    }
    router.events.emit('routeChangeComplete');
  };

  useEffect(() => {
    if (spreadsheetReady) {
      setTimeout(async () => {
        setMessage({
          message:
            'Please use DD-MM-YYYY format in any date field. You can set the date formatting by going to Format > Number and selecting the correct date format if the field insisted on inputting wrong date format.',
          color: 'blue',
          show: true,
        });
        await delay(10000);
        setMessage({message: '', color: '', show: false});
      }, 3000);
    }
  }, [spreadsheetReady]);

  return error ? (
    <div className="w-full h-full flex flex-col p-10 space-y-4">
      <p className="font-bold text-lg text-red-500">
        Something happened. Please try again or contact administrator/maintainer
        if the problem still persists by giving them the information below:
      </p>
      <Highlight className="html rounded-md border-2">{error}</Highlight>
      <Button path="/" button_description="Go back home" />
    </div>
  ) : workspaceData ? (
    <Container additional_class="full-height relative">
      <Container.Title>
        <div className="-space-y-2">
          <p className="capitalize text-sm font-normal">{path_query}</p>
          <p>Review</p>
        </div>
      </Container.Title>
      <HeaderTable>
        <HeaderInput label1={'Nama KKKS'} label2={'(KKKS Name)'}>
          <Input
            type="text"
            name={'workingArea'}
            placeholder={'Input KKKS name'}
            value={workspaceData.kkks_name}
            required={true}
            additional_styles="w-full"
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
            value={workspaceData.working_area}
            required={true}
            additional_styles="w-full"
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
            value={workspaceData.submission_type}
            required={true}
            additional_styles="w-full"
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
            type="number"
            name={'AFE_Number'}
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
            value={router.query.form_type?.replace(/\_/g, ' ') || 'basin'}
            additional_styles="w-full"
            additional_styles_input="font-semibold capitalize"
            disabled
          />
        </HeaderInput>
      </HeaderTable>
      <div className="pt-3">
        <Table
          header={[
            // eslint-disable-next-line react/jsx-key
            <div className="flex justify-between items-center">
              <p>Data</p>
              {ImageReview ? (
                <Button
                  button_description="Hide image"
                  additional_styles="bg-white"
                  path=""
                  onClick={e => {
                    e.preventDefault();
                    setImageReview('');
                  }}
                />
              ) : (
                <Button
                  button_description="View uploaded picture below"
                  additional_styles="bg-white"
                  path=""
                  onClick={e => {
                    e.preventDefault();
                    setImageReview(ImageURL);
                  }}
                />
              )}
            </div>,
          ]}
          content={[
            [
              // eslint-disable-next-line react/jsx-key
              <div className="h-[750px]">
                {loading && !ReviewData.length >= 1 ? (
                  <div className="flex flex-col items-center justify-center space-y-2 h-full">
                    <div className="w-5 h-5 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
                    <p>{loading}</p>
                  </div>
                ) : (
                  <Sheets
                    type={'review'}
                    form_type={router.query.form_type}
                    data={ReviewData}
                    getSpreadsheetID={setspreadsheetID}
                    finishedInitializing={setspreadsheetReady}
                    config={config}
                  />
                )}
              </div>,
            ],
          ]}
          additional_styles="overflow-hidden"
          additional_styles_row="p-0"
        />
      </div>
      {ImageReview && (
        <div className="pt-3 bg-">
          <Table
            header={[
              // eslint-disable-next-line react/jsx-key
              <div className="flex justify-between items-center">
                <p>Data</p>
                <Button
                  button_description="Hide image"
                  additional_styles="bg-white"
                  path=""
                  onClick={e => {
                    setImageReview('');
                  }}
                />
              </div>,
            ]}
            content={[
              // eslint-disable-next-line react/jsx-key
              [<ImageEditor boundsObserver={() => {}} imageUrl={ImageURL} />],
            ]}
            additional_styles="overflow-hidden"
            additional_styles_row="p-0"
          />
        </div>
      )}
      {document_summary?.body.page_count > 1 && (
        <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full pointer-events-none">
          <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border pointer-events-auto">
            <Button
              path=""
              title="Previous page"
              button_description=""
              additional_styles="bg-white border-2 p-3 hover:bg-gray-200"
              onClick={e => {
                e.preventDefault();
                setPageNo(page_no => {
                  return page_no - 1;
                });
              }}
              disabled={PageNo <= 0 ? true : false}>
              <div className="w-5 h-5">
                <ChevronLeft />
              </div>
            </Button>
            <div
              title="Page number"
              className="bg-white border-2 p-3 cursor-default select-none rounded-lg text-center">
              <p className="w-5 h-5">{PageNo + 1}</p>
            </div>
            <Button
              path=""
              title="Next page"
              button_description=""
              additional_styles="bg-white border-2 p-3 hover:bg-gray-200"
              onClick={e => {
                e.preventDefault();
                setPageNo(page_no => {
                  return page_no + 1;
                });
              }}
              disabled={
                PageNo >= document_summary.body.page_count - 1 ? true : false
              }>
              <div className="w-5 h-5">
                <ChevronRight />
              </div>
            </Button>
          </div>
        </div>
      )}
      <div className="flex space-x-3 py-4">
        <Button
          path=""
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          onClick={saveDocumentHandler}
          disabled={
            !spreadsheetID || Message.message || !spreadsheetReady
              ? true
              : false
          }>
          Save changes
        </Button>
        <Button
          path=""
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          onClick={e => {
            saveDocumentHandler(e, true);
          }}
          disabled={
            !spreadsheetID || Message.message || !spreadsheetReady
              ? true
              : false
          }>
          Save and exit
        </Button>
      </div>
      <Toast message={Message} setmessage={setMessage}>
        {Message.message}
      </Toast>
    </Container>
  ) : (
    <p>Loading...</p>
  );
}

export async function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
