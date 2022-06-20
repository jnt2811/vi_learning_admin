import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { paths } from "../constants";
import App from "../pages/App";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={paths.home} component={App} />
      </Switch>
    </BrowserRouter>
  );
};
