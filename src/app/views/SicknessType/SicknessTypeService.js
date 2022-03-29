import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/sicknessType";


export const searchByPage = (searchObject) => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};

export const deleteItem = (id) => {
  let url = API_PATH + "/" + id;
  return axios.put(url);
};

export const addNew = (obj) => {
  let url = API_PATH;
  return axios.post(url, obj);
};

export const update = (obj) => {
  let url = API_PATH + "/" + obj.id;
  return axios.post(url, obj);
};

export const getItemById = (id) => {
    let url = API_PATH + "/" + id;
    return axios.get(url);
};

export const checkCode =  code => {
  const config = { params: { code: code }};
  var url = ConstantList.API_ENPOINT + "/api/sicknessType/checkCode";
  return axios.put(url, null, config);
};



