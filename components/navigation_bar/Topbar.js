import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Mime from '../../dummy-data/mime';
import MetaDB from '../../public/images/metadata3.png';
import {logOut} from '../../store/userSlice';
import {FloatDialog} from '../FloatDialog';
import RoundImage from '../image/RoundImage';

export default function TopBar() {
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
    setProfileProps({
      float_title: (
        <>
          {user.name} <br />{' '}
          <span className="font-normal">{user.affiliation}</span> <br />{' '}
          <span className="font-normal">{user.type}</span>
        </>
      ),
    });
  }, [user]);

  useEffect(() => {
    setProfile(Mime(user.profile_picture || '')); // TODO CHANGE TO NOT USE HARDCODED STRING LATER
  }, [user]);

  const dispatch = useDispatch();
  const handleSignOut = () => {
    dispatch(logOut());
    router.push('/');
  };

  return (
    <nav className="w-full flex justify-between items-center py-3 px-5 border-b border-gray-300">
      <Link href="/" className="flex items-center gap-x-4">
        <Image src={MetaDB} width={30} height={50} alt="MetaDB Logo" />
        <h1 className="text-xl font-bold">MetaDB</h1>
      </Link>
      <div className="flex items-center gap-x-3">
        <FloatDialog
          items={profileItem}
          className={`right-0 top-[50px]`}
          width="263px"
          {...profileProps}>
          <RoundImage
            source={profile ? profile : '/images/unknown.jpg'}
            size={{width: '30px'}}
          />
        </FloatDialog>
      </div>
    </nav>
  );
}
