import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
  Select,
  InputNumber,
} from "antd";
import { nanoid } from "nanoid";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { apis } from "../constants";
import { apiClient } from "../helpers";
import { useAuth } from "../contexts/AuthContext";
import { CaiDatCauHoi } from "./CaiDatCauHoi";
import { UploadImage } from "../components";

export const CaiDatThiThu = forwardRef(({ onSuccess = () => {} }, ref) => {
  const [image, setImage] = useState("");

  const columns = [
    {
      title: "Tên câu hỏi",
      dataIndex: "name",
      render: (data) => <div dangerouslySetInnerHTML={{ __html: data }} />,
    },
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
  const [loadingQuestionList, setLoadingQuestionList] = useState(false);
  const { currentUser } = useAuth();

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
    setImage("");
  };

  const initData = (data) => {
    form.setFields(
      Object.keys(data).map((name) => ({
        name,
        value: data[name],
      }))
    );
    getQuestionList(data.id);
    setImage(data.thumbnail);
  };

  const getQuestionList = async (id) => {
    try {
      setLoadingQuestionList(true);
      const { data } = await apiClient.post(apis.get_all_questions, { test_id: id });

      console.log("questions", data);

      setDsCauHoi(
        data.map((item) => {
          item.key = nanoid(5);

          const answers = item.answers;

          item.ans_a = answers[0];
          item.ans_b = answers[1];
          item.ans_c = answers[2];
          item.ans_d = answers[3];

          if (item.correct_answer === item.ans_a) item.correct_answer = "ans_a";
          if (item.correct_answer === item.ans_b) item.correct_answer = "ans_b";
          if (item.correct_answer === item.ans_c) item.correct_answer = "ans_c";
          if (item.correct_answer === item.ans_d) item.correct_answer = "ans_d";

          console.log("QES", item);

          return item;
        })
      );
      setLoadingQuestionList(false);
    } catch (error) {
      console.log(error);
      setLoadingQuestionList(false);
    }
  };

  const handleUpdateBaiThi = async (values) => {
    if (!image) {
      return notification.error({ message: "Chưa tải ảnh lên!", placement: "bottomLeft" });
    }
    values.thumbnail = image;
    setLoadingSubmit(true);
    if (!currentData) themMoiBaiThi(values);
    else chinhSuaBaiThi(values);
  };

  const themMoiBaiThi = async (values) => {
    try {
      const data = {
        ...values,
        questions: dsCauHoi,
      };

      data.created_by = currentUser.id;
      data.questions = formattedQuestions(data.questions);

      await apiClient.post(apis.add_new_test, data);

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
      };

      data.id = currentData.id;
      data.questions = formattedQuestions(data.questions);

      await apiClient.post(apis.update_test, data);

      notification.success({ message: "Chỉnh sửa thành công" });
      handleClose();
      return onSuccess();
    } catch (error) {
      setLoadingSubmit(false);
      console.log(error);
      return notification.error({ message: "Chỉnh sửa thất bại" });
    }
  };

  const formattedQuestions = (questions) => {
    return questions.map((item) => {
      item.correct_answer = item[item.correct_answer];
      item.answers = [item.ans_a, item.ans_b, item.ans_c, item.ans_d];
      delete item.ans_a;
      delete item.ans_b;
      delete item.ans_c;
      delete item.ans_d;
      delete item.key;
      return item;
    });
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

            <Button type="primary" loading={loadingSubmit} onClick={() => form.submit()}>
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
                <Form.Item label="Tên bài thi" name="name" {...requiredFormItemProps}>
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Mức độ" name="mode" {...requiredFormItemProps}>
                  <Select placeholder="Nhập">
                    <Select.Option value="EASY">Dễ</Select.Option>
                    <Select.Option value="MEDIUM">Thường</Select.Option>
                    <Select.Option value="hard">Khó</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Thời gian (phút)" name="time_limit" {...requiredFormItemProps}>
                  <InputNumber placeholder="Nhập" min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item label="Mô tả" name="description" {...requiredFormItemProps}>
                  <Input placeholder="Nhập" />
                </Form.Item>
              </Col>

              <Col span={8}>
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
          <UploadImage image={image} setImage={setImage} />
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
        loading={loadingQuestionList}
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
