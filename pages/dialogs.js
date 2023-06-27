import {
  FloatDialogNotification,
  FloatDialogProfile,
} from '../components/float_dialog';
import PopupDialog from '../components/popup_dialog/popup_dialog';

export default function DialogsPage() {
  return (
    <div>
      <FloatDialogNotification />
      <FloatDialogProfile />
      <PopupDialog />
    </div>
  );
}
