const APPLICATION_PATH = "/";
const VOUCHER_TYPE = {
	Liquidate: -2, // Thanh lý
	StockOut: -1, //Xuất kho vật tư
	StockIn: 1, //Nhập kho vật tư
	Allocation: 2, //Cấp phát
	Transfer: 3, //Điều chuyển
	ReceivingAsset: 4, //Tiếp nhận tài sản
	TransferToAnotherUnit: 5, //Điều chuyển đơn vị khác
};

//const APPLICATION_PATH="/asset_develop/";//Đặt homepage tại package.json giống như tại đây nếu deploy develop
module.exports = Object.freeze({
	//ROOT_PATH : "/egret/",
	ROOT_PATH: APPLICATION_PATH,
	ACTIVE_LAYOUT: "layout1", //layout1 = vertical, layout2=horizontal
	// API_ENPOINT: "http://localhost:8081/core",    //local
	API_ENPOINT: "http://Api-N.ap-southeast-1.elasticbeanstalk.com/nimpe",
	//API_ENPOINT: "http://api.oceantech.vn/demonimpe",
	LOGIN_PAGE: APPLICATION_PATH + "session/signin", //Nếu là Spring
	HOME_PAGE: APPLICATION_PATH + "dashboard/analytics", //Nếu là Spring
	//HOME_PAGE:APPLICATION_PATH+"dashboard/learning-management"//Nếu là Keycloak
	//HOME_PAGE:APPLICATION_PATH+"landing3",//Link trang landing khi bắt đầu
	VOUCHER_TYPE: VOUCHER_TYPE,
	MATERIAL_DEPARTMENT_CODE: "VPB4",
});
