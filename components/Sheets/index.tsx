import {useEffect, useState} from 'react';

interface IframeProps extends React.ComponentProps<'iframe'> {
  existingID?: any;
  type: any;
  form_type: any;
  data: any;
  getSpreadsheetID: any;
  finishedInitializing: any;
  config: any;
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
  } = props;

  const [sheetID, setsheetID] = useState();
  const [Loading, setLoading] = useState(true);
  const [LoadingMsg, setLoadingMsg] = useState('');
  const [hasError, sethasError] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState('');
  const [SkipInitialization, setSkipInitialization] = useState(false);

  useEffect(() => {
    console.log(type, form_type);
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
        } catch (error) {
          console.log('You are not supposed to be here');
        }
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
            setErrorMessage(response.response);
          }
        })
        .catch(error => {
          throw error;
        });

      if (type === 'review') {
        try {
          console.log('first');
          setLoadingMsg('Appending OCR data to the spreadsheet');
          console.log(data);
          if (!data) {
            throw new Error(
              'Data not found. Make sure you correctly passed the data into the component.',
            );
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
                setErrorMessage(response.response);
                console.log(response);
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
      setLoadingMsg('All done');
      setLoading(false);
      try {
        finishedInitializing(true);
      } catch (error) {
        console.log('What are you still doing here');
      }
    };
    if (sheetID) {
      localStorage.setItem('spreadsheetID', sheetID);
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
    <div className="h-full flex items-center justify-center">
      <p className="text-center text-red-500">
        Internal server error. Please contact maintainer. <br />
        ---
        <br />
        <strong>{ErrorMessage}</strong>
      </p>
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
