import axios from "axios";
import ConstantList from "../../appConfig";

// export const getAllVideo = () => {
//   return axios.get(ConstantList.API_ENPOINT + "/public/api/video/getAll");
// };

export const searchByDto = (searchDto) => {
    var url = ConstantList.API_ENPOINT + "/public/api/video/searchByPage";
    return axios.post(url, searchDto);
};

export const getById = (id) => {
    var url = ConstantList.API_ENPOINT + "/api/nimpe-article/" + id;
    return axios.get(url);
};

export const deleteVideo = (id) => {
    return axios.delete(
        ConstantList.API_ENPOINT + "/public/api/video/deleteVideoById/" + id
    );
};

export const addVideo = (video, config) => {
    return axios.post(
        ConstantList.API_ENPOINT + "/public/api/video/uploadVideo",
        video,
        config
    );
};

export const updateVideo = (id, video, config) => {
    return axios.put(
        ConstantList.API_ENPOINT + "/public/api/video/updateVideo/" + id,
        video, config
    );
};

export const sendNotifycation = (object) => {
    var url = ConstantList.API_ENPOINT + "/public/api/fcm/notification";
    return axios.post(url, object);
};