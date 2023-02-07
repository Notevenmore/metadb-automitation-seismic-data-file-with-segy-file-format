import Buttons, { Buttons_Sidebar } from '../components/buttons/buttons'
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
import TableComponent from '../components/table'
import Input from '../components/input'

const anothertest = () => {
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
            <div className="flex flex-initial items-center min-h-[50px] border border-black">
                Navbar
            </div>
            <div className="w-full flex flex-auto h-screen overflow-hidden ">
                <div className="flex flex-col bg-side_bar min-w-[300px] max-w-[300px] justify-between hidden">
                    <div className="overflow-y-auto px-3 py-2.5">
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
                    <div className="">
                        <button className='flex items-center space-x-2 hover:bg-gray-200 w-full px-6 py-3'>
                            <div className='flex -space-x-1.5'>
                                <Arrow className='w-3 rotate-180' />
                                <Arrow className='w-3 rotate-180' />
                            </div>
                            <label>Collapse sidebar</label>
                        </button>
                    </div>
                </div>
                <div className='flex flex-col flex-grow overflow-auto'>
                    <div className='flex flex-col items-center justify-center space-y-2 py-5 px-10'>
                        <label className='text-4xl font-bold'>Spent 10 lovely hours dealing with flexboxes to make this little sheetus work (The responsiveness)</label>
                        <p className='font-bold text-xl'>If someone sees this please for the love of God try resizing the window page to see the glorious flexbox working as intended</p>

                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vulputate mattis tortor sed bibendum. Nunc accumsan velit tortor, vulputate tempor ligula gravida eget. Nunc quam nisl, posuere ut mauris et, lobortis ullamcorper nunc. Mauris fermentum tincidunt porttitor. Nunc ac lacinia lectus, vitae mattis ex. Curabitur eget porttitor diam. Aliquam interdum suscipit urna, a semper dui pellentesque id. Cras justo nibh, cursus et sem sed, interdum pulvinar est. Nunc ut commodo nunc. Etiam ut justo tincidunt, egestas neque at, maximus erat. Maecenas maximus erat lacus, eget ultricies neque pulvinar at. Mauris sagittis tortor vel erat pharetra tempor. Integer facilisis, urna sed consectetur volutpat, justo lectus venenatis risus, laoreet bibendum mi ex vel leo. Duis in nibh dui. Vestibulum pretium at metus quis pretium. Suspendisse enim libero, posuere sed magna ac, placerat placerat mauris.
                        </p>
                        <br></br>
                        <Buttons path={'/tabledemo'} button_description='Go to table demo page' />
                        <TableComponent header={tableData.header} content={tableData.content} />
                        <form className='w-full space-y-2'>
                            <Input
                                label="E-mail"
                                label_loc="beside"
                                type="email"
                                name={"email"}
                                autoComplete="none"
                                placeholder={"E-mail"}
                                required={true}
                            />
                            <Input
                                label="E-mail"
                                label_loc="above"
                                type="text"
                                name={"email"}
                                autoComplete="none"
                                placeholder={"E-mail"}
                                required={false}
                                additional_styles="space-y-1"
                                additional_styles_label=""
                                additional_styles_input=""
                            />
                            <Input
                                type="text"
                                name={"email"}
                                autoComplete="none"
                                placeholder={"E-mail"}
                                required={true}
                            />
                        </form>
                        <label className='text-4xl font-bold'>Buttons & Testing scroll</label>
                        <br></br>
                        <Buttons path='/anothertest' button_description='Choose file manually' />
                        <Buttons path='/anothertest' button_description='Make a new document' />
                        <Buttons path='/anothertest' button_description='View drafts' />
                        <Buttons path='/anothertest' button_description='Connect with database' />
                        <Buttons path='/anothertest' button_description='Choose file manually' />
                        <Buttons path='/anothertest' button_description='Make a new document' />
                        <Buttons path='/anothertest' button_description='View drafts' />
                        <Buttons path='/anothertest' button_description='Connect with database' />
                        <Buttons path='/anothertest' button_description='Choose file manually' />
                        <Buttons path='/anothertest' button_description='Make a new document' />
                        <Buttons path='/anothertest' button_description='View drafts' />
                        <Buttons path='/anothertest' button_description='Connect with database' />
                        <Buttons path='/anothertest' button_description='Choose file manually' />
                        <Buttons path='/anothertest' button_description='Make a new document' />
                        <Buttons path='/anothertest' button_description='View drafts' />
                        <Buttons path='/anothertest' button_description='Connect with database' />
                        <Buttons path='/anothertest' button_description='Choose file manually' />
                        <Buttons path='/anothertest' button_description='Make a new document' />
                        <Buttons path='/anothertest' button_description='View drafts' />
                        <Buttons path='/anothertest' button_description='Connect with database' />
                        <Buttons path='/anothertest' button_description='Choose file manually' />
                        <Buttons path='/anothertest' button_description='Make a new document' />
                        <Buttons path='/anothertest' button_description='View drafts' />
                        <Buttons path='/anothertest' button_description='Connect with database' />
                        <Buttons path='/anothertest' button_description='Choose file manually' />
                        <Buttons path='/anothertest' button_description='Make a new document' />
                        <Buttons path='/anothertest' button_description='View drafts' />
                        <Buttons path='/anothertest' button_description='Connect with database' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default anothertest