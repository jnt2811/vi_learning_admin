import { notification } from "antd";
import axios from "axios";
import { keys } from "./constants";

const getAccessToken = () => {
  return localStorage.getItem(keys.ACCESS_TOKEN) || "";
};

export const apiClient = axios.create({
  baseURL: "https://a6e9-123-16-146-8.ap.ngrok.io/api",
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

export const handleAuthError = (error) => {
  const errorCode = error.code;
  let errorMessage = error.message;

  switch (errorCode) {
    case "auth/weak-password":
      errorMessage = "Mật khẩu ít nhất 6 ký tự";
      break;
    case "auth/email-already-in-use":
      errorMessage = "Email đăng nhập đã tồn tại";
      break;
    case "auth/invalid-email":
      errorMessage = "Email đăng nhập không hợp lệ";
      break;
    case "auth/operation-not-allowed":
      errorMessage = "Tài khoản chưa được kích hoạt";
      break;
    default:
      break;
  }

  notification.error({ message: errorMessage, placement: "bottomLeft" });
};

export const getShortName = (name = "") => {
  return name
    .split(" ")
    .map((x) => x[0])
    .join("");
};

export const isEmptyObj = (obj) => {
  if (typeof obj !== "object") return false;
  return Object.keys(obj).length === 0;
};
