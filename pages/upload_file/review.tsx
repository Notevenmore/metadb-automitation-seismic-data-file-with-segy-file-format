import EditUploadFileReview from '@components/Editor/review';
import TableUploadFileReview from '@components/TableEditor/review';

export default function UploadFileReview({setTitle, config, use_editorjs}) {
  if (use_editorjs) {
    return <TableUploadFileReview setTitle={setTitle} config={config} />;
  } else {
    return <EditUploadFileReview setTitle={setTitle} config={config} />;
  }
}

export function getServerSideProps() {
  const config = JSON.parse(process.env.ENDPOINTS);
  const use_editorjs = process.env.MISC_SHEETS !== 'GOOGLE_SHEETS_EDITOR';

  return {
    props: {config: config, use_editorjs}, // will be passed to the page component as props
  };
}
