import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Layout, Button, notification } from "antd";
import { useState } from "react";
import { apis, keys } from "../constants";
import { apiClient } from "../helpers";

export const DangNhap = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post(apis.login, values);
      if (data.user.role !== keys.ROLE_ADMIN && data.user.role !== keys.ROLE_TEACHER) {
        setLoading(false);
        return notification.error({ message: "Đăng nhập thất bại", placement: "bottomLeft" });
      }
      localStorage.setItem(keys.ACCESS_TOKEN, data.token);
      localStorage.setItem(keys.USER_INFO, JSON.stringify(data.user));
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
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
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
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
