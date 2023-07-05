import Image from 'next/image';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../components/Input';
import Button from '../../components/button';
import {getLayoutBlank} from '../../layout/getLayout';
import {getLogin} from '../../services/user';
import {setUser} from '../../store/userSlice';

SignInPage.getLayout = getLayoutBlank;

export default function SignInPage({setTitle}) {
  const user = useSelector(state => state.user.user);
  const router = useRouter();
  const [Error, setError] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.email) {
      router.push('/');
    }
  }, []);

  setTitle('Sign in');

  const handleChange = e => {
    const {name, value} = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async e => {
    e.preventDefault();
    router.events.emit('routeChangeStart');
    if (!loginData.password || !loginData.email) {
      setError('All input fields must not be empty');
      router.events.emit('routeChangeComplete');
      return;
    }
    if (
      !/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.exec(
        loginData.email,
      )
    ) {
      // setError('Please enter a valid email address');
      // router.events.emit('routeChangeComplete');
      // return;
    }
    try {
      await getLogin(loginData.email, loginData.password).then(res => {
        const {succeed, data} = res;
        if (succeed) {
          dispatch(setUser(data.data));
          if (data.data.type === 'Administrator') {
            router.push('/administrator', undefined, {shallow: true});
            // router.reload("/administrator")
            return;
          }
          router.push('/');
          return;
        }
        return;
      });
    } catch (error) {
      setError(String(error));
    }
    router.events.emit('routeChangeComplete');
  };

  return (
    <div
      className="h-screen flex flex-col-reverse my-10
         md:flex-row md:my-0 items-center justify-center m-auto gap-y-5">
      <div className="px-[50px] flex flex-col gap-y-6">
        <div id="title" className="max-md:text-center">
          <p className="text-[100px] leading-[100px] font-bold">MetaDB</p>
          <p className="text-xl">
            Effectively Cataloging and Managing E&amp;P Physical Assets
          </p>
          <div className="border border-b-[#d9d9d9] mt-2"></div>
        </div>
        <div className="max-md:text-center text-[30px] font-bold">Sign in</div>
        <form
          onSubmit={handleSignIn}
          className="flex flex-col gap-y-4 w-full md:pr-10"
          autoComplete="off">
          <Input
            label="Email"
            label_loc="above"
            type="email"
            name={'email'}
            placeholder={'Email'}
            value={loginData.email}
            onChange={e => handleChange(e)}
            required={true}
            additional_styles="space-y-1 text-sm"
            additional_styles_input="bg-[#ededed]"
          />
          <Input
            label="Password"
            label_loc="above"
            type="password"
            name={'password'}
            placeholder={'password'}
            value={loginData.password}
            onChange={e => handleChange(e)}
            required={true}
            additional_styles="space-y-1 text-[14px]"
            additional_styles_input="bg-[#ededed]"
          />
          <div
            className={`flex items-center space-x-2 fixed top-5 left-1/2 translate-x-[-50%] bg-red-500 text-white px-3 rounded-lg py-2 transition-all ${
              Error ? '' : '-translate-y-20'
            }`}>
            <p>{Error}</p>
            <Button
              additional_styles="px-1 py-1 text-black"
              path=""
              onClick={() => {
                setError('');
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          <div className="flex flex-col max-md:items-center gap-y-3">
            <Button
              path=""
              type="submit"
              button_description="Sign In"
              additional_styles="px-12 py-1 mt-4 bg-searchbg/[.6] hover:bg-searchbg font-semibold"
              onClick={handleSignIn}
            />
          </div>
        </form>
      </div>
      <div className="w-1/2 px-[100px] flex flex-row justify-center">
        <div className="min-w-[400px] space-y-3">
          <Image
            src="/images/metadbpng.png"
            className="select-none pointer-events-none"
            alt="MetaDB logo"
            width={400}
            height={400}
          />
          <p className="text-center">&copy; PT Geodwipa Teknika Nusantara</p>
        </div>
      </div>
    </div>
  );
}
