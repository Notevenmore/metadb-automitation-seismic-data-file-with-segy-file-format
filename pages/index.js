import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import Buttons from '../components/buttons/buttons';
import FileIcon from '../public/icons/file.svg';
import {Divider} from '../components/float_dialog';
import Container from '../components/container/container';
import TableComponent from '../components/table/table';
import draft from '../dummy-data/draft';
import Input from '../components/input_form/input';
import {datatypes} from '../config';
import {setUploadDocumentSettings} from '../store/generalSlice';
import {checkAfe} from '../components/utility_functions';
import Toast from '../components/toast/toast';

export default function HomePage({setTitle, config}) {
  useEffect(() => {
    setTitle('Home');
  }, []);

  // if the search state is true change the view of the home page
  const searches = useSelector(state => state.search.search);
  return <>{!searches ? <HomeSection config={config} /> : <SearchResult />}</>;
}

const HomeSection = ({config}) => {
  const [toggleOverlay, settoggleOverlay] = useState(false);
  const [dataType, setdataType] = useState('');
  const [newWorkspace, setnewWorkspace] = useState({
    workspace_name: '',
    kkks_name: '',
    working_area: '',
    submission_type: '',
    afe_number: '',
    email: 'john.richardson@gtn.id', // TODO: SET THIS TO BE BASED ON THE CURRENTLY LOGGED IN USER
  });
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [popupMessage, setpopupMessage] = useState({message: '', color: ''});
  const [afeExist, setafeExist] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/upload_file');
  };

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

  const makenew = async e => {
    e.preventDefault();
    if (dataType) {
      router.events.emit('routeChangeStart');
      try {
        settoggleOverlay(false);
        setMessage({
          message:
            "Creating a new record... Please don't leave this page or click anything",
          color: 'blue',
          show: true,
        });
        await fetch(`${config[datatypes[dataType]]['afe']}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newWorkspace),
        })
          .then(res => {
            if (res.status === 200) {
              return res.statusText;
            } else {
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
        setMessage({
          message: 'Success. Redirecting to the next page...',
          color: 'blue',
          show: true,
        });
        router.events.emit('routeChangeComplete');
        await delay(1500);
        router.push({
          pathname: '/new_document',
          query: {form_type: datatypes[dataType]},
        });
      } catch (error) {
        // Handle error and display error message
        setMessage({
          message: String(error),
          color: 'red',
          show: true,
        });
      }
      router.events.emit('routeChangeComplete');
    }
  };

  const reset = (element = false) => {
    if (element) {
      const comparator = document.getElementById('overlay');
      if (element !== comparator) {
        return;
      }
    }
    settoggleOverlay(false);
    setdataType('');
    setnewWorkspace({
      workspace_name: '',
      kkks_name: '',
      working_area: '',
      afe_number: '',
      submission_type: '',
    });
    setpopupMessage({message: '', color: ''});
  };

  const handleAfeChange = async (e, focused) => {
    e.preventDefault();
    try {
      if (focused) {
        if (!dataType) {
          setafeExist(false);
          setpopupMessage({
            message: 'Please select a data type first',
            color: 'red',
          });
        }
      } else {
        setpopupMessage({message: '', color: ''});
        if (!dataType || !newWorkspace.afe_number) {
          return;
        }

        const result = await checkAfe(
          false,
          config,
          datatypes[dataType],
          parseInt(e.target.value),
        );

        if (result !== 'null') {
          setafeExist(true);
          setpopupMessage({
            message:
              'A record with the same AFE number already exists. Please choose a different one',
            color: 'red',
          });
        } else {
          setafeExist(false);
          setpopupMessage({message: '', color: ''});
        }
      }
    } catch (error) {
      setMessage({
        message: `Failed checking AFE availability, please try again or contact maintainer if the problem persists. Additonal message: ${String(
          error,
        )}`,
        color: 'red',
        show: true,
      });
      setpopupMessage({message: 'Something went wrong', color: 'red'});
      await delay(1000);
      setpopupMessage({message: '', color: ''});
    }
  };

  return (
    <section
      className="flex flex-col justify-center items-center w-full h-full"
      onDragEnter={e => handleDrag(e)}>
      <section className="flex flex-col justify-around w-[944px] h-[426px] items-center">
        <FileIcon className="w-[114px] h-[132px]" />
        <h1 className="text-[24px] leading-[30px] font-semibold opacity-50 text-center">
          Choose the record of which data type to be shown by selecting from the
          side bar,
          <br></br>or drag and drop a document here to be uploaded
        </h1>
        <div className="flex justify-center">
          <Buttons
            path={'/upload_file'}
            button_description="Choose file manually"
          />
        </div>
        <p className="text-center opacity-50">
          The document to be uploaded must be in either JPG, PNG, PDF, PPTX,
          CSV, XLSX, or LAS format.
        </p>
        <section className="flex justify-center items-center">
          <Divider additional_styles={'w-[284px]'} />
          <h1 className="text-[24px] font-semibold opacity-50 mx-[37px]">or</h1>
          <Divider additional_styles={'w-[284px]'} />
        </section>
        <section className="flex flex-row gap-x-3">
          <Buttons
            path=""
            button_description="Make a new record"
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
          reset(e.target);
        }}>
        <div
          id="overlay"
          className="flex items-center justify-center w-full h-full">
          <div
            className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${
              toggleOverlay ? '' : '-translate-y-10 opacity-0'
            } transition-all`}>
            <Buttons
              path=""
              additional_styles="absolute top-2 right-2 px-1 py-1 text-black"
              title="Cancel"
              onClick={e => {
                e.preventDefault();
                reset();
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Buttons>
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
                    placeholder={'1945'}
                    value={newWorkspace.afe_number}
                    required={true}
                    additional_styles="w-full"
                    autoComplete="off"
                    onChange={e => {
                      dataType &&
                        setnewWorkspace({
                          ...newWorkspace,
                          afe_number: parseInt(e.target.value),
                          workspace_name: `record_${e.target.value}`,
                        });
                    }}
                    onFocus={e => handleAfeChange(e, true)}
                    onBlur={e => handleAfeChange(e, false)}
                    onClick={e => handleAfeChange(e, true)}
                  />
                  <div
                    className={`${
                      popupMessage.message
                        ? 'visible opacity-100'
                        : 'invsible opacity-0 -translate-x-2'
                    } absolute ml-4 left-[100%] -translate-y-[50%] top-[50%] border-2 ${
                      popupMessage.color === 'red'
                        ? 'bg-red-100 border-red-500'
                        : 'bg-searchbg border-blue-500'
                    } w-[60%] z-[9999999] p-1 rounded-md pointer-events-none transition-all`}>
                    <p className="font-semibold text-sm">
                      {popupMessage.message}
                    </p>
                  </div>
                  <div
                    className={`${
                      popupMessage.message
                        ? 'visible opacity-100'
                        : 'invsible opacity-0 -translate-x-2'
                    } absolute ml-3 left-[100%] -translate-y-[50%] top-[50%] border-2 rotate-45 h-2 w-2 ${
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
                />
                <p>Submission type</p>
                <Input
                  type="dropdown"
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
                />
              </div>
              <div className="space-x-2 flex">
                <Buttons
                  type="submit"
                  button_description="Confirm"
                  disabled={
                    Object.values(newWorkspace).some(x => {
                      return x === null || x === '';
                    }) || afeExist
                      ? true
                      : false
                  }
                  additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
                  onClick={makenew}
                />
                <Buttons
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
      <Toast message={Message} setmessage={setMessage}>
        {Message.message}
      </Toast>
    </section>
  );
};

const SearchResult = () => {
  const [data, setData] = useState(draft.content);
  const searches = useSelector(state => state.search.value);

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

export async function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
