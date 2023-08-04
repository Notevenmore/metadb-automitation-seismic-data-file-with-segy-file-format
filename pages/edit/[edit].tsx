import {EditDocEditor} from '@components/Editor/edit';
import {EditTableDocEditor} from '@components/TableEditor/edit';

const DocEditor = ({workspace_name, setTitle, config, use_editorjs}) => {
  // TODO: Change conditonal to read from environment variable
  const thing = true;

  if (use_editorjs) {
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
  const use_editorjs = process.env.MISC_SHEETS !== "GOOGLE_SHEETS_EDITOR"
  return {
    props: {
      workspace_name: context.params.edit,
      config: config,
      use_editorjs
    }, // will be passed to the page component as props
  };
}

export default DocEditor;
