import Buttons, { Buttons_Sidebar } from '../components/buttons'
import FloatDialogNotification, {FloatDialogProfile} from "../components/float_dialog"
import PopupDialog from '../components/popup_dialog'
import Bibliography from '../public/icons/bibliography.svg'
import Info from '../public/icons/info.svg'
import Maps from '../public/icons/maps.svg'
import Outcrop from '../public/icons/outcrop.svg'
import Project_file from '../public/icons/project_file.svg'
import Seismic from '../public/icons/seismic.svg'
import Technical_report from '../public/icons/technical_report.svg'
import Well from '../public/icons/well.svg'
import Well_sample_core from '../public/icons/well_sample_core.svg'
import Arrow from '../public/icons/arrow_notrail.svg'
import TableComponent from '../components/table'
import Input from '../components/input'

import styles from '../styles/Home.module.css'

export default function Home() {
  const tableData = {
    header: ["id", "email", "first_name", "last_name", "avatar"],
    content: [
      {
        "id": 1,
        "email": "george.bluth@reqres.in",
        "first_name": "George",
        "last_name": "Bluth",
        "avatar": "https://reqres.in/img/faces/1-image.jpg"
      },
      {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://reqres.in/img/faces/2-image.jpg"
      }
    ]
  }
  const dropdownItems = ['Demo item 1', 'Demo item 2', 'Demo item 3', 'Demo item 4', 'Demo item 5', 'Demo item 6', 'Demo item 7', 'Demo item 8', 'Demo item 9']
  
  return (
    <div>
      <FloatDialogNotification></FloatDialogNotification>
      <FloatDialogProfile></FloatDialogProfile>
      <PopupDialog></PopupDialog>
    </div>
  )
}
