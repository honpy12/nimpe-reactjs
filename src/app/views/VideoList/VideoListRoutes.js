import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from "react-i18next";
const VideoListTable = EgretLoadable({
  loader: () => import("./VideoListTable"),
});

const ViewComponent = withTranslation()(VideoListTable);

const videoRoutes = [
  {
    path: ConstantList.ROOT_PATH + "Video",
    exact: true,
    component: ViewComponent,
  },
];

export default videoRoutes;
