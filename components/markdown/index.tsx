import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';

export default function Markdown({text}: {text: string}) {
  return (
    <div className=" p-5 prose h-full break-words">
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
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
        {text}
      </ReactMarkdown>
    </div>
  );
}
