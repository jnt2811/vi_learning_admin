import { Layout } from "antd";
import { Redirect, Route, Switch } from "react-router-dom";
import { paths } from "../constants";
import { Header } from "../layouts";
import { QlyGiaoVien, QlyHocSinh, QlyKhoaHoc, QlyThiThu } from "../pages";

export const MainRoute = () => {
  return (
    <Layout>
      <Header />

      <Layout.Content
        style={{
          height: "calc(100vh - 64px)",
          overflow: "auto",
          padding: "25px 50px",
        }}
      >
        <Switch>
          <Route exact path={paths.quan_ly_giao_vien} component={QlyGiaoVien} />
          <Route exact path={paths.quan_ly_hoc_sinh} component={QlyHocSinh} />
          <Route exact path={paths.quan_ly_khoa_hoc} component={QlyKhoaHoc} />
          <Route exact path={paths.quan_ly_thi_thu} component={QlyThiThu} />

          <Redirect exact from={paths.home} to={paths.quan_ly_khoa_hoc} />
        </Switch>
      </Layout.Content>
    </Layout>
  );
};
