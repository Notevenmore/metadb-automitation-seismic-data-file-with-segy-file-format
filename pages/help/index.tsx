import Markdown from '@components/markdown';
import fetchPublic from '@utils/fetchPublic';
import {useState} from 'react'

export default function HelpPage() {
  const [fileContent, setFileContent] = useState('');

  const getText = async () => {
    const res = await fetchPublic('/markdown/userHelp.md')
    setFileContent(res)
  }

  getText()

  return <Markdown text={fileContent} />;
}
