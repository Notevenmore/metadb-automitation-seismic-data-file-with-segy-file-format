import Image from 'next/image';
import {useState} from 'react';
import Container from '../../components/container';
import Input from '../../components/input_form/input';
import TableComponent from '../../components/table/table';
import Draft from '../../dummy-data/draft';

export default function BasinPage() {
  let selectedTableData = [[]];

  const [data, setData] = useState(Draft.content);
  const onSearch = e => {
    const name = e.target.value.toLocaleLowerCase();
    let temp = Draft.content;
    temp = temp.filter(item => {
      return item.name.toLocaleLowerCase().includes(name);
    });
    console.log('search', temp);
    setData(temp);
  };

  return (
    <Container>
      <Container.Title>
        <div className="flex flex-row items-center justify-between">
          <div>Basin</div>
          <div className="w-[80%] lg:w-[40%] relative">
            <Input
              label=""
              type="text"
              name="search"
              additional_styles_input="h-[25px] !rounded-full text-[12px]"
              additional_styles="flex flex-col items-center justify-center"
              onChange={e => onSearch(e)}
            />
            <Image
              src="/icons/magnify.svg"
              width={20}
              height={20}
              className="absolute right-[10px] top-[2.5px]"
              alt="search"
            />
          </div>
        </div>
      </Container.Title>
      <TableComponent
        header={Draft.header}
        content={data}
        setSelectedRows={selectedTableData}
        with_checkbox
      />
    </Container>
  );
}
