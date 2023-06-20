import hljs from 'highlight.js';
import {useEffect} from 'react';
import Highlight from 'react-highlight';
import PopupDialog from '../../components/popup_dialog/popup_dialog';
import {Divider} from '../../components/float_dialog/float_dialog';

export default function PopupDialogPage() {
  useEffect(() => {
    hljs.highlightAll();
  }, []);
  return (
    <section className="flex flex-col w-full h-fit text-[14.5px] px-10 py-5">
      <HeaderSection></HeaderSection>
      <MainSection></MainSection>
    </section>
  );
}

const HeaderSection = () => {
  return (
    <header className="mb-[2em]">
      <h1 className="text-4xl font-bold">Popup Dialog Component</h1>
      <Divider additional_styles={'my-[20px] border-[1px]'} />
      <p className="mb-[10px]">
        The{' '}
        <code>
          <strong>PopupDialog</strong>
        </code>{' '}
        component consists of the following props, with no required props:
      </p>
      <ul className="mb-[10px] list-disc px-10">
        <li className="pt-1">
          title: <code>string</code>
        </li>
        <li className="pt-1">
          content: <code>{'<ReactComponent> to string'}</code>
        </li>
        <li className="pt-1">
          button_desc1: <code>string</code>
        </li>
        <li className="pt-1">
          button_desc2: <code>string</code>
        </li>
        <li className="pt-1">
          button_desc3: <code>string</code>
        </li>
      </ul>
      <p>
        Below is the example implementation of the
        <code>
          <strong> PopupDialog</strong>
        </code>{' '}
        component.
      </p>
    </header>
  );
};

const MainSection = () => {
  return (
    <main className="flex flex-col gap-y-8">
      <Example1></Example1>
      <Example2></Example2>
      <Example3></Example3>
    </main>
  );
};

const Example = props => {
  return (
    <section className="flex flex-col gap-y-[20px] mb-[20px]">
      {props.children}
    </section>
  );
};

const ExampleTitle = ({children}) => {
  return (
    <h3 className="text-xl font-bold w-fit decoration-float_section_divider underline underline-5 underline-offset-[10px] mb-[30px]">
      <>{children}</>
    </h3>
  );
};

const CodeSnippet = ({children}) => {
  return (
    <>
      <h2 className="font-bold">Here is the code snippet:</h2>
      <Highlight
        className="html rounded-md
        border-solid border-neutral-300 border-1
        break-words w-fit mb-[20px] shadow shadow-slate-400"
      >
        <>{children}</>
      </Highlight>
    </>
  );
};

const Example1 = () => {
  return (
    <section>
      <ExampleTitle>
        Example 1: Popup dialog in the center of the screen
      </ExampleTitle>
      <CodeSnippet>
        {`<div className="flex justify-center items-center
border-[2px] border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`}
      </CodeSnippet>
      <div
        className="flex justify-center items-center
       border-[2px] border-solid border-black h-[490px]"
      >
        <PopupDialog />
      </div>
    </section>
  );
};

const Example2 = ({className}) => {
  return (
    <section className={className}>
      <ExampleTitle>
        Example 2: Popup dialog in the top-left of the screen
      </ExampleTitle>

      <CodeSnippet>
        {`<div className="flex border-[2px]
border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`}
      </CodeSnippet>

      <div className="flex border-[2px] border-solid border-black h-[490px]">
        <PopupDialog />
      </div>
    </section>
  );
};

const Example3 = ({className}) => {
  return (
    <section className={className}>
      <ExampleTitle>
        Example 3: Popup dialog in the bottom-right of the screen
      </ExampleTitle>

      <CodeSnippet>
        {`<div className="flex justify-end items-end
border-[2px] border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`}
      </CodeSnippet>

      <div className="flex justify-end items-end border-[2px] border-solid border-black h-[490px]">
        <PopupDialog />
      </div>
    </section>
  );
};
