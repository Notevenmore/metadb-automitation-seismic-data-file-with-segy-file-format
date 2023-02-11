import { useState } from "react";
import Footer from "../components/footer/Footer";
import SideBar from "../components/navigation_bar/SideBar";
import TopBar from "../components/navigation_bar/Topbar";

export default function LayoutIcon({ children }) {
    return (
        <div className="h-screen overflow-hidden">
            <TopBar></TopBar>
            <SideBar></SideBar>
            <div className="full-height h-full overflow-auto">
                {children}
                <Footer></Footer>
            </div>
        </div>
    );
}
