import NotFound from "./NotFound";
import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';

import ConstantList from "../../appConfig";

const SignIn = EgretLoadable({
  loader: () => import("./SignIn")
});
const ViewComponentSignIn = withTranslation()(SignIn);

const SignUp = EgretLoadable({
  loader: () => import("./SignUp_RegisterAccount")
});
const ViewComponentSignUp = withTranslation()(SignUp);

const ForgotPassword = EgretLoadable({
  loader: () => import("./ForgotPassword")
});
const ViewComponentForgotPassword = withTranslation()(ForgotPassword);

const OTPAuthentication = EgretLoadable({
  loader: () => import("./OTPAuthentication")
});
const ViewComponentOTPAuthentication = withTranslation()(OTPAuthentication);

const settings = {
  activeLayout: "layout1",
  layout1Settings: {
    topbar: {
      show: false
    },
    leftSidebar: {
      show: false,
      mode: "close"
    }
  },
  layout2Settings: {
    mode: "full",
    topbar: {
      show: false
    },
    navbar: { show: false }
  },
  secondarySidebar: { show: false },
  footer: { show: false }
};

const sessionRoutes = [
  {
    path: ConstantList.ROOT_PATH + "session/signup-register-account",
    component: ViewComponentSignUp,
    settings
  },
  {
    path: ConstantList.ROOT_PATH + "session/signin",
    component: ViewComponentSignIn,
    settings
  },
  {
    path: ConstantList.ROOT_PATH + "session/forgot-password",
    component: ViewComponentForgotPassword,
    settings
  },
  {
    path: ConstantList.ROOT_PATH + "session/otpAuth/:email",
    component: ViewComponentOTPAuthentication,
    settings
  },
  
  {
    path: ConstantList.ROOT_PATH + "session/404",
    component: NotFound,
    settings
  }
];

export default sessionRoutes;
