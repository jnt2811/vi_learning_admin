import React, { useRef, useState } from "react";
import style from "./Qlysach.module.scss";
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
import { PageHeader } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { CaiDatQlySach } from "../CaiDatQlySach";

export const Qlysach = () => {
  const ref = useRef();
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      title: "Sách văn hóa",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      title: "Hóa học 12",
      age: 42,
      address: "10 Downing Street",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Loại sách",
      dataIndex: "gender",
    },

    {
      title: "Mô tả sách",
      dataIndex: "phone",
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
  const handleClickXoa = () => {};
  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);
  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý sách</h1>

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

      <CaiDatQlySach ref={ref} />
    </div>
  );
};
