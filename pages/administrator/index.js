import {getLayoutTop} from '../../layout/getLayout';
import Container from '../../components/container/container';
import {useEffect} from 'react';
import {getProfiles, removeProfile} from '../../services/admin';
import {useState} from 'react';
import Link from 'next/link';
import Input from '../../components/input_form/input';
import Buttons from '../../components/buttons/buttons';
import {useSelector} from 'react-redux';
import Image from 'next/image';

AdministratorPage.getLayout = getLayoutTop;

export default function AdministratorPage() {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(list);
  const user = useSelector(state => state.user.user);

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
    await removeProfile(userId).then(() => handleProfiles());
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
