import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const User = EgretLoadable({
  loader: () => import("./UserOrganization")
});
const ViewComponent = withTranslation()(User);

const UserRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"user_manager/userOrganizaton",
    exact: true,
    component: ViewComponent
  }
];

export default UserRoutes;
