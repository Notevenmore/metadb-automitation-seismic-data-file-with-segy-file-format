import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Mime from '../../utils/mime';
import MetaDB from '../../public/images/metadata3.png';
import {useAppDispatch, useAppSelector} from '../../store';
import {logOut} from '../../store/userSlice';
import {FloatDialog} from '../FloatDialog';
import RoundImage from '../RoundImage';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function TopBar() {
  const user = useAppSelector(state => state.user.user);
  const [helpLink, setHelpLink] = useState('');
  const [homeLink, setHomeLink] = useState('/');
  const router = useRouter();
  const [profile, setProfile] = useState('');
  const [profileItem, setProfileItem] = useState({type: '', contents: []});
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

    setProfile(Mime(user.profile_picture || '')); // TODO CHANGE TO NOT USE HARDCODED STRING LATER

    if (user.type === 'Administrator') {
      setHelpLink('/administrator/help');
      setHomeLink('/administrator');
      setProfileItem({
        type: '',
        contents: [
          {
            section_title: 'Sign out',
            section_content: '',
            handleClick: () => handleSignOut(),
          },
        ],
      });
    } else {
      setHelpLink('/help');
      setProfileItem({
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
      });
    }
  }, [user]);

  const dispatch = useAppDispatch();
  const handleSignOut = () => {
    dispatch(logOut());
    router.push('/');
  };

  return (
    <nav className="w-full flex justify-between items-center py-3 px-5 border-b border-gray-300">
      <Link href={homeLink} className="flex items-center gap-x-4">
        <Image src={MetaDB} width={30} height={50} alt="MetaDB Logo" />
        <h1 className="text-xl font-bold">MetaDB</h1>
      </Link>
      <div className="flex items-center gap-x-3">
        <Link href={helpLink}>
          <InfoOutlinedIcon
            className="text-gray-600 cursor-pointer"
            fontSize="small"
          />
        </Link>
        <FloatDialog
          items={profileItem}
          className={`right-0 top-50p`}
          width="263px"
          {...profileProps}>
          <RoundImage
            source={profile ? profile : '/images/unknown.jpg'}
            width={30}
          />
        </FloatDialog>
      </div>
    </nav>
  );
}
