import { Button, Col, Drawer, Form, Input, notification, Radio, Row, Space } from "antd";
import { nanoid } from "nanoid";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { TextEditor } from "../components";

export const CaiDatCauHoi = forwardRef(({ onSuccess }, ref) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentData, setCurrentData] = useState();
  const [editorValue, setEditorValue] = useState();

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const handleOpen = (data) => {
    setVisible(true);
    setCurrentData(data);
    if (data) {
      setEditorValue(data.name);
      form.setFields(
        Object.keys(data).map((name) => ({
          name,
          value: data[name],
        }))
      );
    }
  };

  const handleClose = () => {
    setVisible(false);
    setCurrentData();
    setEditorValue();
    form.resetFields();
  };

  const onFinish = (values) => {
    let data = {
      ...values,
      name: editorValue,
    };

    if (!currentData) data.key = nanoid(5);
    else data.key = currentData.key;

    function checkIfDuplicateExists(arr) {
      return new Set(arr).size !== arr.length;
    }

    const isDuplicate = checkIfDuplicateExists([data.ans_a, data.ans_b, data.ans_c, data.ans_d]);

    if (isDuplicate) {
      return notification.error({ message: "Câu trả lời bị trùng lặp", placement: "bottomLeft" });
    }

    onSuccess(data, !currentData);
    handleClose();
  };

  return (
    <Drawer
      width={600}
      visible={visible}
      title={`${!currentData ? "Thêm mới" : "Chỉnh sửa"} câu hỏi`}
      onClose={handleClose}
      footer={
        <Row align="middle" justify="end">
          <Space>
            <Button type="primary" ghost onClick={handleClose}>
              Huỷ bỏ
            </Button>

            <Button type="primary" onClick={() => form.submit()}>
              Cập nhật
            </Button>
          </Space>
        </Row>
      }
    >
      <Form form={form} onFinish={onFinish}>
        <h3>Câu hỏi</h3>

        <TextEditor value={editorValue} setValue={setEditorValue} />

        <h3 style={{ marginTop: 15 }}>Câu trả lời</h3>

        <Row gutter={10}>
          <Col span={12}>
            <Form.Item label="A" name="ans_a" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="B" name="ans_b" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="C" name="ans_c" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="D" name="ans_d" {...requiredFormItemProps}>
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>
        </Row>

        <h3>Đáp án</h3>

        <Form.Item
          name="correct_answer"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn đáp án đúng",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="ans_a">A</Radio>
            <Radio value="ans_b">B</Radio>
            <Radio value="ans_c">C</Radio>
            <Radio value="ans_d">D</Radio>
          </Radio.Group>
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
