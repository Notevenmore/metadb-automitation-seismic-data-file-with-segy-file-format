import helpDraft from '../../dummy-data/markdown/help-draft';
import Markdown from '@components/markdown';

export default function HelpPage() {
  return (
    <Markdown text={helpDraft} />
  );
}
