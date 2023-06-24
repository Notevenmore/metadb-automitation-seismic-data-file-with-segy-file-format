import {useRouter} from 'next/router';
import {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import Buttons from '../../components/buttons/buttons';
import Container from '../../components/container/container.js';
import Input from '../../components/input_form/input';
import {storeFile, setUploadDocumentSettings} from '../../store/generalSlice';
import Select from '../../public/icons/selection_tool.svg';
import config, {datatypes} from '../../config';
import {checkAfe} from '../../components/utility_functions';
import Toast from '../../components/toast/toast';

export default function UploadFilePage({config, setTitle}) {
  const router = useRouter();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');
  const additional_styles_label = 'w-[20%] font-semibold';
  const [fileUpload, setFileUpload] = useState([]);
  const [UplSettings, setUplSettings] = useState({
    workspace_name: '',
    kkks_name: '',
    working_area: '',
    submission_type: '',
    afe_number: '',
    DataType: '',
    FileFormat: '',
    Method: '',
  });
  const [toggleOverlay, settoggleOverlay] = useState(false);
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const [popupMessage, setpopupMessage] = useState({message: '', color: ''});
  const [afeExist, setafeExist] = useState(false);

  const fileUploadRef = useRef(null);

  const changeFile = e => {
    if (e.target.files.length == 0) setFileUpload([]);
    else setFileUpload(e.target.files);
  };

  const [dragActive, setDragActive] = useState(false);
  const handleDrop = e => {
    e.stopPropagation();
    e.preventDefault();
    fileUploadRef.current.files = e.dataTransfer.files;
    setFileUpload(e.dataTransfer.files);
    setDragActive(false);
  };
  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  useEffect(() => {
    console.log('detail', dragActive);
  }, [dragActive]);

  const horizontal_scroll = (evt, workflow_container) => {
    evt.preventDefault();
    workflow_container.scrollLeft += evt.deltaY;
  };

  useEffect(() => {
    const workflow_container = document.getElementById(
      'workflow_type_container',
    );
    workflow_container.addEventListener('wheel', e =>
      horizontal_scroll(e, workflow_container),
    );
  }, []);

  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(storeFile(fileUpload));
    dispatch(setUploadDocumentSettings(UplSettings));
    settoggleOverlay(true);
    return true;
  };

  const delay = delay_amount_ms =>
    new Promise(resolve => setTimeout(() => resolve('delay'), delay_amount_ms));

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

  const proceed = async (e, submit = false, element = false) => {
    e.preventDefault();
    router.events.emit('routeChangeStart');
    try {
      if (element) {
        const comparator = document.getElementById('overlay');
        const comparator_parent = document.getElementById('overlay_parent');
        console.log(e.target, comparator, e.target !== comparator);
        if (![comparator, comparator_parent].includes(e.target)) {
          router.events.emit('routeChangeComplete');
          return;
        }
      }
      settoggleOverlay(false);
      if (submit) {
        setMessage({
          message:
            "Creating a new record... Please don't leave this page or click anything",
          color: 'blue',
          show: true,
        });
        if (
          fileUpload.length < 1 ||
          Object.values(UplSettings).some(x => {
            return x === null || x === '';
          })
        ) {
          // setError("Please select a file before continuing to the next process. Make sure to also fill in the appropriate settings for the uploaded file.")
          throw 'Please select a file before continuing to the next process. Make sure to also fill in the appropriate settings for the uploaded file.';
        }
        const post_workspace = await fetch(
          `${config[datatypes[UplSettings.DataType]]['afe']}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              afe_number: parseInt(UplSettings.afe_number),
              workspace_name: UplSettings.workspace_name,
              kkks_name: UplSettings.kkks_name,
              working_area: UplSettings.working_area,
              submission_type: UplSettings.submission_type,
              email: 'john.richardson@gtn.id', // TODO: SET THIS TO BE BASED ON THE CURRENTLY LOGGED IN USER
            }),
          },
        ).then(res => {
          if (res.status !== 200) {
            throw 'Failed to POST new record. Please try again.';
          }
          return res.text();
        });
        if (post_workspace === 'OK') {
          setMessage({
            message:
              'Success. A new record has been created. Redirecting to the next page...',
            color: 'blue',
            show: true,
          });
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
          setMessage({
            message:
              'Failed to create a new record. Please try again or contact maintainer if the problem persists.',
            color: 'red',
            show: true,
          });
        }
      }
    } catch (error) {
      setMessage({
        message: `Failed to create a new record, please try again or contact maintainer if the problem persists. Additional error message: ${String(
          error,
        )}`,
        color: 'red',
        show: true,
      });
    }

    router.events.emit('routeChangeComplete');
  };

  const handleAfeChange = async (e, focused) => {
    e.preventDefault();
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
        // setpopupMessage({message: 'Checking...', color: 'green'});
        const result = await checkAfe(
          false,
          config,
          datatypes[UplSettings.DataType],
          parseInt(e.target.value),
        );
        if (result !== 'null') {
          setafeExist(true);
          // setpopupMessage({message: 'AFE number available', color: 'green'});
          // await delay(1000);
          // setpopupMessage({message: '', color: ''});
          setpopupMessage({
            message: `A ${UplSettings.DataType.toLowerCase()} record with the same AFE number already exists. Please choose a different one`,
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

  useEffect(() => {
    setTitle('Upload file');
  }, []);

  return (
    <Container
      additional_class="full-height relative"
      onDragEnter={e => handleDrag(e)}>
      <Container.Title back>
        <div className="-space-y-2">
          <p className="capitalize text-sm font-normal">{path_query}</p>
          <p>Upload File</p>
        </div>
      </Container.Title>
      <form
        className="flex flex-col items-center justify-center gap-y-4 w-full"
        onSubmit={e => {
          handleSubmit();
          console.log('aaa');
        }}>
        <div className="border-dashed border-2 border-black/30 rounded-lg p-10 flex space-x-3 items-center w-[80%] bg-searchbg/[.5]">
          <svg
            className="w-16 h-16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <div className="w-full">
            <div>
              <div className="flex space-x-2 items-center justify-center">
                <Buttons
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
                  <Buttons
                    path=""
                    additional_styles="px-1 py-1 bg-black/20 hover:bg-red-600 hover:text-white"
                    title="Remove file"
                    onClick={e => {
                      setFileUpload([]);
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
                </div>
              )}
              <p className="text-sm text-black/70 text-center pt-2">
                *Supported file formats: JPG, PNG, PDF, PPTX, CSV, XLSX, or LAS
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileUploadRef}
              onChange={e => changeFile(e)}
            />
          </div>
        </div>
        <h2 className="text-xl font-bold py-3">
          Input the correct settings for the uploaded file and the new record
        </h2>
        <div className="w-[100%] lg:w-[80%] flex flex-col gap-y-3">
          <Input
            label="File format"
            label_loc="beside"
            type="dropdown"
            name={'fileFormat'}
            placeholder={'Select a file format'}
            value={UplSettings.FileFormat}
            dropdown_items={['Image', 'PDF', 'PPTX', 'CSV', 'LAS']}
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
              value={UplSettings.afe_number}
              required={true}
              additional_styles="w-full"
              additional_styles_label={additional_styles_label}
              autoComplete="off"
              onChange={e =>
                UplSettings.DataType
                  ? setUplSettings({
                      ...UplSettings,
                      afe_number: e.target.value,
                      workspace_name: `record_${e.target.value}`,
                    })
                  : null
              }
              onFocus={e => handleAfeChange(e, true)}
              onBlur={e => handleAfeChange(e, false)}
              onClick={e => handleAfeChange(e, true)}
            />
            <div
              className={`${
                popupMessage.message
                  ? 'p-1 max-h-[1000px] visible'
                  : 'max-h-[0px] -translate-y-1'
              } ${
                popupMessage.color === 'red'
                  ? 'border-2 border-red-500 bg-red-100'
                  : ''
              } text-sm w-full text-center transition-all pointer-events-none`}>
              <p>{popupMessage.message}</p>
            </div>
            {/* <div
              className={`${
                popupMessage.message
                  ? 'visible opacity-100'
                  : 'invsible opacity-0 -translate-x-2'
              } absolute ml-4 left-[100%] -translate-y-[50%] top-[50%] border-2 ${
                popupMessage.color === 'red'
                  ? 'bg-red-100 border-red-500'
                  : 'bg-searchbg border-blue-500'
              } w-[60%] z-[9999999] p-1 rounded-md pointer-events-none transition-all`}>
              <p className="font-semibold text-sm">{popupMessage.message}</p>
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
            /> */}
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
          />
          <Input
            label="Submission type"
            label_loc="beside"
            type="dropdown"
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
            additional_styles_input="placeholder: italic"
            additional_styles_label={additional_styles_label}
            onChange={e =>
              setUplSettings({...UplSettings, submission_type: e.target.value})
            }
            withSearch
          />
        </div>
        <h2 className="text-xl font-bold py-3">
          Choose your preferred method of data matching
        </h2>
        <div className="w-[80%] max-w-[80%] flex items-center justify-center">
          <div
            id="workflow_type_container"
            className="flex space-x-3 overflow-auto">
            <Buttons
              id="dropdown"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'dropdown' ? 'bg-searchbg/60' : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'dropdown'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <section className="w-[150px]">
                  <h3 className="text-lg font-bold">Drop down</h3>
                  <p className="text-sm">
                    Choose the correct data matches using drop downs.
                  </p>
                </section>
              </div>
            </Buttons>
            <Buttons
              id="highlight"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'highlight' ? 'bg-searchbg/60' : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'highlight'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <Select className="w-10 h-10" />
                <section className="w-[150px]">
                  <h3 className="text-lg font-bold">Highlighting</h3>
                  <p className="text-sm">
                    Match the data by highlighting the document preview.
                  </p>
                </section>
              </div>
            </Buttons>
            <Buttons
              id="dragdrop"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'dragdrop' ? 'bg-searchbg/60' : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'dragdrop'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <svg
                  className="w-10 h-10"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
                  />
                </svg>
                <section className="w-[150px]">
                  <h3 className="text-lg font-bold">Drag and drop</h3>
                  <p className="text-sm">
                    Choose the correct data matches using drag and drop method.
                  </p>
                </section>
              </div>
            </Buttons>
            <Buttons
              id="automatic"
              title=""
              additional_styles={`h-full active:bg-gray-400/60 outline-none ${
                UplSettings.Method === 'automatic' ? 'bg-searchbg/60' : ''
              }`}
              onClick={e => {
                e.preventDefault();
                setUplSettings({...UplSettings, Method: 'automatic'});
              }}>
              <div className="flex space-x-2 min-w-max items-center p-2">
                <svg
                  role="img"
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <title>Robot Framework</title>
                  <path d="M4.9565 10.2246c0-1.8766 1.5257-3.4023 3.4-3.4023 1.8766 0 3.4024 1.5257 3.4024 3.4023 0 .6838-.5526 1.2364-1.2341 1.2364-.6818 0-1.2344-.5526-1.2344-1.2364 0-.513-.4185-.9296-.9338-.9296-.5129 0-.9317.4165-.9317.9296 0 .6838-.5523 1.2364-1.234 1.2364-.6818 0-1.2344-.5526-1.2344-1.2364m14.0868 5.717c0 .6842-.5524 1.2363-1.2341 1.2363H6.3575c-.6818 0-1.2344-.552-1.2344-1.2363 0-.6837.5526-1.2363 1.2344-1.2363h11.4517c.6817 0 1.234.5526 1.234 1.2363m-5.351-5.0244c-.3814-.5657-.2323-1.3328.3334-1.7143l2.8628-1.9334c.5613-.3902 1.3329-.2324 1.7144.3289.3815.5654.2323 1.3329-.3334 1.7144l-2.8628 1.9333c-.5442.3831-1.3348.2379-1.7144-.3289zm7.8393 7.6018a.8815.8815 0 0 1-.258.6227l-2.1277 2.1277a.8822.8822 0 0 1-.623.258H5.4772a.8822.8822 0 0 1-.623-.258l-2.1277-2.1277a.8815.8815 0 0 1-.258-.6227V5.4818a.8797.8797 0 0 1 .258-.6228l2.1277-2.1282a.8816.8816 0 0 1 .623-.2578h13.0456a.8816.8816 0 0 1 .623.2578l2.1277 2.1282a.8797.8797 0 0 1 .258.6228V18.519zm1.811-15.0835L20.5644.6577A2.2454 2.2454 0 0 0 18.9775 0H5.0207A2.2445 2.2445 0 0 0 3.433.658L.657 3.4359A2.2449 2.2449 0 0 0 0 5.0228v13.9547c0 .5953.2366 1.1667.6575 1.5872l2.778 2.7779c.421.421.9918.6573 1.5871.6573h13.9548a2.2448 2.2448 0 0 0 1.5872-.6573l2.7779-2.7779A2.2436 2.2436 0 0 0 24 18.9775V5.023a2.2451 2.2451 0 0 0-.6575-1.5875z" />
                </svg>
                <section className="w-[150px]">
                  <h3 className="text-lg font-bold">Automatic</h3>
                  <p className="text-sm">
                    Automatically try to predict data and their respective
                    matches.
                  </p>
                </section>
              </div>
            </Buttons>
          </div>
        </div>
        <div className="flex flex-row gap-x-3 pt-3 pb-16">
          <Buttons
            type="submit"
            path={
              fileUpload.length <= 1 ||
              Object.values(UplSettings).some(x => {
                return x === null || x === '';
              })
                ? UplSettings.Method === 'dropdown'
                  ? '/upload_file/matching_dropdown'
                  : UplSettings.Method === 'highlight'
                  ? '/upload_file/matching_highlight'
                  : UplSettings.Method === 'dragdrop'
                  ? '/upload_file/matching_draggable'
                  : '/upload_file/matching_auto'
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
          <Buttons
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
          className="flex items-center justify-center w-[50%] h-full">
          <div
            className={`bg-white w-fit h-fit border-2 rounded-lg p-10 relative space-y-3 ${
              toggleOverlay ? '' : '-translate-y-10 opacity-0'
            } transition-all`}>
            <Buttons
              path=""
              additional_styles="absolute top-2 right-2 px-1 py-1 text-black"
              title="Cancel"
              onClick={proceed}>
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
            <h1 className="font-bold text-3xl">Re-check the inputted data</h1>
            <hr />
            <p>
              Do you want to proceed? Make sure you have re-checked all the
              inputs especially the ones for the new record.{' '}
              <strong>
                You won&quot;t be able to change AFE number and Data Type after
                the new record has been created.
              </strong>
            </p>
            <section className="flex w-full items-center justify-center space-x-2">
              <Buttons
                onClick={e => {
                  proceed(e, true);
                }}
                additional_styles="bg-searchbg/[.6] hover:bg-searchbg font-semibold">
                Proceed
              </Buttons>
              <Buttons onClick={proceed}>Cancel</Buttons>
            </section>
          </div>
        </div>
      </div>
      {dragActive && (
        <div
          className="absolute w-full full-height top-0 right-0 z-[50] bg-searchbg/[20%] flex items-center justify-center backdrop-blur-md"
          onDragEnter={e => handleDrag(e)}
          onDragLeave={e => handleDrag(e)}
          onDragOver={e => handleDrag(e)}
          onDrop={e => handleDrop(e)}>
          <div className="border-dashed border-4 border-black/30 rounded-lg p-10 flex flex-col justify-center space-y-3 items-center w-[80%] bg-searchbg/[.5] h-[550px]">
            <div className="w-full text-center">
              <p className="text-4xl font-bold">Drop your file here</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
        </div>
      )}
      <Toast setmessage={setMessage}>{Message.message}</Toast>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {config: config}, // will be passed to the page component as props
  };
}
