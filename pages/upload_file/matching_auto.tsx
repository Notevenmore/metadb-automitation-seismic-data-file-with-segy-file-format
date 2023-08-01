import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';
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
  AutoFillResponse,
  fetchAutoFill,
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
type State = Table[];

export default function MatchReview({config, setTitle}: MatchReviewProps) {
  const [state, setState] = useState<TableRow[]>([]);
  const [dropDownOptions, setDropDownOptions] = useState<string[]>([]);
  const [imageBase64Str, setImageBase64Str] = useState('');
  const [docId, _setDocId] = useState<string | null>(null);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [Loading, setLoading] = useState('');
  const [formType, setformType] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [awaitingUpdate, setAwaitingUpdate] = useState(false);

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
    if (docId === null) return;
    setImageBase64Str(_ => generateImageUrl(docId, pageNo));
    postScrapeAnnotate(docId, pageNo).then(responseWords => {
      const words = responseWords.body?.words;
      if (words) {
        setDropDownOptions(_ => words);
      }
    });
  }, [docId, pageNo]);

  const prevPage = () => {
    if (pageNo > 1) {
      setPageNo(oldPageNo => oldPageNo - 1);
    }
  };

  useEffect(() => {
    if (router.query.form_type) {
      setformType(String(router.query.form_type));
    }
  }, [router, setformType]);

  useEffect(() => {
    setTitle('Data Matching | Automatic');
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
              key: row_name,
              value: '',
            });
          });
          setState(temp);
          setLoading('Awaiting state update...');
          setAwaitingUpdate(true);
          // continue to the useeffect hook directly below this one
        } catch (error) {
          setError(String(error));
          setLoading('');
          router.events.emit('routeChangeComplete');
        }
      }
    };
    if (router.isReady) {
      init();
    }
  }, [config, dispatch, files, router, setDocId, setTitle]);

  // continue here to ensure that the state has been updated based on the
  // requested data type before proceeding to do any matching prediction tasks
  useEffect(() => {
    setAwaitingUpdate(_awaitingUpdate => {
      if (state?.length > 0 && _awaitingUpdate) {
        let completed = 0;
        setLoading(
          `Starting prediction for ${totalPageNo} pages. This may take a while...`,
        );

        const promises: Promise<AutoFillResponse>[] = [];
        for (let pageNo = 1; pageNo <= totalPageNo; pageNo++) {
          const autoFill = fetchAutoFill(docId, pageNo);
          promises.push(autoFill);
          autoFill.then(autoFillResponse => {
            const _pairs = autoFillResponse.body?.pairs;
            console.log(_pairs);
            if (!_pairs) {
              throw 'Something went wrong while generating data pairs. autoFillResponse returned null.';
            }
            completed++;
            setLoading(
              `Matches for page ${pageNo} predicted. Progress: ${completed}/${totalPageNo} pages completed...`,
            );
            const pairs: Map<string, string> = new Map(Object.entries(_pairs));
            setPairs(pairs, pageNo);
          });
        }

        Promise.all(promises)
          .then(() => {
            setLoading('');
            router.events.emit('routeChangeComplete');
            dispatch(
              displayErrorMessage({
                message:
                  'Make sure you have inputted all of the data correctly before proceeding to view them in the spreadsheet.',
                color: 'blue',
                duration: 5000,
              }),
            );
          })
          .catch(err => {
            setError(String(err));
          });
        return false;
      }
      return _awaitingUpdate;
    });
  }, [
    awaitingUpdate,
    dispatch,
    docId,
    router.events,
    state?.length,
    totalPageNo,
  ]);

  const setValueForId = (id: number, pageNo: number, value: string) => {
    setState(state => {
      // const table = state[pageNo - 1];
      // if (!table) return state;
      const index = state.findIndex(pair => pair.id === id);
      const cpair = state.find(pair => pair.id === id);
      const newPair = {...cpair, value} as TableRow;
      // const newTable = [
      //   ...table.slice(0, index),
      //   newPair,
      //   ...table.slice(index + 1),
      // ] as Table;
      return [...state.slice(0, index), newPair, ...state.slice(index + 1)];
    });
  };

  const setPairs = (pair: Map<string, string>, pageNo: number) => {
    setState(state => {
      const keys = Array.from(pair.keys());
      // const table = state[pageNo - 1];
      // if (!table) return state;
      let indexes: number[] = [];
      for (let i = 0; i < state.length; i++) {
        const row = state[i];
        if (!row) return state;
        if (keys.includes(row.key)) {
          indexes = indexes.concat(i);
        }
      }
      let newTable = [...state];
      for (const index of indexes) {
        const cpair = newTable[index];
        if (!cpair) return state;
        const newPair = {...cpair, value: pair.get(cpair.key)};
        newTable = [
          ...newTable.slice(0, index),
          newPair,
          ...newTable.slice(index + 1),
        ];
      }
      return newTable;
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
            disabled={!data.value}
            onClick={() => {
              setValueForId(data.id, pageNo, '');
            }}>
            <CloseThin className="w-5 h-5" />
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
      <div className="grid grid-cols-2 gap-2 border-2 rounded-lg p-2">
        <HeaderTable>
          {state.map(toRowComponent)}
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
  const NEXT_PUBLIC_OCR_SERVICE_URL = process.env.NEXT_PUBLIC_OCR_SERVICE_URL;
  return {
    props: {
      config: config,
      NEXT_PUBLIC_OCR_SERVICE_URL: NEXT_PUBLIC_OCR_SERVICE_URL,
    }, // will be passed to the page component as props
  };
}
