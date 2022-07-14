import { EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Row, Space, Input, Table, Avatar, Tag, Tooltip, Button } from "antd";
import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { apis, collections } from "../constants";
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
      title: "Trạng thái",
      dataIndex: "on_work",
      render: (data) => (data ? <Tag color="green">Đang công tác</Tag> : <Tag color="red">Dừng công tác</Tag>),
    },
    {
      title: "Số khoá học đã tạo",
      dataIndex: "quantity_course_create",
      render: (data) => 0,
    },
    {
      title: "",
      dataIndex: "status",
      width: "1%",
      render: (data, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} onClick={() => handleClickChinhSua(record)}></Button>
          </Tooltip>
          <Tooltip title="Đổi trạng thái">
            <Button icon={<ReloadOutlined />}></Button>
          </Tooltip>
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
      const { data } = await apiClient.get(apis.get_all_users);
      console.log(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý giáo viên</h1>

        <Space>
          <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} />
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
