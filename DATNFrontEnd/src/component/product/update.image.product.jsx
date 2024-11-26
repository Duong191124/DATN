import { Modal, Button, Upload, notification } from "antd";
import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImageAPI } from "../../service/api.service";

const UploadImage = (props) => {
  const { isModalOpen, setIsModalOpen, loadProduct, onClose, dataUpdate } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle file selection and preview
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
      const response = await uploadImageAPI(dataUpdate, formData);
      if (response.data) {
        notification.success({
          message: "Upload Success",
          description: "Image uploaded successfully!",
        });
        setSelectedFile(null)
        setPreview(null);
        setIsModalOpen(false);
        loadProduct(); // Reload the product list
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
      title="Upload Image Product"
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
};

export default UploadImage;
