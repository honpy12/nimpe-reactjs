import axios from "axios";
import ConstantList from "../../appConfig";

// DengueLocation
const denguePath = ConstantList.API_ENPOINT + "/api/dengue-location";
export const getAllDengueLocation = searchDto =>
	axios.post(denguePath + "/searchByDto", searchDto);

export const getDengueLocationById = id => axios.get(denguePath + `/${id}`);

export const addDengueLocation = item => axios.post(denguePath, item);

export const updateDengueLocation = item =>
	axios.put(denguePath + `/${item.id}`, item);

export const deleteDengueLocation = id => axios.delete(denguePath + `/${id}`);

// DengueLocationItem
const dengueItemPath = ConstantList.API_ENPOINT + "/api/dengue-location-item";

export const getAllDengueLocationItem = searchDto =>
	axios.post(dengueItemPath + "/searchByDto", searchDto);

export const getDengueLocationItemById = id =>
	axios.get(dengueItemPath + `/${id}`);

export const addDengueLocationItem = item => axios.post(dengueItemPath, item);

export const updateDengueLocationItem = item =>
	axios.put(dengueItemPath + `/${item.id}`, item);

export const deleteDengueLocationItem = id =>
	axios.delete(dengueItemPath + `/${id}`);

export const getAddressDetail = item =>
	axios.get(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${item[0]},${item[1]}.json`,
		{
			params: {
				types: "poi",
				country: "VN",
				language: "vi",
				access_token:
					"pk.eyJ1IjoibWVvMTIzIiwiYSI6ImNrdTI2MTQzZzBoNzMyd3FrNWVpc3U1YjEifQ.zj-vYL4EgQI83LzH8w8n6g",
			},
		}
	);

export const exportExcelVector = () =>
	axios.get(dengueItemPath + "/exportExcel", {
		responseType: "blob",
	});
