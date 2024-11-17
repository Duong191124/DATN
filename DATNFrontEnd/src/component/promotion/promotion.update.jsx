import { Button, Form, Input, Modal, notification, DatePicker, Select, Radio } from "antd";
import { useEffect, useState } from "react";
import { updatePromotion, detailPromotion, fetchDataProductDetail } from "../../service/api.service";
import moment from 'moment';

const PromotionUpdate = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, loadData } = props;
    const [form] = Form.useForm();
    const [productDetails, setProductDetails] = useState([]);
    const [editingDiscountType, setEditingDiscountType] = useState(null); // Theo dõi loại giảm giá nào đang được sửa

    // Fetch danh sách chi tiết sản phẩm
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

    // Fetch chi tiết khuyến mãi khi dataUpdate thay đổi
    useEffect(() => {
        if (isModalUpdateOpen && dataUpdate) {
            const fetchPromotionDetail = async () => {
                try {
                    const res = await detailPromotion(dataUpdate.id);
                    if (res && res.data.data) {
                        const promotionData = res.data.data;
                        form.setFieldsValue({
                            name: promotionData.name,
                            description: promotionData.description,
                            discountPercent: promotionData.discountPercent,
                            discountAmount: promotionData.discountAmount,
                            startDate: moment(promotionData.startDate),
                            endDate: moment(promotionData.endDate),
                            status: promotionData.status,
                        });
    
                        // Xác định loại giảm giá dựa trên discountPercent và discountAmount
                        if (promotionData.discountPercent > 0) {
                            setEditingDiscountType('percent');
                        } else if (promotionData.discountAmount > 0) {
                            setEditingDiscountType('amount');
                        }
                    }
                } catch (error) {
                    notification.error({
                        message: "Lỗi",
                        description: "Không thể tải chi tiết khuyến mãi",
                    });
                }
            };
    
            fetchPromotionDetail();
        }
    }, [isModalUpdateOpen, dataUpdate, form]);
    

    // Xử lý gửi dữ liệu cập nhật
    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        const payload = {
            ...values,
            startDate: values.startDate.format("YYYY-MM-DDTHH:mm:ss"),
            endDate: values.endDate.format("YYYY-MM-DDTHH:mm:ss"),
            productDetailsIds: values.productDetailsId || [], // Đảm bảo rằng nếu không có giá trị nào thì nó sẽ là mảng rỗng
        };

        try {
            const res = await updatePromotion(dataUpdate.id, payload);
            if (res && res.data) {
                notification.success({
                    message: "Cập Nhật Khuyến Mãi",
                    description: "Cập nhật khuyến mãi thành công!",
                });
                form.resetFields();
                setIsModalUpdateOpen(false);
                loadData();
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Không thể cập nhật khuyến mãi",
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalUpdateOpen(false);
    };

    // Xử lý thay đổi loại giảm giá
    const handleDiscountTypeChange = (e) => {
        const value = e.target.value;
        if (value === 'percent') {
            form.setFieldsValue({ discountAmount: 0 });
        } else if (value === 'amount') {
            form.setFieldsValue({ discountPercent: 0 });
        }
        setEditingDiscountType(value);
    };

    return (
        <Modal
            title="Chỉnh Sửa Khuyến Mãi"
            open={isModalUpdateOpen}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="Cập Nhật"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mại!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                    <Input />
                </Form.Item>

                {/* Chọn loại giảm giá */}
                <Form.Item label="Chọn Loại Giảm Giá">
                    <Radio.Group onChange={handleDiscountTypeChange} value={editingDiscountType}>
                        <Radio value="percent">Phần Trăm Giảm Giá</Radio>
                        <Radio value="amount">Số Tiền Giảm Giá</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Phần Trăm Giảm Giá */}
                {editingDiscountType === 'percent' && (
                    <Form.Item
                        label="Phần Trăm Giảm Giá(%)"
                        name="discountPercent"
                        rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}>
                        <Input type="number" min={0} max={100} />
                    </Form.Item>
                )}

                {/* Số Tiền Giảm Giá */}
                {editingDiscountType === 'amount' && (
                    <Form.Item
                        label="Số Tiền Giảm Giá(VNĐ)"
                        name="discountAmount"
                        rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá!' }]}>
                        <Input type="number" />
                    </Form.Item>
                )}

                <Form.Item
                    label="Ngày Bắt Đầu"
                    name="startDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={(current) => current && current < moment().startOf('day')}
                    />
                </Form.Item>

                <Form.Item
                    label="Ngày Kết Thúc"
                    name="endDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={(current) => current && current < moment().startOf('day')}
                    />
                </Form.Item>

                {/* <Form.Item
                    label="Trạng Thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                    <Select>
                        <Select.Option value={1}>Hoạt động</Select.Option>
                        <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                    </Select>
                </Form.Item> */}
            </Form>
        </Modal>
    );
};

export default PromotionUpdate;
