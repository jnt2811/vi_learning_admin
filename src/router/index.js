import { HashRouter, Route, Switch } from "react-router-dom";
import { paths } from "../constants";
import { DangNhap } from "../pages";
import { MainRoute } from "./MainRoute";

export const AppRouter = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path={paths.dang_nhap} component={DangNhap} />
        <Route path={paths.home} component={MainRoute} />
      </Switch>
    </HashRouter>
  );
};
