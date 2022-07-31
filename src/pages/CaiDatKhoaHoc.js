import { DeleteOutlined, DownOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
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
  Form,
  notification,
} from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { apis } from "../constants";
import { apiClient, uploadFile } from "../helpers";
import { UploadImage } from "../components";
import { useAuth } from "../contexts/AuthContext";

export const CaiDatKhoaHoc = forwardRef(({ onSuccess = () => {} }, ref) => {
  const columns = [
    {
      title: "Sắp xếp",
      width: 100,
      render: (_, record, index) => (
        <Space>
          <Button
            icon={<UpOutlined />}
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSapXepBaiHoc(index, "up");
            }}
            disabled={index === 0}
          ></Button>

          <Button
            icon={<DownOutlined />}
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSapXepBaiHoc(index, "down");
            }}
            disabled={index === dsBaiHoc.length - 1}
          ></Button>
        </Space>
      ),
    },
    {
      title: "Tên bài học",
      dataIndex: "name",
    },
    {
      title: "Link video",
      dataIndex: "video",
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
          danger
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
  const [loadingLessonList, setLoadingLessonList] = useState(false);
  const { currentUser } = useAuth();
  const [image, setImage] = useState("");
  const [fileImage, setFileImage] = useState();

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
    setImage("");
    setFileImage();
  };

  const initData = (data) => {
    formInfoKhoaHoc.setFields(
      Object.keys(data).map((name) => ({
        name,
        value: data[name],
      }))
    );
    getLessonList(data.id);
    setImage(data.thumbnail);
  };

  const getLessonList = async (id) => {
    try {
      setLoadingLessonList(true);
      const { data } = await apiClient.post(apis.get_all_lessons, { course_id: id });
      setDsBaiHoc(data);
      setLoadingLessonList(false);
    } catch (error) {
      console.log(error);
      setLoadingLessonList(false);
    }
  };

  const handleSapXepBaiHoc = (index, action) => {
    const currentItem = dsBaiHoc[index];
    let arrItems = [...dsBaiHoc];

    if (action === "up") {
      const formerItem = dsBaiHoc[index - 1];

      arrItems[index] = formerItem;
      arrItems[index - 1] = currentItem;
    } else if (action === "down") {
      const latterItem = dsBaiHoc[index + 1];

      arrItems[index] = latterItem;
      arrItems[index + 1] = currentItem;
    }

    setDsBaiHoc(arrItems);
  };

  const handleUpdateKhoaHoc = async (values) => {
    if (!image) {
      return notification.error({ message: "Chưa tải ảnh lên!", placement: "bottomLeft" });
    }

    if (dsBaiHoc.length === 0) {
      return notification.error({ message: "Chưa thêm khóa học!", placement: "bottomLeft" });
    }

    setLoadingSubmit(true);

    values.thumbnail = image;

    if (fileImage) {
      const url = await uploadFile(fileImage);

      if (url) {
        values.thumbnail = url;
      } else {
        setLoadingSubmit(false);
        return notification.error({ message: "Lỗi lưu ảnh!", placement: "bottomLeft" });
      }
    }

    values.lessons = dsBaiHoc.map((item, index) => ({ ...item, order_number: index + 1 }));

    console.log("[INFO] lưu khóa học", values);

    if (!currentData) themMoiKhoaHoc(values);
    else chinhSuaKhoaHoc(values);
  };

  const themMoiKhoaHoc = async (data) => {
    try {
      data.created_by = currentUser?.id;
      await apiClient.post(apis.add_new_course, data);
      notification.success({ message: "Thêm mới thành công" });
      onSuccess();
      return handleClose();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Thêm mới thất bại" });
    }
  };

  const chinhSuaKhoaHoc = async (data) => {
    try {
      data.id = currentData.id;
      await apiClient.post(apis.update_course, data);
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
    const exist = dsBaiHoc.some((baiHoc) => baiHoc.name === values.name);
    if (exist) return notification.error({ message: "Bài học đã tồn tại!" });
    setDsBaiHoc((curr) => [values, ...curr]);
    formThemBaihoc.resetFields();
  };

  const handleXoaBaihoc = (record) => {
    setDsBaiHoc((curr) => {
      return curr.filter((baiHoc) => baiHoc.name !== record.name);
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
            <Button type="primary" loading={loadingSubmit} onClick={() => formInfoKhoaHoc.submit()}>
              Cập nhật
            </Button>
          </Space>
        </Row>
      }
    >
      <Row gutter={20}>
        <Col flex="auto">
          <Form layout="vertical" form={formInfoKhoaHoc} onFinish={handleUpdateKhoaHoc}>
            <h3>Thông tin khoá học</h3>

            <Row gutter={10}>
              <Col span={6}>
                <Form.Item label="Tên khoá học" name="name" {...requiredFormItemProps}>
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item label="Mô tả" name="description" {...requiredFormItemProps}>
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={7}>
                <Form.Item label="Trạng thái" name="active" initialValue={1}>
                  <Radio.Group>
                    <Space>
                      <Radio value={1}>Công khai</Radio>
                      <Radio value={0}>Riêng tư</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col>
          <UploadImage image={image} setImage={setImage} setFileImage={setFileImage} />
        </Col>
      </Row>

      <Divider style={{ marginTop: 5 }} />

      <h3>Danh sách bài học</h3>

      <Form layout="vertical" form={formThemBaihoc} onFinish={handleThemBaihoc}>
        <Row gutter={10} align="middle">
          <Col flex="auto">
            <Row gutter={10}>
              <Col span={6}>
                <Form.Item label="Tên bài học" name="name" {...requiredFormItemProps}>
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Link video" name="video" {...requiredFormItemProps}>
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Mô tả" name="description" {...requiredFormItemProps}>
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
        rowKey="name"
        loading={loadingLessonList}
        pagination={false}
        scroll={{ y: "calc(100vh - 500px)" }}
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
