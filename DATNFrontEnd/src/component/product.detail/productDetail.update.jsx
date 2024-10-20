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
                product: dataUpdate.productResponse?.id,
                color: dataUpdate.color?.id,
                size: dataUpdate.size?.id,
            });
        }
    }, [dataUpdate, form]);

    const handleSubmit = async () => {

        try {
            const values = await form.validateFields();
            const res = await updateProductDetailAPi(values.id, values.code, values.quantity, values.price, values.product, values.size, values.color);
            console.log("check resss", res)
            if (res.data) {

                notification.success({
                    message: "Update product",
                    description: "Update product success",
                });
                resetCloseModal();
                await loadProductDetail();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (isModalUpdateOpen) {
            loadDataProduct();
            loadDataColor();
            loadDataSize();
        }
    }, [isModalUpdateOpen]);

    const loadDataProduct = async () => {
        try {
            const res = await fetchDataProductAPI();
            if (res.data.data) {
                setDataProduct(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const loadDataColor = async () => {
        try {
            const res = await fetchDataColorAPI();
            if (res.data.data) {
                setDataColor(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const loadDataSize = async () => {
        try {
            const res = await fetchDataSize();
            if (res.data.data) {
                setDataSize(res.data.data);
            }
        } catch (error) {
            console.log(error);
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
            >
                <Form.Item label="ID" name="id">
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Code"
                    name="code"
                    rules={[{ required: true, message: 'Please input the code!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: 'Please input the quantity!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input the price!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product"
                    name="product"
                    rules={[{ required: true, message: 'Please select a product!' }]}
                >
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
