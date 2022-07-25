import { Drawer, Row, Space, Button, Col, Input, Divider, Form, notification, Select } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { collections, keys } from "../constants";
import { addDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import TextArea from "antd/lib/input/TextArea";

export const CaiDatSach = forwardRef((props, ref) => {
  const [currentData, setCurrentData] = useState();
  const [visible, setVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [form] = Form.useForm();
  const [dsCauHoi, setDsCauHoi] = useState([]);

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
    setDsCauHoi([]);
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
    setDsCauHoi(data.questions);
  };

  const handleUpdateBaiThi = async (values) => {
    setLoadingSubmit(true);
    if (!currentData) themMoiBaiThi(values);
    else chinhSuaBaiThi(values);
  };

  const themMoiBaiThi = async (values) => {
    try {
      const data = {
        ...values,
        questions: dsCauHoi,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      await addDoc(collections.tests, data);
      notification.success({ message: "Thêm mới thành công" });
      //   onSuccess();
      return handleClose();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Thêm mới thất bại" });
    }
  };

  const chinhSuaBaiThi = async (values) => {
    try {
      const data = {
        ...values,
        questions: dsCauHoi,
        updated_at: serverTimestamp(),
      };
      const ref = doc(firestore, keys.collection_tests, currentData.id);
      await updateDoc(ref, data);
      notification.success({ message: "Chỉnh sửa thành công" });
      handleClose();
      //   return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Chỉnh sửa thất bại" });
    }
  };

  return (
    <Drawer
      width={1000}
      visible={visible}
      title={`${!currentData ? "Thêm mới" : "Chỉnh sửa"} bài thi`}
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
      <Row gutter={20} wrap={false}>
        <Col flex="auto">
          <Form layout="vertical" form={form} onFinish={handleUpdateBaiThi}>
            <h3>Thông tin sách</h3>

            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="Tên tiêu đề sách" name="title" {...requiredFormItemProps}>
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Loại sách" name="mode" {...requiredFormItemProps}>
                  <Select placeholder="Nhập">
                    <Select.Option value="easy">Dễ</Select.Option>
                    <Select.Option value="normal">Thường</Select.Option>
                    <Select.Option value="hard">Khó</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* <Col span={8}>
                <Form.Item
                  label="Thời gian (phút)"
                  name="time"
                  {...requiredFormItemProps}
                >
                  <InputNumber
                    placeholder="Nhập"
                    min={0}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col> */}

              <Col span={24}>
                <Form.Item label="Mô tả" name="description" {...requiredFormItemProps}>
                  <TextArea
                    rows={4}
                    placeholder="Điền vào đây"
                    // maxLength={6}
                  />
                </Form.Item>
              </Col>

              {/* <Col span={8}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  initialValue="public"
                >
                  <Radio.Group>
                    <Space>
                      <Radio value="public">Công khai</Radio>
                      <Radio value="private">Riêng tư</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </Col>
      </Row>

      <Divider style={{ marginTop: 5 }} />
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
