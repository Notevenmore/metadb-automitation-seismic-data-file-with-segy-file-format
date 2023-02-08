import Link from "next/link"
import Head from 'next/head'
import Image from 'next/image'
import Buttons, { Buttons_Sidebar } from '../components/buttons'
import Bibliography from '../public/icons/bibliography.svg'
import Info from '../public/icons/info.svg'
import Maps from '../public/icons/maps.svg'
import Outcrop from '../public/icons/outcrop.svg'
import Project_file from '../public/icons/project_file.svg'
import Seismic from '../public/icons/seismic.svg'
import Technical_report from '../public/icons/technical_report.svg'
import Well from '../public/icons/well.svg'
import Well_sample_core from '../public/icons/well_sample_core.svg'
import Arrow from '../public/icons/arrow_notrail.svg'

const Test = () => {
    return (
        <div className="flex flex-col h-screen text-[14.5px]">
            <div className="min-h-[50px] flex items-center">
                Navbar
            </div>
            <div className="w-full flex h-screen overflow-hidden border border-black">
                <div className="flex flex-col justify-between overflow-y-auto bg-side_bar min-w-[300px] max-w-[300px]">
                    <div className="border border-black">
                        <Buttons_Sidebar path='' button_description='General information'>
                            <Info className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Seismic data'>
                            <Seismic className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Non-Seismic & Seismic Non Conventional Data'>
                            <Seismic className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Well data'>
                            <Well className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Well sample & Core'>
                            <Well_sample_core className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Outcrop'>
                            <Outcrop className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Technical report'>
                            <Technical_report className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Maps & Technical'>
                            <Maps className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Project file'>
                            <Project_file className='w-4' />
                        </Buttons_Sidebar>
                        <Buttons_Sidebar path='' button_description='Bibliography'>
                            <Bibliography className='w-4' />
                        </Buttons_Sidebar>
                    </div>
                    <div className='bg-side_bar z-50'>
                        <button className='flex space-x-2 hover:bg-gray-200 w-full px-6 py-3'>
                            <div className='flex -space-x-1.5'>
                                <Arrow className='w-3 rotate-180' />
                                <Arrow className='w-3 rotate-180' />
                            </div>
                            <label>Collapse sidebar</label>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center w-full space-y-2 overflow-auto">
                    <Buttons path='/test' button_description='Choose file manually' />
                    <Buttons path='/test' button_description='Make a new document' />
                    <Buttons path='/test' button_description='View drafts' />
                    <Buttons path='/test' button_description='Connect with database' />
                </div>
            </div>
        </div>
    )
}

export default Test