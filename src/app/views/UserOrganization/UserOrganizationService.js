import axios from "axios";
import ConstantList from "../../appConfig";


export const searchByDto = (searchDto) => {
  var url = ConstantList.API_ENPOINT + "/api/user-organization/searchByDto";
  return axios.post(url, searchDto);
};

export const getById = id => {
  var url = ConstantList.API_ENPOINT + "/api/user-organization/" + id;
  return axios.get(url);
};
export const deleteUserOrganizationUnit = id => {
  return axios.delete(ConstantList.API_ENPOINT + "/api/user-organization/" + id);
};
export const addUserOrganizationUnit = adminUnit => {
  return axios.post(ConstantList.API_ENPOINT + "/api/user-organization", adminUnit);
};
export const updateUserOrganizationUnit = adminUnit => {
  return axios.put(ConstantList.API_ENPOINT + "/api/user-organization/" + adminUnit.id, adminUnit);
};
