import axios from "axios";
import ConstantList from "../../appConfig";

const BASE_URL = ConstantList.API_ENPOINT + "/api/admin-unit";

export const searchByDto = searchDto =>
	axios.post(BASE_URL + "/searchByDto", searchDto);

export const getByPageByParentId = (searchDto) => {
  if (searchDto.parentId != null || searchDto.isGetAllCity) {
    var url = BASE_URL + "/searchByDto" ;
    return axios.post(url, searchDto);
  }
  searchDto.pageSize = 0;
  return axios.post(url, searchDto);
};

export const getById = id => axios.get(`${BASE_URL}/${id}`);

export const checkExists = adminUnit =>
	axios.post(BASE_URL + `/checkCode`, adminUnit);

export const addNewAdministrativeUnit = adminUnit =>
	axios.post(BASE_URL, adminUnit);

export const updateAdministrativeUnit = adminUnit =>
	axios.put(`${BASE_URL}/${adminUnit.id}`, adminUnit);

export const deleteAdministrativeUnit = id => axios.delete(`${BASE_URL}/${id}`);
