import { UploadOutlined } from "@ant-design/icons";
import { Button, Modal, notification, Upload } from "antd";
import { useState } from "react";
import { upLoadImageForProductDetail } from "../../service/api.service";

const UpLoadImageForProductDetail = (props) => {
  const { isModalOpen, setIsModalOpen, loadProductDetail, onClose, dataUpdate } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (info) => {
    let file = info.file.originFileObj || info.file;

    if (file instanceof Blob) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Selected file is not a valid Blob.");
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      notification.error({
        message: "Upload Error",
        description: "Please select a file before uploading.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await upLoadImageForProductDetail(dataUpdate.productResponse.id, dataUpdate.id, formData);
      if (response.data && response.data.status === 200) {
        notification.success({
          message: "Upload Success",
          description: "Image uploaded successfully!",
        });
        setSelectedFile(null)
        setPreview(null);
        setIsModalOpen(false);
        await loadProductDetail();
      }
    } catch (error) {
      notification.error({
        message: "Upload Error",
        description: "There was an error uploading the file.",
      });
    }
  };

  return (
    <Modal
      title="Upload Image"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>,
        <Button key="upload" type="primary" onClick={handleUpload}>
          Upload
        </Button>,
      ]}
    >
      <Upload
        beforeUpload={() => false} // Prevent automatic upload
        onChange={handleFileChange}
        showUploadList={false} // Hide file list
        accept="image/*" // Only allow image files
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      {preview && (
        <div style={{ marginTop: 20 }}>
          <img src={preview} alt="Preview" style={{ width: "100%" }} />
        </div>
      )}
    </Modal>
  );

}

export default UpLoadImageForProductDetail