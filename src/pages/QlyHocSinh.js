import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip, Row, Space, Input, Table, Avatar } from "antd";
import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { collections } from "../constants";
import { getShortName } from "../helpers";

export const QlyHocSinh = () => {
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
      title: "Số khoá học đã tham gia",
      dataIndex: "quantity_lesson_joined",
    },
    {
      title: "",
      dataIndex: "",
      width: "1%",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button disabled icon={<InfoCircleOutlined />} onClick={() => handleClickViewDetail(record)}></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = async () => {
    setDataSource([]);
    try {
      setLoading(true);
      const q = query(collections.users, where("role", "==", "student"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => setDataSource((curr) => [...curr, { id: doc.id, ...doc.data() }]));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleClickViewDetail = (record) => {};

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý học sinh</h1>

        <Space>
          <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} />
        </Space>
      </Row>

      <Table columns={columns} dataSource={dataSource} loading={loading} size="small" rowKey="id" />
    </div>
  );
};
