import EditNewDocumentPage from '@components/TableEditor/new_document';
import TableNewDocumentPage from '@components/Editor/new_document';

export default function NewDocumentPage({setTitle, config, use_editorjs}) {
  if (use_editorjs) {
    return <TableNewDocumentPage setTitle={setTitle} />;
  } else {
    return <EditNewDocumentPage setTitle={setTitle} config={config} />;
  }
}

export function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  const use_editorjs = process.env.MISC_SHEETS !== 'GOOGLE_SHEETS_EDITOR';
  return {
    props: {config: config, use_editorjs}, // will be passed to the page component as props
  };
}
