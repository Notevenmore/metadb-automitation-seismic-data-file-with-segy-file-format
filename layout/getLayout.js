import { getProfile } from '../services/admin';
import { setUser } from '../store/userSlice';
import Blank from './Blank';
import LayoutIcon from './LayoutIcon';
import LayoutWidget from './LayoutWidget';

import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

function checkAuth() {
  const user = useSelector(state => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleProfile = async () => {
    const res = await getProfile(user.name)
    // console.log(res, user.name)
    dispatch(setUser(res))
  }

  useEffect(() => {
    if (!user.name) {
      router.push('/login/signin');
      return;
    }
    handleProfile()
    // console.log(user.name)
  }, [user.name, router.events, useSelector(state => state.user.user.name)]);

}

function getLayoutBlank(page) {
  return <Blank>{page}</Blank>;
}

function getLayoutIcon(page) {
  return <LayoutIcon>{page}</LayoutIcon>;
}

function getLayoutWidget(page) {
  return <LayoutWidget>{page}</LayoutWidget>;
}

export {getLayoutBlank, getLayoutIcon, getLayoutWidget, checkAuth};
