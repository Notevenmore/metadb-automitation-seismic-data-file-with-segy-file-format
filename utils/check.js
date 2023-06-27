import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getProfile} from '../services/admin';
import {setUser} from '../store/userSlice';

function CheckAuth() {
  const user = useSelector(state => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [Message, setMessage] = useState({message: '', color: '', show: false});

  const handleProfile = async () => {
    const res = await getProfile(user.name).then(
      res => {
        dispatch(setUser(res));
      },
      err => {
        setMessage({
          message: String(err),
          color: 'red',
          show: true,
        });
      },
    );
  };

  useEffect(() => {
    if (!user.name) {
      router.push('/login/signin');
      return;
    }
    if (user.type === 'Administrator') return;
    handleProfile();
  }, [user.name, router.events, useSelector(state => state.user.user.name)]);

  return {Message, setMessage};
}

function CheckUser(userType) {
  const router = useRouter();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (user.type !== userType) {
      router.push('/login/signin');
      return;
    }
  }, [router.asPath]);
}

export {CheckAuth, CheckUser};