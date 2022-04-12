import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const AdministrativeUnitTable = EgretLoadable({
	loader: () => import("./AdministrativeUnitTable"),
});

const ViewComponent = withTranslation()(AdministrativeUnitTable);

const administrativeUnitRoutes = [
	{
		path: ConstantList.ROOT_PATH + "AdministrativeUnits",
		exact: true,
		component: ViewComponent,
	},
];

export default administrativeUnitRoutes;
