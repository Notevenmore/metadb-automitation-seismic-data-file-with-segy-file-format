import FloatDialogNotification from "../../../components/float_dialog/float_dialog"
import hljs from 'highlight.js'
import { useEffect } from 'react'
import Highlight from 'react-highlight'
import { Divider } from '../../../components/float_dialog/float_dialog'

export default function NotificationDialogPage() {
  return (
    <div>
      <HeaderSection></HeaderSection>
      <p>
          This is a functional component in React which renders a floating dialog box with optional title and contents.<br/>
          The component takes in several props:<br/><br/>

        children: any React components or elements that will trigger the dialog box to open when clicked.<br/>
        float_title: an optional string that will be rendered as the title of the floating dialog box.<br/>
        items: an optional array of objects containing the contents of the floating dialog box.<br/>
        Each object should have a section_title property and a section_content property, both of which are strings.<br/>
        onClick: an optional function that will be called when the dialog box is clicked. <br/>
         If this prop is not provided, the dialog box will open and close when clicked. <br/>
        width: an optional string specifying the width of the floating dialog box. The default value is &quot;340px&quot;. <br/> 
        The component uses React&apos;s useState hook to keep track of whether the dialog box is currently shown.<br/>
         When the handleClick function is called &#40;either by clicking on the children element or by calling the <br/>
          onClick prop&#41;, it toggles the value of show in state, which causes the floating dialog box to be <br/>
           rendered or hidden accordingly.
        <br/><br/>
        If show is true, the floating dialog box is rendered with a white background, a border, and rounded corners. If float_title is provided, it will be rendered as an &lt;h2&gt; element at the top of the dialog box. The contents of the dialog box are rendered by mapping over the items array and rendering a &lt;FloatSection&gt; component for each item.
        <br/><br/>
        Overall, this component provides a convenient and reusable way to render floating dialog boxes in React.
      </p>
      <FloatDialogNotification></FloatDialogNotification>
    </div>
  )
}

function PopupDialogPage() {
  useEffect(() => {
    hljs.highlightAll()
  }, [])
  return (
    <section className="flex flex-col w-full h-fit text-[14.5px] px-10 py-5">
      <HeaderSection></HeaderSection>
      <MainSection></MainSection>
    </section>
  )
}



const HeaderSection = () => {
  return (
    <header className="mb-[2em]">
      <h1 className='text-4xl font-bold'>Floating Dialog Component</h1>
      <Divider additional_styles={"my-[20px] border-[1px]"}/>
      <p className='mb-[10px]'>The <code><strong>FloatDialog</strong></code> component consists of the following props,
       with no required props:
      </p>
      <ul className='mb-[10px] list-disc px-10'>
          <li className='pt-1'>title: <code>string</code></li>
          <li className='pt-1'>content: <code>{"<ReactComponent> to string"}</code></li>
          <li className='pt-1'>button_desc1: <code>string</code></li>
          <li className="pt-1">button_desc2: <code>string</code></li>
          <li className="pt-1">button_desc3: <code>string</code></li>
      </ul>
      <p>Below is the example implementation of the 
         <code><strong> FloatDialog</strong></code> component.
      </p>
    </header> 
  )
}

const MainSection = () => {
  return (
    <main className="flex flex-col gap-y-8">
      <Example1></Example1>
      <Example2></Example2>
      <Example3></Example3>
    </main>     
  )
}

const Example = (props) => {
  return (
    <section className="flex flex-col gap-y-[20px] mb-[20px]">
      {props.children}
    </section>
  )
}

const ExampleTitle = ({children}) => {
  return (
    <h3 className='text-xl font-bold w-fit decoration-float_section_divider underline underline-5 underline-offset-[10px] mb-[30px]'>
      <>{children}</>
    </h3>
  )
  
}

const CodeSnippet = ({children}) => {
  return (
    <>
      <h2 className='font-bold'>Here is the code snippet:</h2>
      <Highlight className='html rounded-md
        border-solid border-neutral-300 border-1
        break-words w-fit mb-[20px] shadow shadow-slate-400'>
          <>{children}</>
      </Highlight>
    </>
  )
}


const Example1 = () => {
  return (
    <section>
      <ExampleTitle>Example 1: Popup dialog in the center of the screen</ExampleTitle>
      <CodeSnippet>
        {
`<div className="flex justify-center items-center
border-[2px] border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`  
        }
      </CodeSnippet>
      <div className="flex justify-center items-center
       border-[2px] border-solid border-black h-[490px]">
        {/* <PopupDialog/> */}
      </div>
    </section>
  )    
}

const Example2 = ({className}) => {
  return (
    <section className={className}>  
      <ExampleTitle>Example 2: Popup dialog in the top-left of the screen</ExampleTitle>    
      
      <CodeSnippet>
      {
`<div className="flex border-[2px]
border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`
      }
      </CodeSnippet>
      
      <div className="flex border-[2px] border-solid border-black h-[490px]">
        {/* <PopupDialog/> */}
      </div>
    </section>
  )
}

const Example3 = ({className}) => {
  return (
    <section className={className}>      
      <ExampleTitle>Example 3: Popup dialog in the bottom-right of the screen</ExampleTitle>
      
      <CodeSnippet>
        {
`<div className="flex justify-end items-end
border-[2px] border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`
        }
      </CodeSnippet>
      
      <div className="flex justify-end items-end border-[2px] border-solid border-black h-[490px]">
        {/* <PopupDialog/> */}
      </div>
    </section>
  )
} 

