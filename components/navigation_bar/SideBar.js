import Item from "./navigation_item/Item";
import List from "../../router/List";
import { useState } from "react";

export default function SideBar({ half }) {
    const [iconCollapse, setIconCollapse] = useState(false);
    return (
        <div
            className={`float-left ${
                half ? "h-full" : "h-screen"
            } flex flex-col py-5 max-w-xs bg-side_bar overflow-y-auto`}
        >
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
