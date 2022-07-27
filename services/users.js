import axios from "axios";

export default () => {
	return axios.create({
		baseURL: "https://628c722ba3fd714fd0322bbd.mockapi.io/"
	});
};
