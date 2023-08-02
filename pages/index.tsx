import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import {useEffect, useState} from 'react';
import {Divider} from '../components/Divider';
import Input from '../components/Input';
import Button from '../components/button';
import Container from '../components/container';
import TableComponent from '../components/table/table';
import {
  checkAFETimeout,
  handleAfeChange,
} from '../components/utility_functions';
import {datatypes} from '../config';
import draft from '../dummy-data/draft';
import FileIcon from '../public/icons/file.svg';
import CloseThin from '../public/icons/close-thin.svg';
import {TokenExpired} from '../services/admin';
import {useAppDispatch, useAppSelector} from '../store';
import {
  UploadDocumentSettings,
  displayErrorMessage,
  setUploadDocumentSettings,
} from '../store/generalSlice';
import {delay} from '../utils/common';

export default function HomePage({setTitle, config}) {
  useEffect(() => {
    setTitle('Home');
  }, [setTitle]);

  // if the search state is true change the view of the home page
  // const searches = useAppSelector(state => state.search.search);
  return <HomeSection config={config} />;
}

const HomeSection = ({config}) => {
  const [toggleOverlay, settoggleOverlay] = useState(false);
  const [dataType, setdataType] = useState('');
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
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/upload_file');
  };

  const redirect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (dataType) {
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
          form_type: datatypes[dataType],
          workspace_data: newWorkspace.afe_number,
        },
      });
    }
  };

  const makenew = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (dataType) {
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
        await fetch(`${config[datatypes[dataType]]['afe']}`, {
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
              message: 'Success. Redirecting to the next page...',
              color: 'blue',
              duration: 1500,
            }),
          );
        }, 0);
        router.events.emit('routeChangeComplete');
        await delay(1500);
        router.push({
          pathname: '/new_document',
          query: {form_type: datatypes[dataType]},
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
    }
  };

  const reset = (element: HTMLElement = undefined) => {
    if (element) {
      const comparator = document.getElementById('overlay');
      if (element !== comparator) {
        return;
      }
    }
    settoggleOverlay(false);
    setdataType('');
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

  return (
    <section
      className="flex flex-col justify-center items-center w-full h-full"
      onDragEnter={e => handleDrag(e)}>
      <section className="flex flex-col justify-around w-944p h-426p items-center">
        <FileIcon className="w-114p h-132p" />
        <h1 className="text-[24px] leading-[30px] font-semibold opacity-50 text-center">
          Choose the record of which data type to be shown by selecting from the
          side bar,
          <br></br>or drag and drop a document here to be uploaded
        </h1>
        <div className="flex justify-center">
          <Button
            path={'/upload_file'}
            button_description="Upload record file"
          />
        </div>
        <p className="text-center opacity-50">
          The document to be uploaded must be in either JPG, PNG, PDF, TXT or LAS format.
        </p>
        <section className="flex justify-center items-center">
          <Divider additional_styles={'w-284p'} />
          <h1 className="text-[24px] font-semibold opacity-50 mx-37p">or</h1>
          <Divider additional_styles={'w-284p'} />
        </section>
        <section className="flex flex-row gap-x-3">
          <Button
            path=""
            button_description="Input record manually"
            onClick={e => {
              e.preventDefault();
              settoggleOverlay(true);
            }}
          />
        </section>
      </section>
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
                <p>Data type</p>
                <Input
                  type="dropdown"
                  name={'submissionType'}
                  placeholder={'Select a data type'}
                  value={dataType}
                  dropdown_items={Array.from(Object.keys(datatypes))}
                  required={true}
                  additional_styles="w-full"
                  onChange={e => setdataType(e.target.value)}
                  withSearch
                />
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
                      if (dataType) {
                        setnewWorkspace({
                          ...newWorkspace,
                          afe_number: parseInt(e.target.value) || null,
                          workspace_name: `record_${e.target.value}`,
                        });
                        handleAfeChange(
                          e,
                          config,
                          datatypes[dataType],
                          dispatch,
                          setpopupMessage,
                          setnewWorkspace,
                          newWorkspace,
                          setafeExist,
                        );
                      }
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
                  placeholder={'Select a submission type'}
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
    </section>
  );
};

const SearchResult = () => {
  const [data, setData] = useState(draft.content);
  const searches = useAppSelector(state => state.search.value);

  useEffect(() => {
    const name = searches.searchAll.toLocaleLowerCase();
    let temp = draft.content;
    temp = temp.filter(item => {
      return item.name.toLocaleLowerCase().includes(name);
    });

    const workingArea = searches.workingArea.toLocaleLowerCase();
    if (workingArea !== 'select an item') {
      temp = temp.filter(item => {
        return item['wilayah kerja'].toLocaleLowerCase().includes(workingArea);
      });
    }
    console.log(workingArea);

    console.log('search', temp);
    setData(temp);
  }, [searches]);

  return (
    <Container>
      <Container.Title>Search result</Container.Title>
      <TableComponent header={draft.header} content={data} />
    </Container>
  );
};

export function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
