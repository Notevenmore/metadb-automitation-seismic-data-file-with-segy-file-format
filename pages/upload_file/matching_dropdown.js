/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import Buttons from "../../components/buttons/buttons";
import Container from "../../components/container/container.js";
import Input from "../../components/input_form/input";
import HeaderTable, {
  HeaderDivider,
  ButtonsSection,
  HeaderRow,
  HeaderInput,
} from "../../components/header_table/header_table";
import { useDispatch, useSelector } from "react-redux";
import { setDocumentSummary, setReviewData } from "../../store/generalSlice";
import { useRouter } from "next/router";
import { ImageEditor, Tuple4 } from "../components/highlight_viewer";
import ChevronLeft from '../../public/icons/chevron-left.svg'
import ChevronRight from '../../public/icons/chevron-right.svg'
import Highlight from 'react-highlight'

const FullButton = ({ children, onClick }) => {
  return (
    <button
      className="
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

const HeaderRowWithGap = ({ children }) => {
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

const HeaderInputInput = ({ leftChildren, rightChildren }) => {
  return (
    <HeaderRowWithGap>
      <>{leftChildren}</>
      <>{rightChildren}</>
    </HeaderRowWithGap>
  );
};

const DeleteButton = ({ children, onClick }) => (
  <>
    <button
      className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-red-300 hover:bg-red-200 transition-all justify-center w-[4rem]"
      onClick={onClick}
    >
      {children}
    </button>
  </>
);

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString());
    reader.onerror = (error) => reject(error);
  });

const newDefaultPair = {
  id: 0,
  key: null,
  value: null,
};

const generateKeyValuePair = () => {
  const newPair = { ...newDefaultPair };
  newPair.id = uuidv4();
  return newPair;
};

const uploadImage = async (imageBase64Str) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "base64str": imageBase64Str
  });

  var requestOptions = {
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
    return { status: "failed", body: null }
  }
}

