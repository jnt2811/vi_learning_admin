import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Layout, Menu, Row, Avatar, Dropdown } from "antd";
import { useHistory } from "react-router-dom";
import { paths } from "../../constants";
import { getShortName } from "../../helpers";
import { useAuth } from "../../contexts/AuthContext";

export const Header = () => {
  const history = useHistory();
  const { userInfo, signout } = useAuth();

  const items = [
    {
      key: paths.quan_ly_khoa_hoc,
      label: "Quản lý khoá học",
    },
    {
      key: paths.quan_ly_giao_vien,
      label: "Quản lý giáo viên",
    },
    {
      key: paths.quan_ly_thi_thu,
      label: "Quản lý thi thử",
    },
    {
      key: paths.quan_ly_hoc_sinh,
      label: "Quản lý học sinh",
    },
  ];

  const handleClickMenu = ({ key }) => history.push(key);

  return (
    <Layout.Header>
      <Row align="middle">
        <Col flex="auto">
          <Row align="middle" gutter={20}>
            <Col style={{ fontSize: 30, color: "white" }}>LOGO</Col>
            <Col flex="auto">
              <Menu
                mode="horizontal"
                theme="dark"
                items={items}
                onClick={handleClickMenu}
                defaultSelectedKeys={[items[0].key]}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          <Dropdown
            trigger="click"
            placement="bottomRight"
            overlay={
              <div style={{ width: 150 }}>
                <Menu
                  items={[
                    {
                      key: 1,
                      icon: <UserOutlined />,
                      label: "Tài khoản",
                    },
                    {
                      key: 2,
                      icon: <LogoutOutlined />,
                      label: "Đăng xuất",
                      onClick: signout,
                    },
                  ]}
                />
              </div>
            }
          >
            <Avatar size={35} style={{ cursor: "pointer" }}>
              {getShortName(userInfo.name)}
            </Avatar>
          </Dropdown>
        </Col>
      </Row>
    </Layout.Header>
  );
};
