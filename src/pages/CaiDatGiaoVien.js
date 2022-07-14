import { PlusOutlined } from "@ant-design/icons";
import { Drawer, Row, Space, Button, Col, Input, Upload, Form, Checkbox, Select, DatePicker, notification } from "antd";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { forwardRef, useImperativeHandle, useState } from "react";
import { keys } from "../constants";
import { firestore } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { handleAuthError } from "../helpers";
import moment from "moment";

export const CaiDatGiaoVien = forwardRef(({ onSuccess = () => {} }, ref) => {
  const { signup } = useAuth();
  const [currentData, setCurrentData] = useState();
  const [visible, setVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const handleOpen = (data) => {
    setVisible(true);
    if (data) {
      setCurrentData(data);
      initData(data);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setLoadingSubmit(false);
    setCurrentData();
    form.resetFields();
  };

  const initData = (data) => {
    form.setFields(
      Object.keys(data).map((name) => {
        let value = data[name];
        if (name === "dob") value = moment(value, "DD/MM/YYYY");
        return { name, value };
      })
    );
  };

  const onFinish = (values) => {
    console.log(values);
    values.dob = values.dob.format("DD/MM/YYYY");
    if (currentData) chinhSuaGiaoVien(values);
    else themMoiGiaoVien(values);
  };

  const themMoiGiaoVien = async (values) => {
    try {
      setLoadingSubmit(true);
      // signup
      const password = values.phone;
      const signupRes = await signup(values.email, password);
      const uid = signupRes.user.uid;
      // add to db
      const data = {
        ...values,
        role: "teacher",
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      await setDoc(doc(firestore, keys.collection_users, uid), data);
      notification.success({ message: "Thêm mới thành công" });
      handleClose();
      return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      if (error.errorCode.includes("auth")) return handleAuthError(error);
      return notification.error({ message: "Thêm mới thất bại" });
    }
  };

  const chinhSuaGiaoVien = async (values) => {
    try {
      setLoadingSubmit(true);
      const data = {
        ...values,
        updated_at: serverTimestamp(),
      };
      const ref = doc(firestore, keys.collection_users, currentData.id);
      await updateDoc(ref, data);
      notification.success({ message: "Chỉnh sửa thành công" });
      handleClose();
      return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Chỉnh sửa thất bại" });
    }
  };

  return (
    <Drawer
      width={800}
      visible={visible}
      title={`${!currentData ? "Thêm mới" : "Chỉnh sửa"} giáo viên`}
      onClose={handleClose}
      footer={
        <Row align="middle" justify="end">
          <Space>
            <Button type="primary" ghost onClick={handleClose}>
              Huỷ bỏ
            </Button>
            <Button type="primary" loading={loadingSubmit} onClick={() => form.submit()}>
              Cập nhật
            </Button>
          </Space>
        </Row>
      }
    >
      <Row justify="center">
        <Col>
          <Upload maxCount={1} listType="picture-card" showUploadList={false}>
            <div>
              <PlusOutlined />
              <div>Tải ảnh lên</div>
            </div>
          </Upload>
        </Col>
      </Row>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={10} align="bottom">
          <Col span={8}>
            <Form.Item label="Họ và tên" name="name" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Giới tính" name="gender" {...requiredFormItemProps}>
              <Select placeholder="Chọn" style={{ width: "100%" }}>
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
                <Select.Option value="Khác">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Ngày sinh" name="dob" {...requiredFormItemProps}>
              <DatePicker placeholder="DD/MM/YYYY" format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Số điện thoại" name="phone" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Email" name="email" {...requiredFormItemProps}>
              <Input placeholder="Nhập" readOnly={!!currentData} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Địa chỉ" name="address" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="on_work" initialValue={true} valuePropName="checked">
              <Checkbox defaultChecked>Đang công tác</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div>Lưu ý:</div>
      <ul>
        <li>Tài khoản đăng nhập là địa chỉ email</li>
        <li>Mật khẩu sẽ được khởi tạo là số điện thoại</li>
      </ul>
    </Drawer>
  );
});

const requiredFormItemProps = {
  rules: [
    {
      required: true,
      message: "Vui lòng nhập",
    },
  ],
};
