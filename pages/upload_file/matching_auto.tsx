/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import HeaderTable, {
  HeaderDivider,
  ButtonsSection,
  HeaderInput,
} from "../../components/header_table/header_table";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { ReactNode } from "react";

interface FullButtonProps {
  onClick: () => void
}

const FullButton = ({ children, onClick }: PropsWithChildren<FullButtonProps>) => {
  return (
    <button className="
      flex 
      items-center 
      space-x-2
      px-5
      py-2
      rounded-lg 
      bg-primary 
      hover:bg-gray-300 
      transition-all 
      w-full 
      justify-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const HeaderRowWithGap = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div
      className="
      flex
      justify-center
      lg:items-center
      lg:flex-row
      flex-col 
      w-full 
      py-[10px] 
      lg:h-[55px] 
      gap-1
      "
    >
      <>{children}</>
    </div>
  );
};

interface HeaderInputInputProps {
  leftChildren: ReactNode,
  rightChildren: ReactNode
}

const HeaderInputInput = ({ leftChildren, rightChildren }: HeaderInputInputProps) => {
  return (
    <HeaderRowWithGap>
      <>{leftChildren}</>
      <>{rightChildren}</>
    </HeaderRowWithGap>
  );
};

interface DeleteButtonProps {
  onClick: () => void,
}

const DeleteButton = ({ children, onClick }: PropsWithChildren<DeleteButtonProps>) => (
  <>
    <button
      className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-red-300 hover:bg-red-200 transition-all justify-center w-[4rem]"
      onClick={onClick}
    >
      {children}
    </button>
  </>
);

// function uuidv4() {
//   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//     (
//       c ^
//       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//     ).toString(16)
//   );
// }

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString())
      } else {
        reject(reader.result);
      }
    };
    reader.onerror = (error) => reject(error);
  });

// const generateKeyValuePair = () => {
//   const newPair = { ...newDefaultPair };
//   newPair.id = uuidv4();
//   return newPair;
// };

interface ApiCallResponse<Body> {
  status: "success" | "failed",
  body: Body | null
}

interface UploadFileResponseBody {
  doc_id: string;
}

type UploadFileResponse = ApiCallResponse<UploadFileResponseBody>;

const uploadImage = async (imageBase64Str: string): Promise<UploadFileResponse> => {
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
      `${process.env["OCR_SERVICE_URL"]}/ocr_service/v1/upload/base64`,
      requestOptions
    );
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result) } };
  } catch (e) {
    console.log(e);
    return { status: "failed", body: null } as UploadFileResponse;
  }
}

interface ScrapeResponseBody {
  page: number,
  words: string[]
}

type ScrapeResponse = ApiCallResponse<ScrapeResponseBody>

