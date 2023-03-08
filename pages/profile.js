import Buttons from "../components/buttons/buttons";
import TableComponent from "../components/table/table";
import Container from "../components/container/container";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment/moment";

const Profile = () => {
	const user = useSelector((state) => state.user.user);

	const [content, setContent] = useState([])
	useEffect(() => {
		setContent([
			["Email", user.email],
			["Date joined", moment(user.date_joined).format("DD - MM - YYYY")],
			["Role", user.role_id],
		])
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
			</div>
		</Container>
	);
};

export default Profile;
