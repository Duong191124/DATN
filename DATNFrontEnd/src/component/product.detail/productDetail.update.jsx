import { useEffect, useState } from "react";
import { fetchDataColorAPI, fetchDataProductAPI, fetchDataSize, fetchDataWeight, updateProductDetailAPi } from "../../service/api.service";
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
                defaultPrice: dataUpdate.defaultPrice,
                quantity: dataUpdate.quantity,
                product: dataUpdate.productResponse?.id,
                color: dataUpdate.color?.id,
                size: dataUpdate.size?.id,
                weight: dataUpdate.weight
            });
        }
    }, [dataUpdate, form]);

    const handleSubmit = async () => {

        try {
            const values = await form.validateFields();
            const res = await updateProductDetailAPi(values.id, values.code, values.quantity, values.defaultPrice, values.product, values.size, values.color, values.weight);
            if (res.data) {
                notification.success({
                    message: "Update product",
                    description: "Update product success",
                });
                resetCloseModal();
                await loadProductDetail();
            }
        } catch (error) {
            console.error(error);
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
            console.error(error);
        }
    };

    const loadDataColor = async () => {
        const res = await fetchDataColorAPI();
        const activeColor = res.data.data.filter(colors => colors.status != 0)
        setDataColor(activeColor)
    };

    const loadDataSize = async () => {
        const res = await fetchDataSize();
        const activeSize = res.data.data.filter(sizes => sizes.status != 0)
        setDataSize(activeSize)
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
                    label="defaultPrice"
                    name="defaultPrice"
                    rules={[{ required: true, message: 'Please input the defaultPrice!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product"
                    name="product"
                    rules={[{ required: true, message: 'Please select a product!' }]}
                >
                    <Select
                    disabled
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

                <Form.Item label="Weight(g)" name="weight" rules={[{ required: true, message: 'Please select a Weight!' }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductDetailUpdate;
