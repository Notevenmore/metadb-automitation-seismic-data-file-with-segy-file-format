import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';
import helpDraft from '../../dummy-data/markdown/help-draft';
// import helpdraft from '../../public/help-draft.md';

export default function HelpPage() {
  return (
    <div className=' p-5 prose h-full break-words'>
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        // children={helpDraft}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                // eslint-disable-next-line react/no-children-prop
                children={String(children).replace(/\n$/, '')}
                style={nightOwl}
                language={match[1]}
                PreTag="div"
                customStyle={{background: 'none'}}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}>
        {helpDraft}
      </ReactMarkdown>
    </div>
  );
}
