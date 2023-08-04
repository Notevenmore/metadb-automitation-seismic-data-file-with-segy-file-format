import moment from 'moment/moment';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {FloatDialog} from '../components/FloatDialog';
import Button from '../components/button';
import Container from '../components/container';
import TableComponent from '../components/table/table';
import Mime, {defaultProfile} from '../utils/mime';
import ProfilePic from '../dummy-data/profile_pic';
import {updateProfile} from '../services/admin';
import {useAppDispatch, useAppSelector} from '../store';
import {logOut, setUser} from '../store/userSlice';
import {uploadIMG} from '@utils/image';
import RoundImage from '@components/RoundImage';

const Profile = ({setTitle}) => {
  const user = useAppSelector(state => state.user.user);
  const router = useRouter();
  const [currentUser, setcurrentUser] = useState({
    ...user,
  });
  const dispatch = useAppDispatch();

  const [content, setContent] = useState([]);
  useEffect(() => {
    setTitle('Profile');
    setContent([
      ['Email', user.name],
      ['Expiry Date', user.expiry_date],
      ['Role', user.type],
    ]);
  }, [setTitle, user.date_joined, user.name, user.type]);

  const handleSignOut = () => {
    dispatch(logOut());
  };

  useEffect(() => {
    if (user === currentUser) return;

    router.events.emit('routeChangeStart');
    console.log('start');
    updateProfile({
      userid: user.userid,
      profile_picture: currentUser.profile_picture,
    }).then(
      () => {
        dispatch(setUser(currentUser));
        console.log('complete');
        router.events.emit('routeChangeComplete');
      },
      err => {
        console.log(err);
      },
    );
  }, [currentUser]);

  const handleRemovePhoto = () => {
    router.events.emit('routeChangeStart');

    setcurrentUser(prev => ({...prev, profile_picture: defaultProfile()}));
    router.events.emit('routeChangeComplete');
  };

  return (
    <Container>
      <Container.Title back>Account settings</Container.Title>
      <div className="space-y-5">
        <div className="flex space-x-7">
          <div className="flex flex-col items-center justify-center space-y-2">
            {/* // TODO CHANGE THE LINE BELOW TO NOT USE HARDCODED PROFILE PICTURE STRING */}
            <RoundImage
              source={
                user.profile_picture ? Mime(user.profile_picture) : ProfilePic
              }
              width={500}
              additionalClass={
                ' min-w-[150px] max-w-[150px] min-h-[150px] max-h-150p object-cover border-black rounded-full'
              }
            />
            <FloatDialog
              items={{
                type: '',
                contents: [
                  {
                    section_title: 'Upload photo',
                    section_content: 'Maximum 1 MB',
                    handleClick: () =>
                      uploadIMG(final => {
                        setcurrentUser({
                          ...currentUser,
                          profile_picture: final,
                        });
                      }),
                  },
                  {
                    section_title: 'Remove photo',
                    section_content: '',
                    handleClick: () => handleRemovePhoto(),
                  },
                ],
              }}
              className={`top-35p shadow-lg`}
              width="263px">
              <Button
                button_description="Edit"
                path=""
                additional_styles="py-0.5 pl-1.5 pr-3 space-x-0 border bg-transparent border-float_dialog text-sm">
                <Image
                  src="/icons/pencil.svg"
                  width={25}
                  height={15}
                  className="alt='' "
                  alt="icon"
                />
              </Button>
            </FloatDialog>
          </div>
          <TableComponent
            header={['Account information', '']}
            content={content}
            additional_styles="text-[14.5px]"
          />
        </div>
        <div>
          <h3 className="font-semibold">Password</h3>
          <p>
            Reset your password by clicking the link below. The password reset
            confirmation will be sent to your email.
          </p>
        </div>
        <div className="flex space-x-2">
          {/* <Button path="" button_description="Change my password" /> */}
          <Button
            path=""
            button_description="Sign out"
            onClick={handleSignOut}
          />
        </div>
      </div>
    </Container>
  );
};

export default Profile;
