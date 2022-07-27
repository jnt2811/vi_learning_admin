import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Layout, Menu, Row, Avatar, Dropdown } from "antd";
import { useHistory } from "react-router-dom";
import { keys, paths } from "../../constants";
import { getShortName } from "../../helpers";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/logo.png";

export const Header = () => {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useAuth();

  const handleClickMenu = ({ key }) => history.push(key);

  const handleLogout = () => {
    setCurrentUser();
    localStorage.clear();
  };

  const getItemsByRole = () => {
    let list = items;
    if (currentUser?.role !== keys.ROLE_ADMIN) {
      list = items.filter(
        (item) =>
          item.key !== paths.quan_ly_giao_vien &&
          item.key !== paths.quan_ly_sach &&
          item.key !== paths.quan_ly_audio
      );
    }
    return list;
  };

  return (
    <Layout.Header>
      <Row align="middle">
        <Col flex="auto">
          <Row align="middle" gutter={20}>
            <Col style={{ fontSize: 30, color: "white" }}>
              <img src={Logo} alt="logo" height={45} style={{ marginTop: -10 }} />
            </Col>
            <Col flex="auto">
              <Menu
                mode="horizontal"
                theme="dark"
                items={getItemsByRole()}
                onClick={handleClickMenu}
                defaultSelectedKeys={[getItemsByRole()[0].key]}
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
                      onClick: handleLogout,
                    },
                  ]}
                />
              </div>
            }
          >
            <Avatar size={35} style={{ cursor: "pointer" }} src={currentUser?.avatar}>
              {getShortName(currentUser?.name)}
            </Avatar>
          </Dropdown>
        </Col>
      </Row>
    </Layout.Header>
  );
};

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
  {
    key: paths.quan_ly_sach,
    label: "Quản lý sách",
  },
  {
    key: paths.quan_ly_audio,
    label: "Quản lý audio",
  },
];
