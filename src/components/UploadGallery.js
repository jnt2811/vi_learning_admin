import { PlusOutlined } from "@ant-design/icons";
import { Image, Modal, notification, Upload } from "antd";
import React, { useState } from "react";
import { getBase64 } from "../helpers";

export const UploadGallery = ({
  fileList = [],
  setFileList = () => {},
  setFileImages = () => {},
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    setPreviewImage(file.thumbUrl);
    setPreviewVisible(true);
  };

  const beforeUpload = async (file) => {
    const isImage = file.type.indexOf("image/") === 0;
    if (!isImage) {
      return notification.error({
        message: "Upload image only!",
        placement: "bottomLeft",
      });
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      return notification.error({
        message: "Image's size is too large! (< 5MB only)",
        placement: "bottomLeft",
      });
    }

    try {
      file.thumbUrl = await getBase64(file);

      console.log("file upload", file, fileList);

      setFileList((arr) => [...arr, file]);
      setFileImages((arr) => [...arr, file]);
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  const handleRemove = (file) => setFileList((arr) => arr.filter((item) => item.uid !== file.uid));

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  console.log("file list", fileList);

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onRemove={handleRemove}
        multiple
      >
        {uploadButton}
      </Upload>

      <Modal visible={previewVisible} title="Preview Image" footer={null} onCancel={handleCancel}>
        <Image alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};
