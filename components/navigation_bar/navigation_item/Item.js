import Link from "next/link";
import styles from "../../../styles/NavItem.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Item({ icon, name, child, link, collapse, setCollapse }) {
    const [toggleOpen, setToggleOpen] = useState(false);
    const [selected, setselected] = useState("")
    function toggle() {
        if (collapse) {
            setToggleOpen(true)
        } else {
            setToggleOpen(prevToggle => !prevToggle)
        }
    }

    return (
        <div className="text-[14.5px]">
            <div onClick={() => { toggle(); try { setCollapse(false) } catch (error) { } }}>
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
                        <div key={item.name + index} onClick={() => { setselected(item.name) }}>
                            <Child
                                icon={item.icon}
                                name={item.name}
                                link={item.link}
                                collapse={collapse}
                                selected={selected}
                                setSelected={setselected}
                            ></Child>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Child({ icon, name, link = "", collapse }) {
    const router = useRouter()
    return (
        <Link href={link || router.asPath} className={styles.navItem}>
            <div className={`flex justify-between items-center px-5 py-2 gap-x-4 hover:bg-gray-200 ${router.asPath.split("/").some(path => { return path === name?.toLowerCase().replace(/\s/g, "_") }) ? "bg-[#dae0e5]" : ""} relative transition-all`}>
                <div className="flex gap-x-4">
                    <img src={icon} className="w-[.9rem] h-[22px]" alt="icon" />
                    {!collapse && <div className="w-[200px]">{name}</div>}
                </div>
                {!collapse && (
                    <div className="absolute right-5">
                        <img src="/icons/chevron-right.svg" alt="icon" className={`w-[25px] h-[15px] ${styles.navItemChevron}`} />
                    </div>
                )}
            </div>
        </Link>
    );
}
