import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Props {
  confirm: string;
}

export default function Confirm({ confirm }: Props) {
  const [data, setData] = useState<Record<string, any>[]>();
  const [values, setValues] = useState<Record<string, any>[]>();
  const [showIndex, setShowIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const data_json = localStorage.getItem(confirm);
    const other_data_json = localStorage.getItem(`${confirm}Data`);
    if (data_json && other_data_json) {
      const data = JSON.parse(data_json);
      const other_data = JSON.parse(other_data_json);
      setData(data);
      setValues(other_data);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (data) {
      const updateData = [...data];
      updateData[showIndex] = { ...updateData[showIndex], [name]: value };
      setData(updateData);
    }
    if (values) {
      const updateValues = [...values];
      updateValues[showIndex] = { [name]: value };
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const localStorageData = localStorage.getItem(`confirmed${confirm}`);
    let updatedData = localStorageData ? JSON.parse(localStorageData) : [];
    if (data) {
      updatedData = [...updatedData, ...data];
      localStorage.setItem(`confirmed${confirm}`, JSON.stringify(updatedData));
      router.push({pathname: `/connect-to-local-directory/result/${confirm}`, query: {form_type: confirm}});
    }
  };

  function SelectComponent({ id, label, name, value, onChange, key }: any) {
    return (
      <div key={key} className="flex w-full">
        <label htmlFor={id} className="text-black text-lg font-semibold w-2/3">
          {label} :
        </label>
        <select name={name} id={id} value={data ? data[showIndex][name] : ""} className="bg-inherit border-black border-2 text-black w-full px-3 rounded-lg" onChange={onChange}>
          {data &&
            Object.values(data[showIndex]).map((value, index) => {
              if (value != "") {
                return (
                  <option key={index} value={value as string}>
                    {value as string}
                  </option>
                );
              }
            })}
          <option value="" disabled>
            -- Choose this field --
          </option>
        </select>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col p-7 gap-5">
      <div className="flex flex-row gap-3 text-gray-600 items-center">
        <p>Seismic Data</p>
        <p> {">"} </p>
        <p>Load Data</p>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        {data && values ? (
          <div className="flex flex-col items-center w-full justify-center gap-8">
            <h1 className="text-black font-bold text-3xl">CONFIRM DATA {confirm.toUpperCase().replaceAll("_", " ")}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-stretch justify-stretch gap-5 bg-white border-2 border-black p-8 rounded-xl w-[50vw]">
              {Object.entries(values[showIndex]).map(([key, value], index) => {
                return <SelectComponent key={index} id={key} label={key.replaceAll("_", " ")} name={key} value={value} onChange={handleChange} />;
              })}
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
              <button onClick={() => setShowIndex(showIndex + 1)} disabled={showIndex >= values.length - 1}>
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
