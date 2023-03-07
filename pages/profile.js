import Buttons from "../components/buttons/buttons";
import TableComponent from "../components/table/table";
import Container from "../components/container/container";
import { useSelector } from "react-redux";

const Profile = () => {
    const user = useSelector((state) => state.user.user)

	return (
		<Container>
			<Container.Title back>Account settings</Container.Title>
			<div className="space-y-5">
				<TableComponent
					header={["Account information", ""]}
					content={[
						["Email", user.email],
						["Date joined", user.date_joined],
						["Role", user.role_id],
					]}
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
