import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx-js-style";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { UploadDocumentSettings, displayErrorMessage, setUploadDocumentSettings } from "@store/generalSlice";
import Sheets from "@components/Sheets";
import {useAppDispatch} from '@store/index';
import {
  downloadWorkspace,
  init_data,
  logError, 
  saveDocument,
  sendDeleteSpreadsheet,
  showErrorToast,
} from '../../../components/utility_functions';
import {parseCookies} from 'nookies';
import {TokenExpired} from '../../../services/admin';
import {delay} from '../../../utils/common';

interface Props {
  config: any,
  preview: string;
}

interface FormData {
  workingArea: string;
  afenumber: number;
}

interface AutomaticDataStructure {
  data: any[];
  otherData: any[];
  fileFormat: string;
  dataType: string;
}

export default function Preview({ config, preview }: Props) {
  const [data, setData] = useState([{}]);
  const [workspace, setWorkspace] = useState<UploadDocumentSettings>();
  const [workspaceAutomatic, setWorkspaceAutomatic] = useState<UploadDocumentSettings[]>(); 
  const [cellBase, setCellBase] = useState<Matrix<CellBase<any>>>();
  const [load, setLoad] = useState<boolean>(false);
  const router = useRouter();
  const [spreadsheetReady, setspreadsheetReady] = useState(false);
  const [spreadsheetId, setspreadsheetId] = useState();
  const [IsSaved, setIsSaved] = useState(false);
  const [automaticData, setAutomaticData] = useState<AutomaticDataStructure[]>();
  const [automaticType, setAutomaticType] = useState<string>();
  const [multiSpreadSheetId, setMultiSpreadSheetId] = useState<any>();
  const [selectedDataType, setSelectedDataType] = useState<string>();
  const warningText =
    'You have unsaved changes - Are you sure you want to leave this page?';

  const dispatch = useAppDispatch();
  const [submission, setSubmission] = useState(['Quarterly', 'Relinquishment', 'Termination', 'Spec New', 'Spec Ext', 'Spec Term', 'Joint Study', 'DIPA']);

  useEffect(() => {
    const confirmedData = localStorage.getItem("confirmedData");
    if(confirmedData) setAutomaticData(JSON.parse(confirmedData));
  }, [])

  useEffect(() => {
    if(preview === "index") {
      if(automaticData) {
        const automatic = automaticData.map((value) => {
          return {
            workspace_name: "",
            kkks_name: "Acme.Co",
            working_area: "",
            submission_type: "",
            afe_number: null,
            DataType: value.dataType,
          }
        });
        setSelectedDataType(automaticData[0].dataType);
        setWorkspaceAutomatic(automatic);
      }
    }
  }, [automaticData])

  useEffect(() => {
    const datas = localStorage.getItem(`confirmed${preview}`);
    const formData = localStorage.getItem("data");
    if (datas) {
      setData(JSON.parse(datas));
    }
    if (formData) {
      setWorkspace(JSON.parse(formData));
    }
  }, []);

  useEffect(() => {
    if (data.length > 0 && typeof data[0] === "object") {
      const headingData = Object.keys(data[0]).map((key) => {
        return { value: key, readOnly: true };
      });
      const contentsData: { value: unknown; readOnly: boolean }[][] = [];
      data.map((value) => {
        const contentData = Object.values(value).map((val) => {
          return { value: val, readOnly: false };
        });
        contentsData.push(contentData);
      });
      const cellData = [headingData, ...contentsData];
      setCellBase(cellData);
    }
  }, [data]);

  useEffect(() => {
    if (load && cellBase) {
      const key = cellBase[0].map((items) => {
        return items?.value;
      });
      cellBase.map((items, index) => {
        if (index > 0) {
          const datas = Object.values(data[index - 1]);
          let id = 0;
          let thekey = null;
          const changesData = items.find((value, i) => {
            if (datas[i] !== items[i]?.value) {
              id = index;
              thekey = key[i];
              return value;
            }
          });
          if (thekey && id > 0) {
            let updateData = [...data];
            updateData[id - 1] = {
              ...updateData[id - 1],
              [thekey]: changesData?.value,
            };
            setData(updateData);
          }
        }
      });
      setLoad(false);
    }
  }, [load]);

  useEffect(() => {
    const handleWindowClose = e => {
      e.preventDefault();
      if (!IsSaved) return (e.returnValue = warningText);
      return;
    };

    // This function handles navigation away from the current page by checking whether unsaved changes are present and displaying a warning dialog if necessary
    const handleBrowseAway = url => {
      if (!IsSaved) {
        // If there are unsaved changes, prompt the user with a warning dialog
        if (url === router.asPath || !window.confirm(warningText)) {
          // Emit a routeChangeError event and throw an error to prevent navigation away from the page
          history.go(1);
          router.events.emit('routeChangeError');
          throw 'routeChange aborted.';
        }
      }
      sendDeleteSpreadsheet(config, spreadsheetId);
      // If there are no unsaved changes, allow navigation away from the page
      return;
    };
    window.addEventListener('beforeunload', handleWindowClose);
    window.addEventListener('pagehide', () => {
      sendDeleteSpreadsheet(config, spreadsheetId);
    });
    router.events.on('beforeHistoryChange', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      window.removeEventListener('pagehide', () => {
        sendDeleteSpreadsheet(config, spreadsheetId);
      });
      router.events.off('beforeHistoryChange', handleBrowseAway);
    };
  }, [IsSaved, router, spreadsheetId]);

  useEffect(() => {
    if(spreadsheetId && automaticType){
      setMultiSpreadSheetId({...multiSpreadSheetId, [automaticType]: spreadsheetId});
    }
  }, [spreadsheetId, automaticType]);

  useEffect(() => {
    if (spreadsheetReady) {
      setTimeout(() => {
        dispatch(
          displayErrorMessage({
            message:
              'Please input dates using the YYYY-MM-DD format if you are using Google Spreadsheet as the interface. Spreadsheet will convert it to the correct format (DD/MM/YYYY) afterwards. You can set the date formatting by clicking the input column then going to Format > Number in the menu bar.',
            color: 'blue',
            duration: 20000,
          }),
        );
      }, 3000);
    }
  }, [dispatch, spreadsheetReady]);

  const addMoreData = () => {
    localStorage.removeItem(preview);
    localStorage.removeItem(`${preview}Data`);
    localStorage.removeItem(`confirmed${preview}`);
    localStorage.setItem(`confirmed${preview}`, JSON.stringify(data));
    router.push(`/connect-to-local-directory/${preview}`);
  };

  const saveDocumentOperation = async (redirect: boolean = false) => {
    if(preview !== "index") {
      saveDocumentHandler(redirect, spreadsheetId, workspace);
    } else {
      if(workspaceAutomatic) {
        Object.entries(multiSpreadSheetId).map(async ([key, value]) => {
          const workspaceData = {...workspaceAutomatic.find(value => value.DataType === key), DataType: key, workspace_name: `record_${workspaceAutomatic.find(value => value.DataType === key).afe_number}`}
          await makenew(workspaceData, key);
          await saveDocumentHandler(false, value as string, workspaceData, key);
        });
      }

      if(redirect) {
        localStorage.removeItem("confirmedData");
        localStorage.getItem("data");
        dispatch(
          displayErrorMessage({
            message: 'Redirecting back to record list...',
            color: 'blue',
            duration: 1500,
          }),
        );
        await delay(1000);
        router.push("/");
      }
    }
  }

  const saveDocumentHandler = async (redirect: boolean = false, spreadsheetId: string, workspace: UploadDocumentSettings, automatic?: string) => {
    router.events.emit('routeChangeStart');
    saveDocument(null, router, config, spreadsheetId, workspace, dispatch, automatic? automatic : undefined)
      .then(async result => {
        if (result.success) {
          setIsSaved(true);
          dispatch(
            displayErrorMessage({
              message: 'Record successfully saved',
              color: 'blue',
              duration: 3000,
            }),
          );
          router.events.emit('routeChangeComplete');
          if (redirect) {
            localStorage.removeItem(preview);
            localStorage.removeItem(`${preview}Data`);
            localStorage.removeItem(`confirmed${preview}`);
            localStorage.removeItem('data');
            await delay(1000);
            dispatch(
              displayErrorMessage({
                message: 'Redirecting back to record list...',
                color: 'blue',
                duration: 1500,
              }),
            );
            await delay(1000);
            router.push("/");
          }
        }
      })
      .then(() => {
        router.events.emit('routeChangeComplete');
      })
      .catch(error => {
        // Handle error and display error message
        showErrorToast(dispatch, error);
      })
      .finally(() => {
        router.events.emit('routeChangeComplete');
      });
  }

  const makenew = async (newWorkspace, preview: string) => {
    router.events.emit('routeChangeStart'); 
    try {
      dispatch(
        displayErrorMessage({
          message:
            "Creating a new record... Please don't leave this page or click anything",
          color: 'blue',
        }),
      );
      await fetch(`${config[preview]['afe']}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
        body: JSON.stringify(newWorkspace),
      })
        .then(res => {
          if (res.status === 200) {
            console.log(res.statusText);
            return res.statusText;
          } else {
            TokenExpired(res.status);
            console.log(res);
            return res.text();
          }
        })
        .then(res => {
          if (res.toLowerCase() === 'ok') {
            return true;
          } else if (res.toLowerCase().includes('workspace_name_unique')) {
            throw `A record with the name "${newWorkspace.workspace_name}" already exists. Please choose a different name.`;
          } else if (res.toLowerCase().includes('afe_pk_error')) {
            throw `A record with AFE number ${newWorkspace.afe_number} already exists. Please choose a different one.`;
          } else {
            throw (
              res ||
              'Something happened while updating record information data. Please try again or contact maintainer if the problem persists.'
            );
          }
        });
      dispatch(setUploadDocumentSettings(newWorkspace));
      setTimeout(() => {
        dispatch(
          displayErrorMessage({
            message: 'Success. Redirecting to the next page...',
            color: 'blue',
            duration: 1500,
          }),
        );
      }, 0);
      router.events.emit('routeChangeComplete');
    } catch (error) {
      // Handle error and display error message
      showErrorToast(dispatch, error);
    }
    await delay(1500);
    router.events.emit('routeChangeComplete');
  };

  const downloadWorkspaceHandler = () => {
    router.events.emit('routeChangeStart');
    saveDocument(null, router, config, spreadsheetId, workspace, dispatch)
      .then(async result => {
        if (result.success) {
          downloadWorkspace(router, config, workspace, dispatch)
            .then(result => {
              if (result.success) {
                dispatch(
                  displayErrorMessage({
                    message: `Success. Record converted to XLSX with file name "${workspace.workspace_name}.xlsx"`,
                    color: 'blue',
                    duration: 3500,
                  }),
                );
                setIsSaved(false);
                router.events.emit('routeChangeComplete');
              }
            })
            .catch(error => {
              showErrorToast(dispatch, error);
            })
            .finally(() => {
              router.events.emit('routeChangeComplete');
            });
        } else {
          throw 'Something went wrong when saving changes.';
        }
      })
      .catch(error => {
        // Handle error and display error message
        showErrorToast(dispatch, error);
      })
      .finally(() => {
        router.events.emit('routeChangeComplete');
      });
  };

  return (
    <main className="flex min-h-screen flex-col p-7 gap-5 overflow-scroll">
      <div className="flex flex-row gap-3 text-gray-600 items-center">
        <p>Seismic Data</p>
        <p> {">"} </p>
        <p>Load Data</p>
      </div>
      <div className="h-[100vh] flex flex-col items-center">
        <div className="flex flex-col items-center w-full gap-8">
          <div className="flex flex-col w-full bg-white rounded-xl border-gray-400 border-2 overflow-hidden items-center">
            <h1 className="w-full bg-gray-300 p-3 text-black font-bold text-base">Header</h1>
            {workspace ? (
              <form className="w-full flex flex-col">
                <div className="border-gray-400 border-y-2 flex items-center justify-between w-full px-5 py-2 ">
                  <div className="flex flex-row gap-10">
                    <label htmlFor="" className="text-black">
                      Nama KKKS
                    </label>
                    <p className="text-gray-400">( KKKS Name )</p>
                  </div>
                  <input type="text" className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black" placeholder="Nama KKKS" value={"Acme.Co"} />
                </div>
                <div className="border-gray-400 border-y-2 flex items-center justify-between w-full px-5 py-2 ">
                  <div className="flex flex-row gap-10">
                    <label htmlFor="" className="text-black">
                      Nama Wilayah Kerja
                    </label>
                    <p className="text-gray-400">( Working area )</p>
                  </div>
                  {
                    preview !== "index"
                      ? <input
                          type="text"
                          className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black"
                          placeholder="Nama Wilayah Kerja"
                          value={workspace.working_area ?workspace.working_area : ""}
                          onChange={(e) =>
                            setWorkspace((prev) => {
                              return {
                                ...prev,
                                working_area: e.target.value,
                              };
                            })
                          }
                        />
                      : <input
                          type="text"
                          className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black"
                          placeholder="Nama Wilayah Kerja"
                          value={workspaceAutomatic ? workspaceAutomatic.find(value => value.DataType !== selectedDataType).working_area : ""}
                          onChange={(e) => {
                            if(workspaceAutomatic) {
                              const updated =  workspaceAutomatic.map((value) => {
                                return {
                                  ...value,
                                  working_area: e.target.value,
                                }
                              });
                              setWorkspaceAutomatic(updated);
                            }
                          }}
                        />
                  }
                </div>
                <div className="border-gray-400 border-y-2 flex items-center justify-between w-full px-5 py-2 ">
                  <div className="flex flex-row gap-10">
                    <label htmlFor="" className="text-black">
                      Jenis Penyerahan Data
                    </label>
                    <p className="text-gray-400">( Submission type )</p>
                  </div>
                  {
                  preview !== "index"
                    ? <select value={workspace.submission_type} className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black" onChange={(e) => setWorkspace({...workspace, submission_type: e.target.value})}>
                        {submission.map((data, index) => {
                          return <option key={index} value={data}>{data}</option>
                        })}
                        <option value="">{"Choose Submission type"}</option>
                      </select>
                    : <select 
                        value={workspaceAutomatic && workspaceAutomatic.find(value => value.DataType === selectedDataType).submission_type} 
                        className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black" 
                        onChange={(e) => {
                          if(workspaceAutomatic) {
                            const updated =  workspaceAutomatic.map((value) => {
                              return {
                                ...value,
                                submission_type: e.target.value,
                              }
                            });
                            setWorkspaceAutomatic(updated);
                          }
                        }}
                      >
                        {submission.map((data, index) => {
                          return <option key={index} value={data}>{data}</option>
                        })}
                        <option value="">{"Choose Submission type"}</option>
                      </select>
                  }
                  
                </div>
                <div className="border-gray-400 border-y-2 flex items-center justify-between w-full px-5 py-2 ">
                  <div className="flex flex-row gap-10">
                    <label htmlFor="" className="text-black">
                      Nomor AFE
                    </label>
                    <p className="text-gray-400">( AFE Number )</p>
                  </div>
                  {
                    preview !== "index"
                      ? <input
                          type="number"
                          className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black"
                          placeholder="Nama KKKS"
                          value={workspace.afe_number ? workspace.afe_number : ""}
                          onChange={(e) =>
                            setWorkspace((prev) => {
                              return {
                                ...prev,
                                afe_number: e.target.value !== "" ? Number(e.target.value) : 0,
                              };
                            })
                          }
                          disabled
                        />
                      : <input
                          type="number"
                          className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black"
                          placeholder="AFE Number"
                          value={workspaceAutomatic && workspaceAutomatic.find(value => value.DataType === selectedDataType).afe_number || ""}
                          onChange={(e) => {
                            if(workspaceAutomatic) {
                              const updated =  workspaceAutomatic.map((value) => {
                                return {
                                  ...value,
                                  afe_number: e.target.value != "" ? Number(e.target.value) : 0,
                                }
                              });
                              setWorkspaceAutomatic(updated);
                            }
                          }}
                        />
                  }
                </div>
                <div className="border-gray-400 border-y-2 flex items-center justify-between w-full px-5 py-2 ">
                  <div className="flex flex-row gap-10">
                    <label htmlFor="" className="text-black font-bold">
                      Data Type
                    </label>
                    =
                  </div>
                  {
                    preview !== "index"
                      ? <input
                          type="text"
                          className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black"
                          placeholder="Nama KKKS"
                          value={preview
                            .split("_")
                            .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
                            .join(" ")}
                          disabled
                        />
                      : <select 
                          value={selectedDataType} 
                          className="p-2 w-96 bg-gray-300 rounded-lg text-black placeholder:text-black" 
                          onChange={(e) => { setSelectedDataType(e.target.value) }}
                        >
                          {automaticData && automaticData.map((data, index) => {
                            return <option key={index} value={data.dataType}>{data.dataType.split("_").map((value => value.charAt(0).toUpperCase()+value.slice(1))).join(" ")}</option>
                          })}
                        </select>
                  }
                </div>
              </form>
            ) : (
              <div>{"Waiting..."}</div>
            )}
          </div>
          {cellBase ? (
            <div className="flex flex-col w-full h-[100vh] bg-white rounded-xl border-gray-400 border-2 gap-3 overflow-hidden items-center">
              <h1 className="w-full bg-gray-300 p-3 text-black font-bold text-base">Data</h1>
              <div className="flex flex-row self-start">
                <button className="bg-black text-white rounded-xl p-2 mx-2 font-bold hover:bg-white hover:text-black" onClick={downloadWorkspaceHandler}>
                  Export to XLSX
                </button>
                <button className="bg-black text-white rounded-xl p-2 mx-2 font-bold hover:bg-white hover:text-black" onClick={addMoreData}>
                  Add More Data
                </button>
                <button className="bg-black text-white rounded-xl p-2 mx-2 font-bold hover:bg-white hover:text-black" onClick={() => saveDocumentOperation(true)}>
                  Save Changes & Exit
                </button>
              </div>
              <div className="w-full h-full overflow-scroll text-center [scrollbar-width:thin]">
                {
                  preview !== "index"
                    ? <Sheets
                          type="review"
                          form_type={router?.query.form_type || 'basin'}
                          data={data}
                          finishedInitializing={setspreadsheetReady}
                          getSpreadsheetID={setspreadsheetId}
                          config={config}
                      />
                    : workspaceAutomatic && workspaceAutomatic.map((value, index) => {
                      return <div key={index} className={value.DataType !== selectedDataType ? "hidden" : "block w-full h-full"}>
                        <Sheets 
                            key={index}
                            type="review"
                            form_type={value.DataType}
                            data={automaticData.find(v => v.dataType === value.DataType).data}
                            finishedInitializing={setspreadsheetReady}
                            getSpreadsheetID={setspreadsheetId}
                            config={config}
                            getAutomaticType={setAutomaticType}
                        />
                      </div>
                    })
            
                }
              </div>
            </div>
          ) : (
            <p className="text-black">INVALID URL</p>
          )}
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const { preview } = context.params;
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {
      config: config,
      preview: preview.join("/"),
    },
  };
}