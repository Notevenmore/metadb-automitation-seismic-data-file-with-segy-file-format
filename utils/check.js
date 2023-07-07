import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {getProfile} from '../services/admin';
import {useAppDispatch, useAppSelector} from '../store';
import {setErrorMessage} from '../store/generalSlice';
import {setUser} from '../store/userSlice';

function CheckAuth() {
  const user = useAppSelector(state => state.user.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleProfile = async () => {
    console.log(user.userid);
    const res = await getProfile(user.userid).then(
      res => {
        dispatch(setUser(res));
      },
      err => {
        console.log('???');
        dispatch(
          setErrorMessage({
            message: String(err),
            color: 'red',
            show: true,
          }),
        );
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
  }, [
    user.userid,
    router.events,
    useAppSelector(state => state.user.user.userid),
  ]);
}

function CheckUser(userType) {
  const router = useRouter();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    if (user.type !== userType) {
      router.push('/login/signin');
      return;
    }
  }, [router.asPath]);
}

export {CheckAuth, CheckUser};
