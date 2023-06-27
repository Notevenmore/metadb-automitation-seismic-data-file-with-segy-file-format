import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Container from '../../components/container/container';
import Input from '../../components/input_form/input';
import {getLayoutTop} from '../../layout/getLayout';
import {getProfile, removeProfile, updateProfile} from '../../services/admin';
import Toast from '../../components/toast/toast';

UserPage.getLayout = getLayoutTop;

interface Detail {
  userid: string;
  type: 'Regular User' | 'Administrator';
  name: string;
  expiry_date: string;
  affiliation: string;
}

export default function UserPage() {
  const [detail, setDetail] = useState<Detail>();
  const [Message, setMessage] = useState({message: '', color: '', show: false});
  const router = useRouter();
  const {userId} = router.query;

  const handleProfile = async () => {
    const res = await getProfile(userId).then(
      res => {
        return res;
      },
      err => {
        setMessage({
          message: String(err),
          color: 'red',
          show: true,
        });
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
        setMessage({
          message: `${userId} data successfully updated.`,
          color: 'blue',
          show: true,
        });
      },
      err => {
        setMessage({
          message: String(err),
          color: 'red',
          show: true,
        });
      },
    );
  };

  const handleRemove = async () => {
    await removeProfile(userId);
    router.replace('/administrator');
  };

  return (
    <Container>
      <Container.Title back>User Detail: {userId}</Container.Title>
      {detail && (
        <form onSubmit={e => handleSubmit(e)} className="flex flex-col gap-y-2">
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
      )}

      <Toast message={Message} setmessage={setMessage}>
        {Message.message}
      </Toast>
    </Container>
  );
}
