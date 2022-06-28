import { Spin } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { paths } from "../constants";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const value = {
    currentUser,
    login,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {(pathname.includes(paths.dang_nhap) || pathname.includes(paths.home)) &&
      loading ? (
        <Spin spinning={true} tip="Loading...">
          <div style={{ width: "100vw", height: "100vh" }}></div>
        </Spin>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
