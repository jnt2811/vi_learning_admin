import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Popconfirm, Row, Space, Table, Tag, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { apis, keys } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../helpers";
import { CaiDatKhoaHoc } from "./CaiDatKhoaHoc";

export const QlyKhoaHoc = () => {
  const columns = [
    {
      title: "Tên khoá học",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Số lượng bài học",
      dataIndex: "total_lessons",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (data) =>
        !!data ? <Tag color="green">Công khai</Tag> : <Tag color="red">Riêng tư</Tag>,
    },
    {
      title: "",
      dataIndex: "active",
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
  const { currentUser } = useAuth();

  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);

  useEffect(() => {
    getDataSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDataSource = async () => {
    setDataSource([]);
    try {
      setLoading(true);
      let body = {};
      if (currentUser?.role === keys.ROLE_TEACHER) body = { created_by: currentUser.id };
      const { data } = await apiClient.post(apis.get_all_courses, body);
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
        <h1 style={{ marginBottom: 0 }}>Quản lý khoá học</h1>

        <Space>
          {/* <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} /> */}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleClickThemMoi}>
            Thêm mới
          </Button>
        </Space>
      </Row>

      <Table columns={columns} dataSource={dataSource} size="small" loading={loading} rowKey="id" />

      <CaiDatKhoaHoc ref={ref} onSuccess={getDataSource} />
    </div>
  );
};

const SwitchStateButton = ({ record, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    try {
      setLoading(true);
      await apiClient.post(apis.update_course, { id: record.id, active: !record.active });
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
      await apiClient.post(apis.update_course, { id: record.id, visible: 0 });
      notification.success({ message: "Xóa khóa học thành công", placement: "bottomLeft" });
      onSuccess();
    } catch (error) {
      console.log(error);
      notification.error({ message: "Xóa khóa học thất bại", placement: "bottomLeft" });
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
