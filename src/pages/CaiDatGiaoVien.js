import {
  Drawer,
  Row,
  Space,
  Button,
  Col,
  Input,
  Form,
  Select,
  DatePicker,
  notification,
  Checkbox,
  Upload,
} from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { apis, keys } from "../constants";
import { apiClient } from "../helpers";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";

export const CaiDatGiaoVien = forwardRef(({ onSuccess = () => {} }, ref) => {
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
      console.log("data", data);
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
        if (name === "dob") value = value ? moment(value, "DD/MM/YYYY") : undefined;
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
      values.role = keys.ROLE_TEACHER;
      await apiClient.post(apis.add_new_user, values);
      notification.success({ message: "Thêm mới thành công" });
      handleClose();
      return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Thêm mới thất bại" });
    }
  };

  const chinhSuaGiaoVien = async (values) => {
    try {
      setLoadingSubmit(true);
      values.id = currentData.id;
      await apiClient.post(apis.update_user, values);
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
              Lưu thay đổi
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
          <Col span={12}>
            <Form.Item label="Tên đăng nhập" name="username" {...requiredFormItemProps}>
              <Input placeholder="Nhập" readOnly={currentData} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Mật khẩu" name="password" {...requiredFormItemProps}>
              <Input.Password placeholder="Nhập" />
            </Form.Item>
          </Col>

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
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Địa chỉ" name="address" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="active" initialValue={true} valuePropName="checked">
              <Checkbox defaultChecked>Đang công tác</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
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
