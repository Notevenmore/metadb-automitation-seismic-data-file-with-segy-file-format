import Item from "./navigation_item/Item";
import List from "../../router/List";

export default function SideBar() {
    console.log(List);
    return (
        // <div className="float-left flex-col py-10 px-5 max-w-xs">
        <div className="float-left grid grid-flow-row auto-row-max py-5 px-5 max-w-xs bg-gray-100">
            {List.map((router) => (
                <Item
                    name={router.name}
                    icon={router.icon}
                    child={router.children ? true : false}
                    link={router.link}
                    key={router.link}
                ></Item>
            ))}
        </div>
    );
}
