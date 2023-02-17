import hljs from 'highlight.js'
import { useEffect } from 'react'
import Highlight from 'react-highlight'
import Well_sample_core from '../../public/icons/well_sample_core.svg'
import Buttons from '../../components/buttons/buttons'

const ButtonPage = () => {
    useEffect(() => {
        hljs.highlightAll()
    }, [])

    return (
        <div className="flex flex-col text-[14.5px]">
            <div className="w-full flex flex-auto">
                <div className='flex flex-col flex-grow overflow-auto'>
                    <div className='flex flex-col space-y-2 py-5 px-10'>
                        <label className='text-4xl font-bold'>Button component</label>
                        <p>The <code>Button</code> component consists of the following extended props (the native props are still supported), with the bold ones being the <span className='font-bold'>required</span> props:</p>
                        <ul className='list-disc px-10'>
                            <code>
                                <li className='pt-1 font-bold'>path: string</li>
                                <li className='pt-1 font-bold'>button_description: string</li>
                                <li className='pt-1 '>additional_styles: CSS class string</li>
                            </code>
                        </ul>
                        <p>
                            Below are the example usages of the <code>button</code> component.
                        </p>
                        <br></br>

                        <h3 className='text-xl font-bold'>Example 1</h3>
                        <Highlight className='html rounded-md border-2'>
                            {"<Buttons \n\tpath='' \n\tbutton_description='Choose file manually' \n/>"}
                        </Highlight>
                        <Buttons path='' button_description='Choose file manually' />
                        <br></br>

                        <h3 className='text-xl font-bold'>Example 2</h3>
                        <Highlight className='html rounded-md border-2'>
                            {"<Buttons \n\tpath='' \n\tbutton_description='Make a new document' \n/>"}
                        </Highlight>
                        <Buttons path='' button_description='Make a new document' />
                        <br></br>

                        <h3 className='text-xl font-bold'>Example 3</h3>
                        <Highlight className='html rounded-md border-2'>
                            {`<Buttons path='' button_description='Make a new document' >
    <Well_sample_core className='w-4 h-4' />
</Buttons>`}
                        </Highlight>
                        <Buttons path='' button_description='Make a new document' >
                            <Well_sample_core className='w-4 h-4' />
                        </Buttons>
                        <br></br>

                        <h3 className='text-xl font-bold'>Example 4</h3>
                        <p>The <code className='font-bold'>additional_styles</code> prop is not mandatory to be filled, just like the above example.</p>
                        <pre>
                            <Highlight className='html rounded-md border-2'>
                                {"<Buttons \n\tpath='/' \n\tbutton_description='View drafts' \n\tadditional_styles='border-[3px] border-green-600 italic bg-green-600 text-white font-bold hover:bg-green-500' \n/>"}
                            </Highlight>
                        </pre>
                        <Buttons path='' button_description='View drafts' additional_styles={'border-[3px] border-green-600 italic bg-green-600 text-white font-bold hover:bg-green-500'} />
                        <div className="py-5 w-full text-center flex flex-col items-center space-y-2">
                            <p>Other documentations:</p>
                            <div className="flex space-x-2">
                                <Buttons path={'/table'} button_description='Table component'><Well_sample_core className='w-4 h-4' /></Buttons>
                                <Buttons path={'/input'} button_description='Input component'><Well_sample_core className='w-4 h-4' /></Buttons>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ButtonPage