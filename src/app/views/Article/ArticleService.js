import axios from "axios";
import ConstantList from "../../appConfig";

export const getAllArticle = () => {
	return axios.get(ConstantList.API_ENPOINT + "/api/nimpe-article/1/10");
};

export const searchByDto = searchDto => {
	var url = ConstantList.API_ENPOINT + "/api/nimpe-article/searchByDto";
	return axios.post(url, searchDto);
};

export const getById = id => {
	var url = ConstantList.API_ENPOINT + "/api/nimpe-article/" + id;
	return axios.get(url);
};
export const deleteArticle = id => {
	return axios.delete(ConstantList.API_ENPOINT + "/api/nimpe-article/" + id);
};
export const addNewArticle = article => {
	return axios.post(ConstantList.API_ENPOINT + "/api/nimpe-article", article);
};

export const updateArticle = article => {
	return axios.put(
		ConstantList.API_ENPOINT + "/api/nimpe-article/" + article.id,
		article
	);
};

export const sendNotification = id =>
	axios.post(
		ConstantList.API_ENPOINT +
			"/api/nimpe-article/titleArticleNotification/" +
			id,
		{}
	);

// export const sendNotifycation = object => {
// 	var url = ConstantList.API_ENPOINT + "/public/api/fcm/notification";
// 	return axios.post(url, object);
// };
