import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import Highlight from 'react-highlight';
import {parseCookies} from 'nookies';
import Container from '../../components/container/container';
import {
  HeaderTable,
  HeaderDivider,
} from '../../components/header_table/header_table';
import Button from '../../components/button';
import {ImageEditor, Tuple4} from '../components/highlight_viewer';
import {setDocumentSummary, setReviewData} from '../../store/generalSlice';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import Input from '../../components/input_form/input';
import Toast from '../../components/toast/toast';

interface TableRow {
  id: number;
  key: string;
  value: string | null;
}

export const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString());
    reader.onerror = error => reject(error);
  });

async function extractTextFromBounds(
  doc_id: string,
  page_no: number,
  bound: Tuple4<number>,
) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `Bearer ${JSON.parse(parseCookies().user_data).access_token}`,
  );
  var raw = JSON.stringify({
    bounds: bound,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/scrape-bounds/${doc_id}/${page_no}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
}

const uploadImage = async (imageBase64Str: string) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `Bearer ${JSON.parse(parseCookies().user_data).access_token}`,
  );

  var raw = JSON.stringify({
    base64str: imageBase64Str,
  });

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/upload/base64`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: e};
  }
};

const fetchDocumentSummary = async (docId: string) => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/summary/${docId}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: e};
  }
};

const generateImageUrl = (docId: string, page: number) => {
  return `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/image/${docId}/${page}`;
};

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
  const [message, setMessage] = useState({
    message: '',
    color: '',
    show: false,
  });
  const [error, setError] = useState('');

  // @ts-ignore
  const files = useSelector(state => state.general.file);
  const router = useRouter();
  const dispatch = useDispatch();
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

  // Page change use effect
  useEffect(() => {
    const onPageChange = async () => {
      if (docId === null) return;
    };
    onPageChange();
  }, [pageNo]);

  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (router.query.form_type) {
      setformType(String(router.query.form_type));
    }
  }, [router]);

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  useEffect(() => {
    setTitle('Data Matching | Highlight');
    const init = async () => {
      router.events.emit('routeChangeStart');
      setLoading('Reading data... Please wait for a moment');
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
          const row_names = await fetch(
            `${config.services.sheets}/getHeaders`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${
                  JSON.parse(parseCookies().user_data).access_token
                }`,
              },
              // TODO change form_type to be dynamic later
              // FINISHED
              body: JSON.stringify({
                form_type: router.query?.form_type || 'basin',
              }),
            },
          )
            .then(response => {
              return response.json();
            })
            .catch(error => {
              throw error;
            });

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
        }
      }
      router.events.emit('routeChangeComplete');
      setLoading(null);
      setTimeout(() => {
        setMessage({
          message:
            'Make sure you have inputted all of the data correctly before proceeding to view them in the spreadsheet.',
          color: 'blue',
          show: true,
        });
      }, 3000);
      await delay(5000);
      setMessage({message: '', color: '', show: false});
    };
    init();
  }, []);

  useEffect(() => {
    // save the edited state to redux for final review later
    dispatch(setReviewData(state));
  }, [state]);

  async function boundsObserver(bounds: Tuple4<number>[]) {
    if (bounds.length === 0) return;
    if (selectedRow === -1) return;
    const last = bounds.length - 1;
    const bound = bounds[last];
    const response = await extractTextFromBounds(docId, pageNo, bound);
    if (response.status === 'success') {
      setValueForId(selectedRow, response.body.word);
    }
  }

  const setValueForId = (id: number, value: string) => {
    setState(state => {
      // creating a copy to prevent direct mutation that causes error in redux
      let final = {...state};
      const index = final[pageNo - 1].findIndex(pair => pair.id === id);
      const cpair = final[pageNo - 1].find(pair => pair.id === id);
      const newPair = {...cpair, value};
      final[pageNo - 1] = [
        ...final[pageNo - 1].slice(0, index),
        newPair,
        ...final[pageNo - 1].slice(index + 1),
      ];
      console.log(final);
      return {...final};
    });
  };

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
          onChange={e => setValueForId(data.id, e.target.value)}
        />
        <Button
          additional_styles="px-1 py-1 text-black hover:bg-red-500 hover:text-white"
          title="Reset input"
          disabled={data.value ? false : true}
          onClick={() => {
            setValueForId(data.id, '');
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
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
              disabled={pageNo > 1 ? false : true}>
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
              disabled={pageNo >= totalPageNo ? true : false}>
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
          // @ts-ignore
          query={{form_type: formType}}
          additional_styles="px-20 bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          disabled={formType ? false : true}
          onClick={() => {
            dispatch(setReviewData(state));
          }}
        />
      </div>
      <Toast message={message} setmessage={setMessage}>
        {message.message}
      </Toast>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </Container>
  );
}

export async function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
