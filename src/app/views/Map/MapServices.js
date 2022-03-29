import axios from "axios";
import ConstantList from "../../appConfig";

export const getListPatient = (searchObject) => {
	const config = { params: { month : searchObject.month, year:  searchObject.year} };
	return axios.get(ConstantList.API_ENPOINT + `/api/patientInformation/listPatient`,config)
}

export const getListVector = (searchObject) => {
	const config = { params: { month : searchObject.month, year:  searchObject.year} };
	return axios.get(ConstantList.API_ENPOINT + `/api/dengue-location-item/listDengueLocationItem`,config)
}