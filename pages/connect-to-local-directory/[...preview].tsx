import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {parseCookies} from 'nookies';
import {TokenExpired} from '../../services/admin';
import axios from "axios";
import {
  UploadDocumentSettings,
  displayErrorMessage,
  setUploadDocumentSettings,
} from '../../store/generalSlice';
import {useAppDispatch} from '../../store';
import {delay} from '../../utils/common';
import { showErrorToast } from '../../components/utility_functions';

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

interface Size {
  width: string;
  height: string;
}

interface Cordinate {
  x: number;
  y: number;
}

function RowComponent({ label, value, index }: any) {
  return (
    <tr className="first:px-5">
      <td className="py-2 text-gray-600">{index}</td>
      <td className="px-5 py-2">{label}</td>
      <td className="px-5 py-2"> : </td>
      <td className="px-5 py-2">{value}</td>
    </tr>
  );
}

export default function Preview({ config, preview }: Props) {
  const [directory, setDirectory] = useState<Directory>();
  const [data, setData] = useState<any[]>();
  const [file, setFile] = useState<string[]>();
  const [fileItem, setFileItem] = useState<File>();
  const [otherData, setOtherData] = useState<any[]>();
  const [showIndex, setShowIndex] = useState(0);
  const [fileDrag, setFileDrag] = useState<string[]>();
  const [fileDragTemp, setFileDragTemp] = useState<string>();
  const [newWorkspace, setNewWorkspace] = useState<UploadDocumentSettings>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const workspace = localStorage.getItem('data');
    if(workspace) {
      setNewWorkspace(JSON.parse(workspace));
    } else {
      router.push("/");
    }
  }, [])

  const readFileContent = async (fileHandle: any) => {
    try {
      if (fileHandle.type === "file") {
        const file = await fileHandle.file;
        setFileItem(file);
        const formData = new FormData();
        formData.append("file", file);
        axios
          .post("http://127.0.0.1:5000/read-sgy-segy-file", formData)
          .then((response) => {
            setData((prev) => {
              if (prev) return [...prev, JSON.parse(response.data.result)];
              else return [JSON.parse(response.data.result)];
            });
            setOtherData((prev) => {
              if (prev) return [...prev, JSON.parse(response.data.data)];
              else return [JSON.parse(response.data.data)];
            });
            setFile((prev) => {
              if (prev) return [...prev, file.name];
              else return [file.name];
            });
          })
          .catch(() => {
            console.log("Gagal membaca file.");
          });
      } else {
        console.error("Handle bukan file, tidak dapat membaca isi file.");
      }
    } catch (error) {
      console.error("Gagal membaca file:", error);
    }
  };

  const redirect = () => {
    localStorage.setItem(preview, JSON.stringify(data));
    localStorage.setItem(`${preview}Data`, JSON.stringify(otherData));
    makenew();
  };

  const toggleFolder = (path: string) => {
    setDirectory((prev) => {
      const changeOpenDirectoryStatus = (p: Directory): Directory => {
        if (p?.path === path) {
          return { ...p, isOpen: !p.isOpen };
        } else if (p?.items) {
          return {
            ...p,
            items: p.items.map((v) => changeOpenDirectoryStatus(v)),
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
      if (entry.kind === "file") {
        if (entry.name.split(".")[1].toLowerCase() == "segy" || entry.name.split(".")[1].toLowerCase() == "sgy") {
          items.push({ name: entry.name, type: "file", path: `${path}/${entry.name}`, file: entry.getFile() });
        }
      } else if (entry.kind === "directory") {
        const subDirectoryItems: Directory[] = await readDirectory(entry, `${path}/${entry.name}`);
        items.push({
          name: entry.name,
          type: "directory",
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
        alert("Browser tidak mendukung fitur ini!");
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
      console.error("Gagal membaca direktori:", error);
    }
  };

  const folderComponent = (lists: Directory[], isopen?: boolean) => {
    return (
      <div className={`flex-col gap-10 ps-10`}>
        {Array.from(lists).map((items, index) => {
          return (
            <div key={index} className={`flex flex-row gap-2 py-2 ${isopen ? "flex" : "hidden"}`}>
              {items.type === "file" ? (
                <div
                  className={`flex gap-7 justify-start items-center hover:bg-gray-300 p-2 cursor-pointer break-all w-full file ${file?.includes(items.name) || fileDrag?.includes(items.name) ? "bg-gray-300" : "bg-inherit"}`}
                  onClick={() => {
                    if (file) {
                      if (!file.includes(items.name)) readFileContent(items);
                    } else {
                      readFileContent(items);
                    }
                  }}
                >
                  <Image src="/icons/File.svg" alt="File" width={24} height={24} />
                  <p className="text-sm">{items.name}</p>
                  {file?.includes(items.name) ? (
                    <button
                      className="z-10 justify-self-end text-end rounded-full bg-red-500 px-2 w-5 h-5 flex items-center justify-center font-bold text-white text-[0.5rem]"
                      onClick={async (e) => {
                        e.preventDefault();
                        let i = 0;
                        setFile((prev) => {
                          return prev?.filter((value) => value !== items.name);
                        });
                        setData((prev) => {
                          return prev?.filter((value, index) => {
                            i = index;
                            return value["ORIGINAL_FILE_NAME"] !== items.name;
                          });
                        });
                        setOtherData((prev) => {
                          return prev?.filter((value, index) => {
                            if (index !== i) return value;
                          });
                        });
                      }}
                    >
                      X
                    </button>
                  ) : null}
                </div>
              ) : (
                <div key={index} className={`flex flex-col gap-3`} onMouseDown={handleMouseDown}>
                  <button className="flex flex-row items-center gap-3 hover:bg-gray-300 p-2 break-all" onClick={() => toggleFolder(items.path)}>
                    <Image src="/icons/see_more.svg" className={`${items.isOpen ? "rotate-90" : null} duration-100`} alt="See More" width={24} height={24} />
                    <div className="flex gap-2">
                      <Image src="/icons/Folder.svg" alt="Folder" width={24} height={24} />
                      <p>{items.name}</p>
                    </div>
                  </button>
                  {folderComponent(items.items ? items.items : [], items.isOpen)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const [start, setStart] = useState<Cordinate>({ x: 0, y: 0 });
  const [now, setNow] = useState<Cordinate>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>();
  const [press, setPress] = useState<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!press) {
      setPress(true);
      setStart({ x: e.clientX, y: e.clientY });
      setNow({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (press) {
      setPress(false);
      setStart({ x: 0, y: 0 });
      setNow({ x: 0, y: 0 });
      setSize({ width: `0px`, height: `0px` });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (press) {
      if (e.clientX >= start.x) {
        setNow((prev) => {
          return { ...prev, x: start.x };
        });
      } else {
        setNow((prev) => {
          return { ...prev, x: e.clientX };
        });
      }
      if (e.clientY >= now.y) {
        setNow((prev) => {
          return { ...prev, y: start.y };
        });
      } else {
        setNow((prev) => {
          return { ...prev, y: e.clientY };
        });
      }
      setSize({ width: `${Math.abs(start.x - e.clientX)}px`, height: `${Math.abs(start.y - e.clientY)}px` });
      const eventTarget = e.target as HTMLElement;
      if (eventTarget.classList.contains("file")) {
        setFileDragTemp(eventTarget.children[1].innerHTML);
      }
    }
  };

  useEffect(() => {
    if (fileDragTemp) {
      if (fileDrag) {
        if (!fileDrag.includes(fileDragTemp)) {
          setFileDrag([...fileDrag, fileDragTemp]);
        }
      } else {
        setFileDrag([fileDragTemp]);
      }
    }
  }, [fileDragTemp]);

  useEffect(() => {
    if (press) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [press]);

  const getDirectory = (dir: Directory[], value: string) => {
    Array.from(dir).map(async (lists) => {
      if (lists.type === "file" && lists.name === value) {
        await readFileContent(lists);
      } else {
        if (lists.items) getDirectory(lists.items, value);
      }
    });
  };

  const handleDragSelectFile = () => {
    if (fileDrag && directory) {
      fileDrag.forEach((value) => {
        if (directory.items) {
          getDirectory(directory.items, value);
        }
      });
      setFileDrag(undefined);
    }
  };

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
      // Handle error and display error message
      showErrorToast(dispatch, error);
    }
    await delay(1500);
    router.push(`/connect-to-local-directory/confirm/${preview}`);
    router.events.emit('routeChangeComplete');
  };

  return (
    <main className="flex min-h-screen flex-col p-7 gap-5">
      <div className="flex flex-row gap-3 text-gray-600 items-center">
        <p>Seismic Data</p>
        <p> {">"} </p>
        <p>Load Data</p>
      </div>
      <div className="flex min-h-screen flex-col p-7 gap-5 relative" onMouseDown={handleMouseDown}>
        {press && <div className={`bg-blue-500 opacity-50 border-2 border-blue-900 fixed top-0 left-0`} style={{ ...size, top: `${now.y}px`, left: `${now.x}px` }}></div>}
        <div className="flex flex-row items-center gap-3 text-black font-bold text-lg">
          <button onClick={connectLocalDirectory} className="border-2 border-black py-1 px-3 rounded-lg hover:bg-slate-400 hover:text-white hover:border-slate-400 z-10">
            Connect Local Directory
          </button>
        </div>
        <div className="flex flex-row gap-5 text-black items-start justify-start">
          <div className="flex flex-col gap-7 w-96">
            <h1 className="font-bold w-full">Files</h1>
            {directory ? (
              <div className="flex flex-col ps-3 gap-3 w-[25vw] h-[60vh] overflow-y-scroll z-10">
                <button className="flex flex-row items-center gap-3 hover:bg-gray-300 p-2" onClick={() => toggleFolder(directory.path)}>
                  <Image src="/icons/see_more.svg" className={`${directory.isOpen ? "rotate-90" : null} duration-100`} alt="See More" width={24} height={24} />
                  <div className="flex gap-2 w-full">
                    <Image src="/icons/Folder.svg" alt="Folder" width={24} height={24} />
                    <p className="break-all">{directory.name}</p>
                  </div>
                </button>
                {folderComponent(directory.items ? directory.items : [], directory.isOpen)}
                {fileDrag ? (
                  <div className="w-72 flex items-center justify-center self-center gap-3">
                    <button className="bg-green-500 w-32 self-center rounded-xl font-bold text-white" onClick={handleDragSelectFile}>
                      Confirm
                    </button>
                    <button
                      className="bg-red-500 w-32 self-center rounded-xl font-bold text-white"
                      onClick={() => {
                        setFileDrag(undefined);
                      }}
                    >
                      Remove All Dragging File
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="w-[25vw] h-[60vh] items-center justify-center flex bg-gray-200 font-bold text-xl">Connect to your Local Directory</div>
            )}
          </div>
          <div className="flex flex-col gap-7">
            <h1 className="font-bold">Preview Data</h1>
            {data && data.length > 0 ? (
              <div className="overflow-y-scroll h-[60vh] w-[45vw]">
                <table className={`text-black font-semibold min-w-[50vw] min-h-[60vh]`}>
                  <tbody>
                    {data[showIndex] &&
                      Object.entries(data[showIndex]).map(([key, value], index) => {
                        return <RowComponent key={index} value={value} label={key.replaceAll("_", " ")} index={`C${index + 1}`} />;
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[60vh] w-[45vw] bg-gray-200 flex items-center justify-center font-bold text-xl">Connect to your local directory and choose the data from it</div>
            )}
            {data && data.length > 1 && (
              <div className="z-10 self-center bg-slate-500 px-5 flex items-center justify-center py-2 gap-7 rounded-2xl text-white font-black text-2xl">
                <button className="flex items-center justify-center h-full" onClick={() => setShowIndex(showIndex - 1)} disabled={showIndex < 1}>
                  {"<"}
                </button>
                <button className="flex items-center justify-center h-full" onClick={() => setShowIndex(showIndex + 1)} disabled={showIndex >= data.length - 1}>
                  {">"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row text-black justify-end text-xl font-semibold">
          <button
            disabled={data ? false : true}
            className={`border-black border-2 py-1 px-5 rounded-lg z-10 ${data ? "bg-inherit hover:bg-slate-400 hover:border-slate-400 hover:text-white" : "bg-gray-400 text-white border-gray-400"}`}
            onClick={() => redirect()}
          >
            Next
          </button>
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
