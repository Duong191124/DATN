import { Button, Input, Modal, notification, Select, Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import { checkDuplicateProductDetailAPI, createProductDetailAPi, fetchDataColorAPI, fetchDataSize } from "../../service/api.service";
import { PlusOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

const ProductDetailForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sizes, setSizes] = useState([]);       // Dữ liệu danh sách size
    const [colors, setColors] = useState([]);     // Dữ liệu danh sách màu

    const { productId, loadProductDetail } = props;  // Lấy productId từ props

    const [form] = Form.useForm();  // Khởi tạo form từ Ant Design

    const handleSubmit = async (values) => {
        const { quantity, defaultPrice, size, color, weight } = values;
        const randomCode = `SPCT-${Math.floor(Math.random() * 100000).toString()}`;
        const res = await createProductDetailAPi(
            randomCode, quantity, defaultPrice, productId, size, color, weight  // Truyền productId từ props
        );
        if (res.data) {
            notification.success({
                message: "Create ProductDetail",
                description: "Create ProductDetail Success"
            });
            await loadProductDetail();
            resetCloseModal();
        }
    };

    const loadDataColor = async () => {
        const res = await fetchDataColorAPI();
        const activeColor = res.data.data.filter(colors => colors.status !== 0);
        setColors(activeColor);
    };

    const loadDataSize = async () => {
        const res = await fetchDataSize();
        const activeSize = res.data.data.filter(sizes => sizes.status !== 0);
        setSizes(activeSize);
    };

    useEffect(() => {
        loadDataColor();
        loadDataSize();
    }, []);


    const resetCloseModal = () => {
        form.resetFields();  // Reset lại các trường trong form
        setIsModalOpen(false);
    };



    return (
        <>
            <Button
                style={{ color: "green" }}
                icon={<PlusOutlined />}
                onClick={() => setIsModalOpen(true)} >Create Product-Detail</Button>

            <Modal
                title="Create Product Detail"
                open={isModalOpen}
                onOk={() => form.submit()}  // Gọi hàm submit form khi click OK
                onCancel={() => resetCloseModal()}
                okText="Create"
            >
                <Form
                    form={form}  // Khởi tạo form
                    layout="vertical"  // Layout dọc cho các trường
                    onFinish={handleSubmit}  // Xử lý submit form
                >
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: "Please input quantity!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Default Price"
                        name="defaultPrice"
                        rules={[{ required: true, message: "Please input price!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Weight(g)"
                        name="weight"
                        rules={[{ required: true, message: "Please input weight!" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Color"
                        name="color"
                        rules={[{ required: true, message: "Please select a color!" }]}>
                        <Select
                            showSearch
                            placeholder="Select a color"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={colors}
                            fieldNames={{ label: "name", value: "id" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Size"
                        name="size"
                        rules={[{ required: true, message: "Please select a size!" }]}>
                        <Select
                            showSearch
                            placeholder="Select a size"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={sizes}
                            fieldNames={{ label: "name", value: "id" }}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
};

export default ProductDetailForm;
