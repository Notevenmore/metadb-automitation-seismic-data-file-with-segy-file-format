import Icon from '@mdi/react';
import {mdiBellOutline, mdiHomeFloorA} from '@mdi/js';
import RoundImage from '../image/RoundImage';
import GTN from '../../public/images/gtn_logo_singleline.png';
import MetaDB from '../../public/images/metadata3.png';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import Mime from '../../dummy-data/mime';
import {useDispatch, useSelector} from 'react-redux';
import FloatDialog from '../float_dialog/float_dialog';
import {logOut} from '../../store/userSlice';
import Image from 'next/image';
import {useRouter} from 'next/router';
import ProfilePic from 'dummy-data/profile_pic';

export default function TopBar(props) {
  const user = useSelector(state => state.user.user);
  const router = useRouter();
  const [profile, setProfile] = useState('');
  const profileItem = {
    type: '',
    contents: [
      {
        section_title: 'Account settings',
        section_content: '',
        link: '/profile',
      },
      {
        section_title: 'Sign out',
        section_content: '',
        handleClick: () => handleSignOut(),
      },
    ],
  };
  const [profileProps, setProfileProps] = useState({});
  useEffect(() => {
    // setProfile(Mime(user.profile_picture)) // TODO CHANGE TO NOT USE HARDCODED STRING LATER
    setProfile(ProfilePic);
    setProfileProps({
      float_title: (
        <>
          {user.first_name} {user.last_name} <br />{' '}
          <span className="font-normal">{user.email}</span> <br />{' '}
          <span className="font-normal">{user.role_name}</span>
        </>
      ),
    });
  }, []);

  const dispatch = useDispatch();
  const handleSignOut = () => {
    dispatch(logOut());
    router.push('/');
  };

  return (
    <nav className="w-full flex justify-between items-center py-3 px-5 border-b border-gray-300">
      <Link href="/" className="flex items-center gap-x-4">
        {/* <BSP className="w-[60px]" onClick={props.handleClick}/> */}
        {/* <img src={GTN} className='w-5 h-5'/> */}
        {/* <Image src={GTN} width={115} height={50}/> */}
        <Image src={MetaDB} width={30} height={50} alt="MetaDB Logo" />
        <h1 className="text-xl font-bold">MetaDB</h1>
      </Link>
      <div className="flex items-center gap-x-3">
        {/* <img src="/icons/bell-outline.svg" className="w-[1rem]" alt="notification" /> */}
        {/* <div className="border-l-[1.5px] border-slate-200 h-6"> </div> */}
        <FloatDialog
          items={profileItem}
          className={`right-0 top-[50px]`}
          width="263px"
          {...profileProps}>
          <RoundImage
            source={profile ? profile : '/images/unknown.jpg'}
            size={{width: '30px'}}></RoundImage>
        </FloatDialog>
      </div>
    </nav>
  );
}
