import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Popconfirm, Row, Space, Table, Tag, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { apis } from "../constants";
import { apiClient } from "../helpers";
import { CaiDatThiThu } from "./CaiDatThiThu";

export const QlyThiThu = () => {
  const columns = [
    {
      title: "Tên bài thi",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Mức độ",
      dataIndex: "mode",
      render: (data) => (data === "EASY" ? "Dễ" : data === "MEDIUM" ? "Thường" : "Khó"),
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "time_limit",
    },
    {
      title: "Số lượng câu hỏi",
      dataIndex: "questions",
      render: (data) => data?.length || 0,
    },
    // {
    //   title: "Số lượng đã thi",
    //   dataIndex: "quantity_competitors",
    //   render: () => 0,
    // },
    // {
    //   title: "Điểm TB",
    //   dataIndex: "avg_score",
    //   render: () => 0,
    // },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (data) =>
        !!data ? <Tag color="green">Công khai</Tag> : <Tag color="red">Riêng tư</Tag>,
    },
    {
      title: "",
      width: "1%",
      render: (data, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleClickChinhSua(record)}
              type="primary"
              ghost
            ></Button>
          </Tooltip>

          <SwitchStateButton record={record} onSuccess={getDataSource} />

          <DeleteButton record={record} onSuccess={getDataSource} />
        </Space>
      ),
    },
  ];

  const ref = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = async () => {
    setDataSource([]);
    try {
      setLoading(true);
      const { data } = await apiClient.post(apis.get_all_tests);
      setDataSource(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  console.log(dataSource);

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý thi thử</h1>

        <Space>
          {/* <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} /> */}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleClickThemMoi}>
            Thêm mới
          </Button>
        </Space>
      </Row>

      <Table columns={columns} dataSource={dataSource} size="small" loading={loading} rowKey="id" />

      <CaiDatThiThu ref={ref} onSuccess={getDataSource} />
    </div>
  );
};

const SwitchStateButton = ({ record, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    try {
      setLoading(true);
      await apiClient.post(apis.update_test, { id: record.id, active: !record.active });
      notification.success({ message: "Đổi trạng thái thành công", placement: "bottomLeft" });
      onSuccess();
    } catch (error) {
      console.log(error);
      notification.error({ message: "Đổi trạng thái thất bại", placement: "bottomLeft" });
      setLoading(false);
    }
  };

  return (
    <Tooltip title={`Chuyển sang "${!!record.active ? "Riêng tư" : "Công khai"}"`}>
      <Button
        icon={record.active ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        type="primary"
        onClick={handleSwitch}
        loading={loading}
      ></Button>
    </Tooltip>
  );
};

const DeleteButton = ({ record, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await apiClient.post(apis.update_test, { id: record.id, visible: 0 });
      notification.success({ message: "Xóa bài thi thành công", placement: "bottomLeft" });
      onSuccess();
    } catch (error) {
      console.log(error);
      notification.error({ message: "Xóa bài thi thất bại", placement: "bottomLeft" });
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title="Xác nhận?"
      okText="Đồng ý"
      onConfirm={handleDelete}
      okButtonProps={{ loading }}
      showCancel={false}
    >
      <Tooltip title="Xóa">
        <Button icon={<DeleteOutlined />} type="primary" danger></Button>
      </Tooltip>
    </Popconfirm>
  );
};
