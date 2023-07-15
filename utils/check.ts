import {useRouter} from 'next/router';
import {useCallback, useEffect} from 'react';
import {getProfile} from '../services/admin';
import {useAppDispatch, useAppSelector} from '../store';
import {setErrorMessage} from '../store/generalSlice';
import {setUser} from '../store/userSlice';

function CheckAuth() {
  const user = useAppSelector(state => state.user.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleProfile = useCallback(() => {
    console.log(user.userid);
    getProfile(user.userid).then(
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
  }, [dispatch, user.userid]);

  useEffect(() => {
    if (!user.userid) {
      router.push('/login');
      return;
    }
    if (user.type === 'Administrator') return;
    handleProfile();
  }, [user.userid, router.events, user.type, handleProfile, router]);
}

function CheckUser(userType) {
  const router = useRouter();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    if (user.type !== userType) {
      router.push('/login');
      return;
    }
  }, [router, router.asPath, user.type, userType]);
}

export {CheckAuth, CheckUser};
