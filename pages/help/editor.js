import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import data from './data';
import SyntaxHighlighter from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';
import rehypeRaw from 'rehype-raw';

const Editor = () => {
  const [Input, setInput] = useState(data.data)

  return (
    <div className='h-fit p-3'>
      <div className='h-full w-full grid grid-cols-2 space-x-2'>
        <div className='border-2 rounded-md overflow-hidden'>
          <textarea className='h-full w-full resize-none py-2 px-3 outline-none font-mono' value={Input} onChange={(e) => { setInput(e.target.value) }} />
        </div>
        <div className='border-2 rounded-md p-5 prose'>
          <ReactMarkdown
            children={Input}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={nightOwl}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ "background": "none" }}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Editor