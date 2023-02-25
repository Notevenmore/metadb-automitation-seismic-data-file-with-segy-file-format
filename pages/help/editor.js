import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import data from '../../dummy-data/help_editor_data';
import SyntaxHighlighter from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Input from "../../components/input_form/input"
import Button from '../../components/buttons/buttons'

const Editor = () => {
  const [Title, setTitle] = useState(data.title)
  const [Warning, setWarning] = useState(true)
  const [Description, setDescription] = useState(data.data)
  const [Description_norender, setDescription_norender] = useState([data.data])
  const [Checked, setChecked] = useState(false)
  const body_editor = useRef()

  const formatText = (type, element) => {
    const start = element.selectionStart
    const end = element.selectionEnd
    const value = element.value.substring(start, end)
    element.focus()
    if (type === 'bold') {
      document.execCommand("insertText", false, `**${value}**`);
      element.selectionStart = start + 2
      element.selectionEnd = end + 2
    }
    else if (type === 'italic') {
      document.execCommand("insertText", false, `*${value}*`);
      element.selectionStart = start + 1
      element.selectionEnd = end + 1
    }
    else if (type === 'underline') {
      document.execCommand("insertText", false, `<u>${value}</u>`);
      element.selectionStart = start + 3
      element.selectionEnd = end + 3
    }
    else if (type === 'strikethrough') {
      document.execCommand("insertText", false, `~~${value}~~`);
      element.selectionStart = start + 2
      element.selectionEnd = end + 2
    }
    else if (type === 'ordered_list') {
      document.execCommand("insertText", false, start === 0 ? `1. ${value}` : `\n1. ${value}`);
    }
    else if (type === 'unordered_list') {
      document.execCommand("insertText", false, start === 0 ? `- ${value}` : `\n- ${value}`);
    }
    else if (type === 'quote') {
      document.execCommand("insertText", false, start === 0 ? `> ${value}` : `\n> ${value}`);
    }
    else if (type === 'code') {
      document.execCommand("insertText", false, `\`${value}\``);
      element.selectionStart = start + 1
      element.selectionEnd = end + 1
    }
    else if (type === 'multi-code') {
      document.execCommand("insertText", false, start === 0 ? `~~~\n${value}\n~~~\n` : `\n~~~\n${value}\n~~~\n`);
      element.selectionStart = start + (start === 0 ? 4 : 5)
      element.selectionEnd = end + (start === 0 ? 4 : 5)
    }
    else if (type === 'break') {
      document.execCommand("insertText", false, `\n${value}`);
    }
    else if (type === 'link') {
      document.execCommand("insertText", false, `${start === 0 ? '' : '\n'}[text](link)`);
      element.selectionStart = start + (start === 0 ? 1 : 2)
      element.selectionEnd = end + (start === 0 ? 5 : 6)
    }
    else if (type === 'image_link') {
      document.execCommand("insertText", false, `${start === 0 ? '' : '\n'}![name](link)`);
      element.selectionStart = start + (start === 0 ? 2 : 3)
      element.selectionEnd = end + (start === 0 ? 6 : 7)
    }
    else if (type === 'image_upload') {
      let reader = new FileReader();
      let input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*'
      input.onchange = _this => {
        let files = Array.from(input.files)[0];
        reader.onload = () => {
          document.execCommand("insertText", false, `${start === 0 ? '' : '\n'}![${files.name}](${reader.result})`);
          element.focus()
        }
        reader.readAsDataURL(files)
      };
      input.click();
    }
  }

  const handleKey = (e) => {
    // Tab
    if (e.key === "Tab") {
      e.preventDefault()
      document.execCommand("insertText", false, '\t');
      return;
    }
    else if (e.key === "Enter") {
      e.preventDefault()
      document.execCommand("insertText", false, '\n');
      const end = e.target.value.lastIndexOf('\n', e.target.selectionEnd - 1)
      const start = e.target.value.lastIndexOf('\n', end - 1)
      const line = e.target.value.substring(start, end).trim()
      const list_exist = line.match(/^\d\.|^\-\s*/)
      if (list_exist) {
        if (list_exist[0].trim() === '-') {
          document.execCommand("insertText", false, '- ')
        } else {
          document.execCommand("insertText", false, `${Number(list_exist[0]) + 1}. `);
        }
      }
    }
    // Bold
    if (e.ctrlKey && e.key === 'b') {
      formatText('bold', e.target)
    }
    // Italic
    else if (e.ctrlKey && e.key === 'i') {
      formatText('italic', e.target)
    }
    // Underline
    else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u') {
      formatText('underline', e.target)
    }
    // Strikethrough
    else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
      formatText('strikethrough', e.target)
    }
  }

  useEffect(() => {
    if (Checked) {
      setDescription(Description_norender[0])
    }
  }, [Checked])


  return (
    <div className='h-fit p-6 space-y-4'>
      {Warning ?
        <div className='w-full rounded-md bg-yellow-400 p-3 relative'>
          <button title='Close warning' className='rounded-md absolute right-1 top-1 hover:bg-red-600 hover:text-white p-[2px] bg-white/[.3] cursor-pointer transition-all' onClick={(e) => { e.preventDefault(); setWarning(!Warning) }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p>
            <strong>WARNING!</strong> <br />
            Due to a browser compability issue, it is recommended to avoid using Firefox as your browser, as it can tamper the CTRL+Z undo event on the text editor.
          </p>
        </div>
        :
        null
      }
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
        {/* <Button path='.' onClick={(e) => { e.preventDefault(); console.log([document.getElementsByClassName("editor_body")[0].value]) }} button_description='Print text to console' /> */}
      </div>
      <Input type='text' placeholder='Documentation title' additional_styles_input='placeholder:italic text-xl font-semibold p-3' value={Title} onChange={(e) => { setTitle(e.target.value) }} />
      <div className='h-full min-h-screen w-full grid grid-cols-2 space-x-2'> {/*grid grid-cols-2 */}
        <div className='border-2 rounded-md h-full overflow-clip flex flex-col'>
          <div className='border-b bg-gray-200 flex px-2 h-fit'>
            <div title='Header' className='p-2 font-bold h-full group relative hover:bg-gray-300 rounded-md transition-all border flex items-center' >
              <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-textarea-t" viewBox="0 0 16 16"> <path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874V2.5zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v3.563zM2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" /> <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386L11.434 4z" /> </svg>
              <div className='absolute top-[45px] left-0 hidden group-hover:block text-center bg-white border-2 border-black/[.15] rounded-md overflow-clip w-fit'>
                <Button onClick={(e) => { document.execCommand("insertText", false, `${body_editor.current.selectionStart === 0 ? '' : '\n'}# ${body_editor.current.value.substring(body_editor.current.selectionStart, body_editor.current.selectionEnd)}`) }} path='' title='Header 1' button_description='H1' className='hover:bg-gray-100 transition-all w-[100px] py-2 text-3xl' ></Button>
                <Button onClick={(e) => { document.execCommand("insertText", false, `${body_editor.current.selectionStart === 0 ? '' : '\n'}## ${body_editor.current.value.substring(body_editor.current.selectionStart, body_editor.current.selectionEnd)}`) }} path='' title='Header 2' button_description='H2' className='hover:bg-gray-100 transition-all w-[100px] py-2 text-2xl' ></Button>
                <Button onClick={(e) => { document.execCommand("insertText", false, `${body_editor.current.selectionStart === 0 ? '' : '\n'}### ${body_editor.current.value.substring(body_editor.current.selectionStart, body_editor.current.selectionEnd)}`) }} path='' title='Header 3' button_description='H3' className='hover:bg-gray-100 transition-all w-[100px] py-2 text-xl' ></Button>
                <Button onClick={(e) => { document.execCommand("insertText", false, `${body_editor.current.selectionStart === 0 ? '' : '\n'}#### ${body_editor.current.value.substring(body_editor.current.selectionStart, body_editor.current.selectionEnd)}`) }} path='' title='Header 4' button_description='H4' className='hover:bg-gray-100 transition-all w-[100px] py-2 text-lg' ></Button>
                <Button onClick={(e) => { document.execCommand("insertText", false, `${body_editor.current.selectionStart === 0 ? '' : '\n'}##### ${body_editor.current.value.substring(body_editor.current.selectionStart, body_editor.current.selectionEnd)}`) }} path='' title='Header 5' button_description='H5' className='hover:bg-gray-100 transition-all w-[100px] py-2 text-md' ></Button>
                <Button onClick={(e) => { document.execCommand("insertText", false, `${body_editor.current.selectionStart === 0 ? '' : '\n'}###### ${body_editor.current.value.substring(body_editor.current.selectionStart, body_editor.current.selectionEnd)}`) }} path='' title='Header 6' button_description='H6' className='hover:bg-gray-100 transition-all w-[100px] py-2 text-sm' ></Button>
              </div>
            </div>
            <Button onClick={() => { formatText('bold', document.getElementById("editor_body")) }} path='' title='Bold (CTRL + B)' button_description='B' additional_styles='text-[20px] px-2.5 font-mono font-bold' />
            <Button onClick={() => { formatText('italic', document.getElementById("editor_body")) }} path='' title='Italic (CTRL + I)' button_description='I' additional_styles='text-[20px] px-2.5 font-mono italic' />
            <Button onClick={() => { formatText('underline', document.getElementById("editor_body")) }} path='' title='Underline (CTRL + Shift + U)' button_description='U' additional_styles='text-[20px] px-2.5 font-mono underline' />
            <Button onClick={() => { formatText('strikethrough', document.getElementById("editor_body")) }} path='' title='Strikethrough (CTRL + Shift + S)' button_description='S' additional_styles='text-[20px] px-2.5 font-mono line-through' />
            <Button onClick={() => { formatText('ordered_list', document.getElementById("editor_body")) }} path='' title='Ordered list' additional_styles='p-2 font-mono h-full' >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-123" viewBox="0 0 16 16"> <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75v.96Z" /> </svg>
            </Button>
            <Button onClick={() => { formatText('unordered_list', document.getElementById("editor_body")) }} path='' title='Unordered list' additional_styles='p-2 font-mono h-full' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </Button>
            <Button onClick={() => { formatText('quote', document.getElementById("editor_body")) }} path='' title='Quote' additional_styles='p-2 font-mono h-full' >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-quote" viewBox="0 0 16 16"> <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z" /> </svg>
            </Button>
            <Button onClick={() => { formatText('code', document.getElementById("editor_body")) }} path='' title='Code' additional_styles='p-2 font-mono h-full' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </Button>
            <Button onClick={() => { formatText('multi-code', document.getElementById("editor_body")) }} path='' title='Multi-line code' additional_styles='p-2 font-mono h-full' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </Button>
            <Button onClick={() => { formatText('break', document.getElementById("editor_body")) }} path='' title='New line' additional_styles='p-2 font-mono h-full' >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 6V12H7.83L10.41 9.41L9 8L4 13L9 18L10.41 16.59L7.83 14H20V6H18Z" fill="black" /> </svg>
            </Button>
            <Button onClick={() => { formatText('link', document.getElementById("editor_body")) }} path='' title='Insert link' additional_styles='p-2 font-mono h-full' >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16"> <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" /> <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" /> </svg>
            </Button>
            <div path='' title='Insert image' className='p-2 h-full relative group rounded-md flex items-center hover:bg-gray-300 transition-all' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <div className='absolute top-[45px] left-0 border-2 border-black/[.2] hidden group-hover:block bg-white rounded-md overflow-clip text-center w-max'>
                <Button onClick={(e) => { e.preventDefault(); formatText('image_upload', body_editor.current) }} path='' button_description='Upload' className='w-[150px] text-center py-2 hover:bg-gray-100 transition-all flex space-x-2 items-center px-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </Button>
                <Button onClick={(e) => { e.preventDefault(); formatText('image_link', body_editor.current) }} path='' button_description='Insert from link' className='w-[150px] text-center py-2 hover:bg-gray-100 transition-all flex space-x-2 items-center px-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div className='h-screen'> {/* h-full */}
            {Checked ?
              <textarea
                ref={body_editor}
                id='editor_body'
                placeholder='Documentation body (markdown)'
                className='h-full w-full resize-none py-2 px-3 outline-none m-0 font-mono'
                value={Description}
                onChange={(e) => { setDescription(e.target.value); Description_norender[0] = e.target.value }}
                onKeyDown={handleKey}
              />
              :
              <textarea
                ref={body_editor}
                id='editor_body'
                placeholder='Documentation body (markdown)'
                className='h-full w-full resize-none py-2 px-3 outline-none m-0 font-mono'
                defaultValue={Description_norender[0]}
                onChange={(e) => { Description_norender[0] = e.target.value }}
                onKeyDown={handleKey}
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