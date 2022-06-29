import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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
  notification,
} from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { collections, keys } from "../../constants";
import { addDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

export const CaiDatKhoaHoc = forwardRef(({ onSuccess = () => {} }, ref) => {
  const columns = [
    {
      title: "Tên bài học",
      dataIndex: "title",
    },
    {
      title: "Link video",
      dataIndex: "link",
      render: (data) => (
        <a href={data} target="_blank" rel="noreferrer">
          {data}
        </a>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleXoaBaihoc(record);
          }}
        ></Button>
      ),
    },
  ];

  const [currentData, setCurrentData] = useState();
  const [visible, setVisible] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formInfoKhoaHoc] = Form.useForm();
  const [formThemBaihoc] = Form.useForm();
  const [dsBaiHoc, setDsBaiHoc] = useState([]);

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
    setDsBaiHoc([]);
    setCurrentData();
    formInfoKhoaHoc.resetFields();
    formThemBaihoc.resetFields();
  };

  const initData = (data) => {
    formInfoKhoaHoc.setFields(
      Object.keys(data).map((name) => ({
        name,
        value: data[name],
      }))
    );
    setDsBaiHoc(data.lessons);
  };

  const handleUpdateKhoaHoc = async (values) => {
    setLoadingSubmit(true);
    if (!currentData) themMoiKhoaHoc(values);
    else chinhSuaKhoaHoc(values);
  };

  const themMoiKhoaHoc = async (values) => {
    try {
      const data = {
        ...values,
        lessons: dsBaiHoc,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      await addDoc(collections.courses, data);
      notification.success({ message: "Thêm mới thành công" });
      onSuccess();
      return handleClose();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Thêm mới thất bại" });
    }
  };

  const chinhSuaKhoaHoc = async (values) => {
    try {
      const data = {
        ...values,
        lessons: dsBaiHoc,
        updated_at: serverTimestamp(),
      };
      const ref = doc(firestore, keys.collection_courses, currentData.id);
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

  const handleThemBaihoc = (values) => {
    const exist = dsBaiHoc.some((baiHoc) => baiHoc.title === values.title);
    if (exist) return notification.error({ message: "Bài học đã tồn tại!" });
    setDsBaiHoc((curr) => [values, ...curr]);
    formThemBaihoc.resetFields();
  };

  const handleXoaBaihoc = (record) => {
    setDsBaiHoc((curr) => {
      return curr.filter((baiHoc) => baiHoc.title !== record.title);
    });
  };

  return (
    <Drawer
      width={1000}
      visible={visible}
      title={`${!currentData ? "Thêm mới" : "Chỉnh sửa"} khoá học`}
      onClose={handleClose}
      footer={
        <Row align="middle" justify="end">
          <Space>
            <Button type="primary" ghost onClick={handleClose}>
              Huỷ bỏ
            </Button>
            <Button
              type="primary"
              loading={loadingSubmit}
              onClick={() => formInfoKhoaHoc.submit()}
            >
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
              htmlType="submit"
              style={{ marginTop: 3 }}
              icon={<PlusOutlined />}
            >
              Thêm
            </Button>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={dsBaiHoc}
        size="small"
        rowKey="title"
      />
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
