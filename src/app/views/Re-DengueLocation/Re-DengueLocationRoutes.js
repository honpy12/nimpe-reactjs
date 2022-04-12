import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const DengueLocation = EgretLoadable({
	loader: () => import("./Dengue"),
});
const ViewComponent = withTranslation()(DengueLocation);

const reDengueLocationRoutes = [
	{
		path: ConstantList.ROOT_PATH + "ReDengueLocation",
		exact: true,
		component: ViewComponent,
	},
];

export default reDengueLocationRoutes;
