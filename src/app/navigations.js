import ConstantList from "./appConfig";
export const navigations = [
	{
		name: "Dashboard.dashboard",
		icon: "home",
		path: ConstantList.ROOT_PATH + "dashboard/analytics",
		isVisible: true,
	},
	{
		name: "manage.countNotification",
		icon: "timeline",
		path: ConstantList.ROOT_PATH + "CountNotification",
		isVisible: true,
	},
	{
		name: "dengueMap",
		icon: "map",
		path: ConstantList.ROOT_PATH + "map",
		isVisible: true,
	},
	// {
	// 	name: "manage.dengueLocation",
	// 	icon: "location_on",
	// 	path: ConstantList.ROOT_PATH + "DengueLocation",
	// 	isVisible: true,
	// },
	{
		name: "dengueLocation.dengueLocation",
		icon: "location_on",
		path: ConstantList.ROOT_PATH + "ReDengueLocation",
		isVisible: true,
	},
	{
		name: "manage.article",
		path: ConstantList.ROOT_PATH + "Article",
		icon: "article",
		isVisible: true,
	},
	{
		name: "manage.feedback",
		isVisible: true,
		path: ConstantList.ROOT_PATH + "feedback",
		icon: "feedback",
	},
	{
		name: "manage.healthOrganization",
		path: ConstantList.ROOT_PATH + "HealthOrganizationUnit",
		icon: "local_hospital",
		isVisible: true,
	},
	{
		name: "Dashboard.directory",
		icon: "dashboard",
		path: "",
		isVisible: true,
		children: [
			// {
			// 	name: "Dashboard.sicknessType",
			// 	icon: "list_alt",
			// 	path: ConstantList.ROOT_PATH + "sickness-type",
			// 	isVisible: true,
			// },
			// {
			// 	name: "Dashboard.mosquitoType",
			// 	icon: "list_alt",
			// 	path: ConstantList.ROOT_PATH + "mosquito-type",
			// 	isVisible: true,
			// },
			{
				name: "manage.directory",
				isVisible: true,
				path: ConstantList.ROOT_PATH + "Category",
				icon: "category",
			},
			{
				name: "manage.adminstrativeUnit",
				path: ConstantList.ROOT_PATH + "AdministrativeUnits",
				icon: "account_balance",
				isVisible: true,
			},
			// {
			// 	name: "manage.video",
			// 	isVisible: true,
			// 	path: ConstantList.ROOT_PATH + "Video",
			// 	icon: "video_library",
			// },
		],
	},
	{
		name: "Dashboard.manage",
		isVisible: true,
		icon: "engineering",
		children: [
			{
				name: "manage.user",
				isVisible: true,
				path: ConstantList.ROOT_PATH + "user_manager/user",
				icon: "person",
			},
			// {
			// 	name: "manage.menu",
			// 	isVisible: true,
			// 	path: ConstantList.ROOT_PATH + "list/menu",
			// 	icon: "list",
			// },
		],
	},
];
