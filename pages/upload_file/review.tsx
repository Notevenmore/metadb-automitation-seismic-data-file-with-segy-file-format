import Sheets from '@components/Sheets';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Highlight from 'react-highlight';
import {
  HeaderDivider,
  HeaderInput,
  HeaderTable,
} from '../../components/HeaderTable';
import {ImageEditor} from '../../components/HighlightViewer';
import Input from '../../components/Input';
import Button from '../../components/button';
import Container from '../../components/container';
import Table from '../../components/table/table';
import {
  changePage,
  changePageTimeout,
  init_data,
  saveDocument,
} from '../../components/utility_functions';
import {TableType} from '../../constants/table';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import Save from '../../public/icons/save.svg';
import {useAppDispatch, useAppSelector} from '../../store';
import {
  UploadDocumentSettings,
  displayErrorMessage,
  setUploadDocumentSettings,
} from '../../store/generalSlice';
import {delay} from '../../utils/common';

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
  // const [workspaceData, setworkspaceData] = useState<UploadDocumentSettings>();

  const dispatch = useAppDispatch();

  const router = useRouter();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');

  const files = useAppSelector(state => state.general.file);
  const review_data = useAppSelector(state => state.general.review_data);
  const document_summary = useAppSelector(
    state => state.general.document_summary,
  );
  const upload_document_settings = useAppSelector(
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
        let record_data: any[],
          final = [];
        console.log(upload_document_settings);
        if (upload_document_settings.afe_exist) {
          const existing = await init_data(config, router, {
            afe_number: upload_document_settings.afe_number,
          });
          record_data = existing.data_content;
          console.log(record_data);
          final.push(...record_data);
        }
        let row = {};
        Object.values(review_data as TableType).map(item => {
          row[item.key.toLowerCase()] = item.value;
        });
        final.push(row);
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
      if (ReviewData.length === 0) {
        init();
      }
    }

    // ---| OLD WORKFLOW |---
    // check github
  }, [
    PageNo,
    document_summary?.body.page_count,
    document_summary?.document_id,
    files.length,
    review_data,
    router,
  ]);

  useEffect(() => {
    changePage(document_summary, setImageURL, PageNo);
  }, [PageNo, document_summary?.document_id]);

  const workspaceData = (({
    afe_number,
    kkks_name,
    workspace_name,
    working_area,
    submission_type,
  }: UploadDocumentSettings) => ({
    afe_number,
    kkks_name,
    workspace_name,
    working_area,
    submission_type,
    email: 'john.richardson@gtn.id',
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
      }
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
            'Please input dates using the YYYY-MM-DD format if you are using Google Spreadsheet as the interface. Spreadsheet will convert it to the correct format (DD/MM/YYYY) afterwards. You can set the date formatting by clicking the input column then going to Format > Number in the menu bar.',
          color: 'blue',
          duration: 20000,
        }),
      );
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
                kkks_name: e.target.value,
              })
            }
            disabled
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
                working_area: e.target.value,
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
            value={
              (router.query.form_type as string)?.replace(/\_/g, ' ') || 'basin'
            }
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
              <div className="h-750p" key={1}>
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
              [
                <ImageEditor
                  key={1}
                  boundsObserver={() => {}}
                  imageUrl={ImageURL}
                />,
              ],
            ]}
            additional_styles="overflow-hidden"
            additional_styles_row="p-0"
          />
        </div>
      )}
      {document_summary?.body.page_count > 1 && ImageReview && (
        <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full pointer-events-none">
          <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border pointer-events-auto">
            <Button
              title="Previous page"
              button_description=""
              additional_styles="bg-white border-2 p-2 hover:bg-gray-200"
              onClick={e => {
                e.preventDefault();
                setPageNo(page_no => {
                  return page_no - 1;
                });
              }}
              disabled={
                PageNo <= 0 || !spreadsheetID || !spreadsheetReady
                  ? true
                  : false
              }>
              <div className="w-5 h-5">
                <ChevronLeft />
              </div>
            </Button>
            <div
              title="Page number"
              className="bg-white border-2 p-2 cursor-default select-none rounded-lg text-center">
              <section className="h-5 w-28 flex items-center justify-center">
                {!spreadsheetID || !spreadsheetReady ? (
                  <div className="h-5 w-5 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
                ) : (
                  <Input
                    type="number"
                    value={PageNo + 1}
                    onChange={e => {
                      const page = parseInt(e.target.value) - 1;
                      if (
                        page < 0 ||
                        page > document_summary.body.page_count - 1
                      ) {
                        return;
                      }
                      setPageNo(page);
                    }}
                    additional_styles_input="p-0 focus:bg-white bg-white hover:bg-white focus:outline-transparent text-center [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  />
                )}
              </section>
            </div>
            <Button
              title="Next page"
              button_description=""
              additional_styles="bg-white border-2 p-2 hover:bg-gray-200"
              onClick={e => {
                e.preventDefault();
                setPageNo(page_no => {
                  return page_no + 1;
                });
              }}
              disabled={
                PageNo >= document_summary.body.page_count - 1 ||
                !spreadsheetID ||
                !spreadsheetReady
                  ? true
                  : false
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
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p justify-center"
          onClick={saveDocumentHandler}
          disabled={
            !spreadsheetID || Message.message || !spreadsheetReady
              ? true
              : false
          }>
          <div className="flex space-x-2 items-center">
            <Save className="w-4 h-4" />
            <p>Save changes</p>
          </div>
        </Button>
        <Button
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p justify-center"
          onClick={e => {
            saveDocumentHandler(e, true);
          }}
          disabled={
            !spreadsheetID || Message.message || !spreadsheetReady
              ? true
              : false
          }>
          <div className="flex space-x-2 items-center">
            <Save className="w-4 h-4" />
            <p>Save and exit</p>
          </div>
        </Button>
      </div>
    </Container>
  ) : (
    <p>Loading...</p>
  );
}

export function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
