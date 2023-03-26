import axios from "axios";

export async function getLogin(email, password) {
	const result = axios
		.get(`${process.env.backend_url}/users`, {
			headers: {
				email: email,
				password: password,
			},
		})
		.then((res) => {
			console.log(res)
			if (!res.data){
				throw new Error("Incorrent credentials. Try again or use a different account if the problem still persists")
			}
			return { data: res, succeed: true };
		})
		.catch((err) => {
			console.log(err.code, err.message)
			throw new Error(`${err.message}. Please contact maintainer.`)
			return {data: err,succeed: false,};
		});

	return result;
}

export async function getAllRoles() {
	const result = axios
		.get(`${process.env.backend_url}/roles`)
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