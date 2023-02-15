import hljs from 'highlight.js'
import { useEffect } from 'react'
import Highlight from 'react-highlight'
import PopupDialog from '../components/popup_dialog/popup_dialog'

export default function PopupDialogPage() {
  useEffect(() => {
    hljs.highlightAll()
  }, [])
  return (
    <section className="flex flex-col w-full h-fit text-[14.5px]
     border-[2px] border-solid border-black px-10 py-5">
      <HeaderSection></HeaderSection>
      <MainSection></MainSection>
    </section>
  )
}

const HeaderSection = () => {
  return (
    <header className="flex flex-col space-y-2 mb-[2em]">
      <h1 className='text-4xl font-bold'>Popup Dialog Component</h1>
      <p>The <code><strong>PopupDialog</strong></code> component consists of no props,
      since it is intended to be used as a final component. <br></br>
        Below is the example of usage of the PopupDialog component.
      </p>
    </header> 
  )
}

const MainSection = () => {
  return (
    <main className="flex flex-col">
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
const Example1 = () => {
  return (
    <Example>
      <h3 className='text-xl'><strong>Example 1: Popup dialog in the center of the screen</strong></h3>
      <Highlight className='html rounded-md border-solid border-black border-2 break-words w-[500px] overflow-y-scroll'>
      {
`<div className="flex justify-center items-center
  border-[2px] border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`
      }
      </Highlight>
      <div className="flex justify-center items-center border-[2px] border-solid border-black h-[490px]">
        <PopupDialog
          title={"hello"}
          // content={
          //   <>You have not saved the document yet, are you sure you want to leave this page?
          //   <strong> This document will not be uploaded and will be deleted.</strong></> 
          // }
        />
      </div>
    </Example>
    // <section className="flex flex-col gap-y-[20px] mb-[20px]">
    // </section>
  )    
}

const Example2 = () => {
  return (
    <Example>
      <h3 className='text-xl'><strong>Example 2: Popup dialog in the top-left of the screen</strong></h3>
      <Highlight className='html rounded-md border-solid border-black border-2 break-all w-[500px] overflow-y-scroll'>
      {
`<div className="flex border-[2px]
border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`
      }
      </Highlight>
      <div className="flex border-[2px] border-solid border-black h-[490px]">
        <PopupDialog
        content={
          <>You have not saved the document yet, are you sure you want to leave this page?
          <strong> This document will not be uploaded and will be deleted.</strong></>
        }
        />
      </div>
    </Example>
  )
}

const Example3 = () => {
  return (
    <Example>
      <h3 className='text-xl'><strong>Example 3: Popup dialog in the bottom-right of the screen</strong></h3>
      <Highlight className='html rounded-md border-solid border-black border-2 break-all w-[500px] overflow-y-scroll'>
      {
`<div className="flex justify-end items-end
border-[2px] border-solid border-black h-[490px]">
  <PopupDialog></PopupDialog>
</div>`
      }
      </Highlight>
      <div className="flex justify-end items-end border-[2px] border-solid border-black h-[490px]">
        <PopupDialog
          content={
            <>You have not saved the document yet, are you sure you want to leave this page?
            <strong> This document will not be uploaded and will be deleted.</strong></>
        }
          />
      </div>
    </Example>
  )
} 