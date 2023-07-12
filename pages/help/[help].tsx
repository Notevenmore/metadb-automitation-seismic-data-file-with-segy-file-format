import Image from 'next/image';
import Button from '../../components/button';
import Container from '../../components/container';
import Input from '../../components/Input';
import Sheets from '../../components/sheets/sheets';
import TableComponent from '../../components/table/table';

const Documentation = props => {
  // for now it is just testing grounds
  return (
    <Container additional_class={'space-y-3'}>
      <Container.Title back>{props.title}</Container.Title>
      <div>
        Content goes here: <br />
        {props.content}
      </div>
      <p className="font-bold">Testing playground (for now):</p>
      <Input type="text" />
      <TableComponent
        header={[
          <div key={1212} className="flex justify-between items-center">
            <p>
              Hello this is table with button on the right side (for reviewing
              document)
            </p>
            <div className="flex space-x-2">
              <Button
                path={props.path}
                button_description="Show preview below"
                additional_styles="bg-gray-100"
              />
              <Button
                path={props.path}
                button_description="Show preview beside"
                additional_styles="bg-gray-100"
              />
            </div>
          </div>,
        ]}
        content={[
          ['this table content'],
          ['this table content'],
          ['this table content'],
          [
            <div key={2323}>
              <p>this table content with img</p>
              <Image
                alt=""
                src="https://m.media-amazon.com/images/I/61YtCpbZ0SL.jpg"
                className="w-56"
              />
            </div>,
          ],
        ]}
      />
      <Input
        type="text"
        defaultValue="hello"
        additional_styles="overflow-visible"
      />
      <div className="h-[750px] border-2 rounded-md overflow-hidden">
        {/* <Sheets type="new" form_type="basin" /> */}
      </div>
      <div className="h-[750px] border-2 rounded-md overflow-hidden">
        {/* <Sheets type="new" form_type="well_summary" /> */}
      </div>
    </Container>
  );
};

export function getServerSideProps(context) {
  // get data from server
  console.log('id to be get from db: ' + context.params.help);
  // set the title and content to the one fetched from db
  return {
    props: {
      title: 'Hello this is help page',
      content: 'markdown markdown markdown hello',
      path: context.params.help,
    },
  };
}

export default Documentation;
