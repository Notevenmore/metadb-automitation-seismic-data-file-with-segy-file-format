import SideBar from '../components/navigation_bar/SideBar';
import TopBar from '../components/navigation_bar/Topbar';
import { checkAuth, checkUser } from '../utils/check';

export default function LayoutIcon({children}) {
  checkAuth();
  checkUser("Regular User")

  return (
    <div className="h-screen overflow-hidden">
      <TopBar></TopBar>
      <SideBar></SideBar>
      <div id="layout-icon" className="full-height h-full overflow-auto">
        {children}
        {/* <Footer></Footer> */}
      </div>
    </div>
  );
}
