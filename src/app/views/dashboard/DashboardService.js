import axios from "axios";
import ConstantList from "../../appConfig";

const BASE_URL = ConstantList.API_ENPOINT + "/api/Statistical";

const STATICS_URL = ConstantList.API_ENPOINT + "/api/NotificationStatistics";

export const getDashboardTotal = (searchobject) => {
  const config = { params: { year: searchobject.year } };
  return axios.post(ConstantList.API_ENPOINT + "/api/chart", null, config);
};

export const getDashboardAnalytics = (searchobject) => {
  return axios.post(
    ConstantList.API_ENPOINT + "/api/report/getReport",
    searchobject
  );
};
export const getCountNotification = (month, year) =>
  axios.get(STATICS_URL + `/StatisticsByMonth/${month}/${year}`);

export const addCountNofication = () => {
  return axios.post(STATICS_URL + "/CountNotification");
};
