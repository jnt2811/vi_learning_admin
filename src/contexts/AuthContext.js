import { Spin } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { keys, paths } from "../constants";
import { isEmptyObj } from "../helpers";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const localUser = localStorage.getItem(keys.USER_INFO);

  useEffect(() => {
    if (localUser) {
      setLoading(false);
      const parsedUser = JSON.parse(localUser);
      setCurrentUser(parsedUser);
      console.log("user info", parsedUser);
    }
  }, [localUser]);

  const value = {
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading || !currentUser ? (
        <Spin spinning={true} tip="Loading...">
          <div style={{ width: "100vw", height: "100vh" }}></div>
        </Spin>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
