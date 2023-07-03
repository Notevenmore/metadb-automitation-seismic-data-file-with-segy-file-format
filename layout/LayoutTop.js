import TopBar from '../components/navigation_bar/Topbar';
import Toast from '../components/toast/toast';
import {CheckAuth, CheckUser} from '../utils/check';

export default function LayoutTop({children}) {
  CheckAuth();
  CheckUser('Administrator');

  return (
    <div className="h-screen overflow-hidden">
      <TopBar />
      <div className="full-height h-full overflow-auto">
        <Toast />
        {children}
      </div>
    </div>
  );
}
