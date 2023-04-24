import { useCallback, useEffect, useState } from "react";
import Container from "../../components/container/container";
import HeaderTable, {
  HeaderDivider,
  ButtonsSection,
  HeaderRow,
  HeaderInput,
} from "../../components/header_table/header_table";
import Buttons from "../../components/buttons/buttons";
import { ImageEditor, Tuple4 } from "../components/highlight_viewer";
import { useDispatch, useSelector } from 'react-redux';
import { setDocumentSummary, setReviewData } from "../../store/generalSlice";
import { useRouter } from 'next/router';
import ChevronLeft from '../../public/icons/chevron-left.svg'
import ChevronRight from '../../public/icons/chevron-right.svg'
import Highlight from 'react-highlight'

interface TableRow {
  id: number,
  key: string,
  value: string | null
}

// const initialState: TableRow[] = [
//   {
//     id: 0,
//     key: "NO",
//     value: null,
//   },
//   {
//     id: 1,
//     key: "BA_LONG_NAME",
//     value: null,
//   },
//   {
//     id: 2,
//     key: "BA_TYPE",
//     value: null,
//   },
//   {
//     id: 3,
//     key: "AREA_ID",
//     value: null,
//   },
//   {
//     id: 4,
//     key: "AREA_TYPE",
//     value: null,
//   },
//   {
//     id: 5,
//     key: "FIELD_NAME",
//     value: null,
//   },
//   {
//     id: 6,
//     key: "WELL_NAME",
//     value: null,
//   },
//   {
//     id: 7,
//     key: "UWI",
//     value: null,
//   },
//   {
//     id: 8,
//     key: "TITLE",
//     value: null,
//   },
//   {
//     id: 9,
//     key: "CREATOR_NAME",
//     value: null,
//   },
//   {
//     id: 10,
//     key: "CREATE_DATE",
//     value: null,
//   },
//   {
//     id: 11,
//     key: "MEDIA_TYPE",
//     value: null,
//   },
//   {
//     id: 12,
//     key: "DOCUMENT_TYPE",
//     value: null,
//   },
//   {
//     id: 13,
//     key: "ITEM_CATEGORY",
//     value: null,
//   },
//   {
//     id: 14,
//     key: "ITEM_SUB_CATEGORY",
//     value: null,
//   },
//   {
//     id: 15,
//     key: "PAGE_COUNT",
//     value: null,
//   },
//   {
//     id: 16,
//     key: "REMARK",
//     value: null,
//   },
//   {
//     id: 17,
//     key: "BA_LONG_NAME",
//     value: null,
//   },
//   {
//     id: 18,
//     key: "BA_TYPE",
//     value: null,
//   },
//   {
//     id: 19,
//     key: "DATA_STORE_NAME",
//     value: null,
//   },
//   {
//     id: 20,
//     key: "DATA_STORE_TYPE",
//     value: null,
//   },
//   {
//     id: 21,
//     key: "SOURCE",
//     value: null,
//   },
//   {
//     id: 22,
//     key: "QC_STATUS",
//     value: null,
//   },
//   {
//     id: 23,
//     key: "CHECKED_BY_BA_ID",
//     value: null,
//   },
// ];

export const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.toString());
  reader.onerror = (error) => reject(error);
});

