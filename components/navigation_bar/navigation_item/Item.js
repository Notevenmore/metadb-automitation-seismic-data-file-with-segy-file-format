import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import Link from "next/link";
import styles from "../../../styles/NavItem.module.css";

export default function Item({ icon, name, child, link, collapse }) {
    const path = link ? link : "";

    return (
        <Link href={path} className={`${styles.navItem}  hover:bg-gray-200`}>
            <div className="flex justify-between items-center px-5 py-2 gap-x-4">
                <div className="flex gap-x-4">
                    <Icon path={icon} size={1} />
                    {!collapse && <div>{name}</div>}
                </div>
                {!collapse && (
                    <div>
                        <Icon
                            path={mdiChevronRight}
                            size={1}
                            className={styles.navItemChevron}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}
