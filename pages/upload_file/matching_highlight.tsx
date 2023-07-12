import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Highlight from 'react-highlight';
import {HeaderDivider, HeaderTable} from '../../components/HeaderTable';
import {ImageEditor, Tuple4} from '../../components/HighlightViewer';
import Input from '../../components/Input';
import Button from '../../components/button';
import Container from '../../components/container';
import {TableRow} from '../../constants/table';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import CloseThin from '../../public/icons/close-thin.svg';
import {getHeader} from '../../services/document';
import {
  extractTextFromBounds,
  fetchDocumentSummary,
  generateImageUrl,
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

export default function MatchingGuided({config, setTitle}) {
  const [state, setState] = useState({} as any);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [pageNo, setPageNo] = useState(1);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [docId, _setDocId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formType, setformType] = useState('');

  // utility states
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const files = useAppSelector(state => state.general.file);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');

  const prevPage = () => {
    if (pageNo > 1) {
      setPageNo(oldPageNo => oldPageNo - 1);
    }
  };

  const nextPage = () => {
    if (pageNo < totalPageNo) {
      setPageNo(oldPageNo => oldPageNo + 1);
    }
  };

  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (router.query.form_type) {
      setformType(String(router.query.form_type));
    }
  }, [router]);

  useEffect(() => {
    setTitle('Data Matching | Highlight');
    const init = async () => {
      setLoading('Reading data... Please wait for a moment');
      await delay(500);
      router.events.emit('routeChangeStart');
      if (files.length < 1) {
        router.push('/upload_file');
      } else {
        try {
          const file = files[0];
          const imageBase64Str = await toBase64(file);
          const uploadResponse = await uploadImage(imageBase64Str);
          if (uploadResponse.status === 'failed') {
            throw new Error(
              `Upload image failed, please try again or contact administrator/maintainer if the problem still persists. ${uploadResponse.body}`,
            );
          }
          const {doc_id: docId} = uploadResponse.body;
          setDocId(docId);
          setImageUrl(_ => generateImageUrl(docId, pageNo));
          const summaryResponse = await fetchDocumentSummary(docId);
          if (summaryResponse.status !== 'success') {
            throw new Error(
              `Something happened with the OCR service, please contact administrator and/or maintainer. ${summaryResponse.body}`,
            );
          }

          setTotalPageNo(summaryResponse.body.page_count);
          dispatch(
            setDocumentSummary({...summaryResponse, document_id: docId}),
          );
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
          let temp_obj = {};
          for (let idx = 0; idx < summaryResponse.body.page_count; idx++) {
            let temp = [];
            row_names.response.forEach((row_name, index) => {
              temp.push({
                id: index,
                key: row_name.toLowerCase(),
                value: null,
              });
            });
            temp_obj[idx] = temp;
          }
          setState(temp_obj);
          setLoading(null);
        } catch (error) {
          setError(String(error));
          setLoading(null);
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
  }, [config, dispatch, files, pageNo, router, router.isReady, setTitle]);

  useEffect(() => {
    // save the edited state to redux for final review later
    dispatch(setReviewData(state));
  }, [dispatch, state]);

  function boundsObserver(bounds: Tuple4<number>[]) {
    if (bounds.length === 0) return;
    if (selectedRow === -1) return;
    const last = bounds.length - 1;
    const bound = bounds[last];
    extractTextFromBounds(docId, pageNo, bound).then((response) => {
      if (response.status === 'success') {
        setValueForId(setState, pageNo, selectedRow, response.body.word);
      }
    });
  }

  const setDocId = (newDocId: string) => {
    _setDocId(newDocId);
  };

  function clickRow(dataId: number) {
    setSelectedRow(_ => dataId);
  }

  const toRowComponent = (data: TableRow) => (
    <div
      key={data.id}
      className={
        (selectedRow === data.id ? 'underline' : '') + ' cursor-pointer'
      }>
      <HeaderDivider additional_styles="border-gray-300" />
      <div
        onClick={_ => clickRow(data.id)}
        className={
          (selectedRow === data.id ? 'underline' : '') +
          ' w-full cursor-pointer py-2.5 grid grid-cols-[1fr_auto] items-center space-x-2'
        }>
        <Input
          type="text"
          label={data.key
            .replace(/\_/g, ' ')
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')}
          label_loc="beside"
          value={data.value || ''}
          title={data.value || ''}
          placeholder="Highlighted text will show up here"
          additional_styles_input="overflow-ellipsis placeholder:text-gray-400"
          additional_styles_label={`${
            selectedRow === data.id ? 'font-bold' : 'font-semibold'
          } cursor-pointer`}
          additional_styles="min-w-0 cursor-pointer"
          onChange={e =>
            setValueForId(setState, pageNo, data.id, e.target.value)
          }
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

  return loading ? (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
      <p className="text-xl font-semibold text-gray-500">{loading}</p>
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
          <p>Data Matching - Highlight</p>
        </div>
      </Container.Title>
      <div className="grid grid-cols-2 gap-2 border-[2px] rounded-lg p-2">
        <HeaderTable>{state[pageNo - 1]?.map(toRowComponent)}</HeaderTable>
        <ImageEditor
          boundsObserver={boundsObserver}
          imageUrl={generateImageUrl(docId, pageNo)}
        />
      </div>
      {totalPageNo > 1 && (
        <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full pointer-events-none">
          <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border pointer-events-auto">
            <Button
              path=""
              title="Previous page"
              button_description=""
              additional_styles="bg-white border-2 p-3 hover:bg-gray-200"
              onClick={prevPage}
              disabled={!(pageNo > 1)}>
              <div className="w-5 h-5">
                <ChevronLeft />
              </div>
            </Button>
            <Button
              path=""
              title=""
              button_description=""
              className="bg-white border-2 p-3 cursor-default select-none text-center rounded-lg">
              <p className="w-5 h-5">{pageNo}</p>
            </Button>
            <Button
              path=""
              title="Next page"
              button_description=""
              additional_styles="bg-white border-2 p-3 hover:bg-gray-200"
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
      <div
        className={`flex items-center space-x-2 fixed top-5 left-1/2 translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${
          error ? '' : '-translate-y-20'
        }`}>
        <p>{error}</p>
        <Button
          additional_styles="px-1 py-1 text-black"
          path=""
          onClick={() => {
            setError('');
          }}>
          <CloseThin className="w-5 h-5" />
        </Button>
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
