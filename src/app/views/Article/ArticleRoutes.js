import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ArticleTable = EgretLoadable({
  loader: () => import("./ArticleTable")
});

const ViewComponent = withTranslation()(ArticleTable);

const articleRoutes = [
  {
    path: ConstantList.ROOT_PATH + "Article",
    exact: true,
    component: ViewComponent
  }
];

export default articleRoutes;
