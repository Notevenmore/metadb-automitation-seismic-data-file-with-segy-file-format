import { useState } from "react";
import Container from "../../components/container/container";
import HeaderTable, {
  HeaderDivider,
  ButtonsSection,
  HeaderRow,
  HeaderInput,
} from "../../components/header_table/header_table";
import Buttons from "../../components/buttons/buttons";
import { ImageEditor, Tuple4 } from "../components/highlight_viewer";

interface TableRow {
  id: number,
  key: string,
  value: string | null
}

const initialState: TableRow[] = [
  {
    id: 0,
    key: "NO",
    value: null,
  },
  {
    id: 1,
    key: "BA_LONG_NAME",
    value: null,
  },
  {
    id: 2,
    key: "BA_TYPE",
    value: null,
  },
  {
    id: 3,
    key: "AREA_ID",
    value: null,
  },
  {
    id: 4,
    key: "AREA_TYPE",
    value: null,
  },
  {
    id: 5,
    key: "FIELD_NAME",
    value: null,
  },
  {
    id: 6,
    key: "WELL_NAME",
    value: null,
  },
  {
    id: 7,
    key: "UWI",
    value: null,
  },
  {
    id: 8,
    key: "TITLE",
    value: null,
  },
  {
    id: 9,
    key: "CREATOR_NAME",
    value: null,
  },
  {
    id: 10,
    key: "CREATE_DATE",
    value: null,
  },
  {
    id: 11,
    key: "MEDIA_TYPE",
    value: null,
  },
  {
    id: 12,
    key: "DOCUMENT_TYPE",
    value: null,
  },
  {
    id: 13,
    key: "ITEM_CATEGORY",
    value: null,
  },
  {
    id: 14,
    key: "ITEM_SUB_CATEGORY",
    value: null,
  },
  {
    id: 15,
    key: "PAGE_COUNT",
    value: null,
  },
  {
    id: 16,
    key: "REMARK",
    value: null,
  },
  {
    id: 17,
    key: "BA_LONG_NAME",
    value: null,
  },
  {
    id: 18,
    key: "BA_TYPE",
    value: null,
  },
  {
    id: 19,
    key: "DATA_STORE_NAME",
    value: null,
  },
  {
    id: 20,
    key: "DATA_STORE_TYPE",
    value: null,
  },
  {
    id: 21,
    key: "SOURCE",
    value: null,
  },
  {
    id: 22,
    key: "QC_STATUS",
    value: null,
  },
  {
    id: 23,
    key: "CHECKED_BY_BA_ID",
    value: null,
  },
];

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
    const response = await fetch(`${process.env.OCR_SERVICE}/ocr_service/v1/scrape-bounds/${doc_id}/${page_no}`, requestOptions);
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result)}};
  } catch (e) {
    console.log(e);
    return { status: "failed", body: null };
  }
}


export default function MatchingGuided() {

  const doc_id: string = "c5fd3ac264d654b04b759f193a16254b8eb0c878a3f0de0f914aaf2cae3da47f";
  const page_no: number = 2;

  const [ state, setState ] = useState<TableRow[]>(initialState);
  const [ selectedRow, setSelectedRow ] = useState<number>(-1);
  const [ message, setMessage ] = useState<string>("");

  async function boundsObserver(bounds: Tuple4<number>[]) {
    if (bounds.length === 0) return;
    const last = bounds.length - 1;
    const bound = bounds[ last ];
    const response = await extractTextFromBounds(doc_id, page_no, bound);
    if (response.status === "success") {
      setValueForId(selectedRow, response.body.word);
    }
  }

  const setValueForId = (id: number, value: string) => {
    setState((state) => {
      const index = state.findIndex((pair) => pair.id === id);
      const cpair = state.find((pair) => pair.id === id);
      const newPair = { ...cpair, value };
      return [...state.slice(0, index), newPair, ...state.slice(index + 1)];
    });
  };

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

  return (
    <Container additional_class="full-height relative">
      <Container.Title>Data Matching</Container.Title>
      <div className="grid grid-cols-2 gap-14">
        <HeaderTable>
          {state.map(toRowComponent)}
          <HeaderDivider />
        </HeaderTable>
        <ImageEditor boundsObserver={boundsObserver} imageUrl={`${process.env.OCR_SERVICE_URL}/ocr_service/v1/image/${doc_id}/${page_no}`} />
      </div>
      <ButtonsSection>
        {/* @ts-ignore */}
        <Buttons button_description="View on sheets" path="/upload_file/review" additional_styles="bg-primary" />
      </ButtonsSection>
      <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-green-500 text-white px-3 rounded-lg py-2 transition-all ${message ? "" : "-translate-y-20"}`}>
        <p>{message}</p>
        {/* @ts-ignore */}
        <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setMessage("") }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Buttons>
      </div>
    </Container>
  )
}