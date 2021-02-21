import React, { FC } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import "@/themes/global.less";

const Auth = React.lazy(() => import("@/pages/Auth"));
const Home = React.lazy(() => import("@/pages/Home"));

export const Pages: FC = props => {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path={"/home"} component={Home} />
      <Redirect to="/auth/login" />
    </Switch>
  );
};
