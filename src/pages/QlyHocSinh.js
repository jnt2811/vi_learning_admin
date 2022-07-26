import { InfoCircleOutlined } from "@ant-design/icons";
import { Row, Table, Avatar, Tooltip, Button, Modal } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { apis, keys } from "../constants";
import { apiClient, getShortName } from "../helpers";

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
      title: "Tên đăng nhập",
      dataIndex: "username",
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
      title: "",
      dataIndex: "",
      width: "1%",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            ghost
            icon={<InfoCircleOutlined />}
            onClick={() => handleClickViewDetail(record)}
          ></Button>
        </Tooltip>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleDetail, setVisibleDetail] = useState();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [historyByStudent, setHistoryByStudent] = useState([]);

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = async () => {
    setDataSource([]);
    try {
      setLoading(true);
      const { data } = await apiClient.post(apis.get_all_users, { role: keys.ROLE_STUDENT });
      setDataSource(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleClickViewDetail = async (record) => {
    setVisibleDetail(true);

    try {
      setLoadingDetail(true);
      const { data } = await apiClient.post(apis.get_test_history, {
        user_id: record.id,
        order_by: "date",
      });
      setHistoryByStudent(data);
      setLoadingDetail(false);
    } catch (error) {
      setLoadingDetail(false);
      console.log("get history data", error);
    }
  };

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý học sinh</h1>

        {/* <Space>
          <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} />
        </Space> */}
      </Row>

      <Table columns={columns} dataSource={dataSource} loading={loading} size="small" rowKey="id" />

      <Modal
        title="Chi tiết học sinh"
        footer={null}
        visible={visibleDetail}
        onCancel={() => {
          setVisibleDetail(false);
          setHistoryByStudent([]);
        }}
      >
        <Table
          columns={historyCols}
          dataSource={historyByStudent}
          loading={loadingDetail}
          size="small"
          rowKey="id"
        />
      </Modal>
    </div>
  );
};

const historyCols = [
  {
    title: "Ngày làm bài",
    dataIndex: "created_at",
    render: (data) => moment(data).utcOffset("+14:00").format("DD/MM/YYYY HH:mm"),
  },
  {
    title: "Bài thi",
    dataIndex: "test",
  },
  {
    title: "Điểm thi",
    dataIndex: "score",
  },
];
