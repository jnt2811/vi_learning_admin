import { Layout, Result } from "antd";
import { Redirect, Route, Switch } from "react-router-dom";
import { paths } from "../constants";
import { Header } from "../layouts";
import { QlyAudio, QlyGiaoVien, QlyHocSinh, QlyKhoaHoc, QlySach, QlyThiThu } from "../pages";

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
          <Route exact path={paths.quan_ly_sach} component={QlySach} />
          <Route exact path={paths.quan_ly_audio} component={QlyAudio} />

          <Redirect exact from={paths.home} to={paths.quan_ly_khoa_hoc} />
          <Route render={() => <Result status="404" title="Trang web không tồn tại" />} />
        </Switch>
      </Layout.Content>
    </Layout>
  );
};
