import {useRouter} from 'next/router';
import {useContext, useEffect, useState} from 'react';
import Input from '../../components/Input';
import Container from '../../components/container';
import {getLayoutTop} from '../../layout/getLayout';
import {getProfile, removeProfile, updateProfile} from '../../services/admin';
import {useAppDispatch} from '../../store';
import {setErrorMessage} from '../../store/generalSlice';
import {PopupContext} from '@contexts/PopupContext';
import Button from '@components/button';
import Image from 'next/image';
import {FloatDialog} from '@components/FloatDialog';
import ProfilePic from '../../dummy-data/profile_pic';
import Mime, { defaultProfile } from '../../utils/mime';

UserPage.getLayout = getLayoutTop;

interface Detail {
  userid: string;
  type: 'Regular User' | 'Administrator';
  name: string;
  expiry_date: string;
  affiliation: string;
  profile_picture: string;
}

export default function UserPage() {
  const [detail, setDetail] = useState<Detail>();
  const router = useRouter();
  const {userId} = router.query;
  let {openPopup} = useContext(PopupContext);

  const dispatch = useAppDispatch();
  const handleProfile = async () => {
    const res = await getProfile(userId).then(
      res => {
        return res;
      },
      err => {
        dispatch(
          setErrorMessage({
            message: String(err),
            color: 'red',
            show: true,
          }),
        );
        return;
      },
    );
    setDetail(res);
  };

  useEffect(() => {
    if (!userId) return;

    handleProfile();
  }, [userId]);

  const handleChange = e => {
    const {name, value} = e.target;
    setDetail(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(detail);
    await updateProfile(detail).then(
      () => {
        dispatch(
          setErrorMessage({
            message: `${userId} data successfully updated.`,
            color: 'blue',
            show: true,
          }),
        );
      },
      err => {
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

  const handleRemove = e => {
    e.preventDefault();
    openPopup({
      message: `Are you sure you want to delete ${userId} account?`,
      title: 'Delete Confirmation',
      onConfirm: async () => {
        await removeProfile(userId).then(() => {
          dispatch(
            setErrorMessage({
              message: `${userId} data successfully deleted.`,
              color: 'blue',
              show: true,
            }),
          );
          router.replace('/administrator');
        });
      },
    });
  };

  const uploadIMG = async () => {
    let reader = new FileReader();
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = _this => {
      let files = Array.from(input.files)[0];
      reader.onload = event => {
        const result = event.target?.result as string; // Type assertion applied here
        if (reader.readyState === 2) {
          if (/^image\/[\w]+$/.exec(files.type)) {
            const final = result.replace(
              /^(.+)(?=,)/.exec(result)[0] + ',',
              '',
            );
            // setcurrentUser({...currentUser, profile_picture: final});
            setDetail(prev => ({...prev, profile_picture: final}))
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

  const handleRemovePhoto = async () => {
    router.events.emit('routeChangeStart');
    router.events.emit('routeChangeComplete');

    
    setDetail(prev => ({...prev, profile_picture: defaultProfile()}))
  };

  console.log(detail);

  return (
    <Container>
      <Container.Title back>User Detail: {userId}</Container.Title>
      {detail && (
        <div className="flex items-start gap-x-6">
          <div className="flex flex-col items-center space-y-3">
            <Image
              src={
                detail.profile_picture ? Mime(detail.profile_picture) : ProfilePic
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
          <form
            onSubmit={e => handleSubmit(e)}
            className="flex flex-col gap-y-2 flex-1">
            <Input
              type="text"
              label="User ID: "
              name="userid"
              label_loc="beside"
              value={detail.userid}
              disabled
              onChange={e => {
                handleChange(e);
              }}
            />
            <Input
              type="text"
              label="Name: "
              name="name"
              label_loc="beside"
              value={detail.name}
              onChange={e => {
                handleChange(e);
              }}
            />
            <Input
              type="dropdown"
              label="User Type: "
              dropdown_items={['Regular User', 'Administrator']}
              name="type"
              label_loc="beside"
              value={detail.type}
              onChange={e => {
                handleChange(e);
              }}
            />
            <Input
              type="text"
              label="Affiliation: "
              name="affiliation"
              label_loc="beside"
              value={detail.affiliation}
              onChange={e => {
                handleChange(e);
              }}
            />
            <Input
              type="password"
              label="Password: "
              name="password"
              autoComplete="off"
              label_loc="beside"
              onChange={e => {
                handleChange(e);
              }}
              placeholder="Password"
            />
            <Input
              type="text"
              label="Expiry Date: "
              name="expiry_date"
              label_loc="beside"
              value={detail.expiry_date}
              onChange={e => {
                handleChange(e);
              }}
              disabled
            />

            <div className="flex items-center gap-x-3">
              <button
                type="submit"
                className="px-3 py-1 rounded-[5px] hover:drop-shadow-lg bg-primary">
                Update
              </button>
              <button
                className="bg-error text-white px-3 py-1 rounded-[5px] hover:drop-shadow-lg"
                onClick={handleRemove}>
                Delete
              </button>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
}
