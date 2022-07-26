import { PlusOutlined } from "@ant-design/icons";
import { Drawer, Row, Space, Button, Input, Form, notification, Col, Upload } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { apis } from "../constants";
import { apiClient } from "../helpers";

export const CaiDatSach = forwardRef(({ onSuccess }, ref) => {
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
      Object.keys(data).map((name) => ({
        name,
        value: data[name],
      }))
    );
  };

  const handleUpdateSach = async (values) => {
    setLoadingSubmit(true);
    if (!currentData) themMoiSach(values);
    else chinhSuaSach(values);
  };

  const themMoiSach = async (values) => {
    try {
      const data = { ...values };
      await apiClient.post(apis.add_book, data);
      notification.success({ message: "Thêm mới thành công" });
      handleClose();
      return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Thêm mới thất bại" });
    }
  };

  const chinhSuaSach = async (values) => {
    try {
      const data = { ...values };
      data.id = currentData.id;
      await apiClient.post(apis.edit_book, data);
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
      visible={visible}
      width={500}
      title={`${!currentData ? "Thêm mới" : "Chỉnh sửa"} sách`}
      onClose={handleClose}
      footer={
        <Row align="middle" justify="end">
          <Space>
            <Button type="primary" ghost onClick={handleClose}>
              Huỷ bỏ
            </Button>

            <Button type="primary" loading={loadingSubmit} onClick={() => form.submit()}>
              {`${!currentData ? "Thêm mới" : "Cập nhật"} `}
            </Button>
          </Space>
        </Row>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleUpdateSach}>
        <Form.Item label="Tên sách" name="name" {...requiredFormItemProps}>
          <Input placeholder="Nhập" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description" {...requiredFormItemProps}>
          <Input.TextArea rows={6} />
        </Form.Item>
      </Form>

      <label>Bộ sưu tập ảnh</label>
      <Row style={{ marginTop: 10 }}>
        <Col>
          <Upload maxCount={1} listType="picture-card" showUploadList={false}>
            <div>
              <PlusOutlined />
              <div>Tải ảnh lên</div>
            </div>
          </Upload>
        </Col>
      </Row>
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
