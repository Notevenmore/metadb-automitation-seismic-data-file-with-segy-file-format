import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import Button from '../../components/button';
import Container from '../../components/container';
import {getLayoutTop} from '../../layout/getLayout';
import {getProfiles, removeProfile} from '../../services/admin';
import {displayErrorMessage} from '../../store/generalSlice';
import {useAppDispatch} from '../../store';
import Input from '@components/Input';
import {PopupContext} from '@contexts/PopupContext';
import {useContext} from 'react';

AdministratorPage.getLayout = getLayoutTop;

export default function AdministratorPage() {
  let {openPopup} = useContext(PopupContext);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(list);

  const handleProfiles = () => {
    getProfiles().then((res) => {
      if (!res) return;
      const users = res.filter(item => item.userid !== 'admin');
      setList(users);
      setFilteredList(users);
    }).catch((err) => {
      dispatch(
        displayErrorMessage({
          message: `${String(err)}`,
          color: 'red',
        }),
      );
    })
  };

  useEffect(() => {
    handleProfiles();
  }, []);

  const dispatch = useAppDispatch();
  const handleRemove = userId => {
    openPopup({
      message: `Are you sure you want to delete ${userId} account?`,
      title: 'Delete Confirmation',
      onConfirm: () => {
        removeProfile(userId).then(
          () => {
            handleProfiles();
            dispatch(
              displayErrorMessage({
                message: `${userId} acount successfully deleted.`,
                color: 'blue',
              }),
            );
          },
          err => {
            dispatch(
              displayErrorMessage({
                message: String(err),
                color: 'red',
              }),
            );
          },
        );
      },
    });
  };

  const handleSearch = e => {
    setFilteredList(
      list.filter(item => item.userid.toLowerCase().includes(e.target.value)),
    );
  };

  return (
    <Container>
      <Container.Title>All Users</Container.Title>
      <div className="flex flex-col w-full gap-y-5">
        <div className="flex w-full items-center justify-end gap-x-3">
          <div>
            <Input
              type="text"
              additional_styles_input="h-8"
              placeholder="search user..."
              onChange={e => handleSearch(e)}
            />
          </div>
          <Button
            path="/administrator/add"
            additional_styles="bg-primary/[.8] hover:bg-primary h-8">
            Add User
          </Button>
        </div>
        <div className="w-full h-auto border-gray-500 border-[1px] rounded-[5px] flex flex-col">
          <ItemRow>
            <Item name="Name" /> <Item name="Actions" />
          </ItemRow>
          <div className="h-auto max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredList.map((item, index) => (
              <ItemRow key={index}>
                <Item name={item.userid} />
                <div className="w-full flex items-center gap-x-3">
                  <Link href={`/administrator/${item.userid}`}>
                    <Image
                      src="/icons/visibility.svg"
                      alt="image"
                      width={100}
                      height={100}
                      className="w-[20px] h-[20px] cursor-pointer"
                      priority
                    />
                  </Link>
                  <Image
                    src="/icons/delete.svg"
                    alt="image"
                    width={100}
                    height={100}
                    className="w-[20px] h-[20px] cursor-pointer"
                    priority
                    onClick={() => handleRemove(item.userid)}
                  />
                </div>
              </ItemRow>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

const Item = ({name}) => {
  return <div className="w-full flex items-center h-full">{name}</div>;
};

const ItemRow = ({children}) => {
  return (
    <div className="p-2 flex items-center flex-1 justify-between border-b">
      {children}
    </div>
  );
};
