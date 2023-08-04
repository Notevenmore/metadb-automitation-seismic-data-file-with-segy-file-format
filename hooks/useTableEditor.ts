import {formatDate, omitID} from '@components/TableEditor/Helper';
import {RowObject, WorkspaceType} from '@components/TableEditor/Type';
import {UploadDocumentSettings} from '@store/generalSlice';
import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {ColumnDefinition, ReactTabulatorOptions} from 'react-tabulator';

export const useTableEditor = (
  workspace_data: UploadDocumentSettings,
  setspreadsheetReady: Dispatch<SetStateAction<boolean>>,
  afeNumber: number,
) => {
  const router = useRouter();
  const config = JSON.parse(process.env.ENDPOINTS);

  const def_data: RowObject[] = [];
  const def_columns: ColumnDefinition[] = [];

  const [finalData, setFinalData] = useState(def_data);
  const [finalColumns, setFinalColumns] = useState(def_columns);
  const [columnData, setColumnData] = useState<string[]>();
  const tableRef = useRef(null);
  const tableOptions: ReactTabulatorOptions = {
    index: 'id',
    height: '800px',
    // maxHeight: '95%',
    downloadReady: (fileContents: string, blob) => {
      return blob;
    },
  };

  const getRow = useCallback(
    async (
      workspace_data: UploadDocumentSettings,
      setFinalData: Dispatch<SetStateAction<RowObject[]>>,
    ) => {
      const data = [];
      try {
        const response = await fetch(
          `${config[router.query.form_type]['workspace']}${
            workspace_data['afe_number']
          }`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${
                JSON.parse(parseCookies().user_data).access_token
              }`,
            },
          },
        );
        const result = (await response.json()) as WorkspaceType[];

        if (result) {
          for (const datatype_record_id of result) {
            const details = await fetch(
              `${config[router.query.form_type]['view']}${
                datatype_record_id[
                  config[router.query.form_type]['workspace_holder_key']
                ]
              }`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${
                    JSON.parse(parseCookies().user_data).access_token
                  }`,
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
        for (let i = 0; i < 25; i++) {
          data.push(Object.assign({}, newRow));
        }

        setFinalData(data);
      } catch (e) {
        console.log(e);
        console.log('Error in getRow');
      }
    },
    [],
  );

  const getColumn = useCallback(
    async (
      setFinalColumns: Dispatch<SetStateAction<ColumnDefinition[]>>,
      setColumnData: Dispatch<SetStateAction<string[]>>,
    ) => {
      const columns = [];
      try {
        const response = await fetch(
          `${config[router.query.form_type]['view'].slice(0, -1)}-column/`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${
                JSON.parse(parseCookies().user_data).access_token
              }`,
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
    },
    [],
  );

  useEffect(() => {
    if (workspace_data) {
      getColumn(setFinalColumns, setColumnData);
      getRow(workspace_data, setFinalData);
      setspreadsheetReady(true);
    }
  }, [getColumn, getRow, setspreadsheetReady, workspace_data]);

  const sendData = (data: RowObject[]) => {
    for (const row of data) {
      processData(row);
    }
  };

  const filterData = (row: RowObject) => {
    for (const key of Object.keys(row)) {
      try {
        if (/int|float/g.test(columnData[key])) {
          row[key] = Number(row[key]) * 1 || null;
        } else if (
          key.includes('date') &&
          row[key] !== null &&
          row[key] !== undefined
        ) {
          row[key] = formatDate(row[key], false);
        }
      } catch (e) {
        console.log('Error in filterData');
        console.log(e);
      }
    }
  };

  const postData = async (row: RowObject) => {
    filterData(row);
    const response = await fetch(`${config[router.query.form_type]['view']}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
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
    return fetch(`${config[router.query.form_type]['workspace']}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
      body: JSON.stringify({
        afe_number: afe,
        [config[router.query.form_type]['workspace_holder_key']]: id,
      }),
    });
  };

  const deleteData = (id: number) => {
    return fetch(`${config[router.query.form_type]['view']}${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
    });
  };

  const putData = (row: RowObject, id: number) => {
    filterData(row);
    return fetch(`${config[router.query.form_type]['view']}${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
      body: JSON.stringify(row),
    });
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
          postData(row);
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
          deleteData(id);
        } catch (e) {
          console.log('Error in processData - DELETING');
          console.log(e);
        }
        return;
      } else {
        try {
          console.log('PUTTING');
          putData(row, id);
        } catch (e) {
          console.log('Error in processData - PUTTING');
          console.log(e);
        }
        return;
      }
    }
  };

  return {
    finalData,
    finalColumns,
    tableRef,
    tableOptions,
    sendData,
  };
};
