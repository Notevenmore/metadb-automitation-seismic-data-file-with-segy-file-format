import Markdown from '@components/markdown';
import fetchPublic from '@utils/fetchPublic';
import {useEffect, useState} from 'react'

export default function HelpPage() {
  const [fileContent, setFileContent] = useState('');

  const getText = () => {
    fetchPublic('/helpDraft.md').then((res) => {
      setFileContent(res)
    });
  }

  useEffect(() => {
    getText()
  }, []);

  return <Markdown text={fileContent} />;
}
