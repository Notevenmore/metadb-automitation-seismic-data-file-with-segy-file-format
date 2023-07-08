import TopBar from '../components/Navigation/TopBar';
import {CheckAuth, CheckUser} from '../utils/check';
import {PopupProvider} from '@contexts/PopupContext';

export default function LayoutTop({children}) {
  CheckAuth();
  CheckUser('Administrator');

  return (
    <PopupProvider>
      <div className="h-screen overflow-hidden">
        <TopBar />
        <div className="full-height h-full overflow-auto">{children}</div>
      </div>
    </PopupProvider>
  );
}
