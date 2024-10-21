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
                console.log(res)
                if (res && res.data) {
                    setProductDetails(res.data.data);
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: "Không thể tải danh sách chi tiết sản phẩm"
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Có lỗi xảy ra khi tải danh sách chi tiết sản phẩm"
                });
            }
        };

        fetchProductDetails();
    }, []);

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        const productDetailsId = values.productDetailsId || null;

        if (!productDetailsId) {
            notification.error({
                message: "Lỗi",
                description: "Vui lòng chọn chi tiết sản phẩm trước khi tạo khuyến mại."
            });
            return;
        }

        const res = await createPromotion(
            values.name,
            values.description,
            values.startDate.format("YYYY-MM-DDTHH:mm:ss"),
            values.endDate.format("YYYY-MM-DDTHH:mm:ss"),
            values.discountPercent,
            values.discountAmount,
            values.status,
            values.productDetailsId
        );

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
                        startDate: moment(), // Set the start date to the current time
                        endDate: moment().add(1, 'days'), // Set the end date to one day after the current time
                        status: 1, // Set status to active by default
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
                                    if (value < 0) {
                                        return Promise.reject(new Error('Phần trăm giảm giá không được nhỏ hơn 0!'));
                                    }
                                    if (value > 100) {
                                        return Promise.reject(new Error('Phần trăm giảm giá không được lớn hơn 100!'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Điều Kiện Được Giảm(VNĐ)"
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
                            disabledDate={(current) => current && current < moment().startOf('day')} // Disable past dates
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ngày Kết Thúc"
                        name="endDate"
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                            {
                                validator: (_, value) => {
                                    const startDate = form.getFieldValue('startDate');
                                    if (value && startDate) {
                                        if (value.isBefore(startDate)) {
                                            return Promise.reject(new Error('Ngày kết thúc không được trước ngày bắt đầu!'));
                                        }
                                        if (value.isSame(startDate, 'minute')) {
                                            return Promise.reject(new Error('Ngày kết thúc không được cùng ngày với ngày bắt đầu!'));
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={(current) => current && current < moment().startOf('day')} // Disable past dates
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

                    <Form.Item
                        label="Chi Tiết Sản Phẩm"
                        name="productDetailsId"
                        rules={[{ required: true, message: 'Vui lòng chọn chi tiết sản phẩm!' }]}
                    >
                        <Select
                            placeholder="Chọn chi tiết sản phẩm"
                            allowClear
                        >
                            {Array.isArray(productDetails) && productDetails.length > 0
                                ? productDetails.map(product => (
                                    <Select.Option key={product.id} value={product.id}>
                                        {product.code}
                                    </Select.Option>
                                ))
                                : <Select.Option disabled>Không có sản phẩm chi tiết</Select.Option>
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PromotionForm;
