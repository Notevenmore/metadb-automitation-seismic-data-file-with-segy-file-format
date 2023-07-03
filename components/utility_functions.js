import {parseCookies} from 'nookies';
import {TokenExpired} from '../services/admin';
import {setErrorMessage} from '../store/generalSlice';
import {store} from './../store/index'

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
        throw `Service returned with status ${status}: ${res}`;
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
        throw `Service returned with status ${status}: ${res}`;
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
            throw `Service returned with status ${status}: ${res}`;
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
  setMessage,
  dispatch
) => {
  if (e) {
    e.preventDefault();
  }

  // Check if spreadsheetId is available
  if (!spreadsheetId) {
    dispatch(
      setErrorMessage({
        message:
          'Failed to get spreadsheet information, please reload this page. Changes will not be saved',
        color: 'red',
        show: true,
      }),
    );
    // setMessage({
    //   message:
    //     'Failed to get spreadsheet information, please reload this page. Changes will not be saved',
    //   color: 'red',
    //   show: true,
    // });
    return;
  }

  // Set saving message 
  dispatch(
      setErrorMessage({
        message:
          "Checking changes in record information... Please don't leave this page or click anything",
        color: 'blue',
        show: true,
      }),
    );
  // setMessage({
  //   message:
  //     "Checking changes in record information... Please don't leave this page or click anything",
  //   color: 'blue',
  //   show: true,
  // });

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
        throw `Service returned with status ${status} on record details GET: ${res}`;
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
      setErrorMessage({
        message:
          "Saving record information... Please don't leave this page or click anything",
        color: 'blue',
        show: true,
      }),
    );
    // setMessage({
    //   message:
    //     "Saving record information... Please don't leave this page or click anything",
    //   color: 'blue',
    //   show: true,
    // });
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
            throw `A record with the name "${workspaceData.workspace_name}" already exists. Please choose a different name.`;
          } else {
            throw `Service returned with status ${status} on record details PUT: ${res}`;
          }
        }
      });
  }

  dispatch(
    setErrorMessage({
      message:
        "Checking changes in record data... Please don't leave this page or click anything",
      color: 'blue',
      show: true,
    }),
  );
  // setMessage({
  //   message:
  //     "Checking changes in record data... Please don't leave this page or click anything",
  //   color: 'blue',
  //   show: true,
  // });
  // fetch original data from database
  const old_data = await init_data(config, router, workspaceData);

  // Fetch header from spreadsheet
  const spreadsheet_header = await fetch(
    `${config.services.sheets}/getHeaders`,
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
      }),
    },
  )
    .then(response => {
      return response.json();
    })
    .then(response => {
      // Handle non-200 response status
      if (response.status !== 200) {
        TokenExpired(response.status);
        throw `Service returned with status ${response.status} on spreadsheet GET headers: ${response.response}`;
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
        throw `Service returned with status ${response.status} on spreadsheet GET rows: ${response.response}`;
      }
      return response;
    })
    .catch(err => {
      throw err;
    });

    
  dispatch(
    setErrorMessage({
      message:
        "Saving record data... Please don't leave this page or click anything",
      color: 'blue',
      show: true,
    }),
  );
  // setMessage({
  //   message:
  //     "Saving record data... Please don't leave this page or click anything",
  //   color: 'blue',
  //   show: true,
  // });
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
            if (header.toLowerCase().includes('page')) {
              row[header.toLowerCase()] =
                spreadsheet_data?.response[idx_row][idx_col] * 1 || null;
            } else {
              row[header.toLowerCase()] =
                spreadsheet_data?.response[idx_row][idx_col] || null;
            }
            if (row[header.toLowerCase()] === '') {
              throw 'Please fill out every column in a row although there is no data to be inserted based on the reference document. Make sure to insert correct value types based on their own respective column types.';
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
            (row[header.toLowerCase()]?.replace(/[^\x00-\x7F]/g, '') ||
              null) !==
              (old_data.data_content[idx_row][header.toLowerCase()] ||
                old_data.data_content[idx_row][header] ||
                null)
          ) {
            changed = true;
          }
        } catch (error) {}
      });
      console.log(row, idx_row, idx_row < old_data.data_content.length - 1);
      // if change in row is detected then update the data in the database
      if (
        changed &&
        idx_row <= old_data.data_content.length - 1 &&
        JSON.stringify(row) !== '{}'
      ) {
        console.log('trying to PUT', idx_row);
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
              throw `Service returned with status ${status} on record PUT: ${res}`;
            }
          });
        console.log('PUT succeeded');
      } else {
        // else if current index is already beyond the length of original data or the new data
        if (
          idx_row > spreadsheet_data.response.length - 1 ||
          idx_row > old_data.data_content.length - 1
        ) {
          // if the new data length is shorter than the new data then the old data is deleted
          if (spreadsheet_data.response.length < old_data.data_content.length) {
            console.log('trying to DELETE', idx_row);
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
                  throw `Service returned with status ${status} on record DELETE: ${res}`;
                }
              });
            console.log('DELETE succeeded');
          }
          // else if the new data length is greater than the old data then there's a new row appended
          else if (
            spreadsheet_data.response.length > old_data.data_content.length
          ) {
            console.log('trying to POST', idx_row);
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
                  throw `Service returned with status ${status} on record POST: ${res}`;
                }
                return res;
              });
            console.log('success POSTING new record, appending to record...');
            let uploaded_id = upload.split(':');
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
                  throw `Service returned with status ${status} on append data to record POST: ${res}`;
                }
              });
            console.log('success');
          }
        }
      }
    }
  } else {
    if (old_data.data_content.length > 0) {
      old_data.data_content.forEach(async (record, idx_row_del) => {
        console.log('trying to DELETE', idx_row_del);
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
              throw `Service returned with status ${status} on record DELETE: ${res}`;
            }
          });
        console.log('DELETE succeeded');
      });
    }
  }
  return {success: true};
};

export const downloadWorkspace = async (
  router,
  config,
  spreadsheetId,
  workspaceData,
  setMessage,
  dispatch
) => {
  dispatch(
    setErrorMessage({
      message: 'Downloading record as XLSX file, please wait...',
      color: 'blue',
      show: true,
    }),
  );
  // setMessage({
  //   message: 'Downloading record as XLSX file, please wait...',
  //   color: 'blue',
  //   show: true,
  // });
  if (spreadsheetId && router.query.form_type && workspaceData.afe_number) {
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
          spreadsheetID: spreadsheetId,
          workspace_data: workspaceData,
        }),
      },
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.status !== 200) {
          TokenExpired(res.status);
          throw `Service returned with status code ${res.status}: ${res.response}`;
        }
        return res;
      });
    console.log(
      `new temp spreadsheet download: ${spreadsheet_download.response}`,
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
      .catch(console.error);
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
      console.log(err);
    });
    dispatch(
      setErrorMessage({
        message: `Success. Record converted to XLSX with file name "${workspaceData.workspace_name}.xlsx"`,
        color: 'blue',
        show: true,
      }),
    );
    // setMessage({
    //   message: `Success. Record converted to XLSX with file name "${workspaceData.workspace_name}.xlsx"`,
    //   color: 'blue',
    //   show: true,
    // });
    // return {success: true};
  }
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
        throw `Service returned with status ${status}: ${res}`;
      }
      return res;
    });
  return afe_exist;
};
