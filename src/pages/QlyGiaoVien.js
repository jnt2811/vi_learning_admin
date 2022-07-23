import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Row, Space, Table, Avatar, Tag, Tooltip, Button, notification, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import { apis, keys } from "../constants";
import { apiClient, getShortName } from "../helpers";
import { CaiDatGiaoVien } from "./CaiDatGiaoVien";

export const QlyGiaoVien = () => {
  const columns = [
    {
      title: "",
      dataIndex: "avatar",
      width: "1%",
      render: (data, record) => <Avatar src={data}>{getShortName(record.name)}</Avatar>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (data) =>
        data ? <Tag color="green">Đang công tác</Tag> : <Tag color="red">Dừng công tác</Tag>,
    },
    {
      title: "",
      width: "1%",
      render: (data, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} onClick={() => handleClickChinhSua(record)}></Button>
          </Tooltip>
          <SwitchStateButton record={record} onSuccess={getDataSource} />
          <DeleteButton record={record} onSuccess={getDataSource} />
        </Space>
      ),
    },
  ];

  const ref = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = async () => {
    setDataSource([]);
    try {
      setLoading(true);
      const { data } = await apiClient.post(apis.get_all_users, { role: keys.ROLE_TEACHER });
      setDataSource(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);

  console.log(dataSource);

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý giáo viên</h1>

        <Space>
          {/* <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} /> */}
          <Button type="primary" onClick={handleClickThemMoi} icon={<PlusOutlined />}>
            Thêm mới
          </Button>
        </Space>
      </Row>

      <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} size="small" />

      <CaiDatGiaoVien ref={ref} onSuccess={getDataSource} />
    </div>
  );
};

const SwitchStateButton = ({ record, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    try {
      setLoading(true);
      await apiClient.post(apis.update_user, { id: record.id, active: !record.active });
      notification.success({ message: "Đổi trạng thái thành công", placement: "bottomLeft" });
      onSuccess();
    } catch (error) {
      console.log(error);
      notification.error({ message: "Đổi trạng thái thất bại", placement: "bottomLeft" });
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Đổi trạng thái">
      <Button icon={<ReloadOutlined />} loading={loading} onClick={handleSwitch}></Button>
    </Tooltip>
  );
};

const DeleteButton = ({ record, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await apiClient.post(apis.update_user, { id: record.id, visible: 0 });
      notification.success({ message: "Xóa giáo viên thành công", placement: "bottomLeft" });
      onSuccess();
    } catch (error) {
      console.log(error);
      notification.error({ message: "Xóa giáo viên thất bại", placement: "bottomLeft" });
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
        <Button icon={<DeleteOutlined />}></Button>
      </Tooltip>
    </Popconfirm>
  );
};
