import Markdown from '@components/markdown';
import {getLayoutTop} from '../../layout/getLayout';
import fetchPublic from '@utils/fetchPublic';
import {useEffect, useState} from 'react'

HelpPage.getLayout = getLayoutTop;

export default function HelpPage() {
  const [fileContent, setFileContent] = useState('');

  const getText = () => {
    fetchPublic('/helpDraft.md').then((res) => {
      setFileContent(res);
    });
  }

  useEffect(() => {
    getText();
  }, []);

  return <Markdown text={fileContent} />;
}
