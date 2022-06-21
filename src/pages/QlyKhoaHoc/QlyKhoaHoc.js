import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Tooltip,
  Popconfirm,
  Row,
  Space,
  Input,
  Table,
  Tag,
} from "antd";
import { useRef } from "react";
import { CaiDatKhoaHoc } from "./CaiDatKhoaHoc/CaiDatKhoaHoc";

export const QlyKhoaHoc = () => {
  const colums = [
    {
      title: "Tên khoá học",
      dataIndex: "name",
    },
    {
      title: "Số lượng bài học",
      dataIndex: "quantity_lesson",
    },
    {
      title: "Số lượng đăng ký",
      dataIndex: "quantity_subscription",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (data) =>
        data ? (
          <Tag color="green">Công khai</Tag>
        ) : (
          <Tag color="red">Riêng tư</Tag>
        ),
    },
    {
      title: "",
      dataIndex: "status",
      width: "1%",
      render: (data, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleClickChinhSua(record)}
            ></Button>
          </Tooltip>
          <Tooltip title={`Chuyển sang "${data ? "Riêng tư" : "Công khai"}"`}>
            <Button
              icon={data ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            ></Button>
          </Tooltip>
          <Tooltip title="Xoá">
            <Popconfirm
              title="Xoá khoá học"
              onConfirm={() => handleClickXoa(record)}
            >
              <Button icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const ref = useRef();

  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);
  const handleClickXoa = () => {};

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <Space size={20}>
          <h1 style={{ marginBottom: 0 }}>Quản lý khoá học</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleClickThemMoi}
          >
            Thêm mới
          </Button>
        </Space>

        <Space>
          <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} />
        </Space>
      </Row>

      <Table columns={colums} dataSource={[1]} size="small" />

      <CaiDatKhoaHoc ref={ref} />
    </div>
  );
};
