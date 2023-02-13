import Highlight from "react-highlight"
import Buttons from "../components/buttons/buttons"
import Navbar from "../components/navbar"
import Sidebar from "../components/sidebar"
import TableComponent from "../components/table/table"
import Well_sample_core from '../public/icons/well_sample_core.svg'
import Input from '../components/input_form/input'
import { useState, useEffect } from "react"


const TablePage = () => {
    let SelectedTableData = [[]]
    const tableData = {
        header: ["ID", "E-mail", "First name", "Last name", "Avatar"],
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

    const printData = (e) => {
        e.preventDefault()
        console.log(SelectedTableData[0])
    }


    return (
        <div className="flex flex-col text-[14.5px]">
            <div className="w-full flex flex-auto">
                <div className='flex flex-col flex-grow overflow-auto'>
                    <div className='flex flex-col space-y-2 py-5 px-10'>
                        <label className='text-4xl font-bold'>Table component</label>
                        <p>The <code>Table</code> component consists of the following props, with the bold ones being the <span className='font-bold'>required</span> props:</p>
                        <ul className='list-disc px-10'>
                            <code>
                                <li className='pt-1 font-bold'>header: array</li>
                                <li className='pt-1 font-bold'>content: array of objects<p className="font-sans font-normal italic text-sm">The <code>content</code> prop must be a two dimensional object (array of objects | array of arrays) with the inner arrays | objects having the same size as the header's array size.</p></li>
                                <li className="pt-1 ">additional_styles: CSS</li>
                            </code>
                        </ul>
                        <p>
                            Below are the example usages of the <code>table</code> component, with the <code>tableData</code> object defined below.
                        </p>
                        <Highlight className="text-sm border-2 rounded-md">
                            {`const tableData = {
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
`}
                        </Highlight>
                        <div className="w-full space-y-2 pt-2">
                            <h2 className="text-lg font-bold">1. A normal table.</h2>
                            <p className="font-bold">Code:</p>
                            <Highlight className="text-sm border-2 rounded-md">
                                {`<TableComponent 
    header={tableData.header} 
    content={tableData.content} 
/>`}
                            </Highlight>
                            <p className="font-bold">Output:</p>
                            <TableComponent header={tableData.header} content={tableData.content} />
                            <br />
                            <h2 className="text-lg font-bold">2. A table with checkboxes.</h2>
                            <p>An array of an array variable must be initialized to keep track of the selected rows. </p>
                            <Highlight className="text-sm border-2 rounded-md">
                                {`let SelectedTableData = [[]]`}
                            </Highlight>
                            <p>
                                Directly using the setState function is prevented for performance sake
                                (to prevent unecessary re-renders, which is very resource expensive in this case),
                                hence the use of dev console to see the previously initialized array being updated.
                            </p>
                            <p className="font-bold">Code:</p>
                            <Highlight className="text-sm border-2 rounded-md">
                                {`<TableComponent
    with_checkbox={true}
    header={["Document name", "Working area", "Type", "AFE", "Action"]}
    content={
        [
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
            ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
        ]
    }
    setSelectedRows={SelectedTableData}
/>
`}
                            </Highlight>
                            <br />
                            <p className="font-bold">Output:</p>
                            <TableComponent
                                with_checkbox={true}
                                header={["Document name", "Working area", "Type", "AFE", "Action"]}
                                content={
                                    [
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                        ["Lorem ipsum", "Pulau Kangean", "Quarterly", 12345, <div className="flex space-x-2"><button>e</button><button>v</button><button>d</button></div>],
                                    ]
                                }
                                setSelectedRows={SelectedTableData}
                            />
                            <div className="pt-2">
                                <p>Selected rows: (Press the button below and check dev console to see the updates)</p>
                                <Buttons additional_styles="mt-2" path="/" button_description="Print to console" onClick={(e) => { printData(e) }} />

                            </div>
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
        </div >
    )
}

export default TablePage