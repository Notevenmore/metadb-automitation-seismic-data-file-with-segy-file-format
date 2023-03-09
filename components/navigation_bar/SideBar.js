import Item from "./navigation_item/Item";
import List from "../../router/List";
import { useState } from "react";
import SearchWidget from "../widget/Search";

export default function SideBar({ half }) {
	const [iconCollapse, setIconCollapse] = useState(false);
	return (
		<div
			className={`float-left ${
				half ? "h-full" : "h-screen"
			} flex flex-col pt-2 pb-10 w-[314px] bg-side_bar overflow-y-auto relative`}
			style={{ width: iconCollapse ? "auto" : "" }}>
			{iconCollapse ? (
				<div>
					<Item icon="/icons/magnify.svg" collapse={iconCollapse} />
                    <div className="border-b border-b-[#dddddd]"></div>
				</div>
			) : (
				<div>
					<SearchWidget />
				</div>
			)}
			<div onClick={() => setIconCollapse((prev) => !prev)}>
				<Item
					name="Collapse"
					icon={iconCollapse ? "/icons/chevron-double-right.svg" : "/icons/chevron-double-left.svg"}
					collapse={iconCollapse}></Item>
			</div>
			{List.map((router) => (
				<Item
					name={router.name}
					icon={router.icon}
					child={router.child}
					link={router.link}
					collapse={iconCollapse}
					key={router.name}></Item>
			))}
			<div className={`fixed bottom-0 h-[40px] ${iconCollapse? "" :"w-[314px]"} flex items-center justify-center text-[12px] text-[#a3a3a3] bg-side_bar`}>
				<div>© Kangean Energy Indonesia 2023</div>
			</div>
		</div>
	);
}
