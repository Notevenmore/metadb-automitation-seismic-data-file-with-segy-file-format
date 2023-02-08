import Kangean from '../public/icons/kangean_logo.svg'

const Navbar = () => {
    return (
        <div className="flex px-5 items-center min-h-[50px] border-b border-b-gray-300">
            <div className='flex space-x-2 items-center'>
                <Kangean className='w-7' />
                <h2>KEIDC Components Documentation</h2>
            </div>
        </div>
    )
}

export default Navbar