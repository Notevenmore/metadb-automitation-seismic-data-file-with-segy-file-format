import moment from 'moment/moment';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {FloatDialog} from '../components/FloatDialog';
import Button from '../components/button';
import Container from '../components/container';
import TableComponent from '../components/table/table';
import Mime from '../utils/mime';
import ProfilePic from '../dummy-data/profile_pic';
import {updateProfile} from '../services/admin';
import {useAppDispatch, useAppSelector} from '../store';
import {logOut, setUser} from '../store/userSlice';

const Profile = ({setTitle}) => {
  setTitle('Profile');
  const user = useAppSelector(state => state.user.user);
  const router = useRouter();
  const [currentUser, setcurrentUser] = useState({
    ...user,
  });
  const dispatch = useAppDispatch();

  const [content, setContent] = useState([]);
  useEffect(() => {
    setContent([
      ['Email', user.name],
      ['Date joined', moment(user.date_joined).format('DD - MM - YYYY')],
      ['Role', user.type],
    ]);
  }, []);

  const uploadIMG = async () => {
    let reader = new FileReader();
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = _this => {
      let files = Array.from(input.files)[0];
      reader.onload = () => {
        if (reader.readyState === 2) {
          if (/^image\/[\w]+$/.exec(files.type)) {
            const final = reader.result.replace(
              /^(.+)(?=,)/.exec(reader.result)[0] + ',',
              '',
            );
            setcurrentUser({...currentUser, profile_picture: final});
          } else {
            alert('Please upload only image formatted file (JPG/PNG)');
            return;
          }
        }
      };
      reader.readAsDataURL(files);
    };
    input.click();
  };

  const handleSignOut = () => {
    dispatch(logOut());
  };

  const handleUploadPhoto = async () => {
    if (user === currentUser) return;

    router.events.emit('routeChangeStart');
    console.log('start');
    await updateProfile({
      userid: user.userid,
      profile_picture: currentUser.profile_picture,
    }).then(
      () => {
        dispatch(setUser(currentUser));
        console.log('complete');
      },
      err => {
        console.log(err);
      },
    );
    router.events.emit('routeChangeComplete');
  };

  useEffect(() => {
    handleUploadPhoto();
  }, [currentUser]);

  const handleRemovePhoto = async () => {
    router.events.emit('routeChangeStart');
    router.events.emit('routeChangeComplete');
  };

  return (
    <Container>
      <Container.Title back>Account settings</Container.Title>
      <div className="space-y-5">
        <div className="flex space-x-7">
          <div className="flex flex-col items-center justify-center space-y-2">
            {/* // TODO CHANGE THE LINE BELOW TO NOT USE HARDCODED PROFILE PICTURE STRING */}
            <Image
              src={
                user.profile_picture ? Mime(user.profile_picture) : ProfilePic
              }
              alt="image"
              width={500}
              height={500}
              className="min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px] object-cover border-black rounded-full"
              priority
            />
            <FloatDialog
              items={{
                type: '',
                contents: [
                  {
                    section_title: 'Upload photo',
                    section_content: 'Maximum 1 MB',
                    handleClick: () => uploadIMG(),
                  },
                  {
                    section_title: 'Remove photo',
                    section_content: '',
                    handleClick: () => handleRemovePhoto(),
                  },
                ],
              }}
              className={`top-[35px] shadow-lg`}
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
          <Button path="" button_description="Change my password" />
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
