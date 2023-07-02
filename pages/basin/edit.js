import {useState} from 'react';
import Button from '../../components/button';
import Container from '../../components/container/container.js';
import Input from '../../components/input_form/input';
import {
  HeaderTable,
  HeaderDivider,
  HeaderStatic,
  HeaderInput,
  ButtonsSection,
} from '../../components/header_table/header_table';

export default function BasinEditPage() {
  const [detail, setDetail] = useState('');

  return (
    <Container
      additional_class="full-height relative"
      onDragEnter={e => handleDrag(e)}>
      <Container.Title back>Edit file</Container.Title>
      <div className="flex flex-wrap lg:items-center -mt-5 mb-3 lg:mb-[22px] gap-x-2">
        <p className="font-semibold min-w-[130px] mb-3">Currently editing:</p>
        <Input
          type="text"
          name="fileName"
          placeholder="2008-Laporan Akhir Pembuatan Portofolio Eksplorasi Hidrokarbon di KKKS Indonesia"
          additional_styles="lg:w-full w-[90%]"
          additional_styles_input="font-semibold w-full"
          onChange={e => setDetail(e.target.name)}
        />
      </div>
      <HeaderTable>
        <HeaderStatic
          label1={'Nama KKKS'}
          label2={'(KKKS Name)'}
          content={'Geodwipa Teknika Nusantara'}
        />
        <HeaderDivider />
        <HeaderInput label1={'Nama wilayah kerja'} label2={'(Working Area)'}>
          <Input
            type="text"
            name={'workingArea'}
            placeholder={'Pulau Geodwipa'}
            required={true}
            additional_styles="w-full"
            onChange={e => setDetail(e.target.name)}
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput
          label1={'Jenis penyerahan data'}
          label2={'(Submission Type)'}>
          <Input
            type="dropdown"
            name={'submissionType'}
            placeholder={'Quarterly'}
            dropdown_items={['a', 'b', 'c']}
            required={true}
            additional_styles="w-full"
            onChange={e => setDetail(e.target.name)}
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput label1={'Nomor AFE'} label2={'(AFE Number)'}>
          <Input
            type="text"
            name={'AFE_Number'}
            placeholder={'01'}
            required={true}
            additional_styles="w-full"
            onChange={e => setDetail(e.target.name)}
          />
        </HeaderInput>
      </HeaderTable>
      <ButtonsSection className={'max-lg:mt-5'}>
        <Button path="" additional_styles="bg-primary">
          Save changes
        </Button>
        <Button path="" additional_styles="bg-primary">
          Save and exit
        </Button>
        <Button path="" additional_styles="text-error">
          Cancel
        </Button>
        <Button path="" additional_styles="text-error">
          Delete file
        </Button>
      </ButtonsSection>
    </Container>
  );
}
