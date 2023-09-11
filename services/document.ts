import { parseCookies } from 'nookies';

export async function getHeader(config: any, form_type: string) {
  return fetch(
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
        form_type: form_type,
      }),
    },
  )
  .then(response => {
    return response.json();
  })
}