import {useCallback, useEffect, useMemo, useState} from 'react';
import {ColumnDefinition, ReactTabulatorOptions} from 'react-tabulator';
import TableEditor from '.';
import {RowObject, WorkspaceType} from './Type';
import {ACCESS_TOKEN, AFE_NUMBER, BASE_URL} from './Constants';
import {formatDate} from './Helper';

const def_data: RowObject[] = [];
const def_columns: ColumnDefinition[] = [];

function App() {
  const data: RowObject[] = useMemo(() => [], []);
  const columns: ColumnDefinition[] = useMemo(() => [], []);
  const [finalData, setFinalData] = useState(def_data);
  const [finalColumns, setFinalColumns] = useState(def_columns);
  const [columnData, setColumnData] = useState<string[]>();
  const tableOptions: ReactTabulatorOptions = {
    index: 'id',
    maxHeight: '100%',
  };

  const getRow = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/print-well-report-workspace/${AFE_NUMBER}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        },
      );
      const result = (await response.json()) as WorkspaceType[];

      if (result) {
        for (const datatype_record_id of result) {
          const details = await fetch(
            `${BASE_URL}/api/v1/print-well-report/${datatype_record_id.print_well_report_id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            },
          );
          const result_details = (await details.json()) as RowObject[];
          const current = result_details[0];

          // Format string with appropriate Date format
          for (const key of Object.keys(current)) {
            if (key.includes('date') && current[key] !== null) {
              current[key] = formatDate(current[key], true);
            }
          }
          data.push(current);
        }
      }

      // Add empty rows at the end
      const newRow = {ba_long_name: undefined} as unknown as RowObject;
      for (let i = 0; i < 100; i++) {
        data.push(Object.assign({}, newRow));
      }

      setFinalData(data);
    } catch (e) {
      console.log('Error in getRow');
      console.log(e);
    }
  }, [data]);

  const getColumn = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/print-well-report-column`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        },
      );

      const result = (await response.json()) as string[];
      setColumnData(result);
      const result_details = Object.keys(result);

      for (const title of result_details) {
        const upper = title.toUpperCase();
        const lower = title.toLowerCase();
        if (upper === 'ID') {
          columns.push({
            title: upper,
            field: lower,
            width: 150,
            editor: 'input',
            visible: false,
          });
        } else {
          columns.push({
            title: upper,
            field: lower,
            width: 150,
            editor: 'input',
          });
        }
      }
      setFinalColumns(columns);
    } catch (e) {
      console.log('Error in getColumn');
      console.log(e);
    }
  }, [columns]);

  useEffect(() => {
    void getColumn();
    void getRow();
  }, [getColumn, getRow]);

  return (
    <div className="mx-16 mt-16 h-screen">
      <h1 className="text-3xl font-bold">Table</h1>
      <TableEditor
        data={finalData}
        columns={finalColumns}
        columnData={columnData}
        afeNumber={AFE_NUMBER}
        options={tableOptions}
      />
    </div>
  );
}

export default App;
