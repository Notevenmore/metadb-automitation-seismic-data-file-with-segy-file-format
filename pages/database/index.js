import Button from '../../components/button';
import Container from '../../components/container';
import Input from '../../components/Input';

export default function Database() {
  const additional_styles_label = 'w-[20%]';

  return (
    <Container>
      <Container.Title back>Connect with database</Container.Title>
      <form
        className="flex flex-col items-center justify-center h-full w-full gap-y-3"
        onSubmit={() => console.log('submit')}>
        <div className="w-full text-xs lg:w-[710px] lg:text-base flex flex-col gap-y-3">
          <Input
            label="Connection method"
            label_loc="beside"
            type="string"
            name={'connectionMethod'}
            placeholder={'Connection method'}
            required={true}
            additional_styles_label={additional_styles_label}
          />
          <div className="flex flex-row gap-x-3">
            <Input
              label="Hostname"
              label_loc="beside"
              type="string"
              name={'hostname'}
              placeholder={'Hostname'}
              required={true}
              additional_styles="flex-1"
              additional_styles_label="w-[53%]"
            />
            <Input
              label="Port"
              label_loc="beside"
              type="number"
              name={'port'}
              placeholder={'Port'}
              required={true}
              additional_styles="flex-1"
              additional_styles_label="w-[20%] text-center"
            />
          </div>
          <Input
            label="Username"
            label_loc="beside"
            type="text"
            name={'username'}
            placeholder={'Username'}
            required={true}
            additional_styles_label={additional_styles_label}
          />
          <Input
            label="Password"
            label_loc="beside"
            type="password"
            name={'username'}
            placeholder={'Password'}
            required={true}
            additional_styles_label={additional_styles_label}
          />
          <Input
            label="Default Schema"
            label_loc="beside"
            type="text"
            name={'defaultSchema'}
            placeholder={'Default Schema'}
            required={true}
            additional_styles_label={additional_styles_label}
          />

          <Input
            label="SSL Key File"
            label_loc="beside"
            type="text"
            name={'SSL_key_file'}
            placeholder={'SSL Key File'}
            additional_styles="mt-6"
            additional_styles_label={additional_styles_label}
          />
          <Input
            label="SSL CERT File"
            label_loc="beside"
            type="text"
            name={'SSL_CERT_file'}
            placeholder={'SSL CERT File'}
            additional_styles_label={additional_styles_label}
          />
          <Input
            label="SSL CA File"
            label_loc="beside"
            type="text"
            name={'SSL_CA_file'}
            placeholder={'SSL CA File'}
            additional_styles_label={additional_styles_label}
          />
          <Input
            label="SSL Cipher"
            label_loc="beside"
            type="text"
            name={'SSL Cipher'}
            placeholder={'SSL Cipher'}
            additional_styles_label={additional_styles_label}
          />
        </div>
        <div className="flex flex-row gap-x-3 items-center justify-center">
          <Button
            path="/database/select-table"
            button_description="Connect"
            additional_styles="bg-primary"
            type="submit"
            onClick={e => console.log(e)}
          />
          <Button path="" button_description="Cancel" />
        </div>
      </form>
    </Container>
  );
}
