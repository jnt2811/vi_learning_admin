import "antd/dist/antd.variable.min.css";
import { ConfigProvider } from "antd";
import viVN from "antd/lib/locale/vi_VN";

ConfigProvider.config({
  theme: {
    primaryColor: "#fb5231",
  },
});

export const AntdConfig = ({ children }) => {
  return (
    <ConfigProvider locale={viVN} input={{ autoComplete: "new_password" }}>
      {children}
    </ConfigProvider>
  );
};