async function extractTextFromBounds(doc_id: string, page_no: number, bound: Tuple4<number>) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "bounds": bound
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${process.env.OCR_SERVICE_URL}/ocr_service/v1/scrape-bounds/${doc_id}/${page_no}`, requestOptions);
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result) } };
  } catch (e) {
    console.log(e);
    return { status: "failed", body: null };
  }
}

const uploadImage = async (imageBase64Str: string) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "base64str": imageBase64Str
  });

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch(
      `${process.env.OCR_SERVICE_URL}/ocr_service/v1/upload/base64`,
      requestOptions
    );
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result) } };
  } catch (e) {
    console.log(e);
    return { status: "failed", body: e }
  }
}

const fetchDocumentSummary = (async (docId: string) => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow'
  };

  try {
    const response = await fetch(
      `${process.env.OCR_SERVICE_URL}/ocr_service/v1/summary/${docId}`,
      requestOptions
    );
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result) } };
  } catch (e) {
    console.log(e);
    return { status: "failed", body: e };
  }
});

const generateImageUrl = (docId: string, page: number) => {
  //  `${process.env.OCR_SERVICE_URL}/ocr_service/v1/image/${docId}/${page}`
  return `${process.env.OCR_SERVICE_URL}/ocr_service/v1/image/${docId}/${page}`;
}

export default function MatchingGuided() {

  const doc_id: string = "c5fd3ac264d654b04b759f193a16254b8eb0c878a3f0de0f914aaf2cae3da47f";
  const page_no: number = 2;

  // const [state, setState] = useState<TableRow[]>(initialState);
  const [state, setState] = useState({} as any);
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPageNo, setTotalPageNo] = useState<number>(1);
  const [docId, _setDocId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // utility states
  const [loading, setLoading] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("")

  // @ts-ignore
  const files = useSelector((state) => state.general.file)
  const router = useRouter();
  const dispatch = useDispatch()
  const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")

  const prevPage = (() => {
    if (pageNo > 1) {
      setPageNo(oldPageNo => oldPageNo - 1);
    }
  });

  const nextPage = (() => {
    if (pageNo < totalPageNo) {
      setPageNo(oldPageNo => oldPageNo + 1);
    }
  });

  // Page change use effect
  useEffect(() => {
    const onPageChange = async () => {
      if (docId === null) return;
      // setState(_ => [...initialState]);
    }
    onPageChange();
  }, [pageNo]);

  useEffect(() => {
    console.log(imageUrl)
  }, [imageUrl])



  useEffect(() => {
    const init = async () => {
      router.events.emit("routeChangeStart");
      setLoading("Reading data... Please wait for a moment");
      if (files.length < 1) {
        router.push("/upload_file")
      } else {
        try {
          const file = files[0];
          const imageBase64Str = await toBase64(file);
          const uploadResponse = await uploadImage(imageBase64Str);
          if (uploadResponse.status === "failed") {
            throw new Error(`Upload image failed, please try again or contact administrator/maintainer if the problem still persists. ${uploadResponse.body}`);
          }
          const { doc_id: docId } = uploadResponse.body;
          setDocId(docId);
          setImageUrl(_ => generateImageUrl(docId, pageNo));
          const summaryResponse = await fetchDocumentSummary(docId);
          if (summaryResponse.status !== "success") {
            throw new Error(`Something happened with the OCR service, please contact administrator and/or maintainer. ${summaryResponse.body}`)
          }

          setTotalPageNo(summaryResponse.body.page_count);
          dispatch(setDocumentSummary({...summaryResponse, document_id: docId}))
          // TODO change data type to be dynamic later 
          setLoading("Getting appropriate properties for data type printed well report")
          const row_names = await fetch('http://localhost:5050/getHeaders', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            // TODO change form_type to be dynamic later
            body: JSON.stringify({
              form_type: "printed_well_report"
            })
          }).then(response => {
            return response.json()
          }).catch(error => { throw error })

          setLoading("Setting appropriate properties for data type printed well report")
          let temp_obj = {}
          for (let idx = 0; idx < summaryResponse.body.page_count; idx++) {
            let temp = []
            row_names.response.forEach((row_name, index) => {
              temp.push({
                id: index,
                key: row_name,
                value: null,
              },)
            });
            temp_obj[idx] = temp
          }
          setState(temp_obj)
          setLoading(null);
        } catch (error) {
          setError(String(error))
        }
      }
      router.events.emit("routeChangeComplete");
      setLoading(null);
      setMessage("Make sure you have inputted all of the data correctly before proceeding to view them in the spreadsheet.")
    };
    init();
  }, []);

  useEffect(() => {
    // save the edited state to redux for final review later
    dispatch(setReviewData(state))
  }, [state])

  async function boundsObserver(bounds: Tuple4<number>[]) {
    if (bounds.length === 0) return;
    if (selectedRow === -1) return;
    const last = bounds.length - 1;
    const bound = bounds[last];
    const response = await extractTextFromBounds(docId, pageNo, bound);
    if (response.status === "success") {
      setValueForId(selectedRow, response.body.word);
    }
  }

  const setValueForId = (id: number, value: string) => {
    setState((state) => {
      // creating a copy to prevent direct mutation that causes error in redux
      let final = { ...state }
      const index = final[pageNo - 1].findIndex((pair) => pair.id === id);
      const cpair = final[pageNo - 1].find((pair) => pair.id === id);
      const newPair = { ...cpair, value };
      final[pageNo - 1] = [...final[pageNo - 1].slice(0, index), newPair, ...final[pageNo - 1].slice(index + 1)]
      return { ...final };
    });

    // setState((state) => {
    //   const index = state.findIndex((pair) => pair.id === id);
    //   const cpair = state.find((pair) => pair.id === id);
    //   const newPair = { ...cpair, value };
    //   return [...state.slice(0, index), newPair, ...state.slice(index + 1)];
    // });
  };

  const setDocId = (newDocId: string) => {
    _setDocId(newDocId);
  }

  function clickRow(dataId: number) {
    setSelectedRow(_ => dataId);
  }

  const toRowComponent = (data: TableRow) => (
    <div key={data.id} className={((selectedRow === data.id) ? "text-red-500 underline" : "") + " cursor-pointer"}>
      <HeaderDivider />
      <div
        onClick={_ => clickRow(data.id)}
        className={"w-full"}
      >
        <HeaderInput label1={(selectedRow === data.id ? "* " : "") + data.key}>
          <HeaderRow>{data.value}</HeaderRow>
        </HeaderInput>
      </div>
    </div>
  );

  return (loading) ? (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
      <p className="text-xl font-semibold text-gray-500">{loading}</p>
    </div>
  ) : (error) ? (
    <div className="w-full h-full flex flex-col p-10 space-y-4">
      <p className="font-bold text-lg text-red-500">Something happened. Please try again or contact administrator/maintainer if the problem still persists by giving them the information below:</p>
      <Highlight className='html rounded-md border-2'>{error}</Highlight>
      {/* @ts-ignore */}
      <Buttons path="" button_description="Back" onClick={() => { router.back() }} />
    </div>
  ) : (
    <Container additional_class="full-height relative">
      <Container.Title>
        <div className="-space-y-2">
          <p className="capitalize text-sm font-normal">{path_query}</p>
          <p>Data Matching</p>
        </div>
      </Container.Title>
      {/* <div className="grid grid-cols-2 gap-14 border-[2px] rounded-lg p-2"> */}
      <div className="grid grid-cols-2 gap-2 border-[2px] rounded-lg p-2">
        <HeaderTable>
          {state[pageNo - 1]?.map(toRowComponent)}
          <HeaderDivider />
        </HeaderTable>
        <ImageEditor boundsObserver={boundsObserver} imageUrl={generateImageUrl(docId, pageNo)} />
      </div>
      {(totalPageNo > 1) ? (
        <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full">
          <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border">
            {/* {Array.from({ length: totalPageNo }, (item, index) =>
          <Buttons path={} title="" button_description="" additional_styles="" key={index} />
        )} */}
            {/* @ts-ignore */}
            <Buttons path="" title="Previous page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={prevPage} disabled={pageNo > 1 ? false : true} ><div className="w-5 h-5"><ChevronLeft /></div></Buttons>
            {/* @ts-ignore */}
            <Buttons path="" title="" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-white cursor-default"><p className="w-5 h-5">{pageNo}</p></Buttons>
            {/* @ts-ignore */}
            <Buttons path="" title="Next page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={nextPage} disabled={pageNo >= totalPageNo ? true : false}><div className="w-5 h-5"><ChevronRight /></div></Buttons>
          </div>
        </div>
      ) : null}
      <div className="flex items-center justify-center w-full my-4">
        {/* @ts-ignore */}
        <Buttons button_description="View on sheets" path="/upload_file/review" additional_styles="px-20 bg-searchbg/[.6] hover:bg-searchbg font-semibold" />
      </div>
      <ButtonsSection>
        {/* @ts-ignore */}
        {/* <Buttons path="" additional_styles="bg-primary" button_description="Previous Page" onClick={prevPage} /> */}
        {/* @ts-ignore */}
        {/* <Buttons path="" additional_styles="bg-primary" button_description="Next Page" onClick={nextPage} /> */}
      </ButtonsSection>
      <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-green-500 text-white px-3 rounded-lg py-2 transition-all z-40 ${message ? "" : "-translate-y-20"}`}>
        <p>{message}</p>
        {/* @ts-ignore */}
        <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setMessage("") }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Buttons>
      </div>
      <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${error ? "" : "-translate-y-20"}`}>
        <p>{error}</p>
        {/* @ts-ignore */}
        <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setError("") }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Buttons>
      </div>
    </Container>
  )
}