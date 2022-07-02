import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
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
  Select,
  InputNumber,
} from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { collections, keys } from "../../constants";
import { addDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { CaiDatCauHoi } from "./CaiDatCauHoi";

export const CaiDatThiThu = forwardRef(({ onSuccess = () => {} }, ref) => {
  const columns = [
    {
      title: "Tên câu hỏi",
      dataIndex: "question",
      ellipsis: true,
    },
    // {
    //   title: "Link video",
    //   dataIndex: "link",
    //   render: (data) => (
    //     <a href={data} target="_blank" rel="noreferrer">
    //       {data}
    //     </a>
    //   ),
    // },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   ellipsis: true,
    // },
    {
      title: "",
      dataIndex: "",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleSuaCauHoi(record);
            }}
          ></Button>

          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            ghost
            onClick={(e) => {
              e.stopPropagation();
              handleXoaCauHoi(record);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  const cauHoiRef = useRef();
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
      onSuccess();
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
      return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Chỉnh sửa thất bại" });
    }
  };

  const handleThemCauHoi = () => cauHoiRef.current?.open();
  const handleSuaCauHoi = (data) => cauHoiRef.current?.open(data);
  const handleXoaCauHoi = (data) => {
    setDsCauHoi((curr) => curr.filter((item) => item.key !== data.key));
  };

  const handleCaiDatCauHoi = (data, isAddNew = true) => {
    if (isAddNew) {
      setDsCauHoi((curr) => [data, ...curr]);
    } else {
      const index = dsCauHoi.findIndex((item) => item.key === data.key);
      setDsCauHoi((curr) => {
        const arr = [...curr];
        arr[index] = data;
        return arr;
      });
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

            <Button
              type="primary"
              loading={loadingSubmit}
              onClick={() => form.submit()}
            >
              Cập nhật
            </Button>
          </Space>
        </Row>
      }
    >
      <Row gutter={20} wrap={false}>
        <Col flex="auto">
          <Form layout="vertical" form={form} onFinish={handleUpdateBaiThi}>
            <h3>Thông tin bài thi</h3>

            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  label="Tên bài thi"
                  name="title"
                  {...requiredFormItemProps}
                >
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Mức độ"
                  name="mode"
                  {...requiredFormItemProps}
                >
                  <Select placeholder="Nhập">
                    <Select.Option value="easy">Dễ</Select.Option>
                    <Select.Option value="normal">Thường</Select.Option>
                    <Select.Option value="hard">Khó</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
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
              </Col>

              <Col span={16}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  {...requiredFormItemProps}
                >
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={8}>
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

      <Row align="middle" justify="space-between" style={{ marginBottom: 10 }}>
        <h3>Danh sách câu hỏi</h3>
        <Button type="primary" onClick={handleThemCauHoi}>
          Thêm câu hỏi
        </Button>
      </Row>

      <Table
        columns={columns}
        dataSource={dsCauHoi}
        size="small"
        rowKey="key"
      />

      <CaiDatCauHoi ref={cauHoiRef} onSuccess={handleCaiDatCauHoi} />
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