const postScrapeAnnotate = async (docId: string, page: number): Promise<ScrapeResponse> => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${process.env["OCR_SERVICE_URL"]}/ocr_service/v1/scrape/${docId}/${page}`,
      requestOptions
    );
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result) } };
  } catch (e) {
    console.log(e);
    return { status: "failed", body: null };
  }
};

interface DocumentSummaryResponseBody {
  file_type: string,
  page_count: number
}

type DocumentSummaryResponse = ApiCallResponse<DocumentSummaryResponseBody>;

const fetchDocumentSummary = (async (docId: string): Promise<DocumentSummaryResponse> => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow'
  };

  try {
    const response = await fetch(
      `${process.env["OCR_SERVICE_URL"]}/ocr_service/v1/summary/${docId}`,
      requestOptions
    );
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return { status: "failed", body: null };
  }
});

interface AutoFillResponseBody {
  pairs: Map<string, string>
}

type AutoFillResponse = ApiCallResponse<AutoFillResponseBody>

const fetchAutoFill = (async (docId: string, pageNo: number): Promise<AutoFillResponse> => {
  var requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow'
  };

  try {
    const response = await fetch(
      `${process.env["OCR_SERVICE_URL"]}/ocr_service/v1/auto/${docId}/${pageNo}`,
      requestOptions
    );
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result) } };
  } catch (e) {
    console.log(e);
    return { status: "failed", body: null };
  }
});

const generateImageUrl = (docId: string, page: number) => {
  return `${process.env["OCR_SERVICE_URL"]}/ocr_service/v1/annotate/${docId}/${page}`;
}

interface MatchReviewProps {
  setTitle: (title: string) => void
}

interface TableRow {
  id: number,
  key: string,
  value: string
}

type Table = TableRow[]

const WELL_SUMMARRY_TABLE_EMPTY: Table = [
  {
    id: 0,
    key: "NO",
    value: "",
  },
  {
    id: 1,
    key: "BA_LONG_NAME",
    value: "",
  },
  {
    id: 2,
    key: "BA_TYPE",
    value: "",
  },
  {
    id: 3,
    key: "AREA_ID",
    value: "",
  },
  {
    id: 4,
    key: "AREA_TYPE",
    value: "",
  },
  {
    id: 5,
    key: "FIELD_NAME",
    value: "",
  },
  {
    id: 6,
    key: "WELL_NAME",
    value: "",
  },
  {
    id: 7,
    key: "UWI",
    value: "",
  },
  {
    id: 8,
    key: "TITLE",
    value: "",
  },
  {
    id: 9,
    key: "CREATOR_NAME",
    value: "",
  },
  {
    id: 10,
    key: "CREATE_DATE",
    value: "",
  },
  {
    id: 11,
    key: "MEDIA_TYPE",
    value: "",
  },
  {
    id: 12,
    key: "DOCUMENT_TYPE",
    value: "",
  },
  {
    id: 13,
    key: "ITEM_CATEGORY",
    value: "",
  },
  {
    id: 14,
    key: "ITEM_SUB_CATEGORY",
    value: "",
  },
  {
    id: 15,
    key: "PAGE_COUNT",
    value: "",
  },
  {
    id: 16,
    key: "REMARK",
    value: "",
  },
  {
    id: 17,
    key: "BA_LONG_NAME",
    value: "",
  },
  {
    id: 18,
    key: "BA_TYPE",
    value: "",
  },
  {
    id: 19,
    key: "DATA_STORE_NAME",
    value: "",
  },
  {
    id: 20,
    key: "DATA_STORE_TYPE",
    value: "",
  },
  {
    id: 21,
    key: "SOURCE",
    value: "",
  },
  {
    id: 22,
    key: "QC_STATUS",
    value: "",
  },
  {
    id: 23,
    key: "CHECKED_BY_BA_ID",
    value: "",
  },
];

type State = Table[];

const INITIAL_STATE: State = [
  WELL_SUMMARRY_TABLE_EMPTY,
  WELL_SUMMARRY_TABLE_EMPTY
]

export default function MatchReview({ setTitle }: MatchReviewProps) {
  setTitle("Upload File - Data Matching")
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [dropDownOptions, setDropDownOptions] = useState<string[]>([]);
  const [imageBase64Str, setImageBase64Str] = useState("");
  const [docId, _setDocId] = useState<string | null>(null);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [Loading, setLoading] = useState("")
  const [Message, setMessage] = useState("")
  // @ts-ignore
  const files: FileList = useSelector((state) => state.general.file)
  const router = useRouter()

  const setDocId = ((newDocId: string) => {
    if (docId === null) {
      _setDocId(_ => newDocId);
    }
  });

  const nextPage = (() => {
    if (pageNo < totalPageNo) {
      setPageNo(oldPageNo => oldPageNo + 1);
    }
  });

  useEffect(() => {
    const onPageChange = async () => {
      if (docId === null) return
      setImageBase64Str(_ => generateImageUrl(docId, pageNo));
      const responseWords = await postScrapeAnnotate(docId, pageNo);
      const words = responseWords.body?.words;
      if (words) {
        setDropDownOptions(_ => words);
      }
    }
    onPageChange();
  }, [pageNo]);

  const prevPage = (() => {
    if (pageNo > 1) {
      setPageNo(oldPageNo => oldPageNo - 1);
    }
  });

  useEffect(() => {
    const init = async () => {
      router.events.emit("routeChangeStart")
      setLoading("Reading data... Please wait for a moment")
      if (files.length < 1) {
        router.push("/upload_file")
        return
      } else {
        const file = files[0];
        if (!file) return;

        const imageBase64Str = await toBase64(file);
        const uploadResponse = await uploadImage(imageBase64Str);
        if (uploadResponse.body === null) return;
        const { doc_id: docId } = uploadResponse.body;

        const summaryResponse = await fetchDocumentSummary(docId);
        const pageCount = summaryResponse.body?.page_count;
        if (pageCount === undefined) return;
        setTotalPageNo(_ => pageCount);
        setDocId(docId);
        const scrapeResponse = await postScrapeAnnotate(docId, pageNo);
        const words = scrapeResponse.body?.words;
        if (words === undefined) return;
        setImageBase64Str((_) => generateImageUrl(docId, pageNo));
        setDropDownOptions((_) => words);
        for (let pageNo = 1; pageNo <= pageCount; pageNo++) {
          const autoFillResponse = await fetchAutoFill(docId, pageNo);
          const _pairs = autoFillResponse.body?.pairs;
          if (!_pairs) return;
          const pairs: Map<string, string> = new Map(Object.entries(_pairs));
          setPairs(pairs, pageNo);
        }
      }
      router.events.emit("routeChangeComplete")
      setLoading("")
    }
    init()
    setMessage("Make sure you have inputted all of the data correctly before proceeding to the next step (viewing the data in spreadsheet form).")
  }, [files])

  useEffect(() => {
    localStorage.setItem("reviewUploadedImage", imageBase64Str)
  }, [imageBase64Str])
  


  const setValueForId = (id: number, pageNo: number, value: string) => {
    setState((state) => {
      const table = state[pageNo - 1];
      if (!table) return state;
      const index = table.findIndex((pair) => pair.id === id);
      const cpair = table.find((pair) => pair.id === id);
      const newPair = { ...cpair, value } as TableRow;
      const newTable = [...table.slice(0, index), newPair, ...table.slice(index + 1)] as Table;
      return [...state.slice(0, pageNo - 1), newTable, ...state.slice(pageNo)];
    });
  };

  const setPairs = ((pair: Map<string, string>, pageNo: number) => {
    setState((state) => {
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
        const newPair = { ...cpair, value: pair.get(cpair.key) } as TableRow;
        newTable = [...newTable.slice(0, index), newPair, ...newTable.slice(index + 1)]
      }
      return [...state.slice(0, pageNo - 1), newTable, ...state.slice(pageNo)];
    });
  });

  useEffect(() => {
    localStorage.setItem('reviewData', JSON.stringify(state))
  }, [state])
  

  const toRowComponent = (data: TableRow) => { 
    return (
    <div key={data.id}>
      <HeaderDivider />
      <HeaderInput label1={data.key}>
        <Input
          value={data.value}
          type="dropdown"
          name={"submissionType"}
          placeholder={"Value"}
          // @ts-ignore
          dropdown_items={dropDownOptions}
          required={true}
          // @ts-ignore
          additional_styles="w-full"
          onChange={(e) => setValueForId(data.id, pageNo, e.target.value)}
          withSearch
        />
      </HeaderInput>
    </div>
  ) };

  // TODO HAVE NOT BEEN INTEGRATED YET
  // TODO INTEGRATE THIS WORKFLOW TO THE MAIN APP. 

  return (
    Loading ?
      <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
        <p className="text-xl font-semibold text-gray-500">{Loading}</p>
      </div>
      :
      <Container additional_class="full-height relative">
        <Container.Title>Data Matching</Container.Title>
        <div className="grid grid-cols-2">
          <HeaderTable>
            {state[pageNo - 1]?.map(toRowComponent)}
            <HeaderDivider />
          </HeaderTable>
          <img src={imageBase64Str} alt="" className="object-contain m-auto" />
        </div>
        <ButtonsSection>
          {/* @ts-ignore */}
          <Buttons button_description="View on sheets" path="/upload_file/review" additional_styles="bg-primary" />
          {/* @ts-ignore */}
          <Buttons path="" additional_styles="bg-primary" button_description="Previous Page" onClick={prevPage}/>
          {/* @ts-ignore */}
          <Buttons path="" additional_styles="bg-primary" button_description="Next Page" onClick={nextPage}/>
        </ButtonsSection>
        <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-green-500 text-white px-3 rounded-lg py-2 transition-all ${Message ? "" : "-translate-y-20"}`}>
          <p>{Message}</p>
          {/* @ts-ignore */}
          <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setMessage("") }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Buttons>
        </div>
      </Container>
  );
}
