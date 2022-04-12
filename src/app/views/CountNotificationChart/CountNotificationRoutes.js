import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from "react-i18next";
const CountNotificationChart = EgretLoadable({
  loader: () => import("./CountNotification"),
});

const ViewComponent = withTranslation()(CountNotificationChart);

const CountNotificationRoutes = [
  {
    path: ConstantList.ROOT_PATH + "CountNotification",
    exact: true,
    component: ViewComponent,
  },
];

export default CountNotificationRoutes;
