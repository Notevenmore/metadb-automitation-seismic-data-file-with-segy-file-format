import axios from 'axios';
import {setCookie} from 'nookies';

export async function getLogin(email, password) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  const result = axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_AUTH}/token`, formData)
    .then(res => {
      console.log(res);
      if (!res.data) {
        throw new Error(
          'Incorrent credentials. Try again or use a different account if the problem still persists',
        );
      }

      setCookie(null, 'user_data', JSON.stringify(res.data), {
        maxAge: 9999999999,
        path: '/',
      });
      return {data: res, succeed: true};
    })
    .catch(err => {
      console.log(err.code, err.message);
      throw new Error(`${err.message}. Please contact maintainer.`);
      return {data: err, succeed: false};
    });

  return result;
}

export async function getAllRoles() {
  const result = axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`)
    .then(res => {
      // console.log(res)
      return {data: res, succeed: true};
    })
    .catch(err => {
      // console.log(err)
      return {data: err, succeed: false};
    });

  return result;
}
