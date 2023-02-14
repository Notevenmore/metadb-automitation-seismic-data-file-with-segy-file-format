import Sidebar from "../components/sidebar"
import Buttons from "../components/buttons/buttons"
import Well_sample_core from '../public/icons/well_sample_core.svg'
import Input from "../components/input_form/input"
import Highlight from "react-highlight"
import Navbar from "../components/navbar"

const InputPage = () => {
    const dropdownItems = ['Demo item 1', 'Demo item 2', 'Demo item 3', 'Demo item 4', 'Demo item 5', 'Demo item 6', 'Demo item 7', 'Demo item 8', 'Demo item 9']
    return (
        <div className="flex flex-col text-[14.5px]">
            <div className="w-full flex flex-auto">
                <div className='flex flex-col flex-grow overflow-auto'>
                    <div className='flex flex-col space-y-2 py-5 px-10'>
                        <label className='text-4xl font-bold'>Input component</label>
                        <p>The <code>Input</code> component consists of the following extended props (the native props are still supported), with the bold ones being the <span className='font-bold'>required</span> props:</p>
                        <ul className='list-disc px-10'>
                            <code>
                                <li className='font-bold mt-1'>label: string</li>
                                <li className='font-bold mt-1'>label_loc: above | beside<p className="font-sans font-normal italic text-sm">Required if label prop is defined</p></li>
                                <li className='font-bold mt-1'>type: existing HTML input types | dropdown</li>
                                <li className='font-bold mt-1'>label_loc: above|beside<p className="font-sans font-normal italic text-sm">Required if <code>type</code> is dropdown</p></li>
                                <li className='mt-1'>additional_styles_label: CSS class string</li>
                                <li className='mt-1'>additional_styles_input: CSS class string</li>
                                <li className='mt-1'>additional_styles_menu_container: CSS class string</li>
                                <li className='mt-1'>additional_styles: CSS class string</li>
                            </code>
                        </ul>
                        <p>
                            Below are the example usages of the <code>input</code> form component.
                        </p>
                        <form className='w-full space-y-2 pt-2'>
                            <h2 className="text-lg font-bold">1. An input form with a label beside it.</h2>
                            <p>The label will always be positioned with width of 45% of the parent width.</p>
                            <p className="font-bold">Code:</p>
                            <Highlight className="border-2 rounded-md">
                                {`<Input
    label="E-mail"
    label_loc="beside"
    type="email"
    name={"email"}
    autoComplete="none"
    placeholder={"E-mail"}
    required={true}
/>`}
                            </Highlight>
                            <p className="font-bold">Output:</p>
                            <Input
                                label="E-mail"
                                label_loc="beside"
                                type="email"
                                name={"email"}
                                autoComplete="none"
                                placeholder={"E-mail"}
                                required={true}
                            />
                            <br />
                            <h2 className="text-lg font-bold">2. An input form with a label above it.</h2>
                            <p className="font-bold">Code:</p>
                            <Highlight className="border-2 rounded-md">
                                {`<Input
    label="E-mail"
    label_loc="above"
    type="email"
    name={"email"}
    autoComplete="none"
    placeholder={"E-mail"}
    required={false}
    additional_styles="space-y-1"
    additional_styles_label=""
    additional_styles_input=""
/>`}
                            </Highlight>
                            <p className="font-bold">Output:</p>
                            <Input
                                label="E-mail"
                                label_loc="above"
                                type="email"
                                name={"email"}
                                autoComplete="none"
                                placeholder={"E-mail"}
                                required={false}
                                additional_styles="space-y-1"
                                additional_styles_label=""
                                additional_styles_input=""
                            />
                            <br />
                            <h2 className="text-lg font-bold">3. An input form without a label</h2>
                            <p className="font-bold">Code:</p>
                            <Highlight className="border-2 rounded-md">
                                {`<Input
    type="text"
    name={"labelless"}
    autoComplete="none"
    placeholder={"Label-less input"}
    required={true}
/>`}
                            </Highlight>
                            <p className="font-bold">Output:</p>
                            <Input
                                type="text"
                                name={"labelless"}
                                autoComplete="none"
                                placeholder={"Label-less input"}
                                required={true}
                            />
                            <br />
                            <h2 className="text-lg font-bold">4. An input form of drop down menu type.</h2>
                            <p>
                                Similar to the input type of single-line input, the label will always be positioned with width of 45% of the parent width if positioned beside the drop down menu.
                                The label can also be positioned above the drop down menu, or it may not be present if the <code className="font-bold">label</code> prop is not defined.
                                Below is an example of dropdown items stored in array that will be passed to the <code className="font-bold">dropdown_items</code> prop.
                            </p>
                            <Highlight className="border-2 rounded-md">
                                {`const dropdownItems = ['Demo item 1', 'Demo item 2', 'Demo item 3', 'Demo item 4', 'Demo item 5', 'Demo item 6', 'Demo item 7', 'Demo item 8', 'Demo item 9']`}
                            </Highlight>
                            <p className="font-bold">Code:</p>
                            <Highlight className="border-2 rounded-md">
                                {`<Input
    label='Choose an item'
    label_loc='above'
    type="dropdown"
    dropdown_items={dropdownItems}
    required={true}
/>`}
                            </Highlight>
                            <p className="font-bold">Output:</p>
                            <Input
                                label='Choose an item'
                                label_loc='above'
                                type="dropdown"
                                dropdown_items={dropdownItems}
                                required={true}
                            />
                            <br></br>
                            <p>
                                Other examples which implement the same logic as the single-line text input above with <code className="font-bold">&apos;dropdown&apos;</code> passed as the <code className="font-bold">type</code> prop:
                            </p>
                            <br></br>
                            <Input
                                label='Choose an item'
                                label_loc='beside'
                                type="dropdown"
                                dropdown_items={dropdownItems}
                                required={true}
                            />
                            <Input
                                type="dropdown"
                                dropdown_items={dropdownItems}
                                required={true}
                            />
                        </form>
                        <div className="py-5 w-full text-center flex flex-col items-center space-y-2">
                            <p>Other documentations:</p>
                            <div className="flex space-x-2">
                                <Buttons path={'/button'} button_description='Buttons component'><Well_sample_core className='w-4 h-4' /></Buttons>
                                <Buttons path={'/table'} button_description='Table component'><Well_sample_core className='w-4 h-4' /></Buttons>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InputPage