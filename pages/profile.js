import Buttons from '../components/buttons/buttons';
import TableComponent from '../components/table/table';
import Container from '../components/container/container';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import moment from 'moment/moment';
import {logOut, setUser} from '../store/userSlice';
import FloatDialog from '../components/float_dialog/float_dialog';
import Image from 'next/image';
import Mime from 'dummy-data/mime';
import ProfilePic from 'dummy-data/profile_pic';
import {useRouter} from 'next/router';

const Profile = ({setTitle}) => {
  setTitle('Profile');
  const user = useSelector(state => state.user.user);
  const router = useRouter();
  const [currentUser, setcurrentUser] = useState({
    ...user,
  });
  const dispatch = useDispatch();

  const [content, setContent] = useState([]);
  useEffect(() => {
    setContent([
      ['Email', user.email],
      ['Date joined', moment(user.date_joined).format('DD - MM - YYYY')],
      ['Role', user.role_name],
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
            // setPic(reader.result);
            // console.log(reader.result)
            // const replace = /^(.+)(?=,)/.exec(reader.result)[0] + ', '
            const final = reader.result.replace(
              /^(.+)(?=,)/.exec(reader.result)[0] + ',',
              '',
            );
            setcurrentUser({...currentUser, profile_picture: final});
            console.log(final);
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
    if (currentUser && user.profile_picture !== currentUser.profile_picture) {
      router.events.emit('routeChangeStart');
      console.log('start');
      await fetch('http://localhost:8080/api/v1/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          id: currentUser.id,
        },
        body: JSON.stringify({
          First_Name: currentUser.first_name,
          Last_Name: currentUser.last_name,
          Email: currentUser.email,
          Role_Name: currentUser.role_name,
          Profile_Picture: currentUser.profile_picture,
        }),
      })
        .then(res => {
          if (res.status !== 200) {
            console.log(res);
          }
        })
        .catch(err => {
          throw err;
        });
      dispatch(setUser(currentUser));
      console.log('complete');
      router.events.emit('routeChangeComplete');
    }
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
            {/* <img src={Mime(user.profile_picture) || ProfilePic} className="min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px] object-cover border-black rounded-full" /> */}
            {/* //TODO CHANGE THE LINE BELOW TO NOT USE HARDCODED PROFILE PICTURE STRING */}
            <img
              src={ProfilePic}
              className="min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px] object-cover border-black rounded-full"
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
              width="263px"
            >
              <Buttons
                button_description="Edit"
                path=""
                additional_styles="py-0.5 pl-1.5 pr-3 space-x-0 border bg-transparent border-float_dialog text-[14px]"
              >
                <Image
                  src="/icons/pencil.svg"
                  width={10}
                  height={10}
                  className="w-[25px] h-[15px] alt='' "
                  alt="icon"
                />
              </Buttons>
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
          <Buttons path="" button_description="Change my password" />
          <Buttons
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
