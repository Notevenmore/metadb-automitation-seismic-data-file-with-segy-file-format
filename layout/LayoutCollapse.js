import {useState} from 'react';
import Footer from '../components/footer/Footer';
import SideBar from '../components/navigation_bar/SideBar';
import TopBar from '../components/navigation_bar/Topbar';
import Styles from '../styles/Layout.module.css';

export default function LayoutCollapse({children}) {
  const [sideBar, setSideBar] = useState(true);

  function toggleNavBar() {
    setSideBar(prevToggle => !prevToggle);
  }

  return (
    <div
      className={`${
        sideBar ? Styles.sideBarOpen : ''
      } h-screen overflow-hidden`}>
      <TopBar handleClick={toggleNavBar}></TopBar>
      <div className={`full-height ${Styles.sideBar}`}>
        <SideBar></SideBar>
      </div>
      <div className="h-full overflow-auto">
        {children}
        <Footer></Footer>
      </div>
    </div>
  );
}
