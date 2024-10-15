import { Button, Input, Modal, notification, Select, Form } from "antd";
import { useEffect, useState } from "react";
import {
  createProductAPI,
  fetchDataBrand,
  fetchDataCategory,
  fetchDataCollar,
  fetchDataSleeve,
} from "../../service/api.service";

const ProductForm = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loadProduct, allProductCodes } = props;

  const [brands, setBrands] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collars, setCollars] = useState([]);

  const handleSubmit = async () => {
    const values = form.getFieldsValue(); // Lấy tất cả giá trị từ form
    const res = await createProductAPI(
      values.code,
      values.name,
      values.description,
      values.price,
      values.selectedSleeve,
      values.selectedCategory,
      values.selectedBrand,
      values.selectedCollar
    );

    if (res.data) {
      notification.success({
        message: "Create product",
        description: "Create product success",
      });
      resetCloseModal();
      await loadProduct();
    } else {
      notification.error({
        message: "Create product",
        description: JSON.stringify(res.message),
      });
    }
  };

  useEffect(() => {
    loadDataBrand();
    loadDataSleeve();
    loadDataCategory();
    loadDataCollar();
  }, []);

  const loadDataBrand = async () => {
    const res = await fetchDataBrand();
    setBrands(res.data.data);
  };

  const loadDataSleeve = async () => {
    const res = await fetchDataSleeve();
    setSleeves(res.data);
  };

  const loadDataCategory = async () => {
    const res = await fetchDataCategory();
    setCategories(res.data.data);
  };

  const loadDataCollar = async () => {
    const res = await fetchDataCollar();
    setCollars(res.data);
  };

  const resetCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Đặt lại các trường trong form
  };

  const checkDuplicateCode = (rules, value) => {
    if (allProductCodes.includes(value)) {
      return Promise.reject(new Error("code already exists"));
    }
    return Promise.resolve();
  };

  return (
    <>
      <div>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          Create User
        </Button>
      </div>

      <Modal
        title="Create Product"
        open={isModalOpen}
        onOk={() => {
          form.submit();
        }}
        onCancel={resetCloseModal}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input the code!",
              },
              {
                validator: checkDuplicateCode,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input the price!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Collar"
            name="selectedCollar"
            rules={[
              {
                required: true,
                message: "Please select a collar!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a collar"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={collars}
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>

          <Form.Item
            label="Sleeve"
            name="selectedSleeve"
            rules={[
              {
                required: true,
                message: "Please select a sleeve!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a sleeve"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={sleeves}
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="selectedCategory"
            rules={[
              {
                required: true,
                message: "Please select a category!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a category"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={categories}
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="selectedBrand"
            rules={[
              {
                required: true,
                message: "Please select a brand!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a brand"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={brands}
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductForm;
