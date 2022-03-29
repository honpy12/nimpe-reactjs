import axios from "axios";
import ConstantList from "../../appConfig";

const STATICS_URL = ConstantList.API_ENPOINT + "/api/NotificationStatistics";

export const getCountNotifyByDay = (month, year) =>
	axios.get(STATICS_URL + `/StatisticsByDay/${month}/${year}`);

export const getCountNotifyByMonth = year =>
	axios.get(STATICS_URL + `/StatisticsByMonth/${year}`);
