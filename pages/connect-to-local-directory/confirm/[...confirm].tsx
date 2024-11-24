/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Props {
  confirm: string;
}

interface AutomaticDataStructure {
  data: any[];
  otherData: any[];
  fileFormat: string;
  dataType: string;
}


export default function Confirm({ confirm }: Props) {
  const [data, setData] = useState<Record<string, any>[]>();
  const [automaticData, setAutomaticData] = useState<AutomaticDataStructure[]>();
  const [selectedDataType, setSelectedDataType] = useState<string>("");
  const [values, setValues] = useState<Record<string, any>[]>();
  const [showIndex, setShowIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setShowIndex(0);
    console.log("reset")
  }, [selectedDataType])

  useEffect(() => {
    if(confirm !== "index") {
        const data_json = localStorage.getItem(confirm);
        const other_data_json = localStorage.getItem(`${confirm}Data`);
        if (data_json && other_data_json) {
          const data = JSON.parse(data_json);
          const other_data = JSON.parse(other_data_json);
          setData(data);
          setValues(other_data);
        } else router.push(`/`);
    } else {
      const data_json = localStorage.getItem("data");
      if(data_json) {
        const datas = JSON.parse(data_json);
        setAutomaticData(datas);
      }
      else router.push(`/`);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (confirm !== "index") {
      if (data) {
        const updateData = [...data];
        updateData[showIndex] = { ...updateData[showIndex], [name]: value };
        setData(updateData);
      }
      if (values) {
        const updateValues = [...values];
        updateValues[showIndex] = { [name]: value };
      }
    } else {
      if (automaticData) {
        const updatedData = automaticData.map((val) => {
          let updatedItem = { ...val };
          if(updatedItem.dataType === selectedDataType) {
            updatedItem.data[showIndex] = { ...updatedItem.data[showIndex], [name]: value };
          }
          return updatedItem;
        })
        setData(updatedData);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(confirm !== "index") {
      const localStorageData = localStorage.getItem(`confirmed${confirm}`);
      let updatedData = localStorageData ? JSON.parse(localStorageData) : [];
      if (data) {
        updatedData = [...updatedData, ...data];
        localStorage.setItem(`confirmed${confirm}`, JSON.stringify(updatedData));
        router.push({pathname: `/connect-to-local-directory/result/${confirm}`, query: {form_type: confirm}});
      }
    } else {
      if (automaticData) {
        localStorage.setItem(`confirmedData`, JSON.stringify(automaticData));
        router.push({pathname: `/connect-to-local-directory/result/index`, query: {form_type: "index"}});
      }
    }
  };

  function SelectComponent({ id, label, name, value, onChange, key }: any) {
    return (
      <div key={key} className="flex w-full">
        <label htmlFor={id} className="text-black text-lg font-semibold w-2/3">
          {label} :
        </label>
        <select name={name} id={id} value={confirm !== "index" ? (data ? data[showIndex][name] : "") : (automaticData ? automaticData.find(value => value.dataType === selectedDataType).data[showIndex][name]: "")} className="bg-inherit border-black border-2 text-black w-full px-3 rounded-lg" onChange={onChange}>
          {data && confirm !== "index" 
            ? Object.values(data[showIndex]).map((value, index) => {
                if (value != "") {
                  return (
                    <option key={index} value={value as string}>
                      {value as string}
                    </option>
                  );
                }
              })
            : automaticData && automaticData.map((value) => value.dataType === selectedDataType && 
                Object.values(value.data[showIndex]).map((v, i) => v != "" && 
                  <option key={i} value={v as string}>
                    {v as string}
                  </option>
                )
              )
          }
          <option value="" disabled>
            -- Choose this field --
          </option>
        </select>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-7 gap-5">
      {confirm !== "index" 
        ? (<div className="flex flex-row gap-3 text-gray-600 items-center">
            <p>Seismic Data</p>
            <p> {">"} </p>
            <p>Load Data</p>
          </div>)
        : (<div className="flex flex-row gap-3 text-gray-600 items-center">
            <p>Local Directory</p>
            <p> {">"} </p>
            <p>Confirm</p>
          </div>)
      }
      <div className="w-full flex flex-col items-center justify-center">
        {(confirm !== "index" && data && values) || (confirm === "index" && automaticData) ? (
          <div className="flex flex-col items-center w-full justify-center gap-8">
            {
            confirm === "index" && 
            <select className="border-2 border-black py-1 px-3 rounded-lg bg-white text-black" value={selectedDataType} onChange={(e) => {setSelectedDataType(e.target.value)}} >
              {
                automaticData.map((value, index) => <option key={index} value={value.dataType}>{value.dataType.replaceAll("_", " ").split(" ").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}</option>)
              }
              <option value={""}>Choose your data type</option>
            </select>
            }
            <h1 className="text-black font-bold text-3xl">CONFIRM DATA {confirm.toUpperCase().replaceAll("_", " ")}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-stretch justify-stretch gap-5 bg-white border-2 border-black p-8 rounded-xl w-[50vw]">
              {confirm !== "index" 
                ? Object.entries(values[showIndex]).map(([key, value], index) => {
                    return <SelectComponent key={index} id={key} label={key.replaceAll("_", " ")} name={key} value={value} onChange={handleChange} />;
                  })
                : automaticData.map((value) => value.dataType === selectedDataType && value.otherData.length > showIndex && 
                    Object.entries(value.otherData[showIndex]).map(([key, v], index) => {
                      return <SelectComponent key={index} id={key} label={key.replaceAll("_", " ")} name={key} value={v} onChange={handleChange} />
                    })
                  )
              }
              <div className="flex flex-row gap-4 self-end">
                <button type="submit" className="bg-white text-black border-2 border-black rounded-lg w-32 py-2 font-bold text-lg hover:bg-slate-400 hover:text-white hover:border-slate-400">
                  Confirm
                </button>
                <button type="button" className="bg-white text-black border-2 border-black rounded-lg w-32 py-2 font-bold text-lg hover:bg-slate-400 hover:text-white hover:border-slate-400" onClick={() => router.back()}>
                  Cancel
                </button>
              </div>
            </form>
            <div className="flex items-center justify-center text-white font-black text-xl gap-5 bg-slate-500 px-3 py-1 rounded-2xl">
              <button onClick={() => setShowIndex(showIndex - 1)} disabled={showIndex <= 0}>
                {"<"}
              </button>
              <button onClick={() => setShowIndex(showIndex + 1)} disabled={confirm !== "index" ? showIndex >= values.length - 1 : selectedDataType !== "" && showIndex >= automaticData.find(value => value.dataType === selectedDataType).otherData.length - 1}>
                {">"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-black">INVALID URL</p>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const { confirm } = context.params;
  return {
    props: {
      confirm: confirm.join("/"),
    },
  };
}
