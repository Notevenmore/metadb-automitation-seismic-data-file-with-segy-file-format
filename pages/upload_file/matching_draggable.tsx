import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';
import Highlight from 'react-highlight';
import {useDispatch, useSelector} from 'react-redux';
import {HeaderDivider, HeaderTable} from '../../components/HeaderTable';
import {Tuple4, useNaturalImageDim} from '../../components/HighlightViewer';
import Button from '../../components/button';
import Container from '../../components/container';
import {DraggableBox, DroppableBox} from '../../components/draggable/component';
import {DraggableProvider} from '../../components/draggable/provider';
import {Tuple2} from '../../components/draggable/types';
import Input from '../../components/input_form/input';
import Toast from '../../components/toast/toast';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import CloseThin from '../../public/icons/close-thin.svg';
import {
  FileListType,
  setDocumentSummary,
  setErrorMessage,
  setReviewData,
} from '../../store/generalSlice';
import Image from 'next/image';
import { RootState } from '../../store';

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

interface DraggableItemResponse {
  bound: Tuple4<number>;
  word: string;
}

type DraggableResponse = ApiCallResponse<DraggableItemResponse[]>;

const fetchDraggableData = async (
  docId: string,
  pageNo: number,
): Promise<DraggableResponse> => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/draggables/${docId}/${pageNo}`,
      requestOptions,
    );
    const result = await response.text();
    return {status: 'success', body: JSON.parse(result)};
  } catch (e) {
    return {status: 'failed', body: null};
  }
};

const generateImageUrl = (docId: string, page: number) => {
  return `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/image/${docId}/${page}`;
};

const generateDragImageSrc = (
  docId: string,
  pageNo: number,
  bound: Tuple4<number>,
) => {
  return `${process.env['NEXT_PUBLIC_OCR_SERVICE_URL']}/ocr_service/v1/crop/${docId}/${pageNo}/${bound[0]}/${bound[1]}/${bound[2]}/${bound[3]}`;
};

interface MatchReviewProps {
  setTitle: (title: string) => void;
  config: any;
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

export const useElementDim = (ref: MutableRefObject<null>) => {
  const [dim, setDim] = useState<Tuple2<number>>([0, 0]);
  const [check, setCheck] = useState(false);
  function reload() {
    setCheck(t => !t);
  }
  useEffect(() => {
    const element = ref.current as HTMLElement;
    if (!element) return;
    const {width, height} = element.getBoundingClientRect();
    console.log(`element dim called: ${width}, ${height}`);
    setDim(_ => [width, height]);
  }, [ref, check]);
  return {dim, reload};
};

type DraggableData = {
  initialPos: Tuple2<number>;
  dim: Tuple2<number>;
  src: string;
  word: string;
};

export default function MatchReview({config, setTitle}: MatchReviewProps) {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [dropDownOptions, setDropDownOptions] = useState<string[]>([]);
  const [imageBase64Str, setImageBase64Str] = useState('');
  const [docId, _setDocId] = useState<string | null>(null);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [Loading, setLoading] = useState('');
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const imageRef = useRef();
  const {dim: naturalDim, reload: naturalReload} = useNaturalImageDim(imageRef);
  const {dim: actualDim, reload: actualReload} = useElementDim(imageRef);
  const [dragData, setDragData] = useState<DraggableData[]>([]);
  const draggables: DraggableData[] = [
    {
      initialPos: [100, 100],
      dim: [40, 40],
      src: '/favicon.ico',
      word: 'icon',
    },
  ];
  const [formType, setformType] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log(`naturalDim: ${naturalDim}`);
    console.log(`actualDim: ${actualDim}`);
  }, [actualDim, naturalDim]);

  const files = useSelector<RootState, FileListType>(state => state.general.file);
  const router = useRouter();
  const dispatch = useDispatch();
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
    const onPageChange = async () => {
      if (docId === null) return;
      setImageBase64Str(_ => generateImageUrl(docId, pageNo));
      const responseWords = await postScrapeAnnotate(docId, pageNo);
      const words = responseWords.body?.words;
      if (words) {
        setDropDownOptions(_ => words);
      }

      const dragDataResponse = await fetchDraggableData(docId, pageNo);
      if (dragDataResponse.body === null) return;
      const dragDataResponseBody = dragDataResponse.body;
      const newDragData: DraggableData[] = dragDataResponseBody.map(it => {
        const bound: Tuple4<number> = [
          it.bound[0] - 5,
          it.bound[1] - 5,
          it.bound[2] + 5,
          it.bound[3] + 5,
        ];
        const width = Math.abs(bound[0] - bound[2]);
        const height = Math.abs(bound[1] - bound[3]);
        return {
          word: it.word,
          dim: [width, height],
          initialPos: [bound[1], bound[0]],
          src: generateDragImageSrc(docId, pageNo, bound),
        };
      });
      setDragData(newDragData);
    };
    onPageChange();
  }, [docId, pageNo, setImageBase64Str, setDropDownOptions, setDragData]);

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
    setTitle('Data Matching | Drag and Drop');
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
          setLoading('Populating draggable items...');
          const scrapeResponse = await postScrapeAnnotate(docId, pageNo);
          const words = scrapeResponse.body?.words;
          if (words === undefined) {
            throw 'Something went wrong with the OCR service. Response body returned null on word scraping.';
          }
          setImageBase64Str(_ => generateImageUrl(docId, pageNo));
          const dragDataResponse = await fetchDraggableData(docId, pageNo);
          if (dragDataResponse.body === null) {
            throw 'Something went wrong with the OCR service. Response body returned null on populating draggable data.';
          }
          const dragDataResponseBody = dragDataResponse.body;
          const newDragData: DraggableData[] = dragDataResponseBody.map(it => {
            const bound: Tuple4<number> = [
              it.bound[0] - 5,
              it.bound[1] - 5,
              it.bound[2] + 5,
              it.bound[3] + 5,
            ];
            const width = Math.abs(bound[0] - bound[2]);
            const height = Math.abs(bound[1] - bound[3]);
            return {
              word: it.word,
              dim: [width, height],
              initialPos: [bound[1], bound[0]],
              src: generateDragImageSrc(docId, pageNo, bound),
            };
          });
          setDragData(newDragData);
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
                key: row_name.toLowerCase(),
                value: '',
              });
            });
            temp_obj.push(temp);
          }
          setState(temp_obj);
          setLoading('');
        } catch (error) {
          setError(String(error));
        }
      }
      router.events.emit('routeChangeComplete');
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
    };
    init();
  }, [config.services.sheets, dispatch, files, pageNo, router, setDocId, setTitle]);

  useEffect(() => {
    localStorage.setItem('reviewUploadedImage', imageBase64Str);
  }, [imageBase64Str]);

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
          <DroppableBox
            onDrop={drop => setValueForId(data.id, pageNo, drop.trim())}>
            <Input
              label={data.key
                .replace(/\_/g, ' ')
                .split(' ')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')}
              label_loc="beside"
              value={data.value}
              type="dropdown"
              name={'submissionType'}
              placeholder="Dropped items' text will show up here"
              dropdown_items={dropDownOptions}
              required={true}
              additional_styles="w-full"
              onChange={e => setValueForId(data.id, pageNo, e.target.value)}
              withSearch
            />
          </DroppableBox>
          <Button
            additional_styles="px-1 py-1 text-black hover:bg-red-500 hover:text-white"
            title="Reset input"
            disabled={data.value ? false : true}
            onClick={() => {
              setValueForId(data.id, pageNo, '');
            }}
            withPath={false}>
            <CloseThin className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  };

  const Draggables = () => {
    if (!draggables) return <></>;
    const sw = actualDim[0] / naturalDim[0];
    const sh = actualDim[1] / naturalDim[1];
    return (
      <>
        {dragData.map(it => (
          <DraggableBox
            id={it.initialPos[0] * 10000 + it.initialPos[1]}
            initialPos={[it.initialPos[0] * sh, it.initialPos[1] * sw]}
            snapToOrigin
            data={it.word}
            key={it.initialPos[0] * 10000 + it.initialPos[1]}>
            <div
              style={{
                width: `${it.dim[0] * sw}px`,
                height: `${it.dim[1] * sh}px`,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt=""
                draggable={false}
                unselectable="on"
                style={{
                  width: `${it.dim[0] * sw}px`,
                  height: `${it.dim[1] * sh}px`,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  MozUserSelect: '-moz-none',
                }}
              />
            </div>
          </DraggableBox>
        ))}
      </>
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
    <DraggableProvider>
      <Container additional_class="full-height relative">
        <Container.Title back>
          <div className="-space-y-2">
            <p className="capitalize text-sm font-normal">{path_query}</p>
            <p>Data Matching - Drag and Drop</p>
          </div>
        </Container.Title>
        <div className="grid grid-cols-2 gap-2 border-[2px] rounded-lg p-2">
          <HeaderTable>
            {state[pageNo - 1]?.map(toRowComponent)}
            <HeaderDivider additional_styles={undefined} />
          </HeaderTable>
          <div className="h-[calc(100vh-55px)] rounded-lg border border-gray-300 sticky top-0">
            <Draggables />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageBase64Str}
              alt=""
              className="object-contain m-auto"
              ref={imageRef}
              style={{
                margin: '5px',
              }}
              onLoad={() => {
                naturalReload();
                actualReload();
                console.log('reloaded');
              }}
            />
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
            query={{form_type: formType}}
            additional_styles="px-20 bg-searchbg/[.6] hover:bg-searchbg font-semibold"
            disabled={formType ? false : true}
            onClick={() => {
              dispatch(setReviewData(state));
            }}
          />
        </div>
      </Container>
    </DraggableProvider>
  );
}

export async function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
