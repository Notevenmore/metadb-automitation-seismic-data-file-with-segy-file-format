import {useRouter} from 'next/router';
import {useCallback, useContext, useEffect, useState} from 'react';
import Input from '../../components/Input';
import Container from '../../components/container';
import {getLayoutTop} from '../../layout/getLayout';
import {getProfile, removeProfile, updateProfile} from '../../services/admin';
import {useAppDispatch} from '../../store';
import {displayErrorMessage} from '../../store/generalSlice';
import {PopupContext} from '@contexts/PopupContext';
import Button from '@components/button';
import Image from 'next/image';
import {FloatDialog} from '@components/FloatDialog';
import ProfilePic from '../../dummy-data/profile_pic';
import Mime, {defaultProfile} from '@utils/mime';
import {uploadIMG} from '@utils/image';
import { showErrorToast } from '@components/utility_functions';

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
  const handleProfile = useCallback(() => {
    getProfile(userId).then(setDetail, err => {
      showErrorToast(dispatch, err)
      return;
    });
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userId) return;

    handleProfile();
  }, [handleProfile, userId]);

  const handleChange = e => {
    const {name, value} = e.target;
    setDetail(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(detail);
    updateProfile(detail).then(
      () => {
        dispatch(
          displayErrorMessage({
            message: `${userId} data successfully updated.`,
            color: 'blue',
            duration: 3000,
          }),
        );
      },
      err => {
        const entityTooLarge = (err.response && err.response.status) ?? 400
        showErrorToast(dispatch, entityTooLarge===413 ? "The image you attempted to upload is too large. The maximum upload size is 1MB." : err)
      },
    );
  };

  const handleRemove = e => {
    e.preventDefault();
    openPopup({
      message: `Are you sure you want to delete ${userId} account?`,
      title: 'Delete Confirmation',
      onConfirm: () => {
        removeProfile(userId).then(() => {
          dispatch(
            displayErrorMessage({
              message: `${userId} data successfully deleted.`,
              color: 'blue',
              duration: 3000,
            }),
          );
          router.replace('/administrator');
        });
      },
    });
  };

  const handleRemovePhoto = () => {
    router.events.emit('routeChangeStart');

    setDetail(prev => ({...prev, profile_picture: defaultProfile()}));
    router.events.emit('routeChangeComplete');
  };

  return (
    <Container>
      <Container.Title back>User Detail: {userId}</Container.Title>
      {detail && (
        <div className="flex items-start gap-x-6">
          <div className="flex flex-col items-center space-y-3">
            <Image
              src={
                detail.profile_picture
                  ? Mime(detail.profile_picture)
                  : ProfilePic
              }
              alt="image"
              width={500}
              height={500}
              className="min-w-[150px] max-w-[150px] min-h-[150px] max-h-150p object-cover border-black rounded-full"
              priority
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
                        setDetail(prev => ({...prev, profile_picture: final}));
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
                className="px-3 py-1 rounded-5p hover:drop-shadow-lg bg-primary">
                Update
              </button>
              <Button
                button_description="Delete"
                additional_styles="py-1"
                onClick={handleRemove}
              />
            </div>
          </form>
        </div>
      )}
    </Container>
  );
}