const postScrapeAnnotate = async (docId, page) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${process.env.OCR_SERVICE_URL}/ocr_service/v1/scrape/${docId}/${page}`,
      requestOptions
    );
    const result = await response.text();
    return { status: "success", body: { ...JSON.parse(result) } };
  } catch (e) {
    console.log(e);
    return { status: "failed", body: null };
  }
};

const fetchDocumentSummary = (async (docId) => {
  var requestOptions = {
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
    return { status: "failed", body: null };
  }
});

const generateImageUrl = (docId, page) => {
  return `${process.env.OCR_SERVICE_URL}/ocr_service/v1/annotate/${docId}/${page}`;
}

export default function MatchReview({ setTitle }) {
  setTitle("Upload File - Data Matching")
  const initialState = [
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

  const [state, setState] = useState({});
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [imageBase64Str, setImageBase64Str] = useState("");
  const [docId, _setDocId] = useState(null);
  const [totalPageNo, setTotalPageNo] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [Loading, setLoading] = useState("")
  const [Message, setMessage] = useState("")
  const [formType, setformType] = useState("")
  const [error, setError] = useState("")

  const inputFileRef = useRef(null);

  const files = useSelector((state) => state.general.file)
  const router = useRouter()
  const dispatch = useDispatch()
  const path_query = "Home" + router.pathname.replace(/\//g, " > ").replace(/\_/g, " ")

  const setDocId = ((newDocId) => {
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
    if (router.query.form_type) {
      setformType(String(router.query.form_type))
    }
  }, [router])

  useEffect(() => {
    const onPageChange = async () => {
      if (docId === null) return
      setImageBase64Str(_ => generateImageUrl(docId, pageNo));
      const responseWords = await postScrapeAnnotate(docId, pageNo);
      if (responseWords.status === "success") {
        setDropDownOptions(_ => responseWords.body.words);
        // setState(_ => [...initialState]);
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
        try {
          const file = files[0];
          //   const filename = file.name;
          //   const size = file.size;
          const imageBase64Str = await toBase64(file);

          setLoading("Uploading document...")
          const uploadResponse = await uploadImage(imageBase64Str);
          if (uploadResponse.status === "failed" || !uploadResponse.body) {
            throw "Something went wrong with the OCR service. Response body returned null on file upload."
          };
          const { doc_id: docId } = uploadResponse.body;

          setLoading("Getting uploaded document's summary...")
          const summaryResponse = await fetchDocumentSummary(docId);
          if (summaryResponse.status !== "success" || !summaryResponse.body.page_count) {
            throw "Something went wrong with the OCR service. Response body returned null on document summary."
          }
          setTotalPageNo(_ => summaryResponse.body.page_count);
          dispatch(setDocumentSummary({ ...summaryResponse, document_id: docId }))
          setDocId(docId);

          setLoading("Populating drop down items...")
          const result = await postScrapeAnnotate(docId, pageNo);
          if (result.status !== "success" || !result.body.words) {
            throw "Something went wrong with the OCR service. Response body returned null on word scraping."
          }
          setImageBase64Str((_) => generateImageUrl(docId, pageNo));
          setDropDownOptions((_) => result.body.words);
          // setState((_) => initialState);

          setLoading(`Getting appropriate properties for data type ${router.query.form_type}`)
          const row_names = await fetch('http://localhost:5050/getHeaders', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            // TODO change form_type to be dynamic later
            // FINISHED
            body: JSON.stringify({
              form_type: router.query?.form_type || "basin"
            })
          }).then(response => {
            return response.json()
          }).catch(error => { throw error })

          setLoading(`Setting appropriate properties for data type ${router.query.form_type}`)
          let temp_obj = {}
          for (let idx = 0; idx < summaryResponse.body.page_count; idx++) {
            let temp = []
            row_names.response.forEach((row_name, index) => {
              temp.push({
                id: index,
                key: row_name.toLowerCase(),
                value: "",
              },)
            });
            temp_obj[idx] = temp
          }
          setState(temp_obj)
          setLoading("");
        } catch (error) {
          setError(String(error))
        }
      }
      router.events.emit("routeChangeComplete")
      setLoading("")
      setTimeout(() => {
        setMessage("Make sure you have inputted all of the data correctly before proceeding to view them in the spreadsheet.")
      }, 3000)
    }
    init()
  }, [files])

  useEffect(() => {
    localStorage.setItem("reviewUploadedImage", imageBase64Str)
  }, [imageBase64Str])



  const handleUploadButtonClick = (_) => {
    inputFileRef.current.click();
  };

  const handleChangeUploadFile = async (e) => {
    const files = e.target.files;
    if (files !== null) {
      const file = files[0];
      //   const filename = file.name;
      //   const size = file.size;
      const imageBase64Str = await toBase64(file);
      const result = await postScrapeAnnotate(imageBase64Str);
      console.log(result);
      if (result.status === "success") {
        setImageBase64Str((_) => result.body.base64str);
        setDropDownOptions((_) => result.body.dropdown);
        // setState((_) => initialState);
      }
    } else {
    }
  };

  const setKeyForId = (id, key) => {
    setState((state) => {
      const index = state.findIndex((pair) => pair.id === id);
      const cpair = state.find((pair) => pair.id === id);
      const newPair = { ...cpair, key };
      return [...state.slice(0, index), newPair, ...state.slice(index + 1)];
    });
  };

  const setValueForId = (id, value) => {
    setState((state) => {
      // creating a copy to prevent direct mutation that causes error in redux
      let final = { ...state }
      const index = final[pageNo - 1].findIndex((pair) => pair.id === id);
      const cpair = final[pageNo - 1].find((pair) => pair.id === id);
      const newPair = { ...cpair, value };
      final[pageNo - 1] = [...final[pageNo - 1].slice(0, index), newPair, ...final[pageNo - 1].slice(index + 1)]
      console.log(final)
      return { ...final };

      // const index = state.findIndex((pair) => pair.id === id);
      // const cpair = state.find((pair) => pair.id === id);
      // const newPair = { ...cpair, value };
      // return [...state.slice(0, index), newPair, ...state.slice(index + 1)];
    });
  };

  // TODO CHANGE THIS TO USE REDUX
  useEffect(() => {
    console.log(state)
    dispatch(setReviewData(state))
    // localStorage.setItem('reviewData', JSON.stringify(state))
    // console.log(localStorage.getItem('reviewData'))
  }, [state])


  const removePair = (id) => {
    setState((state) => {
      const index = state.findIndex((pair) => pair.id === id);
      return [...state.slice(0, index), ...state.slice(index + 1)];
    });
  };

  const addPair = () => {
    setState((state) => {
      const newPair = generateKeyValuePair();
      return [...state, newPair];
    });
  };

  const toRowComponent = (data) => (
    <div key={data.id}>
      <HeaderDivider />
      <HeaderInput label1={data.key.replace(/\_/g, " ").split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}>
        <Input
          value={data.value}
          type="dropdown"
          name={"submissionType"}
          placeholder={"Value"}
          dropdown_items={dropDownOptions}
          required={true}
          additional_styles="w-full"
          onChange={(e) => setValueForId(data.id, e.target.value)}
          withSearch
        />
      </HeaderInput>
      {/* <HeaderInputInput
        leftChildren={
          <>
            <input type="checkbox" className="mr-2" />
            <DeleteButton onClick={(_) => removePair(data.id)}>
              Delete
            </DeleteButton>
            <Input
              value={data.key}
              type="dropdown"
              name={"submissionType"}
              placeholder={"Key"}
              dropdown_items={dropDownOptions}
              required={true}
              additional_styles="w-full"
              onChange={(e) => setKeyForId(data.id, e.target.value)}
            />
          </>
        }
        rightChildren={
          <Input
            value={data.value}
            type="dropdown"
            name={"submissionType"}
            placeholder={"Value"}
            dropdown_items={dropDownOptions}
            required={true}
            additional_styles="w-full"
            onChange={(e) => setValueForId(data.id, e.target.value)}
          />
        }
      /> */}
    </div>
  );

  // TODO FIX THIS WORKFLOW TO INCLUDE MULTIPLE PAGES AND INTERACTIVE DOCUMENT VIEWER
  // DONE

  return (
    (Loading) ? (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin border-4 border-t-transparent border-gray-500/[.7] rounded-full w-14 h-14"></div>
        <p className="text-xl font-semibold text-gray-500">{Loading}</p>
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
        <div className="grid grid-cols-2 gap-2 border-[2px] rounded-lg p-2">
          <HeaderTable>
            {state[pageNo - 1]?.map(toRowComponent)}
            {/* <HeaderDivider /> */}
            {/* <HeaderRow>
            <FullButton onClick={addPair}>+</FullButton>
          </HeaderRow> */}
          </HeaderTable>
          <div className="h-[calc(100vh-55px)] sticky top-0 grid grid-cols-1 rounded-lg overflow-clip">
            <ImageEditor boundsObserver={() => { }} imageUrl={imageBase64Str} />
          </div>
          {/* <img src={imageBase64Str} alt="" className="object-contain m-auto" /> */}
        </div>
        <input
          accept="image/*"
          style={{ display: "none" }}
          ref={inputFileRef}
          type="file"
          hidden
          onChange={handleChangeUploadFile}
        />
        {(totalPageNo > 1) ? (
          <div className="flex items-center justify-center sticky bottom-2 my-4 z-[10000] w-full pointer-events-none">
            <div className="w-fit flex space-x-2 items-center justify-center bg-white rounded-lg p-2 border pointer-events-auto">
              {/* @ts-ignore */}
              <Buttons path="" title="Previous page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={prevPage} disabled={pageNo > 1 ? false : true} ><div className="w-5 h-5"><ChevronLeft /></div></Buttons>
              {/* @ts-ignore */}
              <div path="" title="" button_description="" className="bg-white border-2 p-3 cursor-default select-none text-center rounded-lg"><p className="w-5 h-5">{pageNo}</p></div>
              {/* @ts-ignore */}
              <Buttons path="" title="Next page" button_description="" additional_styles="bg-white border-2 p-3 hover:bg-gray-200" onClick={nextPage} disabled={pageNo >= totalPageNo ? true : false}><div className="w-5 h-5"><ChevronRight /></div></Buttons>
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-center w-full py-4">
          {/* @ts-ignore */}
          <Buttons button_description="View on sheets" path="/upload_file/review" query={{ form_type: formType }} additional_styles="px-20 bg-searchbg/[.6] hover:bg-searchbg font-semibold" disabled={formType ? false : true} onClick={() => { dispatch(setReviewData(state)) }} />
        </div>
        <ButtonsSection>
          {/* <Buttons
            path=""
            additional_styles="bg-primary"
            component="label"
            onClick={handleUploadButtonClick}
          >
            Upload File
          </Buttons>
          <Buttons path="" additional_styles="bg-primary">
            Save changes
          </Buttons>
          <Buttons path="" additional_styles="bg-primary">
            Save and exit
          </Buttons>
          <Buttons path="" additional_styles="text-error">
            Cancel
          </Buttons> */}
          {/* <Buttons button_description="View on sheets" path="/upload_file/review" additional_styles="bg-primary" />
          <Buttons path="" additional_styles="bg-primary" button_description="Previous Page" onClick={prevPage} />
          <Buttons path="" additional_styles="bg-primary" button_description="Next Page" onClick={nextPage} /> */}
        </ButtonsSection>
        <div className={`flex items-center space-x-2 fixed top-5 left-[50%] translate-x-[-50%] bg-green-500 text-white px-3 rounded-lg py-2 transition-all ${Message ? "" : "-translate-y-20"}`}>
          <p>{Message}</p>
          <Buttons additional_styles="px-1 py-1 text-black" path="" onClick={() => { setMessage("") }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Buttons>
        </div>
      </Container>
    )
  );
}
