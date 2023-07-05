import {SideBar} from '../components/navigation_bar/SideBar';
import TopBar from '../components/navigation_bar/Topbar';
import {CheckAuth, CheckUser} from '../utils/check';

export default function LayoutIcon({children}) {
  CheckAuth();
  CheckUser('Regular User');

  return (
    <div className="h-screen overflow-hidden">
      <TopBar />
      <SideBar />
      <div id="layout-icon" className="full-height h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
