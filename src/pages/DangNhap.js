import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Layout, Button, notification } from "antd";
import { apis, keys } from "../constants";
import { apiClient } from "../helpers";
import { useAuth } from "../contexts/AuthContext";

export const DangNhap = () => {
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (values) => {
    try {
      const { data } = await apiClient.post(apis.login, values);
      localStorage.setItem(keys.ACCESS_TOKEN, data.token);
      localStorage.setItem(keys.USER_INFO, JSON.stringify(data.user));
      setCurrentUser(data.user);
      notification.success({ message: "Đăng nhập thành công", placement: "bottomLeft" });
    } catch (error) {
      console.log(error);
      notification.error({ message: "Đăng nhập thất bại", placement: "bottomLeft" });
    }
  };

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Form
        initialValues={{ remember: true }}
        style={{ width: 400, margin: "auto" }}
        onFinish={handleSubmit}
      >
        <h1 style={{ textAlign: "center", fontSize: 40 }}>Đăng nhập</h1>

        <Form.Item name="username" {...formItemRequired}>
          <Input size="large" prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item name="password" {...formItemRequired}>
          <Input size="large" prefix={<LockOutlined />} type="password" placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={false}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

const formItemRequired = {
  rules: [
    {
      required: true,
      message: "Hãy nhập đầy đủ thông tin",
    },
  ],
};
