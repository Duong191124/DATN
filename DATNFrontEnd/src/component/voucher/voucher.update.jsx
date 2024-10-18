import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Button, Select, notification, Row, Col } from "antd";
import moment from "moment";
import { updateVoucher, fetchCustomerList, fetchVoucherById } from "../../service/api.service";

const { TextArea } = Input;

const VoucherUpdateModal = ({ visible, voucherId, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchVoucher = async () => {
            if (!voucherId) return;
            setLoading(true);
            try {
                const res = await fetchVoucherById(voucherId);
                if (res && res.data.data) {
                    form.setFieldsValue({
                        code: res.data.data.code,
                        quantity: res.data.data.quantity,
                        discountAmount: res.data.data.discountAmount,
                        discountPercent: res.data.data.discountPercent,
                        minPurchaseAmount: res.data.data.minPurchaseAmount,
                        maxDiscountAmount: res.data.data.maxDiscountAmount,
                        termsAndConditions: res.data.data.termsAndConditions,
                        customers: res.data.data.customers,
                        //startDate: moment(res.data.startDate),
                        expirationDate: res.data.data.expirationDate ? moment(res.data.data.expirationDate, "DD/MM/YYYY") : null
                        
                    });
                    console.log("Expiration Date:", res.data.expirationDate);

                } else {
                    notification.error({
                        message: "Lỗi",
                        description: "Không thể tải dữ liệu voucher",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Có lỗi xảy ra khi tải dữ liệu voucher",
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchCustomers = async () => {
            try {
                const res = await fetchCustomerList();
                if (res && res.data.data) {
                    setCustomers(res.data.data);
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: "Không thể tải danh sách khách hàng",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi",
                    description: "Có lỗi xảy ra khi tải danh sách khách hàng",
                });
            }
        };

        fetchVoucher();
        fetchCustomers();
    }, [voucherId]);

    const handleSubmit = async () => {
        try {
            const values = form.getFieldsValue();
            const formattedValues = {
                ...values,
                // startDate: values.startDate.format("YYYY-MM-DD"),
                expirationDate: values.expirationDate.format("YYYY-MM-DD"),
                status: 1, // Gán trạng thái 'active' khi cập nhật
            };

            setLoading(true);
            const res = await updateVoucher(voucherId, formattedValues);
            console.log(res);
            console.log("Voucher ID: ", voucherId);
            if (res && res.data) {
                notification.success({
                    message: "Cập nhật Voucher",
                    description: "Cập nhật voucher thành công",
                });
                onSuccess(); // Gọi callback sau khi cập nhật thành công
                onClose(); // Đóng modal
            } else {
                notification.error({
                    message: "Cập nhật Voucher",
                    description: "Đã xảy ra lỗi khi cập nhật voucher",
                });
            }
        } catch (error) {
            notification.error({
                message: "Cập nhật Voucher",
                description: "Có lỗi không xác định",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Cập nhật Voucher"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={form.submit}>
                    Cập nhật
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mã Voucher"
                            name="code"
                            rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Khách hàng"
                            name="customers"
                            rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
                        >
                            <Select placeholder="Chọn khách hàng" allowClear>
                                {customers.map((customer) => (
                                    <Select.Option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá tiền (VNĐ)"
                            name="discountAmount"
                            rules={[{ required: true, message: "Vui lòng nhập số tiền giảm giá!" }]}
                        >
                            <InputNumber style={{ width: "100%" }} placeholder="Nhập số tiền giảm giá" min={0} />
                        </Form.Item>

                        <Form.Item
                            label="Phần trăm giảm giá (%)"
                            name="discountPercent"
                            rules={[{ required: true, message: "Vui lòng nhập phần trăm giảm giá!" }]}
                        >
                            <InputNumber style={{ width: "100%" }} placeholder="Nhập phần trăm giảm giá" min={0} max={100} />
                        </Form.Item>

                        {/* <Form.Item
                            label="Ngày bắt đầu"
                            name="startDate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item> */}

                        <Form.Item
                            label="Số lượng voucher"
                            name="quantity"
                            rules={[{ required: true, message: "Vui lòng nhập số lượng voucher!" }]}
                        >
                            <InputNumber style={{ width: "100%" }} placeholder="Nhập số lượng voucher" min={1} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Số tiền mua tối thiểu (VNĐ)"
                            name="minPurchaseAmount"
                            rules={[{ required: true, message: "Vui lòng nhập số tiền mua tối thiểu!" }]}
                        >
                            <InputNumber style={{ width: "100%" }} placeholder="Nhập số tiền mua tối thiểu" min={0} />
                        </Form.Item>

                        <Form.Item
                            label="Giảm giá tối đa (VNĐ)"
                            name="maxDiscountAmount"
                            rules={[{ required: true, message: "Vui lòng nhập số tiền giảm giá tối đa!" }]}
                        >
                            <InputNumber style={{ width: "100%" }} placeholder="Nhập số tiền giảm giá tối đa" min={0} />
                        </Form.Item>

                        <Form.Item
                            label="Ngày hết hạn"
                            name="expirationDate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn!" }]}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item
                            label="Điều khoản và điều kiện"
                            name="termsAndConditions"
                            rules={[{ required: true, message: "Vui lòng nhập điều khoản và điều kiện!" }]}
                        >
                            <TextArea rows={4} placeholder="Nhập điều khoản và điều kiện sử dụng voucher" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default VoucherUpdateModal;
