import { useState } from "react";
import Footer from "../components/footer/Footer";
import SideBar from "../components/navigation_bar/SideBar";
import TopBar from "../components/navigation_bar/Topbar";
import Widget from "../components/widget/Widget";
import Styles from "../styles/Layout.module.css";

export default function LayoutCollapse({ children }) {
    const [sideBar, setSideBar] = useState(true);

    function toggleNavBar() {
        setSideBar((prevToggle) => !prevToggle);
    }

    return (
        <div
            className={`${
                sideBar ? Styles.sideBarOpen : ""
            } ${Styles.halfSideBar} h-screen overflow-hidden`}
        >
            <TopBar handleClick={toggleNavBar}></TopBar>
            <div className="flex flex-row">
                <div className="flex flex-col max-w-xs flex-none">
                    <div className={`${Styles.sideBar} basis-1/2`}><SideBar half></SideBar></div>
                    <Widget></Widget>
                </div>
                <div className="full-height h-full overflow-auto flex-auto w-full">
                    {children}
                    <Footer></Footer>
                </div>
            </div>
        </div>
    );
}
