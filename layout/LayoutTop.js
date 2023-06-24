import TopBar from "../components/navigation_bar/Topbar";
import { checkAuth, checkUser } from "../utils/check";

export default function LayoutTOp({ children }) {
	checkAuth()
	checkUser("Administrator")

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
