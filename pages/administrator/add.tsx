import {useState} from 'react';
import Input from '../../components/Input';
import Container from '../../components/container';
import {defaultProfile} from '../../utils/mime';
import {getLayoutTop} from '../../layout/getLayout';
import {addProfile} from '../../services/admin';
import {useAppDispatch} from '../../store';
import {displayErrorMessage} from '../../store/generalSlice';

AddNewUserPage.getLayout = getLayoutTop;

interface Detail {
  userid: string;
  type: 'Regular User' | 'Administrator';
  name: string;
  expiry_date?: string;
  affiliation: string;
  password: string;
}

export default function AddNewUserPage() {
  const [detail, setDetail] = useState<Detail>({
    userid: '',
    type: 'Regular User',
    name: '',
    affiliation: '',
    password: '',
  });

  const handleChange = e => {
    const {name, value} = e.target;
    setDetail(prev => ({...prev, [name]: value}));
  };

  const dispatch = useAppDispatch();
  const handleSubmit = e => {
    e.preventDefault();

    if (detail.userid && /\s/.test(detail.userid)) {
      dispatch(
        displayErrorMessage({
          message: 'Inputted userid cannot contain space. Please retype.',
          color: 'red',
          duration: 5000,
        }),
      );
      return;
    }

    const data = {
      ...detail,
      profile_picture: defaultProfile(),
    };
    addProfile(data).then(
      res => {
        if (res && res.response) {
          console.log(res.response.data.detail);
          dispatch(
            displayErrorMessage({
              message: String(res),
              color: 'red',
              duration: 5000,
            }),
          );
          return;
        }
        dispatch(
          displayErrorMessage({
            message: `Successfully created ${detail.userid} account.`,
            color: 'blue',
            duration: 3000,
          }),
        );
        setDetail({
          userid: '',
          type: 'Regular User',
          name: '',
          affiliation: '',
          password: '',
        });
      },
      err => {
        if (err.response.status === 409) {
          dispatch(
            displayErrorMessage({
              message: 'Inputted userid already exist',
              color: 'red',
              duration: 5000,
            }),
          );
        }
      },
    );
  };

  return (
    <Container>
      <Container.Title back>Add new User</Container.Title>
      <form onSubmit={e => handleSubmit(e)} className="flex flex-col gap-y-2">
        <Input
          type="text"
          label="User ID: "
          name="userid"
          label_loc="beside"
          required
          value={detail.userid}
          onChange={e => {
            handleChange(e);
          }}
        />
        <Input
          type="text"
          label="Name: "
          name="name"
          label_loc="beside"
          required
          value={detail.name}
          onChange={e => {
            handleChange(e);
          }}
        />
        <Input
          type="password"
          label="Password: "
          name="password"
          label_loc="beside"
          required
          value={detail.password}
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
          required
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
          required
          value={detail.affiliation}
          onChange={e => {
            handleChange(e);
          }}
        />
        <div className="flex items-center gap-x-3">
          <button
            type="submit"
            className="px-3 py-1 rounded-5p hover:drop-shadow-lg bg-primary">
            Add User
          </button>
        </div>
      </form>
    </Container>
  );
}
