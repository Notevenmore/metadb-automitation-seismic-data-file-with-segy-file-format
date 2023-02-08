import Highlight from "react-highlight"
import Buttons from "../components/buttons/buttons"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import TableComponent from "../components/table/table"
import Well_sample_core from '../public/icons/well_sample_core.svg'

const TablePage = () => {
    const tableData = {
        header: ["id", "email", "first_name", "last_name", "avatar"],
        content: [
            {
                "id": 1,
                "email": "george.bluth@reqres.in",
                "first_name": "George",
                "last_name": "Bluth",
                "avatar": "https://reqres.in/img/faces/1-image.jpg"
            },
            {
                "id": 2,
                "email": "janet.weaver@reqres.in",
                "first_name": "Janet",
                "last_name": "Weaver",
                "avatar": "https://reqres.in/img/faces/2-image.jpg"
            }
        ]
    }
    return (
        <div className="flex flex-col h-screen text-[14.5px]">
            <Navbar />
            <div className="w-full flex flex-auto h-screen overflow-hidden ">
                <Sidebar />
                <div className='flex flex-col flex-grow overflow-auto'>
                    <div className='flex flex-col space-y-2 py-5 px-10'>
                        <label className='text-4xl font-bold'>Table component</label>
                        <p>The <code>Table</code> component consists of the following props, with the bold ones being the <span className='font-bold'>required</span> props:</p>
                        <ul className='list-disc px-10'>
                            <code>
                                <li className='pt-1 font-bold'>header: array</li>
                                <li className='pt-1 font-bold'>content: array of objects<p className="font-sans font-normal italic text-sm">The rows' object sizes must be the same with the header array size and must contain keys that match the corresponding header names.</p></li>
                                <li className="pt-1 ">additional_styles: tailwind syntax string</li>
                            </code>
                        </ul>
                        <p>
                            Below is the example of usage of the general button component.
                            The sidebar button component can be seen in the side bar itself.
                        </p>
                        <div>
                            <p className="font-bold">Code:</p>
                            <Highlight className="text-sm border-2 rounded-md">
                                {`const Index = () => {
    const tableData = {
        header: ["id", "email", "first_name", "last_name", "avatar"],
        content: [
            {
            "id": 1,
            "email": "george.bluth@reqres.in",
            "first_name": "George",
            "last_name": "Bluth",
            "avatar": "https://reqres.in/img/faces/1-image.jpg"
            },
            {
            "id": 2,
            "email": "janet.weaver@reqres.in",
            "first_name": "Janet",
            "last_name": "Weaver",
            "avatar": "https://reqres.in/img/faces/2-image.jpg"
            }
        ]
    }
    return (
        <TableComponent 
            header={tableData.header} 
            content={tableData.content} 
        />
    )
}

export default Index`}
                            </Highlight>
                        </div>
                        <p className="font-bold">Output:</p>
                        <div className="w-full">
                            <TableComponent header={tableData.header} content={tableData.content} />
                            <div className="py-5 w-full text-center flex flex-col items-center space-y-2">
                                <p>Other documentations:</p>
                                <div className="flex space-x-2">
                                    <Buttons path={'/button'} button_description='Buttons component'><Well_sample_core /></Buttons>
                                    <Buttons path={'/input'} button_description='Input component'><Well_sample_core /></Buttons>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TablePage