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
    console.log(user.userid)
    const res = await getProfile(user.userid).then(
      res => {
  console.log("AAAAAAAAAAA")
        dispatch(setUser(res));
      },
      err => {
        console.log("AAAAAAAAAAA")
        setMessage({
          message: String(err),
          color: 'red',
          show: true,
        });
      },
    );
  };

  useEffect(() => {
    if (!user.userid) {
      router.push('/login/signin');
      return;
    }
    if (user.type === 'Administrator') return;
    handleProfile();
  }, [user.userid, router.events, useSelector(state => state.user.user.userid)]);

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
