import {useRouter} from 'next/router';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Highlight from 'react-highlight';
import {HeaderDivider, HeaderTable} from '../../components/HeaderTable';
import {Tuple4, useNaturalImageDim} from '../../components/HighlightViewer';
import Input from '../../components/Input';
import Button from '../../components/button';
import Container from '../../components/container';
import {DraggableBox, DroppableBox} from '../../components/draggable/component';
import {DraggableProvider} from '../../components/draggable/provider';
import {Tuple2} from '../../components/draggable/types';
import {
  State,
  TableRow,
  TableType,
  WELL_SUMMARRY_TABLE_EMPTY,
} from '../../constants/table';
import ChevronLeft from '../../public/icons/chevron-left.svg';
import ChevronRight from '../../public/icons/chevron-right.svg';
import CloseThin from '../../public/icons/close-thin.svg';
import {getHeader} from '../../services/document';
import {
  DraggableResponse,
  fetchDocumentSummary,
  fetchDraggableData,
  generateDragImageSrc,
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

interface MatchReviewProps {
  setTitle: (title: string) => void;
  config: any;
}

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

  const makeDragData = useCallback(
    (dragDataResponse: DraggableResponse) => {
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
      return newDragData;
    },
    [docId, pageNo],
  );

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
      setDragData(makeDragData(dragDataResponse));
    };
    onPageChange();
  }, [
    docId,
    pageNo,
    setImageBase64Str,
    setDropDownOptions,
    setDragData,
    makeDragData,
  ]);

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

  useEffect(() => {
    setTitle('Data Matching | Drag and Drop');
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
          setDragData(makeDragData(dragDataResponse));
          setDropDownOptions(_ => words);

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
  }, [
    config,
    dispatch,
    files,
    makeDragData,
    pageNo,
    router,
    setDocId,
    setTitle,
  ]);

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
      ] as TableType;
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
            disabled={!data.value}
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
