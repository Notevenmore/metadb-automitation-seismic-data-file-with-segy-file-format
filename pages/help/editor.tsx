import {useEffect, useRef, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Input from '../../components/Input';
import Button from '../../components/button';
import data from '../../dummy-data/help_editor_data';
import CloseThin from '../../public/icons/close-thin.svg';
import ArrowUp from '../../public/icons/arrow-up.svg';
import LinkAlt from '../../public/icons/link-alt.svg';
import ImageIcon from '../../public/icons/image.svg';
import Link from '../../public/icons/Link.svg';
import List from '../../public/icons/List.svg';
import Code from '../../public/icons/code.svg';
import Terminal from '../../public/icons/terminal.svg';
import Enter from '../../public/icons/enter.svg';
import Quote from '../../public/icons/quote.svg';
import TextNumber from '../../public/icons/text-number.svg';
import TextSelect from '../../public/icons/text-select.svg';
import Check from '../../public/icons/check.svg';

const Description_norender = [data.data];

const Editor = () => {
  const [Title, setTitle] = useState(data.title);
  const [Warning, setWarning] = useState(true);
  const [Description, setDescription] = useState(data.data);
  const [Checked, setChecked] = useState(false);
  const body_editor = useRef<HTMLTextAreaElement>();

  const formatText = (type, element) => {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const value = element.value.substring(start, end);
    element.focus();
    if (type === 'bold') {
      document.execCommand('insertText', false, `**${value}**`);
      element.selectionStart = start + 2;
      element.selectionEnd = end + 2;
    } else if (type === 'italic') {
      document.execCommand('insertText', false, `*${value}*`);
      element.selectionStart = start + 1;
      element.selectionEnd = end + 1;
    } else if (type === 'underline') {
      document.execCommand('insertText', false, `<u>${value}</u>`);
      element.selectionStart = start + 3;
      element.selectionEnd = end + 3;
    } else if (type === 'strikethrough') {
      document.execCommand('insertText', false, `~~${value}~~`);
      element.selectionStart = start + 2;
      element.selectionEnd = end + 2;
    } else if (type === 'ordered_list') {
      document.execCommand(
        'insertText',
        false,
        start === 0 ? `1. ${value}` : `\n1. ${value}`,
      );
    } else if (type === 'unordered_list') {
      document.execCommand(
        'insertText',
        false,
        start === 0 ? `- ${value}` : `\n- ${value}`,
      );
    } else if (type === 'quote') {
      document.execCommand(
        'insertText',
        false,
        start === 0 ? `> ${value}` : `\n> ${value}`,
      );
    } else if (type === 'code') {
      document.execCommand('insertText', false, `\`${value}\``);
      element.selectionStart = start + 1;
      element.selectionEnd = end + 1;
    } else if (type === 'multi-code') {
      document.execCommand(
        'insertText',
        false,
        start === 0 ? `~~~\n${value}\n~~~\n` : `\n~~~\n${value}\n~~~\n`,
      );
      element.selectionStart = start + (start === 0 ? 4 : 5);
      element.selectionEnd = end + (start === 0 ? 4 : 5);
    } else if (type === 'break') {
      document.execCommand('insertText', false, `\n${value}`);
    } else if (type === 'link') {
      document.execCommand(
        'insertText',
        false,
        `${start === 0 ? '' : '\n'}[text](link)`,
      );
      element.selectionStart = start + (start === 0 ? 1 : 2);
      element.selectionEnd = end + (start === 0 ? 5 : 6);
    } else if (type === 'image_link') {
      document.execCommand(
        'insertText',
        false,
        `${start === 0 ? '' : '\n'}![name](link)`,
      );
      element.selectionStart = start + (start === 0 ? 2 : 3);
      element.selectionEnd = end + (start === 0 ? 6 : 7);
    } else if (type === 'image_upload') {
      let reader = new FileReader();
      let input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = _this => {
        let files = Array.from(input.files)[0];
        reader.onload = () => {
          document.execCommand(
            'insertText',
            false,
            `${start === 0 ? '' : '\n'}![${files.name}](${reader.result})`,
          );
          element.focus();
        };
        reader.readAsDataURL(files);
      };
      input.click();
    }
  };

  const handleKey = e => {
    // Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
      return;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertText', false, '\n');
      const end = e.target.value.lastIndexOf('\n', e.target.selectionEnd - 1);
      const start = e.target.value.lastIndexOf('\n', end - 1);
      const line = e.target.value.substring(start, end).trim();
      const list_exist = line.match(/^\d\.|^\-\s*/);
      if (list_exist) {
        if (list_exist[0].trim() === '-') {
          document.execCommand('insertText', false, '- ');
        } else {
          document.execCommand(
            'insertText',
            false,
            `${Number(list_exist[0]) + 1}. `,
          );
        }
      }
    }
    // Bold
    if (e.ctrlKey && e.key === 'b') {
      formatText('bold', e.target);
    }
    // Italic
    else if (e.ctrlKey && e.key === 'i') {
      formatText('italic', e.target);
    }
    // Underline
    else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u') {
      formatText('underline', e.target);
    }
    // Strikethrough
    else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
      formatText('strikethrough', e.target);
    }
  };

  useEffect(() => {
    if (Checked) {
      setDescription(Description_norender[0]);
    }
  }, [Checked]);

  return (
    <div className="h-fit p-6 space-y-4">
      {Warning && (
        <div className="w-full rounded-md bg-yellow-400 p-3 relative">
          <button
            title="Close warning"
            className="rounded-md absolute right-1 top-1 hover:bg-red-600 hover:text-white p-[2px] bg-white/[.3] cursor-pointer transition-all"
            onClick={e => {
              e.preventDefault();
              setWarning(!Warning);
            }}>
            <CloseThin className="w-5 h-5" />
          </button>
          <p>
            <strong>WARNING!</strong> <br />
            Due to a browser compability issue, it is recommended to avoid using
            Firefox as your browser, as it can tamper the CTRL+Z undo event on
            the text editor.
          </p>
        </div>
      )}
      <div className="flex space-x-2">
        <label className="flex items-center w-fit space-x-2 relative">
          <Check className="text-black absolute left-[10.5px] w-3.5 cursor-pointer"/>
          <input
            onChange={() => {
              setChecked(!Checked);
            }}
            checked={Checked}
            type="checkbox"
            className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-[5px] cursor-pointer checked:bg-blue-500 checked:border-blue-500 transition-all"
          />
          <div className="-space-y-1">
            <span className="select-none">Live update</span>
            <p className="text-red-400 text-sm select-none">
              Warning! May cause performance issues
            </p>
          </div>
        </label>
        <Button
          path="."
          onClick={e => {
            e.preventDefault();
            setDescription(Description_norender[0]);
          }}
          button_description="Update preview"
          additional_styles={`${Checked ? 'pointer-events-none' : ''}`}
          disabled={Checked ? true : false}
        />
      </div>
      <Input
        type="text"
        placeholder="Documentation title"
        additional_styles_input="placeholder:italic text-xl font-semibold p-3"
        value={Title}
        onChange={e => {
          setTitle(e.target.value);
        }}
      />
      <div className="h-full min-h-screen w-full grid grid-cols-2 space-x-2">
        {' '}
        <div className="border-2 rounded-md h-full overflow-clip flex flex-col">
          <div className="border-b bg-gray-200 flex px-2 h-fit sticky top-0">
            <div
              title="Header"
              className="p-2 font-bold h-full group relative hover:bg-gray-300 rounded-md transition-all border flex items-center">
              <TextSelect />
              <div className="absolute top-[45px] left-0 hidden group-hover:block text-center bg-white border-2 border-black/[.15] rounded-md overflow-clip w-fit">
                <Button
                  onClick={() => {
                    document.execCommand(
                      'insertText',
                      false,
                      `${
                        body_editor.current.selectionStart === 0 ? '' : '\n'
                      }# ${body_editor.current.value.substring(
                        body_editor.current.selectionStart,
                        body_editor.current.selectionEnd,
                      )}`,
                    );
                  }}
                  path=""
                  title="Header 1"
                  button_description="H1"
                  className="hover:bg-gray-100 transition-all w-[100px] py-2 text-3xl"
                />
                <Button
                  onClick={() => {
                    document.execCommand(
                      'insertText',
                      false,
                      `${
                        body_editor.current.selectionStart === 0 ? '' : '\n'
                      }## ${body_editor.current.value.substring(
                        body_editor.current.selectionStart,
                        body_editor.current.selectionEnd,
                      )}`,
                    );
                  }}
                  path=""
                  title="Header 2"
                  button_description="H2"
                  className="hover:bg-gray-100 transition-all w-[100px] py-2 text-2xl"
                />
                <Button
                  onClick={e => {
                    document.execCommand(
                      'insertText',
                      false,
                      `${
                        body_editor.current.selectionStart === 0 ? '' : '\n'
                      }### ${body_editor.current.value.substring(
                        body_editor.current.selectionStart,
                        body_editor.current.selectionEnd,
                      )}`,
                    );
                  }}
                  path=""
                  title="Header 3"
                  button_description="H3"
                  className="hover:bg-gray-100 transition-all w-[100px] py-2 text-xl"
                />
                <Button
                  onClick={() => {
                    document.execCommand(
                      'insertText',
                      false,
                      `${
                        body_editor.current.selectionStart === 0 ? '' : '\n'
                      }#### ${body_editor.current.value.substring(
                        body_editor.current.selectionStart,
                        body_editor.current.selectionEnd,
                      )}`,
                    );
                  }}
                  path=""
                  title="Header 4"
                  button_description="H4"
                  className="hover:bg-gray-100 transition-all w-[100px] py-2 text-lg"
                />
                <Button
                  onClick={() => {
                    document.execCommand(
                      'insertText',
                      false,
                      `${
                        body_editor.current.selectionStart === 0 ? '' : '\n'
                      }##### ${body_editor.current.value.substring(
                        body_editor.current.selectionStart,
                        body_editor.current.selectionEnd,
                      )}`,
                    );
                  }}
                  path=""
                  title="Header 5"
                  button_description="H5"
                  className="hover:bg-gray-100 transition-all w-[100px] py-2 text-md"
                />
                <Button
                  onClick={() => {
                    document.execCommand(
                      'insertText',
                      false,
                      `${
                        body_editor.current.selectionStart === 0 ? '' : '\n'
                      }###### ${body_editor.current.value.substring(
                        body_editor.current.selectionStart,
                        body_editor.current.selectionEnd,
                      )}`,
                    );
                  }}
                  path=""
                  title="Header 6"
                  button_description="H6"
                  className="hover:bg-gray-100 transition-all w-[100px] py-2 text-sm"
                />
              </div>
            </div>
            <Button
              onClick={() =>
                formatText('bold', document.getElementById('editor_body'))
              }
              path=""
              title="Bold (CTRL + B)"
              button_description="B"
              additional_styles="text-[20px] px-2.5 font-mono font-bold"
            />
            <Button
              onClick={() =>
                formatText('italic', document.getElementById('editor_body'))
              }
              path=""
              title="Italic (CTRL + I)"
              button_description="I"
              additional_styles="text-[20px] px-2.5 font-mono italic"
            />
            <Button
              onClick={() =>
                formatText('underline', document.getElementById('editor_body'))
              }
              path=""
              title="Underline (CTRL + Shift + U)"
              button_description="U"
              additional_styles="text-[20px] px-2.5 font-mono underline"
            />
            <Button
              onClick={() =>
                formatText(
                  'strikethrough',
                  document.getElementById('editor_body'),
                )
              }
              path=""
              title="Strikethrough (CTRL + Shift + S)"
              button_description="S"
              additional_styles="text-[20px] px-2.5 font-mono line-through"
            />
            <Button
              onClick={() =>
                formatText(
                  'ordered_list',
                  document.getElementById('editor_body'),
                )
              }
              path=""
              title="Ordered list"
              additional_styles="p-2 font-mono h-full">
              <TextNumber />
            </Button>
            <Button
              onClick={() =>
                formatText(
                  'unordered_list',
                  document.getElementById('editor_body'),
                )
              }
              path=""
              title="Unordered list"
              additional_styles="p-2 font-mono h-full">
              <List />
            </Button>
            <Button
              onClick={() =>
                formatText('quote', document.getElementById('editor_body'))
              }
              path=""
              title="Quote"
              additional_styles="p-2 font-mono h-full">
              <Quote />
            </Button>
            <Button
              onClick={() =>
                formatText('code', document.getElementById('editor_body'))
              }
              path=""
              title="Code"
              additional_styles="p-2 font-mono h-full">
              <Code className="w-6 h-6" />
            </Button>
            <Button
              onClick={() =>
                formatText('multi-code', document.getElementById('editor_body'))
              }
              path=""
              title="Multi-line code"
              additional_styles="p-2 font-mono h-full">
              <Terminal className="w-6 h-6" />
            </Button>
            <Button
              onClick={() =>
                formatText('break', document.getElementById('editor_body'))
              }
              path=""
              title="New line"
              additional_styles="p-2 font-mono h-full">
              <Enter />
            </Button>
            <Button
              onClick={() =>
                formatText('link', document.getElementById('editor_body'))
              }
              path=""
              title="Insert link"
              additional_styles="p-2 font-mono h-full">
              <Link />
            </Button>
            <div
              title="Insert image"
              className="p-2 h-full relative group rounded-md flex items-center hover:bg-gray-300 transition-all">
              <ImageIcon className="w-6 h-6" />
              <div className="absolute top-[45px] left-0 border-2 border-black/[.2] hidden group-hover:block bg-white rounded-md overflow-clip text-center w-max">
                <Button
                  onClick={e => {
                    e.preventDefault();
                    formatText('image_upload', body_editor.current);
                  }}
                  path=""
                  button_description="Upload"
                  className="w-[150px] text-center py-2 hover:bg-gray-100 transition-all flex space-x-2 items-center px-2">
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  onClick={e => {
                    e.preventDefault();
                    formatText('image_link', body_editor.current);
                  }}
                  path=""
                  button_description="Insert from link"
                  className="w-[150px] text-center py-2 hover:bg-gray-100 transition-all flex space-x-2 items-center px-2">
                  <LinkAlt className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="h-full">
            {' '}
            {Checked ? (
              <textarea
                ref={body_editor}
                id="editor_body"
                placeholder="Documentation body (markdown)"
                className="h-full w-full resize-none py-2 px-3 outline-none m-0 font-mono"
                value={Description}
                onChange={e => {
                  setDescription(e.target.value);
                  Description_norender[0] = e.target.value;
                }}
                onKeyDown={handleKey}
              />
            ) : (
              <textarea
                ref={body_editor}
                id="editor_body"
                placeholder="Documentation body (markdown)"
                className="h-full w-full resize-none py-2 px-3 outline-none m-0 font-mono"
                defaultValue={Description_norender[0]}
                onChange={e => {
                  Description_norender[0] = e.target.value;
                }}
                onKeyDown={handleKey}
              />
            )}
          </div>
        </div>
        <div className="border-2 rounded-md p-5 prose h-full break-words">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={nightOwl}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{background: 'none'}}
                    {...props}
                  >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >{Description}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Editor;
