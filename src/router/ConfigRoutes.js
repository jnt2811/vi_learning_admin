import { paths } from "../constants";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const AuthRoute = ({ component: Component, ...remainingProps }) => {
  const { currentUser } = useAuth();
  const isAuth = !!currentUser;

  return (
    <Route
      {...remainingProps}
      render={(props) => {
        return isAuth ? <Redirect to={paths.home} /> : <Component {...props} />;
      }}
    />
  );
};

export const PrivateRoute = ({ component: Component, ...remainingProps }) => {
  const { currentUser } = useAuth();
  const isAuth = !!currentUser;

  return (
    <Route
      {...remainingProps}
      render={(props) => {
        return isAuth ? <Component {...props} /> : <Redirect to={paths.dang_nhap} />;
      }}
    />
  );
};

// export const PublicRoute = ({ component: Component, ...remainingProps }) => {
//   const isAuth = localGet(localKeys.ACCESS_TOKEN) !== "";

//   const authReducer = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   if (isAuth && !authReducer.isOk) {
//     dispatch(doGetUser());
//   }

//   return (
//     <Route
//       {...remainingProps}
//       render={(props) => {
//         return <Component {...props} />;
//       }}
//     />
//   );
// };
