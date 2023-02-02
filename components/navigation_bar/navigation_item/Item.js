import Icon from "@mdi/react";
import { mdiChevronRight} from "@mdi/js";
import Link from "next/link";

export default function Item({ icon, name, child, link }) {
    console.log(icon, name, child, link)
    return (
        <Link href={link}>
            <div className="flex justify-between items-center py-2 gap-x-4">
                {/* icon and name */}
                <div className="flex gap-x-4">
                    <Icon
                        path={icon}
                        title={name}
                        size={1}
                    />
                    <div>{name}</div>
                </div>
                {/* children hover */}
                <div>
                    {child ? (
                        <Icon
                            path={mdiChevronRight}
                            title="expand"
                            size={1}
                            // color="white"
                        />
                    ) : (
                        <div style={{width:"1.5rem"}}></div>
                    )}
                </div>
            </div>
        </Link>
    );
}
