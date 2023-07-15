import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import Input from '../components/Input';
import Container from '../components/container';
import TableComponent from '../components/table/table';

const Bibliography = ({setTitle}) => {
  const router = useRouter();
  const path_query =
    'Home' + router.pathname.replace(/\//g, ' > ').replace(/\_/g, ' ');
  let selectedTableData = [[]];

  const handleEditClick = workspace_name => {
    let final = workspace_name.toLocaleLowerCase().replace(/\s/g, '_');
    router.push(`/edit/${final}`);
  };

  const get_workspace_name = workspace_name => {
    let final = workspace_name.toLocaleLowerCase().replace(/\s/g, '_');
    return final;
  };

  useEffect(() => {
    setTitle('Bibliography');
  }, [setTitle])

  let table_data = [
    {
      No: 1,
      Name: 'Bibliography Report Final',
      KKS: 'Geodwipa Teknika Nusantara',
      'wilayah kerja': 'Jakarta',
      jenis: 'Bibliography',
      AFE: '4719274818',
      action: (
        <div className="flex flex-row gap-x-1 items-center">
          <Image
            src="/icons/magnify.svg"
            width={50}
            height={50}
            className="w-[25px] h-[15px] alt='' "
            alt="icon"
          />
          <Link
            title="Edit workspace"
            href={{
              pathname: `/edit/${get_workspace_name(
                'Bibliography Report Final',
              )}`,
              query: {
                form_type: 'bibliography',
              },
            }}
            className="">
            <Image
              src="/icons/pencil.svg"
              width={50}
              height={50}
              className="w-[25px] h-[15px] alt='' "
              alt="icon"
            />
          </Link>
          <Image
            src="/icons/delete.svg"
            width={50}
            height={50}
            className="w-[25px] h-[15px] alt='' "
            alt="icon"
          />
        </div>
      ),
    },
    {
      No: 2,
      Name: 'New Document',
      KKS: 'Geodwipa Teknika Nusantara',
      'wilayah kerja': 'Jakarta',
      jenis: 'Bibliography',
      AFE: '5920182732',
      action: (
        <div className="flex flex-row gap-x-1 items-center">
          <Image
            src="/icons/magnify.svg"
            width={50}
            height={50}
            className="w-[25px] h-[15px] alt='' "
            alt="icon"
          />
          <Link
            title="Edit workspace"
            href={{
              pathname: `/edit/${get_workspace_name('New Document')}`,
              query: {
                form_type: 'bibliography',
              },
            }}
            className="">
            <Image
              src="/icons/pencil.svg"
              width={50}
              height={50}
              className="w-[25px] h-[15px] alt='' "
              alt="icon"
            />
          </Link>
          <Image
            src="/icons/delete.svg"
            width={50}
            height={50}
            className="w-[25px] h-[15px] alt='' "
            alt="icon"
          />
        </div>
      ),
    },
  ];

  const [data, setData] = useState(table_data);
  const onSearch = e => {
    const name = e.target.value.toLocaleLowerCase();
    let temp = table_data;
    temp = temp.filter(item => {
      return item.Name.toLocaleLowerCase().includes(name);
    });
    console.log('search', temp);
    setData(temp);
  };

  return (
    <Container>
      <Container.Title>
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-sm font-normal capitalize">{path_query}</p>
            <p>Bibliography</p>
          </div>
          <div className="w-4/5 lg:w-2/5 relative">
            <Input
              label=""
              type="text"
              name="search"
              additional_styles_input="px-4 rounded-full text-base"
              additional_styles="flex flex-col items-center justify-center"
              onChange={e => onSearch(e)}
              autoComplete="off"
              placeholder="Search workspace name"
            />
            <Image
              src="/icons/magnify.svg"
              width="20"
              height="20"
              className="absolute top-1/2 right-3 -translate-y-1/2"
              alt="search"
            />
          </div>
        </div>
      </Container.Title>
      <TableComponent
        header={['No', 'Name', 'KKS', 'Working area', 'Type', 'AFE', 'Action']}
        content={data}
        setSelectedRows={selectedTableData}
        with_checkbox
      />
    </Container>
  );
};

export default Bibliography;
