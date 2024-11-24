/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import {TokenExpired} from '../../services/admin';
import axios from 'axios';
import {
  UploadDocumentSettings,
  displayErrorMessage,
  setUploadDocumentSettings,
} from '../../store/generalSlice';
import {useAppDispatch} from '../../store';
import {delay} from '../../utils/common';
import {showErrorToast} from '../../components/utility_functions';
import {datatypes} from '../../config';

interface Props {
  preview: string;
  config: any;
}

interface Directory {
  name: string;
  items?: Directory[];
  type: string;
  isOpen?: boolean;
  path: string;
  file?: any;
}

declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<any>;
  }
}

interface AutomaticDataStructure {
  data: any[];
  otherData: any[];
  fileFormat: string;
  dataType: string;
  fileName: string[];
}

function RowComponent({label, value, index}: any) {
  return (
    <tr className="first:px-5">
      <td className="py-2 text-gray-600">{index}</td>
      <td className="px-5 py-2">{label}</td>
      <td className="px-5 py-2"> : </td>
      <td className="px-5 py-2">{value}</td>
    </tr>
  );
}

export default function Preview({config, preview}: Props) {
  const [directory, setDirectory] = useState<Directory>();
  const [allFile, setAllFile] = useState<Directory[]>([]);
  const [data, setData] = useState<any[]>();
  const [file, setFile] = useState<string[]>();
  const [otherData, setOtherData] = useState<any[]>();
  const [showIndex, setShowIndex] = useState(0);
  const [newWorkspace, setNewWorkspace] = useState<UploadDocumentSettings>();
  const [formatFile, setFormatFile] = useState(["SGY/SEGY", "LAS"]);
  const [selectedFormatFile, setSelectedFormatFile] = useState<string>("");
  const [selectedDataType, setSelectedDataType] = useState<string>("");
  const [automaticData, setAutomaticData] = useState<AutomaticDataStructure[]>([]);
  const [triggeredAutomaticData, setTriggeredAutomaticData] = useState<AutomaticDataStructure>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const workspace = localStorage.getItem('data');
    if (workspace) {
      setNewWorkspace(JSON.parse(workspace));
    } else if (preview !== "index") {
      router.push('/'); 
    } 
  }, [router, preview]);

  useEffect(() => {
    if(preview === "index") {
      const oldAutomaticData = localStorage.getItem("data");
      if(oldAutomaticData) {
        setAutomaticData(JSON.parse(oldAutomaticData));
      }
    }
  }, [])

  useEffect(() => {
    setShowIndex(0);
  }, [selectedDataType, selectedFormatFile]);

  useEffect(() => {
    setSelectedDataType("");
  }, [selectedFormatFile]);

  useEffect(() => {
    if(triggeredAutomaticData) {
      if(automaticData && automaticData.some((value) => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile)) {
        const automaticTemp = automaticData.find((value) => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile);
        const automaticStore = {
          data: [...automaticTemp.data, ...triggeredAutomaticData.data],
          otherData: [...automaticTemp.otherData, ...triggeredAutomaticData.otherData],
          fileFormat: selectedFormatFile,
          dataType: selectedDataType,
          fileName: [...automaticTemp.fileName, ...triggeredAutomaticData.fileName]
        };
        setAutomaticData((current: AutomaticDataStructure[]) => {
          return current.map((value) => {
            if(value.dataType === selectedDataType) return automaticStore;
            else return value;
          });
        });
      } else {
        setAutomaticData(prev => [...prev, triggeredAutomaticData]);
      }
    }
  }, [triggeredAutomaticData])

  const readFileContent = async (fileHandle: Directory) => {
    try {
      if (fileHandle.type === 'file') {
        const file = await fileHandle.file;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', newWorkspace?.FileFormat || selectedFormatFile);
        axios
          .post('http://127.0.0.1:5000/read-file', formData)
          .then(response => {
            if(preview !== "index") {
              setData(prev => {
                if (prev) return [...prev, JSON.parse(response.data.result)];
                else return [JSON.parse(response.data.result)];
              });
              setOtherData(prev => {
                if (prev) return [...prev, JSON.parse(response.data.data)];
                else return [JSON.parse(response.data.data)];
              });
              setFile(prev => {
                if (prev) return [...prev, file.name];
                else return [file.name];
              });
            } else if(selectedDataType){
              const automatic = {
                data: [JSON.parse(response.data.result)],
                otherData: [JSON.parse(response.data.data)],
                fileFormat: selectedFormatFile,
                dataType: selectedDataType, 
                fileName: [file.name]
              };
              setTriggeredAutomaticData(automatic);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.error('Handle bukan file, tidak dapat membaca isi file.');
      }
    } catch (error) {
      console.error('Gagal membaca file:', error);
    }
  };

  const redirect = () => {
    if(preview !== "index") {
      localStorage.setItem(preview, JSON.stringify(data));
      localStorage.setItem(`${preview}Data`, JSON.stringify(otherData));
      makenew();
    } else {
      localStorage.setItem("data", JSON.stringify(automaticData));
      router.push(`/connect-to-local-directory/confirm/index`);
    }
  };

  const toggleFolder = (path: string) => {
    setDirectory(prev => {
      const changeOpenDirectoryStatus = (p: Directory): Directory => {
        if (p?.path === path) {
          return {...p, isOpen: !p.isOpen};
        } else if (p?.items) {
          return {
            ...p,
            items: p.items.map(v => changeOpenDirectoryStatus(v)),
          };
        }
        return p;
      };
      return changeOpenDirectoryStatus(prev!);
    });
  };

  const readDirectory = async (directory: any, path: string) => {
    const items: Directory[] = [];
    for await (const entry of directory.values()) {
      if (entry.kind === 'file') {
        if (
          newWorkspace?.FileFormat?.toLowerCase().includes(entry.name.split('.')[1].toLowerCase()) || ((entry.name.split('.')[1].toLowerCase().includes("las") || entry.name.split('.')[1].toLowerCase().includes("segy") || entry.name.split('.')[1].toLowerCase().includes('sgy')) && preview === "index") 
        ) {
          items.push({
            name: entry.name,
            type: 'file',
            path: `${path}/${entry.name}`,
            file: entry.getFile(),
          });
          setAllFile(prev => [...prev, {
            name: entry.name,
            type: 'file',
            path: `${path}/${entry.name}`,
            file: entry.getFile(),
          }]);
        }
      } else if (entry.kind === 'directory') {
        const subDirectoryItems: Directory[] = await readDirectory(
          entry,
          `${path}/${entry.name}`,
        );
        items.push({
          name: entry.name,
          type: 'directory',
          items: subDirectoryItems,
          isOpen: false,
          path: `${path}/${entry.name}`,
        });
      }
    }
    return items;
  };

  const connectLocalDirectory = async (e: any) => {
    e.preventDefault();
    try {
      if (!window.showDirectoryPicker) {
        alert('Browser tidak mendukung fitur ini!');
        return;
      }
      const directories = await window.showDirectoryPicker();
      const items = await readDirectory(directories, `/${directories.name}`);
      const allDirectory: Directory = {
        name: `${directories.name}`,
        items: items,
        type: `${directories.kind}`,
        isOpen: false,
        path: `/${directories.name}`,
      };
      setDirectory(allDirectory);
    } catch (error) {
      console.error('Gagal membaca direktori:', error);
    }
  };

  const handleRemoveFile = (items: Directory, i: number) => {
    if(preview !== "index") {
      const indexes = file.map((value, index) => {
        if(value === items.name) return index;
      }).find(value => value !== undefined);
      if(showIndex >= indexes && showIndex !== 0) setShowIndex(showIndex - 1);
      setFile(prev => {
        return prev?.filter(value => value !== items.name);
      });
      setData(prev => {
        return prev?.filter((value) => {
          return value['ORIGINAL_FILE_NAME'] !== items.name;
        });
      });
      setOtherData(prev => {
        return prev?.filter((value, index) => {
          if (index !== indexes) return value;
        });
      });
    } else {
      const dataType = automaticData.find(value => value.dataType === selectedDataType);
      let index = 0;
      dataType.fileName.forEach((value, indexes) => {
        if(value === items.name) index = indexes
      });
      const newDataType = {
        ...dataType,
        data: dataType.data.filter((value, indexes) => indexes !== index),
        otherData: dataType.otherData.filter((value, indexes) => indexes !== index),
        fileName: dataType.fileName.filter((value, indexes) => indexes !== index),
      }
      if(newDataType.data.length !== 0 && newDataType.otherData.length !== 0 && newDataType.fileName.length !== 0) {
        setAutomaticData([
          ...automaticData.filter(value => value.dataType !== selectedDataType),
          newDataType
        ]);
        if(showIndex >= index && showIndex !== 0) {
          setShowIndex(showIndex - 1);
        } 
      } else {
        setAutomaticData(automaticData.filter(value => value.dataType !== selectedDataType));
      }
    }
  }

  const folderComponent = (lists: Directory[], isopen?: boolean) => {
    return (
      <div className={`flex-col`}>
        {Array.from(lists).map((items, index) => {
          return (
            <div
              key={index}
              className={`flex flex-row gap-2 ${
                isopen ? 'flex' : 'hidden'
              }`}>
              {(items.type === 'file' && preview !== "index") || (items.type === 'file' && selectedFormatFile.toLowerCase().includes(items.name.split(".")[1]) && preview === "index") ? (
                <div
                  className={`flex gap-5 justify-start items-center hover:bg-gray-300 cursor-pointer break-all w-full file px-10 py-4 ${
                    file?.includes(items.name) || (automaticData && automaticData.filter((value) => value.dataType === selectedDataType).some(value => value.fileName.some(val => val === items.name)))
                      ? 'bg-gray-300'
                      : 'bg-inherit'
                  }`}
                  onClick={() => {
                    if ((file && preview !== "index") || (automaticData && preview === "index")) {
                      if ((file && !file.includes(items.name) && preview !== "index") || (automaticData && !automaticData.filter((value) => value.dataType === selectedDataType).some(value => value.fileName.some(val => val === items.name)) && preview === "index")) readFileContent(items);
                      else handleRemoveFile(items, 0); 
                    } else {
                      readFileContent(items);
                    }
                  }}>
                  <Image
                    src="/icons/File.svg"
                    alt="File"
                    width={24}
                    height={24}
                  />
                  <p className="text-sm">{items.name}</p>
                  
                </div>
              ) : items.type !== "file" && (
                <div
                  key={index}
                  className={`flex flex-col px-8 py-4`}>
                  <button
                    className="flex flex-row items-center gap-3 hover:bg-gray-300 p-2 break-all"
                    onClick={() => toggleFolder(items.path)}>
                    <Image
                      src="/icons/see_more.svg"
                      className={`${
                        items.isOpen ? 'rotate-90' : null
                      } duration-100`}
                      alt="See More"
                      width={24}
                      height={24}
                    />
                    <div className="flex gap-2">
                      <Image
                        src="/icons/Folder.svg"
                        alt="Folder"
                        width={24}
                        height={24}
                      />
                      <p>{items.name}</p>
                    </div>
                  </button>
                  {folderComponent(
                    items.items ? items.items : [],
                    items.isOpen,
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getDirectory = (dir: Directory[], value: string) => {
    Array.from(dir).map(async lists => {
      if (lists.type === 'file' && lists.name === value) {
        await readFileContent(lists);
      } else {
        if (lists.items) getDirectory(lists.items, value);
      }
    });
  };

  const handleSelectAll = async () => {
    if(preview === "index") {
      if(automaticData && automaticData.some(value => value.dataType === selectedDataType)) {
        const dataType = automaticData.find(value => value.dataType === selectedDataType);
        for (const value of allFile.filter(value => selectedFormatFile.toLowerCase().includes(value.name.split(".")[1].toLowerCase()))) {
          if (!dataType.fileName.some(val => val === value.name)) {
            await readFileContent(value);
          }
        }
      } else {
        for (const value of allFile.filter(value => selectedFormatFile.toLowerCase().includes(value.name.split(".")[1].toLowerCase()))) {
          await readFileContent(value);
        }
      }
    } else {
      if(file) {
        for (const value of allFile) {
          if (!file.some(val => val === value.name)) {
            await readFileContent(value);
          }
        }
      } else {
        for (const value of allFile) {
          await readFileContent(value);
        }
      }
    }
  }

  const handleRemoveAll = () => {
    if(preview === "index") {
      const filteredAutomaticData = automaticData.filter(value => value.dataType !== selectedDataType);
      setAutomaticData(filteredAutomaticData);
    } else {
      setFile(null);
      setData(null);
      setOtherData(null);
    }
  }

  const makenew = async () => {
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
      showErrorToast(dispatch, error);
    }
    await delay(1500);
    router.push(`/connect-to-local-directory/confirm/${preview}`);
    router.events.emit('routeChangeComplete');
  };

  return (
    <main className="flex min-h-screen flex-col p-7 gap-5">
      {
        preview !== "index" 
          ? <div className="flex flex-row gap-3 text-gray-600 items-center">
              <p>Upload Data</p>
              <p> {'>'} </p>
              <p>Load Data</p>
            </div>
          : <div className="flex flex-row gap-3 text-gray-600 items-center">
              <p>Local Directory</p>
            </div>
      }
      <div
        className="flex min-h-screen flex-col p-7 gap-5 relative">
        <div className="flex flex-row items-center gap-20 text-black font-bold text-lg">
          <button
            onClick={connectLocalDirectory}
            className="border-2 border-black py-1 px-3 rounded-lg hover:bg-slate-400 hover:text-white hover:border-slate-400 z-10">
            Connect Local Directory
          </button>
          {
            preview === "index" && 
            <div className="flex flex-row gap-7">
              <select className="border-2 border-black py-1 px-3 rounded-lg bg-white text-black" value={selectedFormatFile} onChange={(e) => {setSelectedFormatFile(e.target.value)}} >
                {
                  formatFile.map((value, index) => {
                    return <option key={index} value={value}>{value}</option>
                  })
                }
                <option value={""}>Choose your format file</option>
              </select>
              <select className="border-2 border-black py-1 px-3 rounded-lg bg-white text-black" value={selectedDataType || ""} onChange={(e) => {setSelectedDataType(e.target.value)}}>
                {
                  Object.entries(datatypes).map(([key, value], index) => {
                    if(value.includes("seismic") && !value.includes("non") && selectedFormatFile === "SGY/SEGY")
                      return <option key={index} value={value}>{key}</option>
                    else if(value === "digital_well_log" && selectedFormatFile === "LAS")
                      return <option key={index} value={value}>{key}</option>
                  })
                }
                <option value={""}>Choose the Data Type</option>
              </select>
            </div>
          }
        </div>
        <div className="flex flex-row gap-5 text-black items-start justify-start">
          <div className="flex flex-col gap-7 w-96">
            <h1 className="font-bold w-full">Files</h1>
            {directory ? (
              <div className="flex flex-col ps-3 gap-3 w-[25vw] h-[60vh] overflow-y-scroll z-10">
                <div className="flex items-center justify-center gap-5 py-1">
                  {
                    (preview !== "index" || selectedDataType) && <button className="bg-green-600 hover:bg-green-900 text-white px-3 py-1 rounded-md font-bold text-sm" onClick={handleSelectAll}>Select All</button>
                  }
                  {
                    ((data && data.length > 0 && preview !== "index") || (automaticData && automaticData.some(value => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile) && preview === "index")) && 
                      (<button className="bg-red-600 hover:bg-red-900 text-white px-3 py-1 rounded-md font-bold text-sm" onClick={handleRemoveAll}>Remove All</button>)
                  }
                </div>
                <button
                  className="flex flex-row items-center gap-3 hover:bg-gray-300 p-2"
                  onClick={() => toggleFolder(directory.path)}>
                  <Image
                    src="/icons/see_more.svg"
                    className={`${
                      directory.isOpen ? 'rotate-90' : null
                    } duration-100`}
                    alt="See More"
                    width={24}
                    height={24}
                  />
                  <div className="flex gap-2 w-full">
                    <Image
                      src="/icons/Folder.svg"
                      alt="Folder"
                      width={24}
                      height={24}
                    />
                    <p className="break-all">{directory.name}</p>
                  </div>
                </button>
                {folderComponent(
                  directory.items ? directory.items : [],
                  directory.isOpen,
                )}
              </div>
            ) : (
              <div className="w-[25vw] h-[60vh] items-center justify-center flex bg-gray-200 font-bold text-xl">
                Connect to your Local Directory
              </div>
            )}
          </div>
          <div className="flex flex-col gap-7">
            <h1 className="font-bold">Preview Data</h1>
            {(data && data.length > 0 && preview !== "index") || (automaticData && automaticData.some(value => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile) && preview === "index") ? (
              <div className="overflow-y-scroll h-[60vh] w-[45vw]">
                <table
                  className={`text-black font-semibold min-w-[50vw] min-h-[60vh]`}>
                  <tbody>
                    {
                      preview !== "index"
                        ? data[showIndex] &&
                            Object.entries(data[showIndex]).map(
                              ([key, value], index) => {
                                return (
                                  <RowComponent
                                    key={index}
                                    value={value}
                                    label={key.replaceAll('_', ' ')}
                                    index={`C${index + 1}`}
                                  />
                                );
                              },
                            )
                        :  automaticData.find(value => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile).data[showIndex] &&
                                Object.entries(automaticData.find(value => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile).data[showIndex]).map(
                                  ([key, value], index) => {
                                    return (
                                      <RowComponent
                                        key={index}
                                        value={value}
                                        label={key.replaceAll('_', ' ')}
                                        index={`C${index + 1}`}
                                      />
                                    );
                                  },
                                )
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[60vh] w-[45vw] bg-gray-200 flex items-center justify-center font-bold text-xl">
                Connect to your local directory and choose the data from it
              </div>
            )}
            {((data && data.length > 1 && preview !== "index") || (automaticData && automaticData.some(value => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile) && preview === "index"  && automaticData?.find(value => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile).data.length > 1)) && (
              <div className="z-10 self-center bg-slate-500 px-5 flex items-center justify-center py-2 gap-7 rounded-2xl text-white font-black text-2xl">
                <button
                  className="flex items-center justify-center h-full"
                  onClick={() => setShowIndex(showIndex - 1)}
                  disabled={showIndex < 1}>
                  {'<'}
                </button>
                <button
                  className="flex items-center justify-center h-full"
                  onClick={() => setShowIndex(showIndex + 1)}
                  disabled={preview !== "index" ? showIndex >= data.length - 1 : showIndex >= automaticData?.find(value => value.dataType === selectedDataType && value.fileFormat === selectedFormatFile).data.length - 1}>
                  {'>'}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row text-black justify-end text-xl font-semibold">
          <button
            disabled={data || automaticData ? false : true}
            className={`border-black border-2 py-1 px-5 rounded-lg z-10 ${
              data || automaticData
                ? 'bg-inherit hover:bg-slate-400 hover:border-slate-400 hover:text-white'
                : 'bg-gray-400 text-white border-gray-400'
            }`}
            onClick={() => redirect()}>
            Next
          </button>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const {preview} = context.params;
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {
      config: config,
      preview: preview.join('/'),
    },
  };
}
