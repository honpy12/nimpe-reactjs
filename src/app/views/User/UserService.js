import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/user-search/";

const API_PATH_ROLE = ConstantList.API_ENPOINT + "/api/roles/";

const API_USER = ConstantList.API_ENPOINT + "/api/users";

export const getAllRoles = () => {
	var url = API_PATH_ROLE + "all";
	return axios.get(url);
};

export const searchByPage = option =>
	axios.get(API_USER + `/${option.pageIndex}/${option.pageSize}`);

export const searchUser = option =>
	axios.post(
		ConstantList.API_ENPOINT +
			`/api/users/search/${option.pageIndex}/${option.pageSize}`,
		{ keyword: option.keyword }
	);

export const addUser = user => axios.post(API_USER, user);

export const updateUser = user => axios.put(API_USER, user);

export const deleteUser = id => axios.delete(API_USER + `/${id}`);
