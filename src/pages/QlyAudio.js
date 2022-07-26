import React, { useEffect, useRef, useState } from "react";
import { Button, Tooltip, Popconfirm, Row, Space, Table, notification } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { apiClient } from "../helpers";
import { apis } from "../constants";
import { CaiDatAudio } from "./CaiDatAudio";

export const QlyAudio = () => {
  const ref = useRef();
  const [dataSource, setDataSource] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = async () => {
    setDataSource([]);
    try {
      setLoading(true);
      const { data } = await apiClient.post(apis.get_all_audios);
      setDataSource(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Tên audio",
      dataIndex: "name",
    },
    {
      title: "Link",
      dataIndex: "link",
      render: (data) => <a href={data}>{data}</a>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "",
      width: "90px",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleClickChinhSua(record)}
              type="primary"
            ></Button>
          </Tooltip>

          <DeleteButton record={record} onSuccess={getDataSource} />
        </Space>
      ),
    },
  ];

  const handleClickThemMoi = () => ref.current?.open();
  const handleClickChinhSua = (record) => ref.current?.open(record);

  return (
    <div>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 0 }}>Quản lý audio</h1>

        <Space>
          {/* <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} /> */}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleClickThemMoi}>
            Thêm mới
          </Button>
        </Space>
      </Row>

      <Table columns={columns} dataSource={dataSource} size="small" loading={loading} rowKey="id" />

      <CaiDatAudio ref={ref} onSuccess={getDataSource} />
    </div>
  );
};

const DeleteButton = ({ record, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await apiClient.post(apis.delete_audio, { id: record.id });
      notification.success({ message: "Xóa audio thành công", placement: "bottomLeft" });
      onSuccess();
    } catch (error) {
      console.log(error);
      notification.error({ message: "Xóa audio thất bại", placement: "bottomLeft" });
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
