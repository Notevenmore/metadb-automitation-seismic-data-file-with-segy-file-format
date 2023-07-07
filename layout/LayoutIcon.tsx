import {SideBar} from '../components/Navigation/SideBar';
import TopBar from '../components/Navigation/TopBar';
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
