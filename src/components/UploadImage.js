import { PlusOutlined } from "@ant-design/icons";
import { notification, Upload } from "antd";
import React from "react";
import { getBase64 } from "../helpers";

export const UploadImage = ({ image = "", setImage = () => {} }) => {
  const beforeUpload = async (file) => {
    const isImage = file.type.includes("image/");

    if (!isImage) {
      return notification.error({
        message: "Tệp tải lên không đúng định dạng ảnh!",
        placement: "bottomLeft",
      });
    }

    const isLt2M = file.size / 1024 / 1024 < 1;

    if (!isLt2M) {
      return notification.error({
        message: "Kích thước ảnh phải nhỏ hơn 1MB!",
        placement: "bottomLeft",
      });
    }

    try {
      const url = await getBase64(file);
      setImage(url);
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải ảnh lên
      </div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
    >
      {image ? (
        <img
          src={image}
          alt="avatar"
          style={{
            width: "100%",
          }}
        />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
