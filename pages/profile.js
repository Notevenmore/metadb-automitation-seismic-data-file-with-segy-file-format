import Buttons from "../components/buttons/buttons";
import TableComponent from "../components/table/table";
import Container from "../components/container/container";

const Profile = () => {
	return (
		<Container>
			<Container.Title back>Account settings</Container.Title>
			<TableComponent
				header={["Account information", ""]}
				content={[
					["Email", "john.doe@email.com"],
					["Date joined", "01 - 01 - 2023"],
					["Role", "IT Admin"],
				]}
				additional_styles="text-[14.5px]"
			/>
			<div>
				<h3 className="font-semibold">Password</h3>
				<p>
					Reset your password by clicking the link below. The password reset confirmation will be sent to your
					email.
				</p>
			</div>
			<Buttons path="" button_description="Change my password" />
		</Container>
	);
};

export default Profile;
