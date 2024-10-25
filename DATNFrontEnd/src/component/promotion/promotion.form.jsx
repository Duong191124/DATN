import { Button, Form, Input, Modal, notification, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import { createPromotion, fetchDataProductDetail } from "../../service/api.service";
import moment from 'moment';

const PromotionForm = (props) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const { loadData } = props;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await fetchDataProductDetail();
                if (res && res.data.data) {
                    setProductDetails(res.data.data);
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải danh sách chi tiết sản phẩm",
                });
            }
        };

        fetchProductDetails();
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields(); // Lấy giá trị đã validate từ form

            // Chuyển đổi ngày giờ về định dạng đúng để gửi đến backend
            const startDate = values.startDate.format("YYYY-MM-DDTHH:mm:ss");
            const endDate = values.endDate.format("YYYY-MM-DDTHH:mm:ss");

            // Gọi API tạo khuyến mãi
            const res = await createPromotion({
                name: values.name,
                description: values.description,
                startDate: startDate, // Gửi dưới dạng chuỗi
                endDate: endDate, // Gửi dưới dạng chuỗi
                discountPercent: String(values.discountPercent), // Đảm bảo là chuỗi
                discountAmount: String(values.discountAmount), // Đảm bảo là chuỗi
                status: values.status,
                //productDetailsIds: values.productDetailsId, // Sửa tên trường cho đúng với DTO
            });

            console.log("Add: ", res);

            if (res && res.data) {
                notification.success({
                    message: "Tạo Khuyến Mại",
                    description: "Tạo khuyến mại thành công"
                });
                resetCloseModal();
                await loadData();
            } else {
                notification.error({
                    message: "Tạo Khuyến Mại",
                    description: JSON.stringify(res.message || "Đã xảy ra lỗi không xác định")
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng kiểm tra lại thông tin nhập liệu!"
            });
        }
    };




    const resetCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <div style={{ margin: "20px" }}>
            <div>
                <Button onClick={() => setIsModalOpen(true)} type="primary">Tạo Khuyến Mại</Button>
            </div>

            <Modal
                title="Tạo Khuyến Mại"
                open={isModalOpen}
                onOk={() => { form.submit() }}
                onCancel={resetCloseModal}
                okText="Tạo"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        startDate: moment(),
                        endDate: moment().add(1, 'days'),
                        status: 1, // Đảm bảo rằng status được set mặc định
                    }}
                >
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mại!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phần Trăm Giảm Giá(%)"
                        name="discountPercent"
                        rules={[
                            { required: true, message: 'Vui lòng nhập phần trăm giảm giá!' },
                            {
                                validator: (_, value) => {
                                    if (value < 0 || value > 100) {
                                        return Promise.reject(new Error('Phần trăm giảm giá phải nằm trong khoảng từ 0 đến 100!'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Số Tiền Giảm Giá(VNĐ)"
                        name="discountAmount"
                        rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày Bắt Đầu"
                        name="startDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày Kết Thúc"
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Trạng Thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value={1}>Hoạt động</Select.Option>
                            <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PromotionForm;
