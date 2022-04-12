import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/public/api/";

export const signUpAccount = item => {
  var url = API_PATH + "register";
  return axios.post(url, item);
};

export const checkuserName = item => {  
  const config = { params: { userName:  item.username } };
  console.log(config)
  var url = API_PATH + "username";
  return axios.put(url,null,config);
};

export const checkEmail = item => {
  const config = { params: { email:  item.email } };
  console.log(config)
  var url = API_PATH + "email";
  return axios.put(url, null, config);
};

export const forgotPassword = email => {
  let url = ConstantList.API_ENPOINT + '/public/api/forgot-password';
  return axios.post(url, email);
}
export const resetPassword = item => {
  let url = 'http://localhost:8993/nimpe/public/api/OTP';
  return axios.put(url, item);
}

export const checkOTP = item => {
  let url = ConstantList.API_ENPOINT + "/public/api/OTP/register"; 
  return axios.put(url, item);
}