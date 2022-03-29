import axios from "axios";
import ConstantList from "../../appConfig";
export const getAllEQAhealthOrgLevels = () => {
  return axios.get(ConstantList.API_ENPOINT+"/api/health-organization/getAll");  
};

export const searchByPage = healthOrgLevel => {
    return axios.post(ConstantList.API_ENPOINT + "/api/health-organization/searchByDto", healthOrgLevel);
  };

export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT+"/api/health-organization/"+id);
};

export const getItemById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/health-organization/getById/" + id);
};