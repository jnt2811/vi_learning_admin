import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Layout, Button, notification } from "antd";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const DangNhap = () => {
  const [loading, setLoading] = useState(false);
  const { login, getUserInfo, signout } = useAuth();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const loginRes = await login(values.email, values.password);
      const infoRes = await getUserInfo(loginRes.user.uid);
      const isNotAllowed =
        !infoRes ||
        (!!infoRes && infoRes.role !== "admin" && infoRes.role !== "teacher");
      if (isNotAllowed) {
        signout();
        notification.error({
          placement: "bottomLeft",
          message: "Tài khoản không có quyền truy cập",
        });
      } else {
        notification.success({
          placement: "bottomLeft",
          message: "Đăng nhập thành công",
          duration: 1,
        });
      }
    } catch (error) {
      console.log(error);
      let message = "Đăng nhập thất bại";
      switch (error.code) {
        case "auth/user-not-found":
          message = "Email không chính xác";
          break;
        case "auth/wrong-password":
          message = "Mật khẩu chưa chính xác";
          break;
        default:
          break;
      }
      notification.error({
        placement: "bottomLeft",
        message,
      });
      setLoading(false);
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

        <Form.Item name="email" {...formItemRequired}>
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Tên đăng nhập"
          />
        </Form.Item>

        <Form.Item name="password" {...formItemRequired}>
          <Input
            size="large"
            prefix={<LockOutlined />}
            type="password"
            placeholder="Mật khẩu"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
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
