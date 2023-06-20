import FloatDialog, {
  FloatDialogNotification,
  ProfileIcon,
  NotificationIcon,
  IconSection,
} from '../../../components/float_dialog/float_dialog';
import Highlight from 'react-highlight';
import {Divider} from '../../../components/float_dialog/float_dialog';

export default function FloatingDialogPage() {
  return (
    <section className="flex flex-col w-full h-fit text-[14.5px] px-10 py-5">
      <HeaderSection></HeaderSection>
      <MainSection></MainSection>
    </section>
  );
}

function PopupDialogPage() {
  return (
    <section className="flex flex-col w-full h-fit text-[14.5px] px-10 py-5">
      <HeaderSection></HeaderSection>
      <MainSection></MainSection>
    </section>
  );
}

const BoldCode = ({children}) => {
  return (
    <code>
      <strong>{children}</strong>
    </code>
  );
};

const HeaderSection = () => {
  return (
    <header className="mb-[2em]">
      <h1 className="text-4xl font-bold">Floating Dialog Component</h1>
      <Divider additional_styles={'my-[20px] border-[1px]'} />
      <p className="mb-[10px]">
        This is a functional component in React which renders a floating dialog
        box with optional title and contents. The component takes in several
        props:
      </p>
      <ul className="mb-[10px] list-disc px-10">
        <li className="pt-1">
          {' '}
          <BoldCode>`children`: </BoldCode>
          any React components or elements that will trigger the dialog box to
          open when clicked.
        </li>
        <li className="pt-1">
          <BoldCode>`float_title`: </BoldCode>
          an optional string that will be rendered as the title of the floating
          dialog box.
        </li>
        <li className="pt-1">
          <BoldCode>`items`: </BoldCode>
          an optional array of objects containing the contents of the floating
          dialog box. Each object should have a section_title property and a
          section_content property, both of which are strings.
        </li>
        <li className="pt-1">
          <BoldCode>`onClick`: </BoldCode>
          an optional function that will be called when the dialog box is
          clicked. If this prop is not provided, the dialog box will open and
          close when clicked.
        </li>
        <li className="pt-1">
          <BoldCode>`width`: </BoldCode>
          an optional string specifying the width of the floating dialog box.
          The default value is &quot;340px&quot;.
        </li>
        <li className="pt-1">
          <BoldCode>`className`: </BoldCode>
          an optional string specifying additional className (especially the{' '}
          <BoldCode>`top`|`bottom`|`left`|`right`</BoldCode> attribute) distance
          relative to the reference element <BoldCode>`children`</BoldCode> of
          the floating dialog box. The default value is &quot;0px&quot;.
        </li>
      </ul>
      <p>
        The component uses React&apos;s <BoldCode>`useState`</BoldCode> hook to
        keep track of whether the dialog box is currently shown. When the{' '}
        <BoldCode>`handleClick`</BoldCode> function is called (either by
        clicking on the children element or by calling the{' '}
        <BoldCode>`onClick`</BoldCode> prop), it toggles the value of{' '}
        <BoldCode>`show`</BoldCode> in state, which causes the floating dialog
        box to be rendered or hidden accordingly.
      </p>
      <br></br>
      <p>
        Below is the example implementation of the
        <BoldCode> FloatDialog</BoldCode> component.
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
    <h3
      className="text-xl font-bold w-fit
     decoration-float_section_divider
      underline underline-5 underline-offset-[10px] mb-[30px]"
    >
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
  const items_notification = {
    type: 'notification',
    contents: [
      {section_title: 'hello', section_content: 'hello there'},
      {section_title: 'abc', section_content: 'def'},
      {section_title: 'fgh', section_content: 'ijk'},
      {section_title: 'trololol', section_content: 'trollge'},
    ],
  };
  return (
    <section>
      <ExampleTitle>
        Example 1: Notification dialog in the center of the screen
      </ExampleTitle>
      <CodeSnippet>
        {`<div className="relative border-[2px] border-solid border-black h-[600px]">
  <section className="absolute top-28 left-[430px]">
    <FloatDialog float_title="notification" items={items_notification}>
      <IconSection>
        <NotificationIcon/>
      </IconSection>
    </FloatDialog>
  </section>
</div>`}
      </CodeSnippet>
      <div className="relative border-[2px] border-solid border-black h-[600px]">
        <section className="absolute top-28 left-[430px]">
          <FloatDialog float_title="notification" items={items_notification}>
            <IconSection>
              <NotificationIcon />
            </IconSection>
          </FloatDialog>
        </section>
      </div>
    </section>
  );
};

const Example2 = ({className}) => {
  const items_profile = {
    type: 'profile',
    contents: [
      {section_title: 'hello', section_content: 'hello there'},
      {
        section_title: 'a notification',
        section_content: 'lorem ipsum dolor sit amet',
      },
      {
        section_title: 'another notification',
        section_content: 'hey, we have a new announcement!',
      },
      {
        section_title: 'An important notification',
        section_content: 'Please read this immediately!',
      },
    ],
  };

  return (
    <section className={className}>
      <ExampleTitle>
        Example 2: Profile dialog in the top-left of the screen
      </ExampleTitle>

      <CodeSnippet>
        {`<div className="flex border-[2px] border-solid border-black h-[490px]">
  <FloatDialog float_title="Profile" items={items_profile}>
    <IconSection>
      <ProfileIcon/>
    </IconSection>
  </FloatDialog>
</div>`}
      </CodeSnippet>
      <div className="flex border-[2px] border-solid border-black h-[600px]">
        <FloatDialog float_title="Profile" items={items_profile}>
          <IconSection>
            <ProfileIcon />
          </IconSection>
        </FloatDialog>
      </div>
    </section>
  );
};

const Example3 = ({className}) => {
  const items_general = {
    type: 'profile',
    contents: [
      {section_title: 'hello', section_content: 'hello there'},
      {
        section_title: 'a notification',
        section_content: 'lorem ipsum dolor sit amet',
      },
      {
        section_title: 'another notification',
        section_content: 'hey, we have a new announcement!',
      },
      {
        section_title: 'An important notification',
        section_content: 'Please read this immediately!',
      },
    ],
  };

  return (
    <section className={className}>
      <ExampleTitle>
        Example 3: General floating dialog in the bottom-right of the screen
      </ExampleTitle>

      <CodeSnippet>
        {`<div className="flex justify-end items-end border-[2px] border-solid border-black h-[490px]">
  <FloatDialog items={items_general} className="bottom-[50px] right-[100px]">
    <p className="cursor-pointer">Let there be light!</p>
  </FloatDialog>
</div>`}
      </CodeSnippet>

      <div className="flex justify-end items-end border-[2px] border-solid border-black h-[490px]">
        <FloatDialog
          items={items_general}
          className="bottom-[50px] right-[100px]"
        >
          <p className="cursor-pointer">Let there be light!</p>
        </FloatDialog>
      </div>
    </section>
  );
};
