import Icon from "@mdi/react";
import { mdiBellOutline, mdiHomeFloorA } from "@mdi/js";
import RoundImage from "../image/RoundImage";

export default function TopBar(props) {
    return (
        <nav className="w-full flex justify-between items-center py-2 px-5 border-b-2 border-slate-200">
            <div className="flex items-center gap-x-4">
                <Icon path={mdiHomeFloorA} size={1.5} onClick={props.handleClick} />
                <div>title</div>
            </div>
            <div className="flex items-center gap-x-3">
                <Icon path={mdiBellOutline} size={.75} />
                <div className="border-l-[1.5px] border-slate-200 h-6"> </div>
                <RoundImage
                    source="/unknown.jpg"
                    size={{ width: "1.5rem" }}
                ></RoundImage>
            </div>
        </nav>
    );
}
