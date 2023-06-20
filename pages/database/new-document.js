import {useEffect, useRef, useState} from 'react';
import Buttons from '../../components/buttons/buttons';
import Container from '../../components/container/container.js';
import Input from '../../components/input_form/input';
import HeaderTable, {
  HeaderDivider,
  HeaderStatic,
  HeaderInput,
  ButtonsSection,
} from '../../components/header_table/header_table';

export default function NewDocumentPageDatabase() {
  const [detail, setDetail] = useState('bbb');
  return (
    <Container
      additional_class="full-height relative"
      onDragEnter={e => handleDrag(e)}
    >
      <Container.Title>New document</Container.Title>
      <Input
        label="Name"
        label_loc="above"
        type="text"
        name={'documentName'}
        placeholder={'Lorem ipsum laporan 2008'}
        additional_styles={'-mt-[20px] mb-[20px]'}
        additional_styles_label={'font-bold mb-3 text-[16px]'}
        additional_styles_input={'font-bold text-[36px]'}
      />
      <HeaderTable>
        <HeaderStatic
          label1={'Nama KKKS'}
          label2={'(KKKS Name)'}
          content="Geodwipa Teknika Nusantara"
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
          label2={'(Submission Type)'}
        >
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
        <HeaderDivider />
        <HeaderInput label1={'Data type'}>
          <Input
            type="dropdown"
            name={'dataType'}
            placeholder={'Seismic data'}
            dropdown_items={['a', 'b', 'c']}
            required={true}
            additional_styles="w-full"
            additional_styles_input="font-semibold"
            onChange={e => setDetail(e.target.name)}
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput label1={'Data classification'}>
          <Input
            type="dropdown"
            name={'dataClassification'}
            placeholder={'3D'}
            dropdown_items={['a', 'b', 'c']}
            required={true}
            additional_styles="w-full"
            additional_styles_input="font-semibold"
            onChange={e => setDetail(e.target.name)}
          />
        </HeaderInput>
        <HeaderDivider />
        <HeaderInput label1={'Data sub-classification'}>
          <Input
            type="dropdown"
            name={'dataSubClassification'}
            placeholder={'Stored in media'}
            dropdown_items={['a', 'b', 'c']}
            required={true}
            additional_styles="w-full"
            additional_styles_input="font-semibold"
            onChange={e => setDetail(e.target.name)}
          />
        </HeaderInput>
      </HeaderTable>
      <ButtonsSection>
        <Buttons path="" additional_styles="bg-primary">
          Save changes
        </Buttons>
        <Buttons path="" additional_styles="bg-primary">
          Save and exit
        </Buttons>
        <Buttons path="" additional_styles="text-error">
          Cancel
        </Buttons>
      </ButtonsSection>
    </Container>
  );
}
