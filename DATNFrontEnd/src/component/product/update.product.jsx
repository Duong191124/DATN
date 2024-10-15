import { useEffect, useState } from "react";
import {
  fetchDataBrand,
  fetchDataCategory,
  fetchDataCollar,
  fetchDataSleeve,
  updateProductAPI,
} from "../../service/api.service";
import { Form, Input, Modal, notification, Select } from "antd";

const UpdateProduct = (props) => {
    const [form] = Form.useForm(); // Tạo đối tượng form của Ant Design
    const [dataBrand, setDataBrand] = useState([]);
    const [dataSleeve, setDataSleeve] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);
    const [dataCollar, setDataCollar] = useState([]);
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate, loadProduct } = props;

    useEffect(() => {
        if (dataUpdate) {
            // Set các giá trị của form khi dữ liệu cập nhật thay đổi
            form.setFieldsValue({
                id: dataUpdate.id,
                code: dataUpdate.code,
                name: dataUpdate.name,
                price: dataUpdate.price,
                description: dataUpdate.description,
                collar: dataUpdate.collarName,
                brand: dataUpdate.brandName,
                category: dataUpdate.categoryName,
                sleeve: dataUpdate.sleeveName,
            });
        }
    }, [dataUpdate, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields(); // Lấy và validate dữ liệu form
            const collar = dataCollar.find((item) => item.name === values.collar);
            const brand = dataBrand.find((item) => item.name === values.brand);
            const category = dataCategory.find((item) => item.name === values.category);
            const sleeve = dataSleeve.find((item) => item.name === values.sleeve);

            const res = await updateProductAPI(
                values.id,
                values.code,
                values.name,
                values.description,
                values.price,
                sleeve ? sleeve.id : null,
                brand ? brand.id : null,
                category ? category.id : null,
                collar ? collar.id : null
            );

            if (res.data) {
                notification.success({
                    message: "Update product",
                    description: "Update product success",
                });
                resetCloseModal();
                loadProduct();
            } else {
                notification.error({
                    message: "Update product",
                    description: JSON.stringify(res.message),
                });
            }
        } catch (error) {
            console.log("Validation failed:", error);
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
        if (res.data) {
            setDataBrand(res.data);
        }
    };

    const loadDataSleeve = async () => {
        const res = await fetchDataSleeve();
        if (res.data) {
            setDataSleeve(res.data);
        }
    };

    const loadDataCategory = async () => {
        const res = await fetchDataCategory();
        if (res.data) {
            setDataCategory(res.data);
        }
    };

    const loadDataCollar = async () => {
        const res = await fetchDataCollar();
        if (res.data) {
            setDataCollar(res.data);
        }
    };

    const resetCloseModal = () => {
        setIsModalUpdateOpen(false);
        form.resetFields(); // Reset lại các trường trong form
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Update Product"
            open={isModalUpdateOpen}
            onOk={handleSubmit}
            onCancel={resetCloseModal}
            okText="SAVE"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="id" label="ID">
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Code"
                    rules={[
                        {
                            required: true, message: "Please input the code!"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true, message: "Please input the name!"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                        {
                            required: true, message: "Please input the price!"

                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="collar"
                    label="Collar"
                    rules={[{ required: true, message: "Please select a collar!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a collar"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataCollar}
                        fieldNames={{ label: "name", value: "id" }}
                    />
                </Form.Item>

                <Form.Item
                    name="sleeve"
                    label="Sleeve"
                    rules={[
                        {
                            required: true, message: "Please select a sleeve!"
                        }
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a sleeve"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataSleeve}
                        fieldNames={{ label: "name", value: "id" }}
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[
                        {
                            required: true, message: "Please select a category!"

                        }
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a category"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataCategory}
                        fieldNames={{ label: "name", value: "id" }}
                    />
                </Form.Item>

                <Form.Item
                    name="brand"
                    label="Brand"
                    rules={[
                        {
                            required: true, message: "Please select a brand!"
                        }
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a brand"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataBrand}
                        fieldNames={{ label: "name", value: "id" }}
                    />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProduct;
