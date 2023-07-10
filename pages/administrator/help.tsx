import Markdown from '@components/markdown';
import {getLayoutTop} from '../../layout/getLayout';
import fetchPublic from '@utils/fetchPublic';
import {useState} from 'react'

HelpPage.getLayout = getLayoutTop;

export default function HelpPage() {
  const [fileContent, setFileContent] = useState('');

  const getText = async () => {
    const res = await fetchPublic('/helpDraft.md')
    setFileContent(res)
  }

  getText()

  return <Markdown text={fileContent} />;
}
