import Buttons from '../components/buttons/buttons'
import Arrow from '../public/icons/arrow_notrail.svg'
import Table from '../components/table/table'
import Head from 'next/head'
import TableComponent from '../components/table/table'

const Profile = () => {
    return (
        <div className="h-full py-5 px-10 space-y-5 text-[14.5px]">
            <Head>
                <title>Profile - Kangean Energy Indonesia Database Converter App</title>
                <meta name='description' content='Kangean Energy Indonesia Database Converter App' />
                <link rel='icon' href='/icons/kangean_logo.svg' />
            </Head>
            <div className='flex space-x-5 py-2 items-center'>
                <Buttons path='/' button_description='' additional_styles='px-4 py-4' >
                    <Arrow className='rotate-180 w-3 h-3' />
                </Buttons>
                <h2 className='text-3xl font-semibold'>Account settings</h2>
            </div>
            <TableComponent
                header={["Account information", ""]}
                content={[
                    ["Email", "john.doe@email.com",],
                    ["Date joined", "01 - 01 - 2023"],
                    ["Role", "IT Admin"],
                ]}
                additional_styles='text-[14.5px]'
            />
            <div>
                <h3 className='font-semibold'>Password</h3>
                <p>
                    Reset your password by clicking the link below. The password reset confirmation
                    will be sent to your email.
                </p>
            </div>
            <Buttons
                path=''
                button_description='Change my password'
            />
        </div>
    )
}

export default Profile