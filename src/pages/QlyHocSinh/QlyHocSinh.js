import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip, Row, Space, Input, Table, Avatar } from "antd";

export const QlyHocSinh = () => {
  const colums = [
    {
      title: "",
      dataIndex: "avatar",
      width: "1%",
      render: (data, record) => <Avatar src={data}>{record.name}</Avatar>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
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

  const handleClickViewDetail = (record) => {};

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý học sinh</h1>

        <Space>
          <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} />
        </Space>
      </Row>

      <Table columns={colums} dataSource={[1]} size="small" />
    </div>
  );
};
