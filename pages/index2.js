import FloatDialogNotification, {FloatDialogProfile} from "../components/float_dialog"
import PopupDialog from '../components/popup_dialog'

import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <FloatDialogNotification></FloatDialogNotification>
      <FloatDialogProfile></FloatDialogProfile>
      <PopupDialog></PopupDialog>
    </div>
  )
}
