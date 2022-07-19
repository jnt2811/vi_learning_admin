import { BrowserRouter, Switch } from "react-router-dom";
import { paths } from "../constants";
import { AuthProvider } from "../contexts/AuthContext";
import { ScrollToTop } from "../hooks";
import { DangNhap } from "../pages";
import { AuthRoute, PrivateRoute } from "./ConfigRoutes";
import { MainRoute } from "./MainRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />

        <Switch>
          <AuthRoute exact path={paths.dang_nhap} component={DangNhap} />
          <PrivateRoute path={paths.home} component={MainRoute} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
};
