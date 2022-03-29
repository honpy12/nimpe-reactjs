import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const DengueLocation = EgretLoadable({
	loader: () => import("./Dengue"),
});
const ViewComponent = withTranslation()(DengueLocation);

const dengueLocationRoutes = [
	{
		path: ConstantList.ROOT_PATH + "DengueLocation",
		exact: true,
		component: ViewComponent,
	},
];

export default dengueLocationRoutes;
