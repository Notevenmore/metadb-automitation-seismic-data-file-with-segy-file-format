import SideBar from '../components/navigation_bar/SideBar'
import TopBar from '../components/navigation_bar/Topbar'

export default function Layout({children}) {
    return (
        <>
            <TopBar></TopBar>
            <SideBar></SideBar>
            <>{children}</>
        </>
    )
}