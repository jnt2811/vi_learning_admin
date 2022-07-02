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
import { getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { collections } from "../../constants";
import { CaiDatThiThu } from "./CaiDatThiThu";

export const QlyThiThu = () => {
  const columns = [
    {
      title: "Tên bài thi",
      dataIndex: "title",
    },
    {
      title: "Mức độ",
      dataIndex: "mode",
      render: (data) =>
        data === "easy" ? "Dễ" : data === "normal" ? "Thường" : "Khó",
    },
    {
      title: "Thời gian (phút)",
      dataIndex: "time",
    },
    {
      title: "Số lượng câu hỏi",
      dataIndex: "questions",
      render: (data) => data.length,
    },
    {
      title: "Số lượng đã thi",
      dataIndex: "quantity_competitors",
      render: () => 0,
    },
    {
      title: "Điểm TB",
      dataIndex: "avg_score",
      render: () => 0,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (data) =>
        data === "public" ? (
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
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);
  const handleClickXoa = () => {};

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = async () => {
    setDataSource([]);
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collections.tests);
      querySnapshot.forEach((doc) =>
        setDataSource((curr) => [...curr, { id: doc.id, ...doc.data() }])
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý thi thử</h1>

        <Space>
          <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleClickThemMoi}
          >
            Thêm mới
          </Button>
        </Space>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        size="small"
        loading={loading}
        rowKey="id"
      />

      <CaiDatThiThu ref={ref} onSuccess={getDataSource} />
    </div>
  );
};
