import Image from 'next/image';
import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import {useCallback, useEffect, useState} from 'react';
import Input from '../../components/Input';
import Button from '../../components/button';
import Container from '../../components/container';
import TableComponent from '../../components/table/table';
import {
  checkAFETimeout,
  formatWorkspaceList,
  getColumnBinder,
  getDataTypeNoUnderscore,
  handleAfeChange,
} from '../../components/utility_functions';
import {TokenExpired} from '../../services/admin';
import {useAppDispatch} from '../../store';
import Plus from '../../public/icons/plus.svg';
import CloseThin from '../../public/icons/close-thin.svg';
import DownloadCommon from '../../public/icons/download-common.svg';
import {
  UploadDocumentSettings,
  displayErrorMessage,
  setUploadDocumentSettings,
} from '../../store/generalSlice';
import {delay} from '../../utils/common';

interface DeleteToggle {
  show: boolean;
  afe_number: number;
}

const PrintedWellReport = ({datatype, setTitle, config}) => {
  const [data, setData] = useState([]);
  const [searchData, setsearchData] = useState([-1]); // for saving a backup when searching
  const [bulkSearch, setbulkSearch] = useState([-1]);
  const [error, seterror] = useState('');
  const [bulkSearchError, setbulkSearchError] = useState('');
  const [toggleOverlay, settoggleOverlay] = useState(false);
  const [toggleOverlayDownload, settoggleOverlayDownload] = useState(false);
  const [toggleOverlayDelete, settoggleOverlayDelete] = useState<DeleteToggle>({
    show: false,
    afe_number: null,
  });
  const [newWorkspace, setnewWorkspace] = useState<UploadDocumentSettings>({
    workspace_name: '',
    kkks_name: '',
    working_area: '',
    submission_type: '',
    afe_number: null,
    email: 'john.richardson@gtn.id', // TODO: SET THIS TO BE BASED ON THE CURRENTLY LOGGED IN USER
  });
  const [popupMessage, setpopupMessage] = useState({message: '', color: ''});
  const [afeExist, setafeExist] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const path_query =
    'Home' + router.asPath.replace(/\//g, ' > ').replace(/\_/g, ' ');
  let selectedTableData = [[]];

  const deleteWorkspace = useCallback(
    (e, afe_number) => {
      e.preventDefault();
      router.events.emit('routeChangeStart');
      dispatch(
        displayErrorMessage({
          message:
            "Deleting record... Please don't leave this page or click anything",
          color: 'blue',
        }),
      );
      return fetch(`${config[datatype]['afe']}${afe_number}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
      })
        .then(res => {
          if (res.status !== 200) {
            TokenExpired(res.status);
            throw `Response returned with status code ${res.status}: ${res.statusText}`;
          }
          dispatch(
            displayErrorMessage({
              message: 'Success',
              color: 'blue',
              duration: 1500,
            }),
          );
          reset_search();
          router.events.emit('routeChangeComplete');
        })
        .catch(error => {
          dispatch(
            displayErrorMessage({
              message: String(error),
              color: 'red',
              duration: 5000,
            }),
          );
          router.events.emit('routeChangeComplete');
        });
    },
    [config, datatype, dispatch, router.events],
  );

  const init = useCallback(() => {
    router.events.emit('routeChangeStart');
    try {
      fetch(`${config[datatype]['afe']}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
      })
        .then(res =>
          Promise.all([
            res.status,
            res.status !== 200 ? res.text() : res.json(),
          ]),
        )
        .then(([status, res]) => {
          if (status !== 200) {
            TokenExpired(status);
            throw `Service returned with status ${status}: ${res}`;
          }
          return res;
        })
        .then(res => {
          if (!res) {
            setData([0]);
            return;
          }
          const final = formatWorkspaceList(
            res,
            Button,
            DownloadCommon,
            Image,
            datatype,
            config,
            dispatch,
            settoggleOverlayDelete,
            router,
          );
          setData(final);
          onSearchDownload();
        })
        .catch(error => {
          seterror(String(error));
        });
    } catch (error) {
      if (String(error).includes('Cannot read properties')) {
        seterror(
          String(
            'Error: Datatype not implemented yet. Please contact maintainer/developer.',
          ),
        );
      } else {
        seterror(String(error));
      }
    }
    router.events.emit('routeChangeComplete');
  }, [config, datatype, deleteWorkspace, router.events]);

  useEffect(() => {
    setTitle(
      datatype
        .split('_')
        .map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' '),
    );
    setData([]);
    seterror('');
    reset_search();
    resetBulkSearch();
    init();
  }, [datatype, init, setTitle]);

  const onSearch = e => {
    const name = e.target.value.toLowerCase();
    let temp = data.filter(item => {
      return (
        item.KKKS.toLocaleLowerCase().includes(name) ||
        item['Working area'].toLocaleLowerCase().includes(name) ||
        String(item.AFE).toLocaleLowerCase().includes(name) ||
        item.Type.toLocaleLowerCase().includes(name)
      );
    });
    if (name) {
      setsearchData(temp);
    } else {
      setsearchData([-1]);
    }
  };

  const onSearchDownload = (e = null) => {
    try {
      if (e) {
        e.preventDefault();
      }
      const bulk_search_input = document.getElementById(
        'search_bar_bulk_download',
      ) as HTMLInputElement;
      const bulk_search_identifier = parseInt(bulk_search_input.value);
      if (!bulk_search_identifier) {
        return;
      }
      setbulkSearch([0]);
      fetch(
        `${config[datatype]['afe'].slice(0, -1)}-${
          config[datatype]['column_binder']
        }`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
              JSON.parse(parseCookies().user_data).access_token
            }`,
            [config[datatype]['column_binder']
              .split('-')
              .join('_')]: `${bulk_search_identifier}`,
          },
        },
      )
        .then(res =>
          Promise.all([
            res.status,
            res.status !== 200 ? res.text() : res.json(),
          ]),
        )
        .then(([status, res]) => {
          if (status !== 200) {
            TokenExpired(status);
            throw `Service returned with status ${status}: ${res}`;
          }
          return res;
        })
        .then(res => {
          const records = formatWorkspaceList(
            res,
            Button,
            DownloadCommon,
            Image,
            datatype,
            config,
            dispatch,
            settoggleOverlayDelete,
            router,
          );
          setbulkSearch(records);
        })
        .catch(err => {
          dispatch(
            displayErrorMessage({
              message: `Failed to execute bulk searching. ${String(err)}`,
              color: 'red',
              duration: 5000,
            }),
          );
          setbulkSearch([-1]);
          setbulkSearchError(
            `Failed to execute bulk searching. ${String(err)}`,
          );
        });
    } catch (error) {
      setbulkSearch([-1]);
      setbulkSearchError(`Failed to execute bulk searching. ${String(error)}`);
    }
  };

  const redirect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(
      displayErrorMessage({
        message: 'Redirecting to next page...',
        color: 'blue',
        duration: 1500,
      }),
    );
    router.push({
      pathname: `/edit/${newWorkspace.workspace_name}`,
      query: {
        form_type: datatype,
        workspace_data: newWorkspace.afe_number,
      },
    });
  };

  const makenew = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.events.emit('routeChangeStart');
    try {
      settoggleOverlay(false);
      dispatch(
        displayErrorMessage({
          message:
            "Creating a new record... Please don't leave this page or click anything",
          color: 'blue',
        }),
      );
      await fetch(`${config[datatype]['afe']}`, {
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
            message: 'Sucess. Redirecting to the next page...',
            color: 'blue',
            duration: 1500,
          }),
        );
      }, 0);
      router.events.emit('routeChangeComplete');
      await delay(1500);
      router.push({
        pathname: '/new_document',
        query: {form_type: datatype},
      });
    } catch (error) {
      // Handle error and display error message
      dispatch(
        displayErrorMessage({
          message: String(error),
          color: 'red',
          duration: 5000,
        }),
      );
    }
    router.events.emit('routeChangeComplete');
  };

  const reset = (element: HTMLElement = undefined) => {
    if (element) {
      const comparator = document.getElementById('overlay');
      if (element !== comparator) {
        return;
      }
    }
    settoggleOverlay(false);
    setnewWorkspace(x => {
      return {
        ...x,
        workspace_name: '',
        kkks_name: '',
        working_area: '',
        afe_number: null,
        submission_type: '',
      };
    });
    setpopupMessage({message: '', color: ''});
  };

  const resetDownloadOverlay = (element: HTMLElement = undefined) => {
    console.log(element);
    if (element) {
      const comparator = document.getElementById('overlay_download');
      if (element !== comparator) {
        return;
      }
    }
    settoggleOverlayDownload(false);
  };

  const resetDeleteOverlay = async (
    e: React.MouseEvent<HTMLElement>,
    submit = false,
    element = false,
  ) => {
    e.preventDefault();
    router.events.emit('routeChangeStart');

    if (element) {
      const comparator = document.getElementById('overlay_delete');
      const comparator_parent = document.getElementById(
        'overlay_delete_parent',
      );
      console.log(e.target, comparator, e.target !== comparator);
      if (![comparator, comparator_parent].includes(e.target as HTMLElement)) {
        router.events.emit('routeChangeComplete');
        return;
      }
    }
    settoggleOverlayDelete(prev => {
      return {
        show: false,
        afe_number: prev.afe_number,
      };
    });
    if (submit) {
      deleteWorkspace(e, toggleOverlayDelete.afe_number).then(res => {
        init();
      });
    }

    router.events.emit('routeChangeComplete');
  };

  const reset_search = () => {
    const search_input = document.getElementById(
      'search_bar',
    ) as HTMLInputElement;
    search_input.value = '';
    setsearchData([-1]);
  };

  const resetBulkSearch = () => {
    const bulk_search_input = document.getElementById(
      'search_bar_bulk_download',
    ) as HTMLInputElement;
    console.log(bulk_search_input.value);
    bulk_search_input.value = '';
    setbulkSearch([-1]);
    setbulkSearchError('');
  };

  return (
    <Container>
      <Container.Title>
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-sm font-normal capitalize">{path_query}</p>
            <p className="capitalize">{getDataTypeNoUnderscore(datatype)}</p>
          </div>
          <div className="w-4/5 lg:w-2/5 relative">
            <Input
              id="search_bar"
              label=""
              type="text"
              name="search"
              additional_styles_input="px-4 rounded-full text-base"
              additional_styles="flex flex-col items-center justify-center"
              onChange={e => onSearch(e)}
              autoComplete="off"
              placeholder="Search"
            />
            <Image
              src="/icons/magnify.svg"
              width={20}
              height={20}
              className="absolute top-1/2 right-3 -translate-y-1/2"
              alt="search"
            />
          </div>
        </div>
      </Container.Title>
      <TableComponent
        header={
          searchData[0] !== -1 // if there exist search data
            ? searchData.length === 0 // if search length of search data is 0
              ? ['Search did not return any result'] // self explanatory
              : ['AFE', 'KKKS', 'Working area', 'Type', 'Action'] // else display default headers
            : data.length !== 0 // else if no search data and length of data is not 0
            ? data[0] === 0 // if index 0 of data is 0
              ? ['No records have been created'] // means that no record has been created
              : ['AFE', 'KKKS', 'Working area', 'Type', 'Action'] // else display default headers
            : error // else if there exist error
            ? ['Connection error'] // means that there's a connection error
            : ['Loading...'] // else it's loading
        }
        content={
          searchData[0] !== -1 // if there exist search data
            ? searchData.length === 0 // if length of search data is 0: no records found
              ? [
                  {
                    'Search did not return any result':
                      'No records found with such attributes',
                  },
                ]
              : searchData // else display the search data
            : data.length === 0 // else if no search data and length of data is 0
            ? error // if there exist error: self explanatory
              ? [
                  {
                    'Connection error':
                      'Error getting record list. Please try again or contact maintainer if the problem persists by giving them the information below',
                  },
                ]
              : [{'Loading...': 'Getting record list...'}]
            : data[0] === 0 // else if index 0 of data is 0: no record has been created
            ? [
                {
                  'No records have been created':
                    'Heads up! Create a new record by clicking the + button below',
                },
              ]
            : data // else display records list
        }
        setSelectedRows={selectedTableData}
        contentAlignWithHeader
        additional_styles="mb-20"
      />
      {error ? (
        // <Highlight className="html rounded-md border-2">{error}</Highlight>
        <code className="rounded-md border-2 p-2">{error}</code>
      ) : null}
      <div className="fixed bottom-9 right-12 flex space-x-2">
        <Button
          className="shadow-black/10 shadow-lg drop-shadow-lg hover:w-250p w-60p h-60p border rounded-full bg-gray-200 flex items-center transition-all overflow-hidden outline-none"
          onClick={e => {
            e.preventDefault;
            settoggleOverlayDownload(true);
          }}>
          <div className="flex items-center justify-center space-x-5 pl-4">
            <DownloadCommon className="w-6 h-6" />
            <p className="whitespace-nowrap font-bold">More download option</p>
          </div>
        </Button>
        <Button
          className="shadow-black/10 shadow-lg drop-shadow-lg hover:w-170p w-60p h-60p border rounded-full bg-gray-200 flex items-center transition-all overflow-hidden outline-none"
          onClick={e => {
            e.preventDefault;
            settoggleOverlay(true);
          }}>
          <div className="flex items-center justify-center space-x-5 pl-4">
            <Plus className="w-6 h-6" />
            <p className="whitespace-nowrap font-bold">New record</p>
          </div>
        </Button>
      </div>
      <div
        className={`fixed w-screen h-screen bg-black/[.5] top-0 left-0 ${
          toggleOverlay ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-all`}
        onClick={e => {
          e.preventDefault();
          reset(e.target as HTMLElement);
        }}>
        <div
          id="overlay"
          className="flex items-center justify-center w-full h-full">
          <div
            className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${
              toggleOverlay ? '' : '-translate-y-10 opacity-0'
            } transition-all`}>
            <Button
              path=""
              additional_styles="absolute top-2 right-2 px-1 py-1 text-black"
              title="Cancel"
              onClick={e => {
                e.preventDefault();
                reset();
              }}>
              <CloseThin className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-3xl">New record</h1>
            <hr />
            <p className="font-semibold">
              Select the appropriate configuration for the new record:
            </p>
            <form className="space-y-3 flex flex-col items-center justify-center">
              <div className="w-full space-y-2 border-2 p-2 rounded-lg">
                <p>AFE number</p>
                <div className="relative">
                  <Input
                    type="number"
                    name={'AFE_Number'}
                    placeholder={'Input AFE number'}
                    value={newWorkspace.afe_number || ''}
                    required={true}
                    additional_styles="w-full"
                    autoComplete="off"
                    onChange={e => {
                      setnewWorkspace({
                        ...newWorkspace,
                        afe_number: parseInt(e.target.value) || null,
                        workspace_name: `record_${e.target.value}`,
                      });
                      handleAfeChange(
                        e,
                        config,
                        datatype,
                        dispatch,
                        setpopupMessage,
                        setnewWorkspace,
                        newWorkspace,
                        setafeExist,
                      );
                    }}
                  />
                  <div
                    className={`${
                      popupMessage.message
                        ? 'visible opacity-100'
                        : 'invsible opacity-0 -translate-x-2'
                    } absolute ml-4 left-full -translate-y-1/2 top-1/2 border-2 ${
                      popupMessage.color === 'red'
                        ? 'bg-red-100 border-red-500'
                        : 'bg-searchbg border-blue-500'
                    } w-60pc z-[9999999] p-1 rounded-md pointer-events-none transition-all`}>
                    <p className="font-semibold text-sm">
                      {popupMessage.message}
                    </p>
                  </div>
                  <div
                    className={`${
                      popupMessage.message
                        ? 'visible opacity-100'
                        : 'invsible opacity-0 -translate-x-2'
                    } absolute ml-3 left-full -translate-y-1/2 top-1/2 border-2 rotate-45 h-2 w-2 ${
                      popupMessage.color === 'red'
                        ? 'bg-red-500 border-red-500'
                        : 'bg-blue-500 border-blue-500'
                    } z-[9999998] transition-all`}
                  />
                </div>
                <p>KKKS name</p>
                <Input
                  type="text"
                  name={'kkksName'}
                  placeholder={'Input KKKS name'}
                  value={newWorkspace.kkks_name}
                  required={true}
                  additional_styles="w-full"
                  autoComplete="off"
                  onChange={e =>
                    setnewWorkspace({
                      ...newWorkspace,
                      kkks_name: e.target.value,
                    })
                  }
                  disabled={afeExist}
                />
                <p>Working area</p>
                <Input
                  type="text"
                  name={'workingArea'}
                  placeholder={'Input working area'}
                  value={newWorkspace.working_area}
                  required={true}
                  additional_styles="w-full"
                  autoComplete="off"
                  onChange={e =>
                    setnewWorkspace({
                      ...newWorkspace,
                      working_area: e.target.value,
                    })
                  }
                  disabled={afeExist}
                />
                <p>Submission type</p>
                <Input
                  type={`${afeExist ? 'text' : 'dropdown'}`}
                  name={'submissionType'}
                  placeholder={'Select an item'}
                  value={newWorkspace.submission_type}
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
                  required={true}
                  additional_styles="w-full"
                  onChange={e =>
                    setnewWorkspace({
                      ...newWorkspace,
                      submission_type: e.target.value,
                    })
                  }
                  withSearch
                  disabled={afeExist}
                />
              </div>
              <div className="space-x-2 flex">
                <Button
                  type="submit"
                  button_description="Confirm"
                  disabled={
                    Object.values(newWorkspace).some(x => {
                      return x === null || x === '';
                    }) || checkAFETimeout
                      ? true
                      : false
                  }
                  additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
                  onClick={e => {
                    afeExist ? redirect(e) : makenew(e);
                  }}
                />
                <Button
                  button_description="Cancel"
                  onClick={e => {
                    e.preventDefault();
                    reset();
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className={`fixed w-screen h-screen bg-black/[.5] top-0 left-0 ${
          toggleOverlayDownload ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-all`}
        onClick={e => {
          e.preventDefault();
          resetDownloadOverlay(e.target as HTMLElement);
        }}>
        <div
          id="overlay_download"
          className="flex items-center justify-center w-full h-full">
          <div
            className={`bg-white border-2 rounded-lg p-10 w-90pc h-85pc relative space-y-3 ${
              toggleOverlayDownload ? '' : '-translate-y-10 opacity-0'
            } transition-all`}>
            <Button
              path=""
              additional_styles="absolute top-2 right-2 px-1 py-1 text-black flex"
              title="Cancel"
              onClick={e => {
                e.preventDefault();
                resetDownloadOverlay();
              }}>
              <CloseThin className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-3xl">More download option</h1>
            <hr />
            <div className="border-2 rounded-lg h-[calc(100%-125px)] overflow-auto relative">
              <div className="flex justify-between items-center p-5 sticky top-0 bg-white">
                <p className="font-semibold w-1/2 break-words">
                  <strong>Search by {getColumnBinder(config, datatype)}</strong>{' '}
                  to find {getDataTypeNoUnderscore(datatype)} record(s) you want
                  to download:
                </p>
                <form
                  id="bulk_search_download"
                  className="w-4/5 lg:w-2/5 relative"
                  onSubmit={onSearchDownload}>
                  <Input
                    id="search_bar_bulk_download"
                    label=""
                    type="text"
                    name="search"
                    additional_styles_input="px-4 rounded-full text-base placeholder:font-bold"
                    additional_styles="flex flex-col items-center justify-center"
                    autoComplete="off"
                    placeholder={`Search by ${getColumnBinder(
                      config,
                      datatype,
                    )}`}
                  />
                  <Image
                    src="/icons/magnify.svg"
                    width={20}
                    height={20}
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                    alt="search"
                  />
                </form>
              </div>
              <div className="px-5">
                <TableComponent
                  header={
                    !bulkSearch // if bulkSearch is null
                      ? ['Search did not return any result'] // no records found
                      : bulkSearchError // else if error
                      ? ['Connection error'] // connection error
                      : bulkSearch[0] === 0 // else if length of bulkSearch is 0
                      ? ['Loading...'] // it's loading
                      : bulkSearch[0] !== -1 // else if length of bulkSearch is more than 0
                      ? ['AFE', 'KKKS', 'Working area', 'Type', 'Action']
                      : ['Start searching!'] // else search has not begun
                  }
                  content={
                    !bulkSearch // if bulkSearch is null
                      ? [
                          {
                            'Search did not return any result': `No records found with such ${getColumnBinder(
                              config,
                              datatype,
                            )}`,
                          },
                        ] // no records found
                      : bulkSearchError // else if error
                      ? [
                          {
                            'Connection error':
                              'Error getting record list. Please try again or contact maintainer if the problem persists by giving them the information above',
                          },
                        ] // connection error
                      : bulkSearch[0] === 0 // else if length of bulkSearch is 0
                      ? [{'Loading...': 'Getting record list...'}] // it's loading
                      : bulkSearch[0] !== -1 // else if length of bulkSearch is more than 0
                      ? bulkSearch
                      : [
                          {
                            'Start searching!': `Search records by entering a ${getColumnBinder(
                              config,
                              datatype,
                            )} in the search bar above, then press enter or click the 'search' button below to see records associated with that ${getColumnBinder(
                              config,
                              datatype,
                            )}.`,
                          },
                        ] // else search has not begun
                  }
                  setSelectedRows={selectedTableData}
                  contentAlignWithHeader
                  additional_styles="mb-5"
                />
              </div>
            </div>
            <div className="flex justify-center space-x-3 w-full ">
              <Button
                form="bulk_search_download"
                type="submit"
                title={`Search ${getDataTypeNoUnderscore(
                  datatype,
                )} records based on ${getColumnBinder(config, datatype)}`}
                onClick={onSearchDownload}
                additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold ">
                Search
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault();
                  resetBulkSearch();
                }}
                title="The reset button. Use this button to clear any previous search or to attemp searching if a failure occured."
                additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold ">
                Reset search
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault();
                  settoggleOverlayDownload(false);
                }}
                title="Close pop-up">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed w-screen h-screen flex items-center justify-center bg-black/[.5] top-0 left-0 ${
          toggleOverlayDelete.show
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        } transition-all z-[9999]`}
        id="overlay_delete_parent"
        onClick={e => {
          resetDeleteOverlay(e, false, true);
        }}>
        <div
          id="overlay_delete"
          className="flex items-center justify-center w-1/2 h-full">
          <div
            className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${
              toggleOverlayDelete.show ? '' : '-translate-y-10 opacity-0'
            } transition-all`}>
            <Button
              path=""
              additional_styles="absolute top-2 right-2 px-1 py-1 text-black"
              title="Cancel"
              onClick={resetDeleteOverlay}>
              <CloseThin className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-3xl">Delete confirmation</h1>
            <hr />
            <p>
              Are you sure you want to delete a record with afe number{' '}
              {toggleOverlayDelete.afe_number}?{' '}
              <strong>This action is irreversible!</strong>
            </p>
            <section className="flex w-full items-center justify-center space-x-2">
              <Button onClick={resetDeleteOverlay}>Cancel</Button>
              <Button
                onClick={e => {
                  resetDeleteOverlay(e, true);
                }}
                additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold">
                Confirm
              </Button>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
};

export function getServerSideProps(context) {
  const datatype = context.params.datatype;
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {
      datatype: datatype[datatype.length - 1],
      config: config,
    }, // will be passed to the page component as props
  };
}

export default PrintedWellReport;
