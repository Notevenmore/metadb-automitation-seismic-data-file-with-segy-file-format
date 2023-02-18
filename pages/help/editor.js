import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import data from '../../dummy-data/help_editor_data';
import SyntaxHighlighter from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Input from "../../components/input_form/input"
import Table from '../../components/table/table'
import Button from '../../components/buttons/buttons'
import { useMeasure } from 'react-use';

const Editor = () => {
  const [Title, setTitle] = useState(data.title)
  const [Description, setDescription] = useState(data.data)
  const [Description_norender, setDescription_norender] = useState([data.data])
  const [Checked, setChecked] = useState(false)
  const [ref_parent, height_parent] = useMeasure(false)
  const [ref_sibling, height_sibling] = useMeasure(false)

  const printSelection = (e) => {
    e.preventDefault()
    const editor_body = document.getElementsByClassName('editor_body')
    console.log(editor_body.selectionStart)
    console.log(editor_body.selectionEnd)
    const selection_start = editor_body.value
  }

  useEffect(() => {
    if (Checked) {
      setDescription(Description_norender[0])
    }
    console.log(height_parent)
    console.log(height_sibling)
  }, [Checked])


  return (
    <div className='h-fit p-6 space-y-4'>
      <div className='flex space-x-2'>
        <label className='flex items-center w-fit space-x-2 relative'>
          <svg aria-hidden="true" viewBox="0 0 15 11" fill="none" className='text-black absolute left-[10.5px] w-3.5 cursor-pointer'>
            <path d="M1 4.5L5 9L14 1" strokeWidth="2" stroke="#fff" />
          </svg>
          <input onChange={(e) => { setChecked(!Checked) }} checked={Checked} type='checkbox' className='appearance-none w-5 h-5 border-2 border-gray-400 rounded-[5px] cursor-pointer checked:bg-blue-500 checked:border-blue-500 transition-all' />
          <div className='-space-y-1'>
            <span className='select-none'>Live update</span>
            <p className='text-red-400 text-sm select-none'>Warning! May cause performance issues</p>
          </div>
        </label>
        <Button path='.' onClick={(e) => { e.preventDefault(); setDescription(Description_norender[0]) }} button_description='Update preview' additional_styles={`${Checked ? "pointer-events-none" : ""}`} disabled={Checked ? true : false} />
      </div>
      <Input type='text' placeholder='Documentation title' additional_styles_input='placeholder:italic text-xl font-semibold p-3' value={Title} onChange={(e) => { setTitle(e.target.value) }} />
      <div className='h-full min-h-screen w-full grid grid-cols-2 space-x-2'>
        <div ref={ref_parent} id='editor_body_parent' className='border-2 rounded-md h-full overflow-clip flex flex-col'>
          <div ref={ref_sibling} className='border-b bg-gray-200 flex px-2 space-x-1 h-fit'>
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Bold (CTRL + ALT + B)' button_description='B' additional_styles='p-2 font-mono font-bold' />
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Italic (CTRL + ALT + I)' button_description='I' additional_styles='p-2 font-mono italic' />
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Underline (CTRL + ALT + U)' button_description='U' additional_styles='p-2 font-mono underline' />
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Strikethrough (CTRL + ALT + S)' button_description='S' additional_styles='p-2 font-mono line-through' />
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Ordered list' button_description='Ordered list' additional_styles='p-2 font-mono' />
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Unordered list' button_description='Unordered list' additional_styles='p-2 font-mono' />
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Quote' button_description='Code' additional_styles='p-2 font-mono' />
            <Button onClick={(e) => {e.preventDefault()}} path='' title='Quote' button_description='Multi-line code' additional_styles='p-2 font-mono' />
          </div>
          <div className='h-full'>
            {Checked ?
              <textarea
                placeholder='Documentation body (markdown)'
                className='editor_body h-full w-full resize-none py-2 px-3 outline-none m-0 font-mono'
                value={Description}
                onChange={(e) => { setDescription(e.target.value); Description_norender[0] = e.target.value }}
              // onSelect={(e) => { console.log(e.target.selectionStart, e.target.selectionEnd) }}
              />
              :
              <textarea
                placeholder='Documentation body (markdown)'
                className='editor_body h-full w-full resize-none py-2 px-3 outline-none m-0 font-mono'
                defaultValue={Description_norender[0]}
                onChange={(e) => { Description_norender[0] = e.target.value }}
              // onSelect={(e) => { console.log(e.target.selectionStart, e.target.selectionEnd) }}
              />
            }
          </div>
        </div>
        <div className='border-2 rounded-md p-5 prose h-full break-words'>
          <ReactMarkdown
            children={Description}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
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