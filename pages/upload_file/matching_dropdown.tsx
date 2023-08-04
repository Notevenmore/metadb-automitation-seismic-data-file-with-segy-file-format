import {useRouter} from 'next/router';
import {useCallback, useEffect, useRef, useState} from 'react';
import Highlight from 'react-highlight';
import {HeaderDivider, HeaderTable} from '../../components/HeaderTable';
import {ImageEditor} from '../../components/HighlightViewer';
import Input from '../../components/Input';
import Button from '../../components/button';
import Container from '../../components/container';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import CloseThin from '../../public/icons/close-thin.svg';
import {getHeader} from '../../services/document';
import {
  fetchDocumentSummary,
  generateImageUrl,
  postScrapeAnnotate,
  uploadImage,
} from '../../services/ocr';
import {useAppDispatch, useAppSelector} from '../../store';
import {
  displayErrorMessage,
  setDocumentSummary,
  setReviewData,
} from '../../store/generalSlice';
import {toBase64} from '../../utils/base64';
import {delay} from '../../utils/common';
import {setValueForId} from '../../utils/document';

export default function MatchReview({config, setTitle}) {
  const [state, setState] = useState([]);
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [imageBase64Str, setImageBase64Str] = useState('');
  const [docId, _setDocId] = useState(null);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [Loading, setLoading] = useState('');
  const [formType, setformType] = useState('');
  const [error, setError] = useState('');

  const inputFileRef = useRef(null);

  const files = useAppSelector(state => state.general.file);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');

  const setDocId = useCallback((newDocId: string) => {
    _setDocId(id => {
      if (id === null) {
        return newDocId;
      }
      return id;
    });
  }, []);

  const nextPage = () => {
    if (pageNo < totalPageNo) {
      setPageNo(oldPageNo => oldPageNo + 1);
    }
  };

  useEffect(() => {
    if (router.query.form_type) {
      setformType(String(router.query.form_type));
    }
  }, [router]);

  useEffect(() => {
    if (docId === null) return;
    setImageBase64Str(_ => generateImageUrl(docId, pageNo));
    postScrapeAnnotate(docId, pageNo).then(responseWords => {
      if (responseWords.status === 'success') {
        setDropDownOptions(_ => responseWords.body.words);
      }
    });
  }, [docId, pageNo]);

  const prevPage = () => {
    if (pageNo > 1) {
      setPageNo(oldPageNo => oldPageNo - 1);
    }
  };

  useEffect(() => {
    setTitle('Data Matching | Dropdown');
    const init = async () => {
      setLoading('Reading data... Please wait for a moment');
      await delay(500);
      router.events.emit('routeChangeStart');
      if (files.length < 1) {
        router.push('/upload_file');
        return;
      } else {
        try {
          const file = files[0];
          const imageBase64Str = await toBase64(file);

          setLoading('Uploading document...');
          const uploadResponse = await uploadImage(imageBase64Str);
          if (uploadResponse.status === 'failed' || !uploadResponse.body) {
            throw 'Something went wrong with the OCR service. Response body returned null on file upload.';
          }
          const {doc_id: docId} = uploadResponse.body;

          setLoading("Getting uploaded document's summary...");
          const summaryResponse = await fetchDocumentSummary(docId);
          if (
            summaryResponse.status !== 'success' ||
            !summaryResponse.body.page_count
          ) {
            throw 'Something went wrong with the OCR service. Response body returned null on document summary.';
          }
          setTotalPageNo(_ => summaryResponse.body.page_count);
          dispatch(
            setDocumentSummary({...summaryResponse, document_id: docId}),
          );
          setDocId(docId);

          setLoading(
            `Getting appropriate properties for data type ${router.query.form_type}`,
          );
          const row_names = await getHeader(
            config,
            router.query?.form_type as string,
          );

          setLoading(
            `Setting appropriate properties for data type ${router.query.form_type}`,
          );
          let temp = [];
          row_names.response.forEach((row_name, index) => {
            temp.push({
              id: index,
              key: row_name.toLowerCase(),
              value: '',
            });
          });
          setState(temp);
          setLoading('');
        } catch (error) {
          setError(String(error));
          setLoading('');
        }
      }
      router.events.emit('routeChangeComplete');
      setLoading('');
      dispatch(
        displayErrorMessage({
          message:
            'Make sure you have inputted all of the data correctly before proceeding to view them in the spreadsheet.',
          color: 'blue',
          duration: 5000,
        }),
      );
    };
    if (router.isReady) {
      init();
    }
  }, [config, dispatch, files, router, setDocId, setTitle]);

  useEffect(() => {
    localStorage.setItem('reviewUploadedImage', imageBase64Str);
  }, [imageBase64Str]);

  const handleUploadButtonClick = _ => {
    inputFileRef.current.click();
  };

  const handleChangeUploadFile = async e => {
    const files = e.target.files;
    if (files !== null) {
      const file = files[0];
      const imageBase64Str = await toBase64(file);
      const result = await postScrapeAnnotate(imageBase64Str, pageNo);
      console.log(result);

      if (result.status === 'success') {
        setImageBase64Str(_ => result.body.base64str);
        setDropDownOptions(_ => result.body.dropdown);
      }
    } else {
    }
  };

  // TODO CHANGE THIS TO USE REDUX
  useEffect(() => {
    console.log(state);
    dispatch(setReviewData(state));
  }, [dispatch, state]);

  const toRowComponent = data => (
    <div key={data.id}>
      <HeaderDivider additional_styles="border-gray-300" />
      <div className="py-2.5 grid grid-cols-[1fr_auto] items-center space-x-2">
        <Input
          type="dropdown"
          label={data.key
            .replace(/\_/g, ' ')
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')}
          label_loc="beside"
          value={data.value}
          name={'submissionType'}
          placeholder={'Selected data will be shown here'}
          dropdown_items={dropDownOptions}
          required={true}
          additional_styles="w-full"
          additional_styles_input_dropdown="placeholder:text-gray-400"
          onChange={e =>
            setValueForId(setState, pageNo, data.id, e.target.value)
          }
          withSearch
        />
        <Button
          additional_styles="px-1 py-1 text-black hover:bg-red-500 hover:text-white"
          title="Reset input"
          disabled={!data.value}
          onClick={() => {
            setValueForId(setState, pageNo, data.id, '');
          }}>
          <CloseThin className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  // TODO FIX THIS WORKFLOW TO INCLUDE MULTIPLE PAGES AND INTERACTIVE DOCUMENT VIEWER
  // DONE

  return Loading ? (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
      <p className="text-xl font-semibold text-gray-500">{Loading}</p>
    </div>
  ) : error ? (
    <div className="w-full h-full flex flex-col p-10 space-y-4">
      <p className="font-bold text-lg text-red-500">
        Something happened. Please try again or contact administrator/maintainer
        if the problem still persists by giving them the information below:
      </p>
      <Highlight className="html rounded-md border-2">{error}</Highlight>
      <Button
        path=""
        button_description="Back"
        onClick={() => {
          router.back();
        }}
      />
    </div>
  ) : (
    <Container additional_class="full-height relative">
      <Container.Title back>
        <div className="-space-y-2">
          <p className="capitalize text-sm font-normal">{path_query}</p>
          <p>Data Matching - Dropdown</p>
        </div>
      </Container.Title>
      <div className="grid grid-cols-2 gap-2 border-2 rounded-lg p-2">
        <HeaderTable>
          {state.map(toRowComponent)}
          <HeaderDivider />
        </HeaderTable>
        <div className="h-[calc(100vh-55px)] sticky top-0 grid grid-cols-1 rounded-lg overflow-clip">
          <ImageEditor boundsObserver={() => {}} imageUrl={imageBase64Str} />
        </div>
      </div>
      <input
        accept="image/*"
        style={{display: 'none'}}
        ref={inputFileRef}
        type="file"
        hidden
        onChange={handleChangeUploadFile}
      />
      {totalPageNo > 1 && (
        <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full pointer-events-none">
          <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border pointer-events-auto">
            <Button
              path=""
              title="Previous page"
              button_description=""
              additional_styles="bg-white border-2 p-2 hover:bg-gray-200"
              onClick={prevPage}
              disabled={!(pageNo > 1)}>
              <div className="w-5 h-5">
                <ChevronLeft />
              </div>
            </Button>
            <div
              title="Page number"
              className="bg-white border-2 p-2 w-28 cursor-default select-none rounded-lg text-center flex items-center justify-center">
              <section className="h-5 w-28 flex items-center justify-center">
                <Input
                  type="number"
                  value={pageNo}
                  onChange={e => {
                    const page = parseInt(e.target.value);
                    if (page < 1 || page > totalPageNo) {
                      return;
                    }
                    setPageNo(page);
                  }}
                  additional_styles_input="p-0 focus:bg-white bg-white hover:bg-white focus:outline-transparent text-center [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                />
              </section>
            </div>
            <Button
              path=""
              title="Next page"
              button_description=""
              additional_styles="bg-white border-2 p-2 hover:bg-gray-200"
              onClick={nextPage}
              disabled={pageNo >= totalPageNo}>
              <div className="w-5 h-5">
                <ChevronRight />
              </div>
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center w-full py-4">
        <Button
          button_description="View on sheets"
          path="/upload_file/review"
          query={{form_type: formType}}
          additional_styles="px-20 bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          disabled={!formType}
          onClick={() => {
            dispatch(setReviewData(state));
          }}
        />
      </div>
    </Container>
  );
}

export function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
