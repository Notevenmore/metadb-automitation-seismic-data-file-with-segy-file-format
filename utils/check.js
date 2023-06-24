function checkAuth() {
  const user = useSelector(state => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleProfile = async () => {
    const res = await getProfile(user.name);
    // console.log(res, user.name)
    dispatch(setUser(res));
  };

  useEffect(() => {
    if (!user.name) {
      router.push('/login/signin');
      return;
    }
    if (user.type === 'Administrator') return;
    handleProfile();
    // console.log(user.name)
  }, [user.name, router.events, useSelector(state => state.user.user.name)]);
}

function checkUser(userType) {
  const router = useRouter();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (user.type !== userType) {
      router.push('/login/signin');
      return;
    }
  }, [router.asPath]);
}

export {checkAuth, checkUser}