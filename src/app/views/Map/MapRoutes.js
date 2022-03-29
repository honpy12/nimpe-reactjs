import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const Map = EgretLoadable({
	loader: () => import("./Map"),
});
const ViewComponent = withTranslation()(Map);

const mapRoutes = [
	{
		path: ConstantList.ROOT_PATH + "map",
		exact: true,
		component: ViewComponent,
	},
];

export default mapRoutes;
