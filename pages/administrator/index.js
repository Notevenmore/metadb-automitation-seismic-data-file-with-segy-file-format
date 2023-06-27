import {useEffect, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {getLayoutTop} from '../../layout/getLayout';
import Container from '../../components/container/container';
import {getProfiles, removeProfile} from '../../services/admin';
import Input from '../../components/input_form/input';
import Buttons from '../../components/buttons/buttons';
import Toast from '../../components/toast/toast';

AdministratorPage.getLayout = getLayoutTop;

export default function AdministratorPage() {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(list);

  const [Message, setMessage] = useState({message: '', color: '', show: false});

  const handleProfiles = async () => {
    const res = await getProfiles();
    if (!res) return;
    const users = res.filter(item => item.userid !== 'admin');
    setList(users);
    setFilteredList(users);
  };

  useEffect(() => {
    handleProfiles();
  }, []);

  const handleRemove = async userId => {
    await removeProfile(userId).then(
      () => {
        handleProfiles();
        setMessage({
          message: `${userId} acount successfully deleted.`,
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
              additional_styles_input="h-[32px]"
              placeholder="search user..."
              onChange={e => handleSearch(e)}
            />
          </div>
          <Buttons
            path="/administrator/add"
            additional_styles="bg-primary h-[32px]">
            Add User
          </Buttons>
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
      <Toast message={Message} setmessage={setMessage}>
        {Message.message}
      </Toast>
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