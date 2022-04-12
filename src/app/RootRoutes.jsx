import React from "react";
import { Redirect } from "react-router-dom";
import homeRoutes from "./views/home/HomeRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import administrativeUnitRoutes from "./views/AdministrativeUnit/AdministrativeUnitRoutes";
import healthOrganizationRoutes from "./views/HealthOrganizationUnit/HealthOrganizationUnitRoutes";
import fiscalYearRoutes from "./views/FiscalYear/FiscalYearRoutes";
import otherRoutes from "./views/others/OtherRoutes";
import UserRoutes from "./views/User/UserRoutes";
import departmentRoutes from "./views/Department/DepartmentRoutes";
import roleRoutes from "./views/Role/RoleRoutes";
import ConstantList from "./appConfig";
import MenuRoutes from "./views/Menus/MenuRoutes";
import pageLayoutRoutes from "./views/page-layouts/PageLayoutRoutees";
import UserOrganizaton from "./views/UserOrganization/UserOrganizationRoutes";
import Article from "./views/Article/ArticleRoutes";
import dengueLocation from "./views/DengueLocation/DengueLocationRoutes";
import category from "./views/Category/CategoryRoutes";
import feedback from "./views/Feedback/FeedbackRoutes";
import mapRoutes from "./views/Map/MapRoutes";
import SicknessType from "./views/SicknessType/SicknessTypeRoutes";
import MosquitoType from "./views/MosquitoType/MosquitoTypeRoutes";
import reDengueLocationRoutes from "./views/Re-DengueLocation/Re-DengueLocationRoutes";
import DengueLocationFormRoutes from "./views/Re-DengueLocation/DengueLocationFormRoutes";
import videoRoutes from "./views/VideoList/VideoListRoutes";
import CountNotificationRoutes from "./views/CountNotificationChart/CountNotificationRoutes";

const redirectRoute = [
  {
    path: ConstantList.ROOT_PATH,
    exact: true,
    component: () => <Redirect to={ConstantList.HOME_PAGE} />, //Luôn trỏ về HomePage được khai báo trong appConfig
  },
];

const errorRoute = [
  {
    component: () => <Redirect to={ConstantList.ROOT_PATH + "session/404"} />,
  },
];

const routes = [
  ...homeRoutes,
  ...redirectRoute,
  ...sessionRoutes,
  ...dashboardRoutes,
  ...administrativeUnitRoutes,
  ...healthOrganizationRoutes,
  ...CountNotificationRoutes,
  ...fiscalYearRoutes,
  ...departmentRoutes,
  ...pageLayoutRoutes,
  ...UserOrganizaton,
  ...DengueLocationFormRoutes,
  ...Article,
  ...SicknessType,
  ...MosquitoType,
  ...dengueLocation,
  ...reDengueLocationRoutes,
  ...category,
  ...feedback,
  ...videoRoutes,
  ...UserRoutes,
  ...roleRoutes,
  ...MenuRoutes,
  ...mapRoutes,
  ...errorRoute,
];

export default routes;
