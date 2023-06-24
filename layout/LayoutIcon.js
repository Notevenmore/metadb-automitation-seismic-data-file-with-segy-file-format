import SideBar from '../components/navigation_bar/SideBar';
import TopBar from '../components/navigation_bar/Topbar';
import Toast from '../components/toast/toast';
import {CheckAuth, CheckUser} from '../utils/check';

export default function LayoutIcon({children}) {
  const {Message, setMessage} = CheckAuth();
  CheckUser('Regular User');

  return (
    <div className="h-screen overflow-hidden">
      <TopBar></TopBar>
      <SideBar></SideBar>
      <div id="layout-icon" className="full-height h-full overflow-auto">
        <Toast message={Message} setmessage={setMessage}>
          {Message.message}
        </Toast>
        {children}
        {/* <Footer></Footer> */}
      </div>
    </div>
  );
}
