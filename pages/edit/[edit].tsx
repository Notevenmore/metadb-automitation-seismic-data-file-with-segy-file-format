import {EditDocEditor} from '@components/Editor/edit';
import {EditTableDocEditor} from '@components/TableEditor/edit';

const DocEditor = ({workspace_name, setTitle, config}) => {
  // TODO: Change conditonal to read from environment variable
  const thing = true;

  if (thing) {
    return (
      <EditTableDocEditor
        workspace_name={workspace_name}
        setTitle={setTitle}
        config={config}
      />
    );
  } else {
    return (
      <EditDocEditor
        workspace_name={workspace_name}
        setTitle={setTitle}
        config={config}
      />
    );
  }
};

export function getServerSideProps(context) {
  const config = JSON.parse(process.env.ENDPOINTS);
  return {
    props: {
      workspace_name: context.params.edit,
      config: config,
    }, // will be passed to the page component as props
  };
}

export default DocEditor;
