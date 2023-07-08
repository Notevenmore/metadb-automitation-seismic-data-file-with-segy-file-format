import helpDraft from '../../dummy-data/markdown/help-draft';
import Markdown from '@components/markdown';
import {getLayoutTop} from '../../layout/getLayout';

HelpPage.getLayout = getLayoutTop;

export default function HelpPage() {
  return <Markdown text={helpDraft} />;
}
