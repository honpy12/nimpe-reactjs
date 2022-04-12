import axios from "axios";
import ConstantList from "../../appConfig";

const BASE_API = ConstantList.API_ENPOINT + "/api/patientInformation";

export const searchByPagePatient = option =>
	axios.post(BASE_API + "/searchByDto", option);

export const addPatient = item => axios.post(BASE_API, item);

export const updatePatient = item => axios.put(BASE_API + `/${item.id}`, item);

export const deletePatient = id => axios.delete(BASE_API + `/${id}`);

export const exportExcelPatient = () =>
	axios.get(BASE_API + "/exportExcel", {
		responseType: "blob",
	});
