import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip, Row, Space, Input, Table, Avatar } from "antd";
import axios from "axios";
import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { apis, collections } from "../constants";
import { apiClient, getShortName, getAccessToken } from "../helpers";

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
            <Button
              disabled
              icon={<InfoCircleOutlined />}
              onClick={() => handleClickViewDetail(record)}
            ></Button>
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
      // const res = await apiClient.get(apis.get_all_users);
      const res = await axios({
        method: "get",
        url: apis.get_all_users,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      console.log(res);
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
