import { Button, Input, Modal, notification, Select, Form } from "antd";
import { useEffect, useState } from "react";
import { createProductDetailAPi, fetchDataColorAPI, fetchDataSize } from "../../service/api.service";
import { Link } from "react-router-dom";
import { DoubleLeftOutlined, PlusOutlined } from "@ant-design/icons";

const ProDuctDetailForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sizes, setSizes] = useState([]);       // Dữ liệu danh sách size
    const [colors, setColors] = useState([]);     // Dữ liệu danh sách màu

    const { productId, loadProductDetail } = props;  // Lấy productId từ props

    const [form] = Form.useForm();  // Khởi tạo form từ Ant Design

    const handleSubmit = async (values) => {
        const { code, quantity, price, size, color } = values;
        const res = await createProductDetailAPi(
            code, quantity, price, productId, size, color  // Truyền productId từ props
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
        const activeColor = res.data.data.filter(colors => colors.status != 0)
        setColors(activeColor)
    };

    const loadDataSize = async () => {
        const res = await fetchDataSize();
        const activeSize = res.data.data.filter(sizes => sizes.status != 0)
        setSizes(activeSize)
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
            <div>
                <Link to={"/admin/products"}>
                    <Button icon={<DoubleLeftOutlined />} style={{ color: "blue" }}>
                        Go to product
                    </Button>
                </Link>
                <Button
                    style={{ color: "green" }}
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)} >Create Product-Detail</Button>
            </div >

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
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: "Please input product code!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: "Please input quantity!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: "Please input price!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Color"
                        name="color"
                        rules={[{ required: true, message: "Please select a color!" }]}
                    >
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
                        rules={[{ required: true, message: "Please select a size!" }]}
                    >
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

export default ProDuctDetailForm;
