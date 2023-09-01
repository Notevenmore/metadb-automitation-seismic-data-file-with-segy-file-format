import {parseCookies} from 'nookies';
import {TokenExpired} from '../services/admin';
import {DocumentSummary, displayErrorMessage} from '../store/generalSlice';
import {getHeader} from '../services/document';
import {delay} from '../utils/common';
import { DatatypeConfig, ServicesConfig } from '@utils/types';
import { Dispatch, SetStateAction } from 'react';

export const init_data = async (config, router, workspaceData) => {
  if (!workspaceData.afe_number) {
    throw 'Record data not found, please try again. Additionally, try opening other records if the problem persists. If other records behave the same, please contact maintainer.';
  }
  const workspace_data = await fetch(
    `${config[router.query.form_type]['afe']}${workspaceData.afe_number}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
    },
  )
    .then(res =>
      Promise.all([res.status, res.status !== 200 ? res.text() : res.json()]),
    )
    .then(([status, res]) => {
      if (status !== 200) {
        TokenExpired(status);
        throw `Service returned with status ${status} on record metadata GET (init_data): ${res}`;
      }
      return res;
    });

  const data = await fetch(
    `${config[router.query.form_type]['workspace']}${workspaceData.afe_number}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
    },
  )
    .then(res =>
      Promise.all([res.status, res.status !== 200 ? res.text() : res.json()]),
    )
    .then(([status, res]) => {
      if (status !== 200) {
        TokenExpired(status);
        throw `Service returned with status ${status} on record content binder GET (init_data): ${res}`;
      }
      return res;
    });

  // if data is not null (workspace is not empty), then get every data details within the workspace.
  // since the 'data' variable above only holds the ids of the data, along with the ppdm guid it's referencing
  // to and the workspace afe number it's referencing to.
  let final = [];

  if (data) {
    for (const datatype_record_id of data) {
      const data_details = await fetch(
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
            throw `Service returned with status ${status} on record content details GET (init_data): ${res}`;
          }
          return res;
        });
      Object.keys(data_details[0]).forEach(key => {
        if (key.toLowerCase().includes('date') && data_details[0][key]) {
          const date = new Date(data_details[0][key]);

          data_details[0][key] = `${new Intl.DateTimeFormat('ja-JP')
            .format(date)
            .replace(/\//g, '-')}`;
        }
      });
      final.push(data_details[0]);
    }
  }
  return {data: data, data_content: final, workspace_data: workspace_data[0]};
};

