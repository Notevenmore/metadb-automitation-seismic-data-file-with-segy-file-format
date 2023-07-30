import {
  ColumnDefinition,
  ReactTabulator,
  ReactTabulatorOptions,
} from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator.min.css'; //import Tabulator stylesheet
import {omitID} from './Helper';
import {RowObject} from './type';
import {ACCESS_TOKEN, BASE_URL} from './Constants';

interface TableProps {
  data: RowObject[];
  columns: ColumnDefinition[];
  columnData: string[];
  afeNumber: number;
  // tableRef: ReactTabulatorOptions;
  options: ReactTabulatorOptions;
}

export default function TableEditor({
  data,
  columns,
  columnData,
  afeNumber,
  // tableRef,
  options,
}: TableProps) {
  const sendData = () => {
    for (const row of data) {
      void processData(row);
    }
  };

  const filterData = (row: RowObject) => {
    for (const key of Object.keys(row)) {
      try {
        if (/int|float/g.test(columnData[key])) {
          row[key] = row[key] * 1 || null;
        }
      } catch (e) {
        console.log('Error in filterData');
        console.log(e);
      }
    }
  };

  const postData = async (row: RowObject) => {
    filterData(row);
    const response = await fetch(`${BASE_URL}/api/v1/print-well-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(row, omitID),
    });

    const result = await response.text();

    const result_split = result.split(':');
    const pwr_id = parseInt(result_split[result_split.length - 1].trim());

    console.log('BINDING');
    await bindData(afeNumber, pwr_id);
  };

  const bindData = (afe: number, id: number) => {
    return fetch(`${BASE_URL}/api/v1/print-well-report-workspace`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        afe_number: afe,
        print_well_report_id: id,
      }),
    });
  };

  const deleteData = async (id: number) => {
    const response = await fetch(`${BASE_URL}/api/v1/print-well-report/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    const result = await response.text();
    console.log(result);
  };

  const putData = async (row: RowObject, id: number) => {
    filterData(row);
    const response = await fetch(`${BASE_URL}/api/v1/print-well-report/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(row),
    });

    const result = await response.text();
    console.log(result);
  };

  const processData = (row: RowObject) => {
    // Populate undefined keys with null
    for (const key in row) {
      const {[`${key}`]: identifier} = row;
      if (identifier === undefined) {
        Object.assign(row, {[`${key}`]: null});
      }
    }

    if (row.id === null) {
      if (Object.values(row).every(el => el === null)) {
        console.log('IGNORING');
        return;
      } else {
        try {
          console.log('POSTING');
          void postData(row);
        } catch (e) {
          console.log('Error in processData - POSTING');
          console.log(e);
        }
      }
      return;
    } else {
      const {id, ...filteredRow} = row;
      if (Object.values(filteredRow).every(el => el === null || el === '')) {
        try {
          console.log('DELETING');
          void deleteData(id);
        } catch (e) {
          console.log('Error in processData - DELETING');
          console.log(e);
        }
        return;
      } else {
        try {
          console.log('PUTTING');
          void putData(row, id);
        } catch (e) {
          console.log('Error in processData - PUTTING');
          console.log(e);
        }
        return;
      }
    }
  };

  return (
    <>
      <button className="bg-black text-white my-8 p-2" onClick={sendData}>
        Submit
      </button>
      <ReactTabulator
        data={data}
        columns={columns}
        layout={'fitData'}
        // onRef={(r) => (tableRef = r)}
        options={options}
        events={{
          dataLoaded: function (table: any) {
            console.log('dataLoaded', table);
          },
          ajaxError: function (error: any) {
            console.log('ajaxError', error);
          },
        }}
        className="mb-8"
      />
    </>
  );
}
