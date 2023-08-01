import {useRouter} from 'next/router';
import {parseCookies} from 'nookies';
import React, {
  ChangeEvent,
  FormEvent,
  WheelEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import Input from '../../components/Input';
import Button from '../../components/button';
import Container from '../../components/container';
import {checkAfe} from '../../components/utility_functions';
import {datatypes} from '../../config';
import CloseThin from '../../public/icons/close-thin.svg';
import DropFile from '../../public/icons/drop-file.svg';
import Hand from '../../public/icons/hand.svg';
import List from '../../public/icons/list.svg';
import Robot from '../../public/icons/robot.svg';
import Select from '../../public/icons/selection_tool.svg';
import Upload from '../../public/icons/upload.svg';
import {TokenExpired} from '../../services/admin';
import {
  UploadDocumentSettings,
  displayErrorMessage,
  setUploadDocumentSettings,
  storeFile,
} from '../../store/generalSlice';
import getFileType from '../../utils/filetype';
import {useAppDispatch} from '../../store';
import {delay} from '../../utils/common';

const routes = {
  dropdown: '/upload_file/matching_dropdown',
  highlight: '/upload_file/matching_highlight',
  dragdrop: '/upload_file/matching_draggable',
  automatic: '/upload_file/matching_auto',
};

export default function UploadFilePage({config, setTitle}) {
  const router = useRouter();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');
  const additional_styles_label = 'w-1/5 font-semibold';
  const [fileUpload, setFileUpload] = useState<FileList | []>([]);
  const [UplSettings, setUplSettings] = useState<UploadDocumentSettings>({
    workspace_name: '',
    kkks_name: '',
    working_area: '',
    submission_type: '',
    afe_number: 0,
    afe_exist: false,
    DataType: '',
    FileFormat: '',
    Method: '',
  });
  const [toggleOverlay, settoggleOverlay] = useState(false);
  const [popupMessage, setpopupMessage] = useState({message: '', color: ''});
  const [afeExist, setafeExist] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const dispatch = useAppDispatch();
  const fileUploadRef = useRef(null);

  useEffect(() => {
    console.log('detail', dragActive);
  }, [dragActive]);

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files.length == 0) setFileUpload([]);
    else setFileUpload(e.target.files);
  };

  useEffect(() => {
    if (fileUpload.length <= 0) {
      setUplSettings(prev => ({...prev, FileFormat: ''}));
      return;
    }

    const fileType = getFileType(fileUpload[0].name);
    setUplSettings(prev => ({...prev, FileFormat: fileType}));
  }, [fileUpload]);

  const handleDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fileUploadRef.current.files = e.dataTransfer.files;
    setFileUpload(e.dataTransfer.files);
    setDragActive(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const horizontal_scroll = (evt: WheelEvent) => {
    evt.preventDefault();
    (evt.target as HTMLDivElement).scrollLeft += evt.deltaY;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(storeFile(fileUpload));
    dispatch(setUploadDocumentSettings(UplSettings));
    settoggleOverlay(true);
    return true;
  };

  // TODO: DEBUG ONLY, COMMENT ON PRODUCTION AND PROPER TESTING
  // AND UNCOMMENT THE COMMENTED METHOD WITH THE SAME NAME

  // const proceed = async (e, submit = false, element = false) => {
  //   e.preventDefault();
  //   if (element) {
  //     const comparator = document.getElementById('overlay');
  //     const comparator_parent = document.getElementById('overlay_parent');
  //     console.log(e.target, comparator, e.target !== comparator);
  //     if (![comparator, comparator_parent].includes(e.target)) {
  //       router.events.emit('routeChangeComplete');
  //       return;
  //     }
  //   }
  //   settoggleOverlay(false);
  //   if (submit) {
  //     router.push({
  //       pathname:
  //         UplSettings.Method === 'dropdown'
  //           ? '/upload_file/matching_dropdown'
  //           : UplSettings.Method === 'highlight'
  //           ? '/upload_file/matching_highlight'
  //           : UplSettings.Method === 'dragdrop'
  //           ? '/upload_file/matching_draggable'
  //           : '/upload_file/matching_auto',
  //       query: {
  //         form_type: datatypes[UplSettings.DataType],
  //       },
  //     });
  //   }
  // };

  // TODO: UNCOMMENT ON TESTING AND PRODUCTION AND COMMENT THE OTHER METHOD WITH THE
  // SAME NAME

  const proceed = async (
    e: React.MouseEvent<HTMLElement>,
    submit = false,
    element = false,
  ) => {
    e.preventDefault();
    router.events.emit('routeChangeStart');
    try {
      if (element) {
        const comparator = document.getElementById('overlay');
        const comparator_parent = document.getElementById('overlay_parent');
        console.log(e.target, comparator, e.target !== comparator);
        if (
          ![comparator, comparator_parent].includes(e.target as HTMLElement)
        ) {
          router.events.emit('routeChangeComplete');
          return;
        }
      }
      settoggleOverlay(false);
      if (submit) {
        let post_workspace: string;
        if (!afeExist) {
          dispatch(
            displayErrorMessage({
              message:
                "Creating a new record... Please don't leave this page or click anything",
              color: 'blue',
            }),
          );
          if (
            fileUpload.length < 1 ||
            Object.values(UplSettings).some(x => {
              return x === null || x === '';
            })
          ) {
            throw 'Please select a file before continuing to the next process. Make sure to also fill in the appropriate settings for the uploaded file.';
          }
          post_workspace = await fetch(
            `${config[datatypes[UplSettings.DataType]]['afe']}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${
                  JSON.parse(parseCookies().user_data).access_token
                }`,
              },
              body: JSON.stringify({
                afe_number: UplSettings.afe_number,
                workspace_name: UplSettings.workspace_name,
                kkks_name: UplSettings.kkks_name,
                working_area: UplSettings.working_area,
                submission_type: UplSettings.submission_type,
                email: 'john.richardson@gtn.id', // TODO: SET THIS TO BE BASED ON THE CURRENTLY LOGGED IN USER
              }),
            },
          ).then(res => {
            if (res.status !== 200) {
              TokenExpired(res.status);
              throw 'Failed to POST new record. Please try again.';
            }
            return res.text();
          });
        }
        if (post_workspace === 'OK' || afeExist) {
          dispatch(
            displayErrorMessage({
              message: `${
                !afeExist ? 'Success. A new record has been created.' : ''
              } Redirecting to the next page...`,
              color: 'blue',
              duration: 1500,
            }),
          );
          router.events.emit('routeChangeComplete');
          await delay(1000);
          router.push({
            pathname:
              UplSettings.Method === 'dropdown'
                ? '/upload_file/matching_dropdown'
                : UplSettings.Method === 'highlight'
                ? '/upload_file/matching_highlight'
                : UplSettings.Method === 'dragdrop'
                ? '/upload_file/matching_draggable'
                : '/upload_file/matching_auto',
            query: {
              form_type: datatypes[UplSettings.DataType],
            },
          });
        } else {
          dispatch(
            displayErrorMessage({
              message:
                'Failed to create a new record. Please try again or contact maintainer if the problem persists.',
              color: 'red',
            }),
          );
        }
      }
    } catch (error) {
      dispatch(
        displayErrorMessage({
          message: `Failed to create a new record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
            error,
          )}`,
          color: 'red',
        }),
      );
    }

    router.events.emit('routeChangeComplete');
  };

  const handleAfeChange = async (e, focused: boolean) => {
    e.preventDefault();
    const input_value = parseInt(e.target.value);
    if (!input_value) {
      return;
    }
    try {
      if (focused) {
        if (!UplSettings.DataType) {
          setafeExist(false);
          setpopupMessage({
            message: 'Please select a data type first',
            color: 'red',
          });
        }
      } else {
        setpopupMessage({message: '', color: ''});

        if (!UplSettings.afe_number || !UplSettings.DataType) {
          return;
        }

        const result: string = await checkAfe(
          false,
          config,
          datatypes[UplSettings.DataType],
          parseInt((e.target as HTMLInputElement).value),
        );
        if (result !== 'null') {
          const workspace_data: UploadDocumentSettings = JSON.parse(result)[0];
          setafeExist(true);
          setUplSettings({
            ...UplSettings,
            afe_number: input_value,
            kkks_name: workspace_data.kkks_name,
            working_area: workspace_data.working_area,
            submission_type: workspace_data.submission_type,
            afe_exist: true,
          });
          setpopupMessage({
            message: `A ${UplSettings.DataType.toLowerCase()} record with the same AFE number already exists. Data acquired from this file will be appended to the existing record. You can edit the fields below in the review section later on.`,
            color: 'blue',
          });
        } else {
          setafeExist(false);
          setpopupMessage({message: '', color: ''});
        }
      }
    } catch (error) {
      dispatch(
        displayErrorMessage({
          message: `Failed checking AFE availability, please try again or contact maintainer if the problem persists. Additonal message: ${String(
            error,
          )}`,
          color: 'red',
        }),
      );
      setpopupMessage({message: 'Something went wrong', color: 'red'});
      await delay(1000);
      setpopupMessage({message: '', color: ''});
    }
  };

  useEffect(() => {
    setTitle('Upload file');
  }, [setTitle]);

  const activeStyle =
    'bg-searchbg/60 outline-2 outline-gray-400 outline-offset-4 w-254p transition-all duration-500';

  return (
    <Container additional_class="full-height relative" onDragEnter={handleDrag}>
      <Container.Title back>
        <div className="-space-y-2">
          <p className="capitalize text-sm font-normal">{path_query}</p>
          <p>Upload File</p>
        </div>
      </Container.Title>
      <form
        className="flex flex-col items-center justify-center gap-y-4 w-full"
        onSubmit={handleSubmit}>
        <div className="border-dashed border-2 border-black/30 rounded-lg p-10 flex space-x-3 items-center w-4/5 bg-searchbg/[.5]">
          <Upload className="w-16 h-16" />
          <div className="w-full">
            <div>
              <div className="flex space-x-2 items-center justify-center">
                <Button
                  type="button"
                  path=""
                  additional_styles="bg-gray-300 hover:bg-gray-400/60 font-bold"
                  button_description="Choose a file"
                  onClick={() => fileUploadRef.current.click()}
                />
                <p>or</p>
                <p className="font-bold">drag and drop a file here.</p>
              </div>
              {fileUpload.length > 0 && (
                <div className="flex space-x-2 items-center justify-center pt-1">
                  <p className="">Uploaded file:</p>
                  <p className="underline">{fileUpload[0].name}</p>
                  <Button
                    path=""
                    additional_styles="px-1 py-1 bg-black/20 hover:bg-red-600 hover:text-white"
                    title="Remove file"
                    onClick={() => setFileUpload([])}>
                    <CloseThin className="w-5 h-5" />
                  </Button>
                </div>
              )}
              <p className="text-sm text-black/70 text-center pt-2">
                *Supported file formats: JPG, PNG, PDF, TXT or LAS
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileUploadRef}
              accept="image/png, application/pdf, .las, .txt, .jpg"
              onChange={changeFile}
            />
          </div>
        </div>
        <h2 className="text-xl font-bold py-3">
          Input the correct settings for the uploaded file and the new record
        </h2>
        <div className="w-full lg:w-4/5 flex flex-col gap-y-3">
          <Input
            label="File format"
            label_loc="beside"
            type="dropdown"
            name={'fileFormat'}
            placeholder={'Select a file format'}
            value={UplSettings.FileFormat}
            dropdown_items={['Image', 'PDF', 'CSV', 'LAS', 'TXT']}
            required={true}
            additional_styles="w-full"
            additional_styles_label={additional_styles_label}
            onChange={e =>
              setUplSettings({...UplSettings, FileFormat: e.target.value})
            }
            withSearch
          />
          <Input
            label="Data type"
            label_loc="beside"
            type="dropdown"
            name={'dataType'}
            placeholder={'Select a data type'}
            value={UplSettings.DataType}
            dropdown_items={Object.keys(datatypes)}
            required={true}
            additional_styles="w-full"
            additional_styles_label={additional_styles_label}
            onChange={e =>
              setUplSettings({...UplSettings, DataType: e.target.value})
            }
            withSearch
          />
          <div className={`${popupMessage.message ? 'space-y-2' : ''}`}>
            <Input
              label="AFE number"
              label_loc="beside"
              type="number"
              name={'AFE_Number'}
              placeholder={'Input AFE number'}
              value={UplSettings.afe_number || ''}
              required={true}
              additional_styles="w-full"
              additional_styles_label={additional_styles_label}
              autoComplete="off"
              onChange={e => {
                if (UplSettings.DataType) {
                  setUplSettings({
                    ...UplSettings,
                    afe_number: parseInt(e.target.value, 10),
                    workspace_name: `record_${e.target.value}`,
                  });
                  handleAfeChange(e, false);
                }
              }}
            />
            <div
              className={`${
                popupMessage.message
                  ? 'p-1 max-h-[1000px] visible'
                  : 'max-h-0 -translate-y-1'
              } ${
                popupMessage.message
                  ? popupMessage.color === 'red'
                    ? 'border-2 border-red-500 bg-red-100'
                    : 'border-2 border-blue-500 bg-blue-100'
                  : ''
              } text-sm w-full text-center transition-all pointer-events-none`}>
              <p>{popupMessage.message}</p>
            </div>
          </div>
          <Input
            label="KKKS name"
            label_loc="beside"
            type="text"
            name={'kkksName'}
            placeholder={'Input KKKS name'}
            value={UplSettings.kkks_name}
            required={true}
            additional_styles="w-full"
            additional_styles_label={additional_styles_label}
            autoComplete="off"
            onChange={e =>
              setUplSettings({...UplSettings, kkks_name: e.target.value})
            }
            disabled={afeExist}
          />
          <Input
            label="Working area"
            label_loc="beside"
            type="text"
            name={'workingArea'}
            placeholder={'Input working area'}
            value={UplSettings.working_area}
            required={true}
            additional_styles="w-full"
            additional_styles_label={additional_styles_label}
            autoComplete="off"
            onChange={e =>
              setUplSettings({...UplSettings, working_area: e.target.value})
            }
            disabled={afeExist}
          />
          <Input
            label="Submission type"
            label_loc="beside"
            type={afeExist ? 'text' : 'dropdown'}
            name={'submissionType'}
            placeholder={'Select a submission type'}
            value={UplSettings.submission_type}
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
            additional_styles_label={additional_styles_label}
            onChange={e =>
              setUplSettings({...UplSettings, submission_type: e.target.value})
            }
            withSearch
            disabled={afeExist}
          />
        </div>
        <h2 className="text-xl font-bold py-3">
          Choose your preferred method of data matching
        </h2>
        <div className="w-4/5 max-w-[80%] flex items-center justify-center">
          <div
            onWheel={horizontal_scroll}
            className="flex space-x-3 overflow-auto h-auto p-3">
            <Button
              id="dropdown"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'dropdown' ? activeStyle : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'dropdown'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <List className="w-10 h-10" />
                <section className="w-150p">
                  <h3 className="text-lg font-bold">Drop down</h3>
                  <p className="text-sm">
                    Choose the correct data matches using drop downs.
                  </p>
                </section>
              </div>
            </Button>
            <Button
              id="highlight"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'highlight' ? activeStyle : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'highlight'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <Select className="w-10 h-10" />
                <section className="w-150p">
                  <h3 className="text-lg font-bold">Highlighting</h3>
                  <p className="text-sm">
                    Match the data by highlighting the document preview.
                  </p>
                </section>
              </div>
            </Button>
            <Button
              id="dragdrop"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'dragdrop' ? activeStyle : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'dragdrop'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <Hand className="w-10 h-10" />
                <section className="w-150p">
                  <h3 className="text-lg font-bold">Drag and drop</h3>
                  <p className="text-sm">
                    Choose the correct data matches using drag and drop method.
                  </p>
                </section>
              </div>
            </Button>
            <Button
              id="automatic"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'automatic' ? activeStyle : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'automatic'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <Robot className="w-10 h-10" />
                <section className="w-150p">
                  <h3 className="text-lg font-bold">Automatic</h3>
                  <p className="text-sm">
                    Automatically try to predict data and their respective
                    matches.
                  </p>
                </section>
              </div>
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-x-3 pt-3 pb-16">
          <Button
            type="submit"
            path={
              // all fields must not be empty check
              fileUpload.length <= 1 ||
              Object.values(UplSettings).some(x => {
                return x === null || x === '';
              })
                ? routes[UplSettings.Method]
                : ''
            }
            query={{form_type: datatypes[UplSettings.DataType]}}
            button_description="Upload and process file"
            additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold"
            onClick={handleSubmit}
            disabled={
              fileUpload.length < 1 ||
              Object.values(UplSettings).some(x => {
                return x === null || x === '';
              })
                ? true
                : false
            }
          />
          <Button
            type="submit"
            button_description="Cancel"
            path=""
            onClick={router.back}
          />
        </div>
      </form>
      <div
        className={`fixed w-screen h-screen flex items-center justify-center bg-black/[.5] top-0 left-0 ${
          toggleOverlay ? 'opacity-100 visible' : 'opacity-0 invisible'
        } transition-all`}
        id="overlay_parent"
        onClick={e => {
          proceed(e, false, true);
        }}>
        <div
          id="overlay"
          className="flex items-center justify-center w-1/2 h-full">
          <div
            className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${
              toggleOverlay ? '' : '-translate-y-10 opacity-0'
            } transition-all`}>
            <Button
              path=""
              additional_styles="absolute top-2 right-2 px-1 py-1 text-black"
              title="Cancel"
              onClick={proceed}>
              <CloseThin className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-3xl">
              {afeExist
                ? 'Record already exists'
                : 'Re-check the inputted data'}
            </h1>
            <hr />
            <p>
              {afeExist && (
                <>
                  A record with the same AFE number already exists.{' '}
                  <strong>
                    Data acquired from this file will be appended into the said
                    record.{' '}
                  </strong>
                </>
              )}
              Do you want to proceed? Make sure all inputs are correct.{' '}
              {!afeExist && (
                <strong>
                  You won&apos;t be able to change AFE number and Data Type
                  after the new record has been created.
                </strong>
              )}
            </p>
            <section className="flex w-full items-center justify-center space-x-2">
              <Button
                onClick={e => {
                  proceed(e, true);
                }}
                additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold">
                Proceed
              </Button>
              <Button onClick={proceed}>Cancel</Button>
            </section>
          </div>
        </div>
      </div>
      {dragActive && (
        <div
          className="absolute w-full full-height top-0 right-0 z-50 bg-searchbg/[20%] flex items-center justify-center backdrop-blur-md"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          <div className="border-dashed border-4 border-black/30 rounded-lg p-10 flex flex-col justify-center space-y-3 items-center w-4/5 bg-searchbg/[.5] h-550p">
            <div className="w-full text-center">
              <p className="text-4xl font-bold">Drop your file here</p>
            </div>
            <DropFile className="w-16 h-16" />
          </div>
        </div>
      )}
    </Container>
  );
}

export function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
