import { Button, Input, Modal, notification, Select, Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash"; // Import lodash debounce

import { checkDuplicateProductAPI, createProductAPI, fetchDataBrand, fetchDataCategory, fetchDataCollar, fetchDataSleeve } from "../../service/api.service";
import { PlusOutlined } from "@ant-design/icons";

const ProductForm = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loadProduct } = props;

  const [brands, setBrands] = useState([]);
  const [sleeves, setSleeves] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collars, setCollars] = useState([]);

  // Hàm tạo mã ngẫu nhiên
  const generateRandomCode = () => {
    return `SP-${Math.floor(Math.random() * 1000000)}`; // Generates a random number between 0 and 999999
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue(); // Lấy tất cả giá trị từ form
    const res = await createProductAPI(
      values.code,
      values.name,
      values.description,
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
    const activeBrands = res.data.data.filter(brand => brand.status !== 0); // Lọc các thương hiệu có trạng thái khác 0
    setBrands(activeBrands);
  };

  const loadDataSleeve = async () => {
    const res = await fetchDataSleeve();
    const activeSleeves = res.data.filter(sleeve => sleeve.status !== 0); // Lọc các tay áo có trạng thái khác 0
    setSleeves(activeSleeves);
  };

  const loadDataCategory = async () => {
    const res = await fetchDataCategory();
    const activeCategories = res.data.data.filter(category => category.status !== 0); // Lọc các danh mục có trạng thái khác 0
    setCategories(activeCategories);
  };

  const loadDataCollar = async () => {
    const res = await fetchDataCollar();
    const activeCollars = res.data.filter(collar => collar.status !== 0); // Lọc các cổ áo có trạng thái khác 0
    setCollars(activeCollars);
  };

  const resetCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const debounceCheckDuplicateCode = useCallback(
    debounce(async (value, callback) => {
      const res = await checkDuplicateProductAPI("code", value);
      if (res.data.exists) {
        callback(new Error("Code already exists"));
      } else {
        callback();
      }
    }, 1000),
    []
  );

  const debounceCheckDuplicateName = useCallback(
    debounce(async (value, callback) => {
      const res = await checkDuplicateProductAPI("name", value);
      if (res.data.exists) {
        callback(new Error("Name already exists"));
      } else {
        callback();
      }
    }, 1000),
    []
  );

  // Sử dụng hàm validator với debounce
  const checkDuplicateCode = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (!value) {
        resolve(); // Nếu không có giá trị thì không kiểm tra
      } else {
        debounceCheckDuplicateCode(value, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }
    });
  };

  const checkDuplicateName = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (!value) {
        resolve(); // Nếu không có giá trị thì không kiểm tra
      } else {
        debounceCheckDuplicateName(value, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      }
    });
  };

  // Mở modal và tự động điền mã ngẫu nhiên
  const openModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      code: generateRandomCode(), // Tự động tạo mã ngẫu nhiên khi mở modal
    });
  };

  return (
    <>
      <div>
        <Button
          icon={<PlusOutlined />}
          onClick={openModal} // Gọi hàm mở modal và tạo mã ngẫu nhiên
          style={{ color: "green" }}
        >Create Product</Button>
      </div >

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
            label="Mã"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the name!",
              },
              // {
              //   validator: checkDuplicateName, // Duplicate check for name
              // },
              {
                validator: (rule, value) => {
                  if (value && value.length > 50) {
                    return Promise.reject(
                      new Error("Length must be < 50 characters")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Cổ Áo"
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
            label="Tay Áo"
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
            label="Loại Áo"
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
            label="Thương Hiệu"
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

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductForm;
