import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import Link from "next/link";
import styles from "../../../styles/NavItem.module.css";

export default function Item({ icon, name, child, link}) {
    const path = link ? link : "";

    return (
        <Link href={path} className={styles.navItem}>
                <div className="flex justify-between items-center py-2 gap-x-4">
                    <div className="flex gap-x-4">
                        <Icon path={icon} size={1} />
                        <div>{name}</div>
                    </div>
                    <div>
                        {child ? (
                            <Icon
                                path={mdiChevronRight}
                                title="expand"
                                size={1}
                                className={styles.navItemChevron}
                            />
                        ) : (
                            <div style={{ width: "1.5rem" }}></div>
                        )}
                    </div>
                </div>
        </Link>
    );
}
