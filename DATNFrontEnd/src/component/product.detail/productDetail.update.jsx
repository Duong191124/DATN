import { useEffect, useState } from "react";
import { fetchDataColorAPI, fetchDataProductAPI, fetchDataSize, updateProductDetailAPi } from "../../service/api.service";
import { Input, Modal, notification, Select, Form, Button } from "antd";

const ProductDetailUpdate = (props) => {
    const [form] = Form.useForm();
    const [dataProduct, setDataProduct] = useState([]);
    const [dataSize, setDataSize] = useState([]);
    const [dataColor, setDataColor] = useState([]);

    const { loadProductDetail, isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props;

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                code: dataUpdate.code,
                price: dataUpdate.price,
                quantity: dataUpdate.quantity,
                product: dataUpdate.product,
                color: dataUpdate.color,
                size: dataUpdate.size,
            });
        }
    }, [dataUpdate, form]);

    const handleSubmit = async () => {
        const values = await form.validateFields();
        const { id, code, quantity, price, product, color, size } = values;

        const res = await updateProductDetailAPi(id, code, quantity, price, product, size, color);
        if (res.data) {
            notification.success({
                message: "Update product",
                description: "Update product success",
            });
            resetCloseModal();
            await loadProductDetail();
        } else {
            notification.error({
                message: "Update product",
                description: JSON.stringify(res.message),
            });
        }
    };

    useEffect(() => {
        loadDataProduct();
        loadDataColor();
        loadDataSize();
    }, []);

    const loadDataProduct = async () => {
        const res = await fetchDataProductAPI();
        if (res.data) {
            setDataProduct(res.data.data);
        }
    };

    const loadDataColor = async () => {
        const res = await fetchDataColorAPI();
        if (res.data) {
            setDataColor(res.data.data);
        }
    };

    const loadDataSize = async () => {
        const res = await fetchDataSize();
        if (res.data) {
            setDataSize(res.data.data);
        }
    };

    const resetCloseModal = () => {
        form.resetFields();
        setIsModalUpdateOpen(false);
        setDataUpdate(null);
    };

    return (
        <Modal
            title="Update Product"
            open={isModalUpdateOpen}
            onCancel={resetCloseModal}
            footer={[
                <Button key="cancel" onClick={resetCloseModal}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    SAVE
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    id: "",
                    code: "",
                    quantity: "",
                    price: "",
                    product: null,
                    color: null,
                    size: null,
                }}
            >
                <Form.Item label="ID" name="id">
                    <Input disabled />
                </Form.Item>

                <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please input the code!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Product" name="product" rules={[{ required: true, message: 'Please select a product!' }]}>
                    <Select
                        showSearch
                        placeholder="Select a product"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataProduct}
                        fieldNames={{ label: "name", value: "id" }}
                    />
                </Form.Item>

                <Form.Item label="Color" name="color" rules={[{ required: true, message: 'Please select a color!' }]}>
                    <Select
                        showSearch
                        placeholder="Select a color"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataColor}
                        fieldNames={{ label: "name", value: "id" }}
                    />
                </Form.Item>

                <Form.Item label="Size" name="size" rules={[{ required: true, message: 'Please select a size!' }]}>
                    <Select
                        showSearch
                        placeholder="Select a size"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={dataSize}
                        fieldNames={{ label: "name", value: "id" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductDetailUpdate;
