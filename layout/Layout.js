import { useState } from "react";
import Footer from "../components/footer/Footer";
import SideBar from "../components/navigation_bar/SideBar";
import TopBar from "../components/navigation_bar/Topbar";
import Styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
    const [sideBar, setSideBar] = useState(true);

    function toggleNavBar() {
        setSideBar((prevToggle) => !prevToggle);
        console.log(sideBar);
    }

    return (
        <div className={sideBar && Styles.sideBarOpen}>
            <TopBar handleClick={toggleNavBar}></TopBar>
            <div className={Styles.sideBar}>
                <SideBar></SideBar>
            </div>
            <>{children}</>
            <Footer></Footer>
        </div>
    );
}
