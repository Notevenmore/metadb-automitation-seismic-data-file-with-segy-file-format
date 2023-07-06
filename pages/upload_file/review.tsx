import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Highlight from 'react-highlight';
import {useDispatch, useSelector} from 'react-redux';
import {ImageEditor} from '../../components/HighlightViewer';
import Button from '../../components/button';
import Container from '../../components/container';
import {
  HeaderDivider,
  HeaderInput,
  HeaderTable,
} from '../../components/HeaderTable';
import Input from '../../components/Input';
import Sheets from '../../components/sheets/sheets';
import Table from '../../components/table/table';
import {saveDocument} from '../../components/utility_functions';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import {DocumentSummary, FileListType, ReviewData, Table as TableType, UploadDocumentSettings, setErrorMessage, setUploadDocumentSettings} from '../../store/generalSlice';
import { RootState } from '../../store';

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

  const dispatch = useDispatch();

  const router = useRouter();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');

  const files = useSelector<RootState, FileListType>(state => state.general.file);
  const review_data = useSelector<RootState, ReviewData>(state => state.general.review_data);
  const document_summary = useSelector<RootState, DocumentSummary>(state => state.general.document_summary);
  const upload_document_settings = useSelector<RootState, UploadDocumentSettings>(
    state => state.general.upload_document_settings,
  );

  useEffect(() => {
    setTitle('Review - Upload Document');
  }, [setTitle]);

  useEffect(() => {
    // ---| NEW WORKFLOW |---
    const init = async () => {
      try {
        setloading(`Reformatting OCR data`);
        await delay(500);
        router.events.emit('routeChangeStart');
        setImageURL(
          `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/image/${
            document_summary?.document_id
          }/${PageNo + 1}`,
        );
        let final = [];
        for (let idx = 0; idx < document_summary.body.page_count; idx++) {
          let row = {};
          Object.values(review_data[idx] as TableType).map(item => {
            row[item.key.toLowerCase()] = item.value;
          });
          final.push(row);
        }
        setReviewData(final);
        setloading('');
      } catch (error) {
        setloading('');
        setError(String(error));
        router.events.emit('routeChangeComplete');
      }
    };
    if (files.length < 1) {
      router.push('/upload_file');
    } else {
      init();
    }

    // ---| OLD WORKFLOW |---
    // check github
  }, [PageNo, document_summary.body.page_count, document_summary?.document_id, files.length, review_data, router]);

  useEffect(() => {
    setImageURL(
      _ =>
        `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/image/${
          document_summary?.document_id
        }/${PageNo + 1}`,
    );
  }, [PageNo, document_summary?.document_id]);

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  const workspaceData = (({afe_number, kkks_name, workspace_name, working_area, submission_type}: UploadDocumentSettings) => ({
    afe_number,
    kkks_name,
    workspace_name,
    working_area,
    submission_type,
    email: "john.richardson@gtn.id"
  }))(upload_document_settings);

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
            dispatch(setErrorMessage({show: false, message: '', color: ''}));
          }, 0);
          await delay(1000);
          router.push('/');
        } else {
          await delay(3000);
          dispatch(setErrorMessage({show: false, message: '', color: ''}));
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
      router.events.emit('routeChangeComplete');
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
        dispatch(setErrorMessage({show: false, message: '', color: ''}));
      }, 3000);
    }
  }, [dispatch, router.events, spreadsheetReady]);

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
              setUploadDocumentSettings({
                ...workspaceData,
                kkks_name: e.target.value
              })
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
              setUploadDocumentSettings({
                ...workspaceData,
                working_area: e.target.value
              })
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
              setUploadDocumentSettings({
                ...workspaceData,
                submission_type: e.target.value
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
            value={(router.query.form_type as string)?.replace(/\_/g, ' ') || 'basin'}
            additional_styles="w-full"
            additional_styles_input="font-semibold capitalize"
            disabled
          />
        </HeaderInput>
      </HeaderTable>
      <div className="pt-3">
        <Table
          header={[
            <div className="flex justify-between items-center" key={1}>
              <p>Data</p>
              {ImageReview ? (
                <Button
                  button_description="Hide image"
                  additional_styles="bg-white"
                  onClick={e => {
                    e.preventDefault();
                    setImageReview('');
                  }}
                />
              ) : (
                <Button
                  button_description="View uploaded picture below"
                  additional_styles="bg-white"
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
              <div className="h-[750px]" key={1}>
                {loading && !(ReviewData.length >= 1) ? (
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
              <div className="flex justify-between items-center" key={1}>
                <p>Data</p>
                <Button
                  button_description="Hide image"
                  additional_styles="bg-white"
                  onClick={e => {
                    setImageReview('');
                  }}
                />
              </div>,
            ]}
            content={[
              [<ImageEditor key={1} boundsObserver={() => {}} imageUrl={ImageURL} />],
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
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-[200px] justify-center"
          onClick={saveDocumentHandler}
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
            <p>Save changes</p>
          </div>
        </Button>
        <Button
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
    <p>Loading...</p>
  );
}

export async function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
