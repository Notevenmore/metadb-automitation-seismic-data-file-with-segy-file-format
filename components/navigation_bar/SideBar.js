import Item from "./navigation_item/Item";
import List from "../../router/List";

export default function SideBar({collapse, half}) {
    // const halfHeight = half==="" ? true : false;
    return (
        // <div className="float-left flex-col py-10 px-5 max-w-xs">
        <div className={`float-left ${half ? "h-full" : "h-screen"} flex flex-col py-5 max-w-xs bg-gray-100`}>
            {List.map((router) => (
                <Item
                    name={router.name}
                    icon={router.icon}
                    child={router.child}
                    link={router.link}
                    collapse={collapse}
                    key={router.name}
                ></Item>
            ))}
        </div>
    );
}
