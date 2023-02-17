import Icon from "@mdi/react";
import { mdiBellOutline, mdiHomeFloorA } from "@mdi/js";
import RoundImage from "../image/RoundImage";
import Kangean from '../../public/icons/kangean_logo.svg'
import Link from "next/link"

export default function TopBar(props) {
    return (
        <nav className="w-full flex justify-between items-center py-2 px-5 border-b border-gray-300">
            <Link href="/" className="flex items-center gap-x-4">
                <Kangean className='w-7' onClick={props.handleClick} />
                <div>KEIDC</div>
            </Link>
            <div className="flex items-center gap-x-3">
                <img src="/icons/bell-outline.svg" className="w-[1rem]" />
                <div className="border-l-[1.5px] border-slate-200 h-6"> </div>
                <RoundImage
                    source="/images/unknown.jpg"
                    size={{ width: "1.5rem" }}
                ></RoundImage>
            </div>
        </nav>
    );
}
