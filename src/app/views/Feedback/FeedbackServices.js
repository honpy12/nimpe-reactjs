import axios from "axios";
import ConstantList from "../../appConfig";

const BASE_URL = ConstantList.API_ENPOINT + "/api/user-feedback";

export const searchByPage = options =>
	axios.post(BASE_URL + "/searchByPage", options);

export const addFeedback = feedback => axios.post(BASE_URL, feedback);

export const updateFeedback = feedback =>
	axios.put(BASE_URL + `/${feedback.id}`, feedback);

export const deleteFeedback = id => axios.delete(BASE_URL + `/${id}`);
