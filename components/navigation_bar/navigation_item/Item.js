import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import Link from "next/link";
import styles from "../../../styles/NavItem.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

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

function Child({ icon, name, link="", collapse }) {
    const router = useRouter()
    return (
        <Link href={link || router.asPath} className={styles.navItem}>
            <div className="flex justify-between items-center px-5 py-2 gap-x-4 hover:bg-gray-200">
                <div className="flex gap-x-4">
                    <img src={icon} className="w-[.9rem] h-[22px]" alt="icon" />
                    {!collapse && <div>{name}</div>}
                </div>
                {!collapse && (
                    <div>
                        <img src="/icons/chevron-right.svg" alt="icon" className={`w-[25px] h-[15px] ${styles.navItemChevron}`} />
                    </div>
                )}
            </div>
        </Link>
    );
}