export const saveDocument = async (
  e,
  router,
  config,
  spreadsheetId,
  workspaceData,
  dispatch,
) => {
  if (e) {
    e.preventDefault();
  }

  // Check if spreadsheetId is available
  if (!spreadsheetId) {
    showErrorToast(
      dispatch,
      'Failed to get spreadsheet information, please reload this page. Changes will not be saved',
    );
    return;
  }

  // Set saving message
  dispatch(
    displayErrorMessage({
      message:
        "Checking changes in record information... Please don't leave this page or click anything",
      color: 'blue',
    }),
  );

  // check for changes in the workspace data, if there are any then push the updates to the db
  let workspace_data_changed = false;
  const old_workspace_data = await fetch(
    `${config[router.query.form_type]['afe']}${workspaceData['afe_number']}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
    },
  )
    .then(res =>
      Promise.all([res.status, res.status !== 200 ? res.text() : res.json()]),
    )
    .then(([status, res]) => {
      if (status !== 200) {
        TokenExpired(status);
        logError(
          `Service returned with status ${status} on record metadata GET (save_doc)`,
          res,
        );
        throw `An error occurred while trying to acquire this record's previous metadata details. Please try again`;
      }
      return res;
    });

  Object.keys(old_workspace_data[0]).some(key => {
    if (old_workspace_data[0][key] !== workspaceData[key]) {
      workspace_data_changed = true;
      return true;
    }
  });

  if (workspace_data_changed) {
    dispatch(
      displayErrorMessage({
        message:
          "Saving record information... Please don't leave this page or click anything",
        color: 'blue',
      }),
    );
    await fetch(
      `${config[router.query.form_type]['afe']}${workspaceData['afe_number']}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
        body: JSON.stringify(workspaceData),
      },
    )
      .then(res => Promise.all([res.status, res.text()]))
      .then(([status, res]) => {
        if (status !== 200) {
          TokenExpired(status);
          if (res.toLowerCase().includes('workspace_name_unique')) {
            logError(
              `A record with the name "${workspaceData.workspace_name}" already exists.`,
            );
            throw `A record with the name "${workspaceData.workspace_name}" already exists. Please choose a different name.`;
          } else {
            logError(
              `Service returned with status ${status} on record metadata PUT (save_doc)`,
              res,
            );
            throw `An error occurred while trying to update this record's metadata. Please try again`;
          }
        }
      });
  }

  dispatch(
    displayErrorMessage({
      message:
        "Checking changes in record data... Please don't leave this page or click anything",
      color: 'blue',
    }),
  );
  // fetch original data from database
  const old_data = await init_data(config, router, workspaceData);

  // Fetch header from spreadsheet
  const spreadsheet_header = await getHeader(
    config,
    router.query.form_type,
  ).then(response => {
    if (response.status !== 200) {
      TokenExpired(response.status);
      logError(
        `Service returned with status ${response.status} on spreadsheet GET headers (save_doc):`,
        response.response,
      );
      throw `An error occurred from Google Sheets that MetaDB is unable to handle. Please try again`;
    }
    return response;
  });

  // Fetch spreadsheet data from the server
  const spreadsheet_data = await fetch(`${config.services.sheets}/getRows`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${
        JSON.parse(parseCookies().user_data).access_token
      }`,
    },
    body: JSON.stringify({
      form_type: router.query.form_type,
      spreadsheetID: spreadsheetId,
      without_header: true,
    }),
  })
    .then(response => {
      return response.json();
    })
    .then(response => {
      // Handle non-200 response status
      if (response.status !== 200) {
        TokenExpired(response.status);
        logError(
          `Service returned with status ${response.status} on spreadsheet GET rows (save_doc):`,
          response.response,
        );
        throw `An error occurred from Google Sheets that MetaDB is unable to handle. Please try again`;
      }
      return response;
    });

  let field_types_final = {};
  dispatch(
    displayErrorMessage({
      message: 'Getting information about column types...',
      color: 'blue',
    }),
  );
  const field_types = await fetch(
    `${config[router.query.form_type]['view'].slice(0, -1)}-column/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
    },
  )
    .then(res =>
      Promise.all([res.status, res.status !== 200 ? res.text() : res.json()]),
    )
    .then(([status, res]) => {
      if (status !== 200) {
        TokenExpired(status);
        logError(
          `Service returned with status ${status} on column type GET (save_doc):`,
          res,
        );
        throw `An error occured while trying to get information regarding column types (text, numbers, etc). Please try again.`;
      }
      return res;
    });

  Object.keys(field_types).forEach(key => {
    field_types_final[key.toLowerCase()] = field_types[key];
  });

  dispatch(
    displayErrorMessage({
      message:
        "Saving record data... Please don't leave this page or click anything",
      color: 'blue',
    }),
  );
  var idx_row = 0;
  if (spreadsheet_data.response) {
    for (
      idx_row;
      idx_row <
      Math.max(spreadsheet_data.response.length, old_data.data_content.length);
      idx_row++
    ) {
      let row = {};
      let changed = false;
      spreadsheet_header.response.forEach((header, idx_col) => {
        // try converting any string to integer if possible, if fails then just skip and append the raw string
        // a try catch was put here to avoid new data being undefined if its length is shorter than old data
        try {
          if (!row[header.toLowerCase()]) {
            if (/int|float/g.test(field_types_final[header.toLowerCase()])) {
              row[header.toLowerCase()] =
                spreadsheet_data?.response[idx_row][idx_col] * 1 || null;
            } else {
              row[header.toLowerCase()] =
                spreadsheet_data?.response[idx_row][idx_col] || null;
            }
          }
        } catch (error) {}

        // convert date gotten from the database to appropriate format after the checking, to avoid
        // misinterpretating different date formats as different values although the date is the same
        if (
          header.toLowerCase().includes('date') &&
          row[header.toLowerCase()]
        ) {
          // try to convert, if the input is null then just pass
          try {
            let day, month, year, parts;
            const input = spreadsheet_data?.response[idx_row][idx_col].replace(
              /[^\x00-\x7F]/g,
              '',
            );
            if (input.includes('-')) {
              parts = input.split('-');
            } else if (input.trim().includes(' ')) {
              parts = input.split(' ');
            } else {
              parts = input.split('/');
            }
            day = parts[0];
            month = parts[1];
            year = parts[2];
            const date = new Date(`${year}-${month}-${day}`);
            row[header.toLowerCase()] = `${date
              .getDate()
              .toString()
              .padStart(2, '0')}/${(date.getMonth() + 1)
              .toString()
              .padStart(2, '0')}/${date.getFullYear()}`;
          } catch (error) {
            row[header.toLowerCase()] = null;
          }
        }

        // DEBUGGING FOR DATES SMH

        // if (header.toLowerCase().includes("date")) {
        //     console.log(row[header.toLowerCase()], old_data.data_content[idx_row][header.toLowerCase()])
        //     console.log(changed && (row[header.toLowerCase()]?.replace(/[^\x00-\x7F]/g, "") || null) !== (old_data.data_content[idx_row][header.toLowerCase()] || old_data.data_content[idx_row][header] || null))
        //     console.log(row[header.toLowerCase()]?.replace(/[^\x00-\x7F]/g, "") || null, (old_data.data_content[idx_row][header.toLowerCase()] || old_data.data_content[idx_row][header] || null))
        // }

        // try checking if the data is different. if index out of range it means that the size of the array of either
        // the old data has surpassed the new data, or vice versa, so skip the step.
        // a try catch was put here to avoid old data being undefined if its length is shorter than new data

        try {
          if (header.toLowerCase().includes('date')) {
            let old_date =
              old_data.data_content[idx_row][header.toLowerCase()] ||
              old_data.data_content[idx_row][header] ||
              null;
            if (old_date) {
              old_date = new Date(old_date);
              old_date = `${old_date.getDate().toString().padStart(2, '0')}/${(
                old_date.getMonth() + 1
              )
                .toString()
                .padStart(2, '0')}/${old_date.getFullYear()}`;
              if (old_data.data_content[idx_row][header.toLowerCase()]) {
                old_data.data_content[idx_row][header.toLowerCase()] = old_date;
              } else {
                old_data.data_content[idx_row][header] = old_date;
              }
            }
          }
          if (
            !changed &&
            (String(row[header.toLowerCase()])?.replace(/[^\x00-\x7F]/g, '') ||
              null) !==
              String(
                old_data.data_content[idx_row][header.toLowerCase()] ||
                  old_data.data_content[idx_row][header] ||
                  null,
              )
          ) {
            changed = true;
          }
        } catch (error) {}
      });
      logDebug(
        `${row} ${idx_row} ${idx_row < old_data.data_content.length - 1}`,
      );
      // if change in row is detected then update the data in the database
      if (
        changed &&
        idx_row <= old_data.data_content.length - 1 &&
        JSON.stringify(row) !== '{}'
      ) {
        logDebug('trying to PUT' + idx_row);
        await fetch(
          `${config[router.query.form_type]['view']}${
            old_data.data_content[idx_row]['id']
          }`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${
                JSON.parse(parseCookies().user_data).access_token
              }`,
            },
            body: JSON.stringify({
              id: old_data.data_content[idx_row]['id'],
              ...row,
            }),
          },
        )
          .then(res => Promise.all([res.status, res.text()]))
          .then(([status, res]) => {
            if (status !== 200) {
              TokenExpired(status);
              logError(
                `Service returned with status ${status} on record content PUT (save_doc): `,
                res,
              );
              throw `An error occured while trying to save the record. Please try again.`;
            }
          });
        logDebug('PUT succeeded');
      } else {
        // else if current index is already beyond the length of original data or the new data
        if (
          idx_row > spreadsheet_data.response.length - 1 ||
          idx_row > old_data.data_content.length - 1
        ) {
          // if the new data length is shorter than the new data then the old data is deleted
          if (spreadsheet_data.response.length < old_data.data_content.length) {
            logDebug('trying to DELETE' + idx_row);
            await fetch(
              `${config[router.query.form_type]['view']}${
                old_data.data_content[idx_row]['id']
              }`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${
                    JSON.parse(parseCookies().user_data).access_token
                  }`,
                },
              },
            )
              .then(res => Promise.all([res.status, res.text()]))
              .then(([status, res]) => {
                if (status !== 200) {
                  TokenExpired(status);
                  logError(
                    `Service returned with status ${status} on record content DELETE (save_doc):`,
                    res,
                  );
                  throw `An error occured while trying to save the record. Please try again`;
                }
              });
            logDebug('DELETE succeeded');
          }
          // else if the new data length is greater than the old data then there's a new row appended
          else if (
            spreadsheet_data.response.length > old_data.data_content.length
          ) {
            logDebug('trying to POST' + idx_row);
            const upload = await fetch(
              `${config[router.query.form_type]['view']}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${
                    JSON.parse(parseCookies().user_data).access_token
                  }`,
                },
                body: JSON.stringify(row),
              },
            )
              .then(res => Promise.all([res.status, res.text()]))
              .then(([status, res]) => {
                if (status !== 200) {
                  TokenExpired(status);
                  logError(
                    `Service returned with status ${status} on record content POST (save_doc):`,
                    res,
                  );
                  throw `An error occured while trying to save the record. Please try again`;
                }
                return res;
              });
            logDebug('success POSTING new record, appending to record...');
            let uploaded_id: string[] | number = upload.split(':');
            uploaded_id = parseInt(uploaded_id[uploaded_id.length - 1].trim());
            await fetch(`${config[router.query.form_type]['workspace']}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${
                  JSON.parse(parseCookies().user_data).access_token
                }`,
              },
              body: JSON.stringify({
                afe_number: workspaceData.afe_number,
                [config[router.query.form_type]['workspace_holder_key']]:
                  uploaded_id,
              }),
            })
              .then(res => Promise.all([res.status, res.text()]))
              .then(([status, res]) => {
                if (status !== 200) {
                  TokenExpired(status);
                  logError(
                    `Service returned with status ${status} on append data to record POST (save_doc):`,
                    res,
                  );
                  throw `An error occured while trying to save the record. Please try again`;
                }
              });
            logDebug('success');
          }
        }
      }
    }
  } else {
    if (old_data.data_content.length > 0) {
      old_data.data_content.forEach(async (record, idx_row_del) => {
        logDebug('trying to DELETE' + idx_row_del);
        await fetch(
          `${config[router.query.form_type]['view']}${record['id']}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${
                JSON.parse(parseCookies().user_data).access_token
              }`,
            },
          },
        )
          .then(res => Promise.all([res.status, res.text()]))
          .then(([status, res]) => {
            if (status !== 200) {
              TokenExpired(status);
              logError(
                `Service returned with status ${status} on record DELETE (save_doc):`,
                res,
              );
              throw `An error occured while trying to save the record. Please try again`;
            }
          });
        logDebug('DELETE succeeded');
      });
    }
  }
  return {success: true};
};

