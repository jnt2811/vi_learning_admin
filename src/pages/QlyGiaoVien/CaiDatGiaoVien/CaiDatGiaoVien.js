import { PlusOutlined } from "@ant-design/icons";
import {
  Drawer,
  Row,
  Space,
  Button,
  Table,
  Col,
  Input,
  Radio,
  Divider,
  Upload,
  Form,
} from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";

export const CaiDatGiaoVien = forwardRef((props, ref) => {
  const columns = [
    {
      title: "Tên bài học",
      dataIndex: "title",
    },
    {
      title: "Link video",
      dataIndex: "link",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
  ];

  const [currentData, setCurrentData] = useState();
  const [visible, setVisible] = useState(false);
  const [loadingSubmit] = useState(false);
  const [formInfoKhoaHoc] = Form.useForm();
  const [formThemBaihoc] = Form.useForm();

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const handleOpen = (data) => {
    setVisible(true);
    if (data) setCurrentData(data);
  };

  const handleClose = () => {
    setVisible(false);
    setCurrentData();
  };

  const handleUpdateKhoaHoc = (values) => {};

  const handleThemBaihoc = (values) => {};

  return (
    <Drawer
      width={1000}
      visible={visible}
      title={`${!currentData ? "Thêm mới" : "Chỉnh sửa"} giáo viên`}
      onClose={handleClose}
      footer={
        <Row align="middle" justify="end">
          <Space>
            <Button type="primary" ghost onClick={handleClose}>
              Huỷ bỏ
            </Button>
            <Button type="primary" loading={loadingSubmit}>
              Cập nhật
            </Button>
          </Space>
        </Row>
      }
    >
      <Row gutter={20}>
        <Col flex="auto">
          <Form
            layout="vertical"
            form={formInfoKhoaHoc}
            onFinish={handleUpdateKhoaHoc}
          >
            <h3>Thông tin khoá học</h3>

            <Row gutter={10}>
              <Col span={6}>
                <Form.Item
                  label="Tên khoá học"
                  name="title"
                  {...requiredFormItemProps}
                >
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  {...requiredFormItemProps}
                >
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item label="Trạng thái" name="status">
                  <Radio.Group defaultValue="public">
                    <Space>
                      <Radio value="public">Công khai</Radio>
                      <Radio value="private">Riêng tư</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col>
          <Upload maxCount={1} listType="picture-card" showUploadList={false}>
            <div>
              <PlusOutlined />
              <div>Tải ảnh lên</div>
            </div>
          </Upload>
        </Col>
      </Row>

      <Divider style={{ marginTop: 5 }} />

      <h3>Danh sách bài học</h3>

      <Form layout="vertical" form={formThemBaihoc} onFinish={handleThemBaihoc}>
        <Row gutter={10} align="middle">
          <Col flex="auto">
            <Row gutter={10}>
              <Col span={6}>
                <Form.Item
                  label="Tên bài học"
                  name="title"
                  {...requiredFormItemProps}
                >
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Link video"
                  name="link"
                  {...requiredFormItemProps}
                >
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  {...requiredFormItemProps}
                >
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col>
            <Button
              type="primary"
              style={{ marginTop: 3 }}
              icon={<PlusOutlined />}
            >
              Thêm
            </Button>
          </Col>
        </Row>
      </Form>

      <Table columns={columns} dataSource={[1]} size="small" />
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
