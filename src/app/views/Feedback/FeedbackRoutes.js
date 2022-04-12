import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";

const Feedback = EgretLoadable({
	loader: () => import("./Feedback"),
});

const ViewComponent = withTranslation()(Feedback);

const feedbackRoutes = [
	{
		path: ConstantList.ROOT_PATH + "feedback",
		exact: true,
		component: ViewComponent,
	},
];

export default feedbackRoutes;