export const downloadWorkspace = async (
  router,
  config,
  workspaceData,
  dispatch,
) => {
  if (router.query.form_type && workspaceData.afe_number) {
    dispatch(
      displayErrorMessage({
        message: 'Getting record  data, please wait...',
        color: 'blue',
      }),
    );
    const record = await init_data(config, router, workspaceData);
    dispatch(
      displayErrorMessage({
        message: 'Processing record data, please wait...',
        color: 'blue',
      }),
    );
    const spreadsheet_download = await fetch(
      `${config.services.sheets}/downloadSheet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
        body: JSON.stringify({
          form_type: router.query.form_type,
          workspace_data: workspaceData,
          workspace_content: record.data_content,
        }),
      },
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status !== 200) {
          TokenExpired(res.status);
          logError(
            `Service returned with status code ${res.status} on spreadsheet api (download):`,
            res.response,
          );
          throw `An error occurred from Google Sheets that MetaDB is unable to handle. Please try again`;
        }
        return res;
      });
    logDebug(`new temp spreadsheet download: ${spreadsheet_download.response}`);
    dispatch(
      displayErrorMessage({
        message: 'Downloading record as XLSX file, please wait...',
        color: 'blue',
      }),
    );
    await fetch(
      `https://docs.google.com/spreadsheets/d/${spreadsheet_download.response}/export?format=xlsx&id=${spreadsheet_download.response}`,
    )
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${workspaceData.workspace_name}`;
        link.click();
      })
      .catch(err => {
        logError(`Service returned error on Google service (download):`, err);
        throw `An error occurred from Google Sheets that MetaDB is unable to handle. Please try again`;
      });
    await fetch(`${config.services.sheets}/deleteSpreadsheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${
          JSON.parse(parseCookies().user_data).access_token
        }`,
      },
      body: JSON.stringify({spreadsheetID: spreadsheet_download.response}),
    }).catch(err => {
      logError(err);
    });
    dispatch(
      displayErrorMessage({
        message: `Success. Record converted to XLSX with file name "${workspaceData.workspace_name}.xlsx"`,
        color: 'blue',
        duration: 3000,
      }),
    );
  } else {
    throw 'Failed to download record. Please send a report to application maintainer/developer';
  }
  return {success: true};
};

export const checkAfe = async (e, config, data_type, afe_number) => {
  if (e) {
    e.preventDefault();
  }
  const afe_exist = await fetch(`${config[data_type]['afe']}${afe_number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        JSON.parse(parseCookies().user_data).access_token
      }`,
    },
  })
    .then(res => Promise.all([res.status, res.text()]))
    .then(([status, res]) => {
      if (status !== 200) {
        TokenExpired(status);
        logError(`Service returned with status ${status} (afe_check):`, res);
        throw `Failed checking AFE availability, please try again`;
      }
      return res;
    });
  return afe_exist;
};

export const getColumnBinder = (config, data_type) => {
  return (
    config[data_type]['column_binder']?.split('-').join(' ') ||
    '!!NOT IMPLEMENTED YET!!'
  );
};

export const getDataTypeNoUnderscore = data_type => {
  return data_type.split('_').join(' ');
};

export const formatWorkspaceList = (
  workspaces_list,
  Button,
  DownloadCommon,
  Image,
  datatype,
  config,
  dispatch,
  router,
  openPopup,
  deleteWorkspace,
  init,
) => {
  if (!workspaces_list) {
    return workspaces_list;
  }
  let final = [];
  workspaces_list.forEach(workspace => {
    final.push({
      KKKS: workspace.kkks_name,
      'Working area': workspace.working_area,
      AFE: workspace.afe_number,
      Type: workspace.submission_type,
      Action: (
        <div className="flex flex-row gap-x-4 items-center">
          <Button
            title="Download"
            additional_styles="px-3 hover:bg-green-300"
            className="flex"
            onClick={async e => {
              try {
                router.events.emit('routeChangeStart');
                await downloadWorkspace(
                  {query: {form_type: datatype}},
                  config,
                  workspace,
                  dispatch,
                );
                router.events.emit('routeChangeComplete');
              } catch (error) {
                dispatch(
                  displayErrorMessage({
                    message: JSON.stringify(error),
                    color: 'blue',
                  }),
                );
                router.events.emit('routeChangeComplete');
              }
            }}>
            <div className="w-18p h-18p">
              <DownloadCommon className="w-5 h-5" />
            </div>
          </Button>
          <Button
            title="Edit record"
            additional_styles="px-3"
            className="flex"
            path={`/edit/${workspace.workspace_name}`}
            query={{
              form_type: datatype,
              workspace_data: workspace.afe_number,
              previous: router.asPath,
            }}>
            <div className="w-18p h-18p flex items-center">
              <Image
                src="/icons/pencil.svg"
                width={50}
                height={50}
                alt="icon"
              />
            </div>
          </Button>
          <Button
            additional_styles="px-3 hover:bg-red-400"
            className="flex"
            title="Delete record"
            onClick={e => {
              openPopup({
                message: `Are you sure you want to delete a record with afe number ${workspace.afe_number}? This action is irreversible!`,
                title: 'Delete confirmation',
                onConfirm: () => {
                  deleteWorkspace(workspace.afe_number).then(() => {
                    init();
                  });
                },
              });
            }}>
            <div className="w-18p h-18p flex items-center">
              <Image
                src="/icons/delete.svg"
                width={50}
                height={50}
                alt="icon"
              />
            </div>
          </Button>
        </div>
      ),
    });
  });
  return final;
};

export let checkAFETimeout = undefined;
export const handleAfeChange = async (
  e,
  config,
  datatype,
  dispatch,
  setpopupMessage,
  setnewWorkspace,
  newWorkspace,
  setafeExist,
) => {
  const input_value = parseInt(e.target.value);
  if (!input_value) {
    return;
  }
  if (checkAFETimeout !== undefined) {
    clearTimeout(checkAFETimeout);
  }
  checkAFETimeout = setTimeout(async () => {
    e.preventDefault();
    try {
      setpopupMessage({message: '', color: ''});
      if (!newWorkspace.afe_number) {
        return;
      }
      const result = await checkAfe(false, config, datatype, input_value);
      if (result !== 'null') {
        const workspace_data = JSON.parse(result)[0];
        setafeExist(true);
        setnewWorkspace({
          ...newWorkspace,
          afe_number: input_value,
          kkks_name: workspace_data.kkks_name,
          working_area: workspace_data.working_area,
          submission_type: workspace_data.submission_type,
        });
        setpopupMessage({
          message:
            'A record with the same AFE number already exists. You will be redirected to the edit record page instead if you proceed. You can edit the fields below inside the edit record page.',
          color: 'blue',
        });
      } else {
        setafeExist(false);
        setpopupMessage({message: '', color: ''});
      }
    } catch (error) {
      showErrorToast(
        dispatch,
        `Failed checking AFE availability, please try again or contact maintainer if the problem persists.`,
      );
      logError(': AFE check failure: ', error);
      setpopupMessage({message: 'Something went wrong', color: 'red'});
      await delay(1000);
      setpopupMessage({message: '', color: ''});
    }
    checkAFETimeout = undefined;
  }, 300);
};

export let changePageTimeout = undefined;
export const changePage = (document_summary: DocumentSummary, setImageURL: Dispatch<SetStateAction<string>>, PageNo: number) => {
  if (changePageTimeout !== undefined) {
    clearTimeout(changePageTimeout);
  }
  changePageTimeout = setTimeout(() => {
    setImageURL(
      _ =>
        `${process.env.NEXT_PUBLIC_OCR_SERVICE_URL}/ocr_service/v1/image/${
          document_summary?.document_id
        }/${PageNo + 1}`,
    );
    changePageTimeout = undefined;
  }, 300);
};

export const sendDeleteSpreadsheet = async (config: ServicesConfig & DatatypeConfig, spreadsheetId: string) => {
  logDebug('deleting temp sheet...');
  await fetch(`${config.services.sheets}/deleteSpreadsheet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spreadsheetID: spreadsheetId,
    }),
    keepalive: true,
  }).catch(error => {
    logError(`Cannot delete temp spreadsheet, reason:`, error);
  });
};

// details is preferrably an Object type, while message is String
export const logDebug = (
  message: string,
  details: null | JSON | string = null,
) => {
  console.log(
    new Date().toString().split(' ').splice(1, 4).join(' ') + ': ' + message,
  );
  if (details) {
    console.log(details);
  }
};

// details is preferrably an Object type, while message is String
export const logError = (
  message: string,
  details: null | JSON | string = null,
) => {
  console.error(
    new Date().toString().split(' ').splice(1, 4).join(' ') + ': ' + message,
  );
  if (details) {
    console.error(details);
  }
};

// message is preferably a string
export const showErrorToast = (dispatch: any, message: string) => {
  dispatch(
    displayErrorMessage({
      message: String(message),
      color: 'red',
      duration: 5000,
    }),
  );
};
