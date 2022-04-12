import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const SicknessType = EgretLoadable({
  loader: () => import("./SicknessType")
});
const ViewComponent = withTranslation()(SicknessType);

const SicknessTypeRoutes = [
  {
    path:  ConstantList.ROOT_PATH + "sickness-type",
    exact: true,
    component: ViewComponent
  }
];

export default SicknessTypeRoutes;
