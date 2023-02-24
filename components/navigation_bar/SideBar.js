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
            } flex flex-col pt-2 pb-10 w-[314px] bg-side_bar overflow-y-auto`}
            style={{width: iconCollapse && "auto"}}
        >
            <div>
                {iconCollapse ? <Item icon="/icons/magnify.svg" collapse={iconCollapse} /> : <SearchWidget />}
            </div>
            <div onClick={() => setIconCollapse(prev => !prev)}>
                <Item
                    name="Collapse"
                    icon={iconCollapse ? "/icons/chevron-double-right.svg" : "/icons/chevron-double-left.svg"}
                    collapse={iconCollapse}
                ></Item>
            </div>
            {List.map((router) => (
                <Item
                    name={router.name}
                    icon={router.icon}
                    child={router.child}
                    link={router.link}
                    collapse={iconCollapse}
                    key={router.name}
                ></Item>
            ))}
        </div>
    );
}
