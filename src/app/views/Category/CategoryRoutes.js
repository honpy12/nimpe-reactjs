import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const AdministrativeUnitTable = EgretLoadable({
	loader: () => import("./CategoryTable"),
});

const ViewComponent = withTranslation()(AdministrativeUnitTable);

const administrativeUnitRoutes = [
	{
		path: ConstantList.ROOT_PATH + "Category",
		exact: true,
		component: ViewComponent,
	},
];

export default administrativeUnitRoutes;
