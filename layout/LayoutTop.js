import TopBar from '../components/navigation_bar/Topbar';
import {CheckAuth, CheckUser} from '../utils/check';

export default function LayoutTop({children}) {
  CheckAuth();
  CheckUser('Administrator');

  return (
    <div className="h-screen overflow-hidden">
      <TopBar />
      <div className="full-height h-full overflow-auto">{children}</div>
    </div>
  );
}