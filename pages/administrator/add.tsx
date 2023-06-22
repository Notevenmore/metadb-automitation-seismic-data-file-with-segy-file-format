// get server side props

import { useRouter } from "next/router";
import Container from "../../components/container/container";
import Input from "../../components/input_form/input";
import { getLayoutTop } from "../../layout/getLayout";
import { addProfile } from "../../services/admin";
import { useState } from "react";
import { defaultProfile } from "../../dummy-data/mime";

AddNewUserPage.getLayout = getLayoutTop;

interface Detail {
	userid: string;
	type: "Regular User" | "Administrator";
	name: string;
	expiry_date?: string;
	affiliation: string;
	password: string;
}

export default function AddNewUserPage() {
	const [detail, setDetail] = useState<Detail>({
		userid: "",
		type: "Regular User",
		name: "",
		affiliation: "",
		password: "",
	});
    const [errMsg, setErrMsg] = useState("")
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setDetail((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = {
			...detail,
			profile_pict: defaultProfile()
		};
		await addProfile(data).then(
			(res) => {
                console.log(res)
                if(res && res.response){
                    console.log(res.response.data.detail)
                    setErrMsg(res.response.data.detail.msg)
                    return;
                }

                setErrMsg("")
				setDetail({
					userid: "",
					type: "Regular User",
					name: "",
					affiliation: "",
					password: "",
				});
			}, (err) => {
				if(err.response.status === 409) {
					setErrMsg(err.response.data.detail)
				}
			}
		);
	};

	return (
		<Container>
			<Container.Title back>Add new User</Container.Title>
			<form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-y-2">
				<Input
					type="text"
					label="User ID: "
					name="userid"
					label_loc="beside"
					required
					value={detail.userid}
					onChange={(e) => {
						handleChange(e);
					}}
				/>
				<Input
					type="text"
					label="Name: "
					name="name"
					label_loc="beside"
					required
					value={detail.name}
					onChange={(e) => {
						handleChange(e);
					}}
				/>
				<Input
					type="password"
					label="Password: "
					name="password"
					label_loc="beside"
					required
					value={detail.password}
					onChange={(e) => {
						handleChange(e);
					}}
				/>
				<Input
					type="dropdown"
					label="User Type: "
					dropdown_items={["Regular User", "Administrator"]}
					name="type"
					label_loc="beside"
					required
					value={detail.type}
					onChange={(e) => {
						handleChange(e);
					}}
				/>
				<Input
					type="text"
					label="Affiliation: "
					name="affiliation"
					label_loc="beside"
					required
					value={detail.affiliation}
					onChange={(e) => {
						handleChange(e);
					}}
				/>
                {errMsg && <div className="text-error">{errMsg}</div>}
				<div className="flex items-center gap-x-3">
					<button type="submit" className="px-3 py-1 rounded-[5px] hover:drop-shadow-lg bg-primary">
						Add User
					</button>
				</div>
			</form>
		</Container>
	);
}
