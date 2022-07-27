import { Drawer, Row, Space, Button, Input, Form, notification, Col } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { UploadImage } from "../components";
import { apis } from "../constants";
import { apiClient } from "../helpers";

export const CaiDatAudio = forwardRef(({ onSuccess }, ref) => {
  const [currentData, setCurrentData] = useState();
  const [visible, setVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const [image, setImage] = useState("");

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
    setImage("");
  };

  const initData = (data) => {
    form.setFields(
      Object.keys(data).map((name) => ({
        name,
        value: data[name],
      }))
    );
    setImage(data.thumbnail);
  };

  const handleUpdateAudio = async (values) => {
    if (!image) {
      return notification.error({ message: "Chưa tải ảnh lên!", placement: "bottomLeft" });
    }
    values.thumbnail = image;
    setLoadingSubmit(true);
    if (!currentData) themMoiAudio(values);
    else chinhSuaAudio(values);
  };

  const themMoiAudio = async (values) => {
    try {
      const data = { ...values };
      await apiClient.post(apis.add_audio, data);
      notification.success({ message: "Thêm mới thành công" });
      handleClose();
      return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Thêm mới thất bại" });
    }
  };

  const chinhSuaAudio = async (values) => {
    try {
      const data = { ...values };
      data.id = currentData.id;
      await apiClient.post(apis.edit_audio, data);
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
      title={`${!currentData ? "Thêm mới" : "Chỉnh sửa"} audio`}
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
      <Row justify="center">
        <Col>
          <UploadImage image={image} setImage={setImage} />
        </Col>
      </Row>

      <Form layout="vertical" form={form} onFinish={handleUpdateAudio}>
        <Form.Item label="Tên audio" name="name" {...requiredFormItemProps}>
          <Input placeholder="Nhập" />
        </Form.Item>

        <Form.Item label="Link mp3" name="link" {...requiredFormItemProps}>
          <Input placeholder="Nhập" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description" {...requiredFormItemProps}>
          <Input.TextArea rows={4} />
        </Form.Item>
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
