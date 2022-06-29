import { Spin } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import { keys, paths } from "../constants";
import { doc, getDoc } from "firebase/firestore";
import { isEmptyObj } from "../helpers";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signout = () => {
    auth.signOut();
    setUserInfo({});
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      if (isEmptyObj(userInfo) && !!user) getUserInfo(user.uid);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserInfo = async (id) => {
    try {
      const docRef = doc(firestore, keys.collection_users, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const info = { ...docSnap.data(), id };
        setUserInfo(info);
        return info;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    userInfo,
    getUserInfo,
    setUserInfo,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {(pathname.includes(paths.dang_nhap) || pathname.includes(paths.home)) &&
      (loading || (!!currentUser && isEmptyObj(userInfo))) ? (
        <Spin spinning={true} tip="Loading...">
          <div style={{ width: "100vw", height: "100vh" }}></div>
        </Spin>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
