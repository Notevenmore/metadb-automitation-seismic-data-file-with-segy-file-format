import Sheets from '@components/Sheets';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useState} from 'react';
import Input from '../../components/Input';
import Button from '../../components/button';
import Container from '../../components/container';
import TableComponent from '../../components/table/table';
import {
  downloadWorkspace,
  init_data,
  saveDocument,
} from '../../components/utility_functions';
import DownloadFolder from '../../public/icons/download-folder.svg';
import Save from '../../public/icons/save.svg';
import {useAppDispatch} from '../../store';
import {
  UploadDocumentSettings,
  displayErrorMessage,
} from '../../store/generalSlice';
import {delay} from '../../utils/common';

const DocEditor = ({workspace_name, setTitle, config}) => {
  const [IsSaved, setIsSaved] = useState(false);
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [error, seterror] = useState('');
  const [Data, setData] = useState([-1]);
  const [dataContentDetails, setdataContentDetails] = useState([-1]);
  const [spreadsheetReady, setspreadsheetReady] = useState(false);
  const [workspaceData, setworkspaceData] = useState<UploadDocumentSettings>();
  const [spreadsheetId, setspreadsheetId] = useState();
  const [triggerSave, settriggerSave] = useState('');

  const dispatch = useAppDispatch();

  const warningText =
    'You have unsaved changes - Are you sure you want to leave this page?';

  const router = useRouter();

  useEffect(() => {
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
          history.go(1);
          router.events.emit('routeChangeError');
          throw 'routeChange aborted.';
        }
      }
      // If there are no unsaved changes, allow navigation away from the page
      return;
    };
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('beforeHistoryChange', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('beforeHistoryChange', handleBrowseAway);
    };
  }, [IsSaved, router]);

  // This useEffect hook sets up the initial data for the workspace based on the workspace name and form type
  useEffect(() => {
    // Call init_data to set up the workspace data
    const init_call = async () => {
      try {
        // console.log(router.query.workspace_data);
        await delay(500);
        router.events.emit('routeChangeStart');
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
          `${workspace_name} | ${(router.query.form_type as string)
            .split('_')
            .map(x => {
              return x.charAt(0).toUpperCase() + x.slice(1);
            })
            .join(' ')} - Edit Record`,
        );
      } catch (error) {
        // Handle any errors that occur during initialization
        seterror(String(error));
        router.events.emit('routeChangeComplete');
      }
    };
    init_call();
  }, [config, router, router.isReady, setTitle, workspace_name]);

  useEffect(() => {
    if (spreadsheetReady) {
      setTimeout(() => {
        dispatch(
          displayErrorMessage({
            message:
              'Please use DD/MM/YYYY format in any date field. You can set the date formatting by going to Format > Number and selecting the correct date format if the field insisted on inputting wrong date format.',
            color: 'blue',
            duration: 10000,
          }),
        );
      }, 3000);
    }
  }, [dispatch, spreadsheetReady]);

  const saveDocumentHandler = useCallback(() => {
    router.events.emit('routeChangeStart');
    saveDocument(null, router, config, spreadsheetId, workspaceData, dispatch)
      .then(async result => {
        if (result.success) {
          setIsSaved(true);
          dispatch(
            displayErrorMessage({
              message: 'Record successfully saved',
              color: 'blue',
              duration: 3000,
            }),
          );
          router.events.emit('routeChangeComplete');
          if (triggerSave.includes('redirect')) {
            await delay(1000);
            setTimeout(() => {
              dispatch(
                displayErrorMessage({
                  message: 'Redirecting back to record list...',
                  color: 'blue',
                  duration: 1500,
                }),
              );
            }, 0);
            await delay(1000);
            router.back();
          }
        }
      })
      .then(() => {
        router.events.emit('routeChangeComplete');
        settriggerSave('');
      })
      .catch(error => {
        // Handle error and display error message
        dispatch(
          displayErrorMessage({
            message: `Failed to save record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
              error,
            )}`,
            color: 'red',
          }),
        );
      });
  }, [config, dispatch, router, spreadsheetId, triggerSave, workspaceData]);

  const downloadWorkspaceHandler = useCallback(() => {
    router.events.emit('routeChangeStart');
    downloadWorkspace(router, config, workspaceData, dispatch)
      .then(result => {
        if (result.success) {
          dispatch(
            displayErrorMessage({
              message: `Success. Record converted to XLSX with file name "${workspaceData.workspace_name}.xlsx"`,
              color: 'blue',
              duration: 3500,
            }),
          );
          setIsSaved(false);
          router.events.emit('routeChangeComplete');
        }
      })
      .catch(error => {
        dispatch(
          displayErrorMessage({
            message: `${String(error)}`,
            color: 'red',
          }),
        );
      })
      .finally(() => {
        router.events.emit('routeChangeComplete');
        settriggerSave('');
      });
  }, [config, dispatch, router, spreadsheetId, workspaceData]);

  useEffect(() => {
    if (triggerSave && IsSaved) {
      if (triggerSave === 'download') {
        downloadWorkspaceHandler();
      } else if (triggerSave.includes('save')) {
        saveDocumentHandler();
      }
    }
  }, [triggerSave, IsSaved, downloadWorkspaceHandler, saveDocumentHandler]);

  // detect changes in the workspace data inputs
  const handleWorkspaceChange = event => {
    const {name, value} = event.target;
    setworkspaceData(prevInputValues => ({
      ...prevInputValues,
      [name]: value,
    }));
    console.log(workspaceData);
  };

  useEffect(() => {
    // if all is true, meaning all loading has been finished
    if ([Data, dataContentDetails, spreadsheetReady].every(x => x)) {
      router.events.emit('routeChangeComplete');
    }
  }, [Data, dataContentDetails, router.events, spreadsheetReady]);

  return error ? (
    <div className="w-full h-full flex flex-col p-10 space-y-4">
      <p className="font-bold text-lg text-red-500">
        Something happened. Please try again or contact administrator/maintainer
        if the problem still persists by giving them the information below:
      </p>
      <code className="rounded-md border-2 p-2">{error}</code>
      <div className="flex space-x-2">
        <Button path="/datatype/well_data/printed_well_report">Go back</Button>
        <Button
          path="/datatype/well_data/printed_well_report"
          onClick={e => {
            e.preventDefault();
            setIsSaved(true);
            router.reload();
          }}>
          Reload
        </Button>
      </div>
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
                  <div className="flex space-x-2" key="kkks">
                    <p>Nama KKKS</p>
                    <p className="text-gray-400">(KKKS Name)</p>
                  </div>,
                  <Input
                    key="kkks_input"
                    name="kkks_name"
                    type={'text'}
                    value={
                      workspaceData?.kkks_name || 'Geodwipa Teknika Nusantara'
                    }
                    onChange={handleWorkspaceChange}
                  />,
                ],
                [
                  <div className="flex space-x-2" key="working_area">
                    <p>Nama wilayah kerja</p>
                    <p className="text-gray-400">(Working area)</p>
                  </div>,
                  <Input
                    key="working_area_input"
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
                  <div className="flex space-x-2" key="submission_type">
                    <p>Jenis penyerahan data</p>
                    <p className="text-gray-400">(Submission type)</p>
                  </div>,
                  <Input
                    key="submission_type_input"
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
                  <div className="flex space-x-2" key="afe_number">
                    <p>Nomor AFE</p>
                    <p className="text-gray-400">(AFE number)</p>
                  </div>,
                  <Input
                    key="afe_number_input"
                    name="afe_number"
                    type={'number'}
                    value={String(workspaceData?.afe_number) || '1'}
                    disabled
                  />,
                ],
                [
                  <p className="font-bold" key="data_type">
                    Data type
                  </p>,
                  <Input
                    key="data_type_input"
                    type={'text'}
                    value={(router.query.form_type as string).replace(
                      /\_/g,
                      ' ',
                    )}
                    additional_styles_input="capitalize font-semibold"
                    disabled
                  />,
                ],
              ]
            : [
                [
                  <div
                    className="flex space-x-3 justify-center items-center p-2"
                    key="loading">
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
            <div
              className="flex justify-between items-center"
              key="data_header">
              <p>Data</p>
            </div>,
          ]}
          content={[
            Data
              ? [
                  <div className="h-750p" key="sheet">
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
                  <div
                    className="flex space-x-3 justify-center items-center p-2"
                    key="loading">
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
          onClick={e => {
            e.preventDefault();
            setIsSaved(true);
            settriggerSave('save');
          }}
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p min-w-max justify-center"
          disabled={!spreadsheetReady || Message.message ? true : false}>
          <div className="flex space-x-2 items-center">
            <Save className="w-5 h-5" />
            <p>Save changes</p>
          </div>
        </Button>
        <Button
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p min-w-max justify-center"
          onClick={e => {
            e.preventDefault();
            setIsSaved(true);
            settriggerSave('save_redirect');
          }}
          disabled={
            !spreadsheetId || Message.message || !spreadsheetReady
              ? true
              : false
          }>
          <div className="flex space-x-2 items-center">
            <Save className="w-5 h-5" />
            <p>Save and exit</p>
          </div>
        </Button>
        <Button
          onClick={e => {
            e.preventDefault();
            setIsSaved(true);
            settriggerSave('download');
          }}
          additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold w-200p min-w-max justify-center"
          disabled={!spreadsheetReady || Message.message ? true : false}>
          <div className="flex space-x-2 items-center">
            <DownloadFolder className="w-5 h-5" />
            <p>Download record</p>
          </div>
        </Button>
      </div>
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

export function getServerSideProps(context) {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {
      workspace_name: context.params.edit,
      config: config,
    }, // will be passed to the page component as props
  };
}

export default DocEditor;
