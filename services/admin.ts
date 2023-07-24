import axios from 'axios';
import Router from 'next/router';
import {parseCookies} from 'nookies';

export function TokenExpired(err) {
  const code = typeof err === "number" ? err : ((err.response && err.response.status) ?? 400);
  if (code === 401 || code === 402) {
    Router.push('/login');
    throw new Error("Token has expired, please login again.")
  }
}

export async function getProfiles() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/list`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
      },
    );
    const data = res.data.data;
    return data;
  } catch (err) {
    TokenExpired(err);
    console.log(err);
  }
}

export async function getProfile(userId) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
      },
    );
    const data = res.data.data;
    return data;
  } catch (err) {
    TokenExpired(err);
    throw err;
  }
}

export async function removeProfile(userId) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
      },
    );
    const data = res.data.data;
    return data;
  } catch (err) {
    TokenExpired(err);
    throw err;
  }
}

export async function updateProfile(body) {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile`,
      body,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
      },
    );
    const data = res.data.data;
    return data;
  } catch (err) {
    TokenExpired(err);
    throw err;
  }
}

export async function addProfile(body) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_AUTH}/profile/new`,
      body,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(parseCookies().user_data).access_token
          }`,
        },
      },
    );
    const data = res.data.data;
    return data;
  } catch (err) {
    TokenExpired(err);
    throw err;
  }
}
