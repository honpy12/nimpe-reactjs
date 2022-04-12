import axios from "axios";
import ConstantList from "../../appConfig";

const CategoryPath = ConstantList.API_ENPOINT + "/api/nimpe-category";

export const searchByPage = searchDto =>
	axios.post(`${CategoryPath}/searchByPage`, searchDto);

export const getCategoryById = id => axios.get(`${CategoryPath}/${id}`);

export const addCategory = category => axios.post(CategoryPath, category);

export const updateCategory = category =>
	axios.put(`${CategoryPath}/${category.id}`, category);

export const deleteCategory = id => axios.delete(`${CategoryPath}/${id}`);
