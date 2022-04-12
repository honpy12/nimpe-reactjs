import axios from "axios";
import ConstantList from "../../appConfig";

const BASE_URL = ConstantList.API_ENPOINT + "/api/health-organization";

export const searchByDto = searchDto => {
	const url = BASE_URL + "/search";
	return axios.post(url, searchDto);
};

export const getById = id => {
	const url = BASE_URL + `/${id}`;
	return axios.get(url);
};

export const addHealOrganization = adminUnit => {
	return axios.post(BASE_URL, adminUnit);
};

export const updateHealOrganization = adminUnit => {
	return axios.put(BASE_URL + `/${adminUnit.id}`, adminUnit);
};

export const deleteHealthOrganization = id => {
	return axios.delete(BASE_URL + `/${id}`);
};
