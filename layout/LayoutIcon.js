import { useState } from "react";
import Footer from "../components/footer/Footer";
import SideBar from "../components/navigation_bar/SideBar";
import TopBar from "../components/navigation_bar/Topbar";

export default function LayoutIcon({ children }) {
    const [sideBar, setSideBar] = useState(false);

    function toggleNavBar() {
        setSideBar((prevToggle) => !prevToggle);
    }

    return (
        <div className="h-screen overflow-hidden">
            <TopBar handleClick={toggleNavBar}></TopBar>
            <SideBar collapse={sideBar}></SideBar>
            <div className="full-height h-full overflow-auto">
                {children}
                <Footer></Footer>
            </div>
        </div>
    );
}
