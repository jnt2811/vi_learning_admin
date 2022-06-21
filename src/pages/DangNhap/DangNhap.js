import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Layout, Button } from "antd";
import { paths } from "../../constants";
import { useHistory } from "react-router-dom";

export const DangNhap = () => {
  const history = useHistory();

  const handleSubmit = (values) => {
    console.log("Login submit", values);
    history.push(paths.home);
  };

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Form
        initialValues={{ remember: true }}
        style={{ width: 400, margin: "auto" }}
        onFinish={handleSubmit}
      >
        <h1 style={{ textAlign: "center", fontSize: 40 }}>Đăng nhập</h1>

        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Tên đăng nhập"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<LockOutlined />}
            type="password"
            placeholder="Mật khẩu"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};
