import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/footer/Footer";
import SideBar from "../components/navigation_bar/SideBar";
import TopBar from "../components/navigation_bar/Topbar";
import { checkAuth } from "./getLayout";

export default function LayoutIcon({ children }) {
    checkAuth()

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
