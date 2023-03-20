import Icon from "@mdi/react";
import { mdiBellOutline, mdiHomeFloorA } from "@mdi/js";
import RoundImage from "../image/RoundImage";
import Kangean from '../../public/icons/kangean_logo.svg'
import BSP from "../../public/icons/PT_BSP_logo.svg"
import Link from "next/link"
import { useEffect, useState } from "react";
import Mime from "../../dummy-data/mime";
import { useSelector } from "react-redux";
import Image from "next/image";

export default function TopBar(props) {
	const user = useSelector((state) => state.user.user);

	const [profile, setProfile] = useState("")
	useEffect(() => {
		setProfile(Mime(user.profile_picture))
        console.log(profile)
	}, []);

    return (
        <nav className="w-full flex justify-between items-center py-2 px-5 border-b border-gray-300">
            <Link href="/" className="flex items-center gap-x-4">
                <BSP className="w-[60px]" onClick={props.handleClick}/>
                <div>KEIDC</div>
            </Link>
            <div className="flex items-center gap-x-3">
                <img src="/icons/bell-outline.svg" className="w-[1rem]" alt="notification" />
                <div className="border-l-[1.5px] border-slate-200 h-6"> </div>
                <RoundImage
                    source={profile?profile:"/images/unknown.jpg"}
                    size={{ width: "1.5rem" }}
                ></RoundImage>
            </div>
        </nav>
    );
}
