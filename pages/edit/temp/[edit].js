import Highlight from 'react-highlight';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Button from '../../../components/button';
import Sheets from '../../../components/sheets/sheets';
import TableComponent from '../../../components/table/table';
import Input from '../../../components/input_form/input';
import Container from '../../../components/container';
import {
  downloadWorkspace,
  init_data,
  saveDocument,
} from '../../../components/utility_functions';
import Toast from '../../../components/toast/toast';
import {useDispatch} from 'react-redux';
import {setErrorMessage} from '../../../store/generalSlice';

const DocEditor = ({workspace_name, setTitle, config}) => {
  const [IsSaved, setIsSaved] = useState(false);
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [error, seterror] = useState('');
  const [Data, setData] = useState([-1]);
  const [dataContentDetails, setdataContentDetails] = useState([-1]);
  const [spreadsheetReady, setspreadsheetReady] = useState(false);
  const [workspaceData, setworkspaceData] = useState();
  const [spreadsheetId, setspreadsheetId] = useState();
  const [triggerSave, settriggerSave] = useState(false);

  const dispatch = useDispatch();

  const warningText =
    'You have unsaved changes - Are you sure you want to leave this page?';

  const router = useRouter();

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
        router.events.emit('routeChangeError');
        throw 'routeChange aborted.';
      }
    }
    // If there are no unsaved changes, allow navigation away from the page
    return;
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [IsSaved]);

  // This useEffect hook sets up the initial data for the workspace based on the workspace name and form type
  useEffect(() => {
    // Call init_data to set up the workspace data
    const init_call = async () => {
      try {
        console.log(router.query.workspace_data);
        const initial_data = await init_data(config, router, {
          afe_number: router?.query?.workspace_data,
        });
        console.log(initial_data);
        setData(initial_data.data ? initial_data.data : [{}]);
        setdataContentDetails(
          initial_data.data ? initial_data.data_content : [{}],
        );
        setworkspaceData(initial_data.workspace_data);
        setTitle(
          `${workspace_name} | ${router.query.form_type
            .split('_')
            .map(x => {
              return x.charAt(0).toUpperCase() + x.slice(1);
            })
            .join(' ')} - Edit Record`,
        );
      } catch (error) {
        // Handle any errors that occur during initialization
        seterror(String(error));
      }
    };
    init_call();
  }, []);

  useEffect(() => {
    if (spreadsheetReady) {
      setTimeout(async () => {
        dispatch(
          setErrorMessage({
            message:
              'Please use DD-MM-YYYY format in any date field. You can set the date formatting by going to Format > Number and selecting the correct date format if the field insisted on inputting wrong date format.',
            color: 'blue',
            show: true,
          }),
        );
        // setMessage({
        //   message:
        //     'Please use DD-MM-YYYY format in any date field. You can set the date formatting by going to Format > Number and selecting the correct date format if the field insisted on inputting wrong date format.',
        //   color: 'blue',
        //   show: true,
        // });
        await delay(10000);
        dispatch(setErrorMessage({message: '', color: '', show: false}));
        // setMessage({message: '', color: '', show: false});
      }, 3000);
    }
  }, [spreadsheetReady]);

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  const saveDocumentHandler = async () => {
    router.events.emit('routeChangeStart');
    try {
      const result = await saveDocument(
        null,
        router,
        config,
        spreadsheetId,
        workspaceData,
        setMessage,
        dispatch
      );
      if (result.success) {
        setIsSaved(true);
        setMessage({
          message: 'Record successfully saved',
          color: 'blue',
          show: true,
        });
        router.events.emit('routeChangeComplete');
        await delay(3000);
        setMessage({message: '', color: '', show: false});
      }
    } catch (error) {
      // Handle error and display error message
      setMessage({
        message: `Failed to save record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
          error,
        )}`,
        color: 'red',
        show: true,
      });
    }
    router.events.emit('routeChangeComplete');
    settriggerSave('');
  };

  const downloadWorkspaceHandler = async () => {
    router.events.emit('routeChangeStart');
    try {
      const result = await downloadWorkspace(
        router,
        config,
        spreadsheetId,
        workspaceData,
        setMessage,
        dispatch
      );
      if (result.success) {
        setMessage({
          message: `Success. Record converted to XLSX with file name "${workspaceData.workspace_name}.xlsx"`,
          color: 'blue',
          show: true,
        });
        setIsSaved(false);
        router.events.emit('routeChangeComplete');
        await delay(3500);
        setMessage({message: '', color: '', show: false});
      }
    } catch (error) {
      setMessage({message: `${String(error)}`, color: 'red', show: true});
    }
    router.events.emit('routeChangeComplete');
    settriggerSave('');
  };

  useEffect(() => {
    if (triggerSave && IsSaved) {
      if (triggerSave === 'download') {
        downloadWorkspaceHandler();
      } else if (triggerSave === 'save') {
        saveDocumentHandler();
      }
    }
  }, [triggerSave, IsSaved]);

  // detect changes in the workspace data inputs
  const handleWorkspaceChange = event => {
    const {name, value} = event.target;
    setworkspaceData(prevInputValues => ({
      ...prevInputValues,
      [name]: value,
    }));
    console.log(workspaceData);
  };

  return error ? (
    <div className="w-full h-full flex flex-col p-10 space-y-4">
      <p className="font-bold text-lg text-red-500">
        Something happened. Please try again or contact administrator/maintainer
        if the problem still persists by giving them the information below:
      </p>
      <Highlight className="html rounded-md border-2">{error}</Highlight>
      <Button
        path="/datatype/well_data/printed_well_report"
        button_description="Go back"
      />
    </div>
  ) : Data[0] !== -1 && dataContentDetails[0] !== -1 ? (
    <Container additional_class="space-y-3">
      <Container.Title back>Edit Record</Container.Title>
      <TableComponent
        additional_styles_column="overflow-visible"
        header={workspaceData?.kkks_name ? ['Header', ''] : ['Header']}
        content={
          workspaceData?.kkks_name
            ? [
                [
                  // eslint-disable-next-line react/jsx-key
                  <div className="flex space-x-2">
                    <p>Nama KKKS</p>
                    <p className="text-gray-400">(KKKS Name)</p>
                  </div>,
                  // eslint-disable-next-line react/jsx-key
                  <Input
                    name="kkks_name"
                    type={'text'}
                    value={
                      workspaceData?.kkks_name || 'Geodwipa Teknika Nusantara'
                    }
                    onChange={handleWorkspaceChange}
                  />,
                ],
                [
                  // eslint-disable-next-line react/jsx-key
                  <div className="flex space-x-2">
                    <p>Nama wilayah kerja</p>
                    <p className="text-gray-400">(Working area)</p>
                  </div>,
                  // eslint-disable-next-line react/jsx-key
                  <Input
                    name="working_area"
                    type={'text'}
                    value={
                      workspaceData?.working_area ||
                      'Geodwipa Teknika Nusantara'
                    }
                    onChange={handleWorkspaceChange}
                  />,
                ],
                [
                  // eslint-disable-next-line react/jsx-key
                  <div className="flex space-x-2">
                    <p>Jenis penyerahan data</p>
                    <p className="text-gray-400">(Submission type)</p>
                  </div>,
                  // eslint-disable-next-line react/jsx-key
                  <Input
                    name="submission_type"
                    type={'dropdown'}
                    value={workspaceData?.submission_type || 'Select an item'}
                    dropdown_items={[
                      'Quarterly',
                      'Relinquishment',
                      'Termination',
                      'Spec New',
                      'Spec Ext',
                      'Spec Term',
                      'Joint Study',
                      'DIPA',
                    ]}
                    onChange={handleWorkspaceChange}
                  />,
                ],
                [
                  // eslint-disable-next-line react/jsx-key
                  <div className="flex space-x-2">
                    <p>Nomor AFE</p>
                    <p className="text-gray-400">(AFE number)</p>
                  </div>,
                  // eslint-disable-next-line react/jsx-key
                  <Input
                    name="afe_number"
                    type={'number'}
                    value={String(workspaceData?.afe_number) || '1'}
                    disabled
                  />,
                ],
                [
                  // eslint-disable-next-line react/jsx-key
                  <p className="font-bold">Data type</p>,
                  // eslint-disable-next-line react/jsx-key
                  <Input
                    type={'text'}
                    value={router.query.form_type.replace(/\_/g, ' ')}
                    additional_styles_input="capitalize font-semibold"
                    disabled
                  />,
                ],
              ]
            : [
                [
                  // eslint-disable-next-line react/jsx-key
                  <div className="flex space-x-3 justify-center items-center p-2">
                    <div className="w-5 h-5 border-t-transparent rounded-full border-2 border-black animate-spin" />
                    <p>Getting data... Please wait</p>
                  </div>,
                ],
              ]
        }
      />
      <div className="h-full">
        <TableComponent
          header={[
            // eslint-disable-next-line react/jsx-key
            <div className="flex justify-between items-center">
              <p>Data</p>
            </div>,
          ]}
          content={[
            Data
              ? [
                  // eslint-disable-next-line react/jsx-key
                  <div className="h-[750px]">
                    <Sheets
                      type="review"
                      form_type={router?.query.form_type || 'basin'}
                      data={dataContentDetails}
                      finishedInitializing={setspreadsheetReady}
                      getSpreadsheetID={setspreadsheetId}
                      config={config}
                    />
                  </div>,
                ]
              : [
                  // eslint-disable-next-line react/jsx-key
                  <div className="flex space-x-3 justify-center items-center p-2">
                    <div className="w-5 h-5 border-t-transparent rounded-full border-2 border-black animate-spin" />
                    <p>Getting data... Please wait</p>
                  </div>,
                ],
          ]}
          additional_styles_row="p-0"
          additional_styles="overflow-hidden"
        />
      </div>
      <div className="flex space-x-2 w-full pt-5">
        <Button
          path=""
          button_description="Save record"
          onClick={e => {
            e.preventDefault();
            setIsSaved(true);
            settriggerSave('save');
          }}
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          disabled={!spreadsheetReady || Message.message ? true : false}
        />
        <Button
          path=""
          button_description="Download record"
          onClick={e => {
            e.preventDefault();
            setIsSaved(true);
            settriggerSave('download');
          }}
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
          disabled={!spreadsheetReady || Message.message ? true : false}
        />
      </div>
      {/* <Toast message={Message} setmessage={setMessage}>
        {Message.message}
      </Toast> */}
    </Container>
  ) : (
    <div
      className={`w-full h-full flex flex-col items-center justify-center space-y-3`}>
      <div
        className={`animate-spin border-4 border-t-transparent
                 border-gray-500/[.7] rounded-full w-14 h-14`}></div>
      <p className="text-xl font-semibold text-gray-500">
        Getting data from database... Please wait
      </p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {
      workspace_name: context.params.edit,
      config: config,
    }, // will be passed to the page component as props
  };
}

export default DocEditor;
