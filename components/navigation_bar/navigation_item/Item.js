import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import Link from "next/link";
import styles from "../../../styles/NavItem.module.css";
import { useState } from "react";

export default function Item({ icon, name, child, link, collapse }) {
    const [toggleOpen, setToggleOpen] = useState(false);
    function toggle() {
        setToggleOpen(prevToggle => !prevToggle)
    }

    return (
        <div className="text-[14.5px]">
            <div onClick={toggle}>
                <Child
                    icon={icon}
                    name={name}
                    link={link}
                    collapse={collapse}
                ></Child>
            </div>
            {!collapse && child && toggleOpen && (
                <div className="ml-4">
                    {child.map((item, index) => (
                        <Child
                            key={index}
                            icon={item.icon}
                            name={item.name}
                            link={item.link}
                            collapse={collapse}
                        ></Child>
                    ))}
                </div>
            )}
        </div>
    );
}

function Child({ icon, name, link, collapse }) {
    const path = link ? link : "";

    return (
        <Link href={path} className={styles.navItem}>
            <div className="flex justify-between items-center px-5 py-2 gap-x-4 hover:bg-gray-200">
                <div className="flex gap-x-4">
                    <Icon path={icon} size={.9} />
                    {!collapse && <div>{name}</div>}
                </div>
                {!collapse && (
                    <div>
                        <Icon
                            path={mdiChevronRight}
                            size={.65}
                            className={styles.navItemChevron}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}
