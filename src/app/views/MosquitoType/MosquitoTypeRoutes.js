import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const MosquitoType = EgretLoadable({
  loader: () => import("./MosquitoType")
});
const ViewComponent = withTranslation()(MosquitoType);

const MosquitoTypeRoutes = [
  {
    path:  ConstantList.ROOT_PATH + "mosquito-type",
    exact: true,
    component: ViewComponent
  }
];

export default MosquitoTypeRoutes;
