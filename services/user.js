import axios from "axios";

export async function getLogin(email, password) {
	const result = axios
		.get(`${process.env.backend_url}/users`, {
			headers: {
				email: "anya.forger@binus.ac.id",
				password: "peanut",
			},
		})
		.then((res) => {
			// console.log(res)
			return { data: res, succeed: true };
		})
		.catch((err) => {
			// console.log(err)
			return {data: err,succeed: false,};
		});

	return result;
}
