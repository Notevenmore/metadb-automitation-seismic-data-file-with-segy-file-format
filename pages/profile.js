import Buttons from "../components/buttons/buttons";
import TableComponent from "../components/table/table";
import Container from "../components/container/container";
import { useSelector } from "react-redux";
import { checkAuth } from "../layout/getLayout";
import { useEffect, useState } from "react";
import Image from "next/image";
import base64 from "base-64";

const Profile = () => {
	const user = useSelector((state) => state.user.user);
	console.log("???");

	const [content, setContent] = useState([])
	useEffect(() => {
		setContent([
			["Email", user.email],
			["Date joined", user.date_joined],
			["Role", user.role_id],
		])
		console.log(base64.decode(user.profile_picture));
	}, []);

	return (
		<Container>
			<Container.Title back>Account settings</Container.Title>
			<div className="space-y-5">
				<TableComponent
					header={["Account information", ""]}
					content={content}
					additional_styles="text-[14.5px]"
				/>
				<div>
					<h3 className="font-semibold">Password</h3>
					<p>
						Reset your password by clicking the link below. The password reset confirmation will be sent to
						your email.
					</p>
				</div>
				<Buttons path="" button_description="Change my password" />
				<div className="h-[200px] w-[200px]">
					<Image src="" width={100} height={100} className="object-fit" />
				</div>
			</div>
		</Container>
	);
};

export default Profile;
