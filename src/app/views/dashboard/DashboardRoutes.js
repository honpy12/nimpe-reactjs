import { EgretLoadable } from "egret";
import { authRoles } from "../../auth/authRoles";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const LearningManagement = EgretLoadable({
	loader: () => import("./LearningManagement"),
});
const Analytics = EgretLoadable({
	loader: () => import("./Analytics"),
});
const Sales = EgretLoadable({
	loader: () => import("./Sales"),
});
const Dashboard1 = EgretLoadable({
	loader: () => import("./Dashboard1"),
});

const AnalyticsComponent = withTranslation()(Analytics);

const dashboardRoutes = [
	{
		path: ConstantList.ROOT_PATH + "dashboard/analytics",
		component: AnalyticsComponent,
		auth: authRoles.admin,
	},
	{
		path: ConstantList.ROOT_PATH + "dashboard/sales",
		component: Sales,
		auth: authRoles.admin,
	},
	// {
	//   path:  ConstantList.ROOT_PATH+"dashboard/dashboard1",
	//   component: Dashboard1
	// },
	{
		path: ConstantList.ROOT_PATH + "dashboard/learning-management",
		component: LearningManagement,
		auth: authRoles.admin,
	},
];

export default dashboardRoutes;
