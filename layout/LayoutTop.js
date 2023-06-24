import { useEffect } from "react";
import Footer from "../components/footer/Footer";
import SideBar from "../components/navigation_bar/SideBar";
import TopBar from "../components/navigation_bar/Topbar";
import { checkAuth } from "./getLayout";
import { useRouter } from "next/router";

export default function LayoutTOp({ children }) {
	checkAuth()

	return (
		<div className="h-screen overflow-hidden">
			<TopBar></TopBar>
			<div className="full-height h-full overflow-auto">
				{children}
				{/* <Footer></Footer> */}
			</div>
		</div>
	);
}
