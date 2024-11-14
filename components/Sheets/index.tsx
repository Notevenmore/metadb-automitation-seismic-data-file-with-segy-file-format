import {logError} from '@components/utility_functions';
import {DatatypeConfig, ServicesConfig} from '@utils/types';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';

interface IframeProps extends React.ComponentProps<'iframe'> {
  existingID?: string;
  type: string;
  form_type: string | string[];
  data: any;
  getSpreadsheetID: Dispatch<SetStateAction<string>>;
  finishedInitializing: Dispatch<SetStateAction<boolean>>;
  config: ServicesConfig & DatatypeConfig;
  getAutomaticType?: Dispatch<SetStateAction<string>>;
}

const Sheets: React.FunctionComponent<IframeProps> = ({...props}) => {
  const {
    config,
    form_type,
    getSpreadsheetID,
    type,
    finishedInitializing,
    data,
    existingID,
    getAutomaticType
  } = props;

  const [sheetID, setsheetID] = useState<string>();
  const [Loading, setLoading] = useState(true);
  const [LoadingMsg, setLoadingMsg] = useState('');
  const [hasError, sethasError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');
  const [SkipInitialization, setSkipInitialization] = useState(false);

  useEffect(() => {
    const getInit = async () => {
      setLoading(true);
      try {
        setLoadingMsg('Initializing sheets, please wait...');
        if (existingID) {
          setsheetID(existingID);
          setSkipInitialization(true);
          return;
        }
        const makeTemp = await fetch(
          `${config.services.sheets}/createSpreadsheet`,
        );
        const spreadsheetID = await makeTemp.json();
        setsheetID(spreadsheetID.response);
        try {
          getSpreadsheetID(spreadsheetID.response);
          if(getAutomaticType) getAutomaticType(form_type as string);
        } catch (error) {}
        setSkipInitialization(false);
      } catch (error) {
        sethasError(true);
        setErrorMessage(`{${error.message}}`);
      }
      setLoading(false);
    };
    getInit();
  }, [config.services.sheets, existingID, form_type, getSpreadsheetID, type]);

  useEffect(() => {
    const updateSheet = async () => {
      setLoading(true);
      setLoadingMsg(
        `Initializing document form based on form type ${form_type}`,
      );
      await fetch(`${config.services.sheets}/updateSpreadsheet/v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          form_type,
          spreadsheetID: sheetID,
        }),
      })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if (response.status !== 200) {
            sethasError(true);
            setErrorMessage(
              `Google Spreadsheet was not able append the record data. Please try again by reloading this page`,
            );
            logError('spreadsheet error update formatting:', response.response);
          }
        });

      if (type === 'review') {
        try {
          setLoadingMsg('Appending OCR data to the spreadsheet');
          console.log(data);
          if (!data) {
            throw 'Data not found. Make sure you correctly passed the data into the component.';
          }

          // TODO finish this new workflow
          // ---| NEW WORKFLOW |---

          await fetch(`${config.services.sheets}/appendToSheets2`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form_type: form_type,
              spreadsheetID: sheetID,
              data: JSON.stringify(data),
            }),
          })
            .then(response => {
              return response.json();
            })
            .then(response => {
              if (response.status !== 200) {
                sethasError(true);
                setErrorMessage(
                  'Google Spreadsheet was not able append the record data. Please try again by reloading this page',
                );
                logError('error spreadsheet append data', response.response);
              } else {
              }
            })
            .catch(error => {
              throw error;
            });
        } catch (error) {
          sethasError(true);
          setErrorMessage(String(error));
        }
      }
      finishedInitializing(true);
      setLoadingMsg('All done');
      setLoading(false);
    };
    if (sheetID) {
      if (!SkipInitialization) {
        updateSheet();
      }
    }
  }, [
    sheetID,
    SkipInitialization,
    form_type,
    config.services.sheets,
    type,
    data,
    finishedInitializing,
  ]);

  return Loading ? (
    <div
      className="flex flex-col items-center justify-center space-y-2 h-full"
      {...props}>
      <div className="w-5 h-5 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
      <p>{LoadingMsg}</p>
    </div>
  ) : hasError ? (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col text-red-500 overflow-x-auto">
        <p className="flex items-center justify-center w-full select-none">
          <p className='p-2 rounded-full border-2 border-red-500 text-xl font-bold w-8 h-8 flex items-center justify-center'>!</p>
        </p>
        <p>
          <strong>{ErrorMessage}</strong>
        </p>
      </div>
    </div>
  ) : (
    <div className="h-full">
      <iframe
        {...props}
        className="w-full h-full"
        src={`https://docs.google.com/spreadsheets/d/${sheetID}?single=false&widget=false&headers=false&rm=embedded`}></iframe>
    </div>
  );
};

export default Sheets;
