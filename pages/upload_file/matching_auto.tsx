import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import {useEffect, useState} from 'react';
import Highlight from 'react-highlight';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderDivider, HeaderTable} from '../../components/HeaderTable';
import {ImageEditor} from '../../components/HighlightViewer';
import Button from '../../components/button';
import Container from '../../components/container';
import Input from '../../components/input_form/input';
import Toast from '../../components/toast/toast';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import {
  setDocumentSummary,
  setErrorMessage,
  setReviewData,
} from '../../store/generalSlice';

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(reader.result);
      }
    };
    reader.onerror = error => reject(error);
  });

interface ApiCallResponse<Body> {
  status: 'success' | 'failed';
  body: Body | null;
}

interface UploadFileResponseBody {
  doc_id: string;
}

type UploadFileResponse = ApiCallResponse<UploadFileResponseBody>;

const uploadImage = async (
  imageBase64Str: string,
): Promise<UploadFileResponse> => {
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
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/upload/base64`,

      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null} as UploadFileResponse;
  }
};

interface ScrapeResponseBody {
  page: number;
  words: string[];
}

type ScrapeResponse = ApiCallResponse<ScrapeResponseBody>;

const postScrapeAnnotate = async (
  docId: string,
  page: number,
): Promise<ScrapeResponse> => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `Bearer ${JSON.parse(parseCookies().user_data).access_token}`,
  );

  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/scrape/${docId}/${page}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
};

interface DocumentSummaryResponseBody {
  file_type: string;
  page_count: number;
}

type DocumentSummaryResponse = ApiCallResponse<DocumentSummaryResponseBody>;

const fetchDocumentSummary = async (
  docId: string,
): Promise<DocumentSummaryResponse> => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/summary/${docId}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
};

interface AutoFillResponseBody {
  pairs: Map<string, string>;
}

type AutoFillResponse = ApiCallResponse<AutoFillResponseBody>;

const fetchAutoFill = async (
  docId: string,
  pageNo: number,
): Promise<AutoFillResponse> => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/auto/${docId}/${pageNo}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: {...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return {status: 'failed', body: null};
  }
};

const generateImageUrl = (docId: string, page: number) => {
  return `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/annotate/${docId}/${page}`;
};

interface MatchReviewProps {
  setTitle: (title: string) => void;
  config: any;
  NEXT_PUBLIC_OCR_SERVICE_URL: any;
}

interface TableRow {
  id: number;
  key: string;
  value: string;
}

type Table = TableRow[];

const WELL_SUMMARRY_TABLE_EMPTY: Table = [
  {
    id: 0,
    key: 'NO',
    value: '',
  },
  {
    id: 1,
    key: 'BA_LONG_NAME',
    value: '',
  },
  {
    id: 2,
    key: 'BA_TYPE',
    value: '',
  },
  {
    id: 3,
    key: 'AREA_ID',
    value: '',
  },
  {
    id: 4,
    key: 'AREA_TYPE',
    value: '',
  },
  {
    id: 5,
    key: 'FIELD_NAME',
    value: '',
  },
  {
    id: 6,
    key: 'WELL_NAME',
    value: '',
  },
  {
    id: 7,
    key: 'UWI',
    value: '',
  },
  {
    id: 8,
    key: 'TITLE',
    value: '',
  },
  {
    id: 9,
    key: 'CREATOR_NAME',
    value: '',
  },
  {
    id: 10,
    key: 'CREATE_DATE',
    value: '',
  },
  {
    id: 11,
    key: 'MEDIA_TYPE',
    value: '',
  },
  {
    id: 12,
    key: 'DOCUMENT_TYPE',
    value: '',
  },
  {
    id: 13,
    key: 'ITEM_CATEGORY',
    value: '',
  },
  {
    id: 14,
    key: 'ITEM_SUB_CATEGORY',
    value: '',
  },
  {
    id: 15,
    key: 'PAGE_COUNT',
    value: '',
  },
  {
    id: 16,
    key: 'REMARK',
    value: '',
  },
  {
    id: 17,
    key: 'BA_LONG_NAME',
    value: '',
  },
  {
    id: 18,
    key: 'BA_TYPE',
    value: '',
  },
  {
    id: 19,
    key: 'DATA_STORE_NAME',
    value: '',
  },
  {
    id: 20,
    key: 'DATA_STORE_TYPE',
    value: '',
  },
  {
    id: 21,
    key: 'SOURCE',
    value: '',
  },
  {
    id: 22,
    key: 'QC_STATUS',
    value: '',
  },
  {
    id: 23,
    key: 'CHECKED_BY_BA_ID',
    value: '',
  },
];

type State = Table[];

const INITIAL_STATE: State = [
  WELL_SUMMARRY_TABLE_EMPTY,
  WELL_SUMMARRY_TABLE_EMPTY,
];

export default function MatchReview({config, setTitle}: MatchReviewProps) {
  const [state, setState] = useState<State>([]);
  const [dropDownOptions, setDropDownOptions] = useState<string[]>([]);
  const [imageBase64Str, setImageBase64Str] = useState('');
  const [docId, _setDocId] = useState<string | null>(null);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [Loading, setLoading] = useState('');
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [formType, setformType] = useState<string>('');
  const [error, setError] = useState<string>('');

  // @ts-ignore
  const files: FileList = useSelector(state => state.general.file);

  const router = useRouter();
  const dispatch = useDispatch();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');

  const setDocId = (newDocId: string) => {
    if (docId === null) {
      _setDocId(_ => newDocId);
    }
  };

  const nextPage = () => {
    if (pageNo < totalPageNo) {
      setPageNo(oldPageNo => oldPageNo + 1);
    }
  };

  useEffect(() => {
    const onPageChange = async () => {
      if (docId === null) return;
      setImageBase64Str(_ => generateImageUrl(docId, pageNo));
      const responseWords = await postScrapeAnnotate(docId, pageNo);
      const words = responseWords.body?.words;
      if (words) {
        setDropDownOptions(_ => words);
      }
    };
    onPageChange();
  }, [pageNo]);

  const prevPage = () => {
    if (pageNo > 1) {
      setPageNo(oldPageNo => oldPageNo - 1);
    }
  };

  useEffect(() => {
    if (router.query.form_type) {
      setformType(String(router.query.form_type));
    }
  }, [router]);

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  useEffect(() => {
    setTitle('Data Matching | Automatic');
    const init = async () => {
      router.events.emit('routeChangeStart');
      setLoading('Reading data... Please wait for a moment');
      if (files.length < 1) {
        router.push('/upload_file');
        return;
      } else {
        try {
          const file = files[0];
          if (!file) {
            throw 'No file was uploaded. Please try again by clicking the button below to re-upload your document.';
          }

          const imageBase64Str = await toBase64(file);
          setLoading('Uploading document...');
          const uploadResponse = await uploadImage(imageBase64Str);
          if (uploadResponse.body === null) {
            throw 'Something went wrong with the OCR service. Response body returned null on file upload.';
          }
          const {doc_id: docId} = uploadResponse.body;

          setLoading("Getting uploaded document's summary...");
          const summaryResponse = await fetchDocumentSummary(docId);
          const pageCount = summaryResponse.body?.page_count;
          if (pageCount === undefined) {
            throw 'Something went wrong with the OCR service. Response body returned null on document summary.';
          }
          setTotalPageNo(_ => pageCount);
          dispatch(
            setDocumentSummary({...summaryResponse, document_id: docId}),
          );
          setDocId(docId);
          setLoading('Reading and populating data...');
          const scrapeResponse = await postScrapeAnnotate(docId, pageNo);
          const words = scrapeResponse.body?.words;
          if (words === undefined) {
            throw 'Something went wrong with the OCR service. Response body returned null on word scraping.';
          }
          setImageBase64Str(_ => generateImageUrl(docId, pageNo));
          setDropDownOptions(_ => words);

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
          let temp_obj = [];
          for (let idx = 0; idx < summaryResponse.body.page_count; idx++) {
            let temp = [];
            row_names.response.forEach((row_name, index) => {
              temp.push({
                id: index,
                key: row_name,
                value: '',
              });
            });
            temp_obj.push(temp);
          }
          setState(temp_obj);

          setLoading('Awaiting state update...');
          // continue to the useeffect hook directly below this one
        } catch (error) {
          setError(String(error));
        }
      }
    };
    init();
  }, [files]);

  // continue here to ensure that the state has been updated based on the
  // requested data type before proceeding to do any matching prediction tasks
  useEffect(() => {
    if (state?.length > 0 && Loading === 'Awaiting state update...') {
      const predict_matches = async () => {
        try {
          for (let pageNo = 1; pageNo <= totalPageNo; pageNo++) {
            setLoading(
              `Predicting matches for page ${pageNo}, this may take a while...`,
            );
            const autoFillResponse = await fetchAutoFill(docId, pageNo);
            const _pairs = autoFillResponse.body?.pairs;
            console.log(_pairs);
            if (!_pairs) {
              throw 'Something went wrong while generating data pairs. autoFillResponse returned null.';
            }
            const pairs: Map<string, string> = new Map(Object.entries(_pairs));
            setPairs(pairs, pageNo);
          }
          setLoading('');
          setTimeout(() => {
            dispatch(
              setErrorMessage({
                message:
                  'Make sure you have inputted all of the data correctly before proceeding to view them in the spreadsheet.',
                color: 'blue',
                show: true,
              }),
            );
          }, 3000);
          await delay(5000);
          dispatch(setErrorMessage({message: '', color: '', show: false}));
        } catch (error) {
          setError(String(error));
        }
      };
      predict_matches();
    }
  }, [state, Loading]);

  const setValueForId = (id: number, pageNo: number, value: string) => {
    setState(state => {
      const table = state[pageNo - 1];
      if (!table) return state;
      const index = table.findIndex(pair => pair.id === id);
      const cpair = table.find(pair => pair.id === id);
      const newPair = {...cpair, value} as TableRow;
      const newTable = [
        ...table.slice(0, index),
        newPair,
        ...table.slice(index + 1),
      ] as Table;
      return [...state.slice(0, pageNo - 1), newTable, ...state.slice(pageNo)];
    });
  };

  const setPairs = (pair: Map<string, string>, pageNo: number) => {
    setState(state => {
      const keys = Array.from(pair.keys());
      const table = state[pageNo - 1];
      if (!table) return state;
      let indexes: number[] = [];
      for (let i = 0; i < table.length; i++) {
        const row = table[i];
        if (!row) return state;
        if (keys.includes(row.key)) {
          indexes = indexes.concat(i);
        }
      }
      let newTable = [...table];
      for (const index of indexes) {
        const cpair = newTable[index];
        if (!cpair) return state;
        const newPair = {...cpair, value: pair.get(cpair.key)} as TableRow;
        newTable = [
          ...newTable.slice(0, index),
          newPair,
          ...newTable.slice(index + 1),
        ];
      }
      return [...state.slice(0, pageNo - 1), newTable, ...state.slice(pageNo)];
    });
  };

  const toRowComponent = (data: TableRow) => {
    return (
      <div key={data.id}>
        <HeaderDivider additional_styles="border-gray-300" />
        <div className="py-2.5 grid grid-cols-[1fr_auto] items-center space-x-2">
          <Input
            label={data.key
              .toLowerCase()
              .replace(/\_/g, ' ')
              .split(' ')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')}
            label_loc="beside"
            value={data.value}
            type="dropdown"
            name={'submissionType'}
            placeholder="Selected data will show up here"
            dropdown_items={dropDownOptions}
            required={true}
            additional_styles="w-full"
            onChange={e => setValueForId(data.id, pageNo, e.target.value)}
            withSearch
          />
          <Button
            additional_styles="px-1 py-1 text-black hover:bg-red-500 hover:text-white"
            title="Reset input"
            disabled={data.value ? false : true}
            onClick={() => {
              setValueForId(data.id, pageNo, '');
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
  };

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
          <p>Data Matching - Automatic</p>
        </div>
      </Container.Title>
      <div className="grid grid-cols-2 gap-2 border-[2px] rounded-lg p-2">
        <HeaderTable>
          {state[pageNo - 1]?.map(toRowComponent)}
          <HeaderDivider additional_styles={undefined} />
        </HeaderTable>
        <div className="h-[calc(100vh-55px)] sticky top-0 grid grid-cols-1 rounded-lg overflow-clip">
          <ImageEditor boundsObserver={() => {}} imageUrl={imageBase64Str} />
        </div>
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
              className="bg-white border-2 p-3 cursor-default select-none text-center rounded-lg"
            />
            <div>
              <p className="w-5 h-5">{pageNo}</p>
            </div>
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
          query={formType}
          additional_styles="px-20 bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          disabled={formType ? false : true}
          onClick={() => {
            dispatch(setReviewData(state));
          }}
        />
      </div>
    </Container>
  );
}

export async function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  const NEXT_PUBLIC_OCR_SERVICE_URL = process.env.NEXT_PUBLIC_OCR_SERVICE_URL;
  return {
    props: {
      config: config,
      NEXT_PUBLIC_OCR_SERVICE_URL: NEXT_PUBLIC_OCR_SERVICE_URL,
    }, // will be passed to the page component as props
  };
}
