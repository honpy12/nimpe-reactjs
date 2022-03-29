import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const DengueLocationForm = EgretLoadable({
  loader: () => import("./DengueLocationForm"),
});
const ViewComponent = withTranslation()(DengueLocationForm);

const DengueLocationFormRoutes = [
  {
    path: ConstantList.ROOT_PATH + "ReDengueLocation/create",
    exact: true,
    component: ViewComponent,
  },
];

export default DengueLocationFormRoutes;
