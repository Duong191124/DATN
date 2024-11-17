import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Button, notification, Row, Col } from "antd";
import moment from "moment";
import { updateVoucher, fetchVoucherById } from "../../service/api.service";

const { TextArea } = Input;

const VoucherUpdateModal = ({ visible, voucherId, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

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
                        expirationDate: res.data.data.expirationDate ? moment(res.data.data.expirationDate) : null,
                    });
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

        fetchVoucher();
    }, [voucherId]);

    const handleValuesChange = (changedValues, allValues) => {
        if ("discountAmount" in changedValues && allValues.discountAmount > 0) {
            form.setFieldsValue({ 
                discountPercent: 0, 
                maxDiscountAmount: 0 
            });
        } else if ("discountPercent" in changedValues && allValues.discountPercent > 0) {
            form.setFieldsValue({ 
                discountAmount: 0, 
                maxDiscountAmount: 0 
            });
        }
    };
    

    const handleSubmit = async () => {
        try {
            const values = form.getFieldsValue();
            const formattedValues = {
                ...values,
                discountAmount: Number(values.discountAmount),
                discountPercent: Number(values.discountPercent),
                minPurchaseAmount: Number(values.minPurchaseAmount),
                maxDiscountAmount: Number(values.maxDiscountAmount),
                expirationDate: values.expirationDate ? values.expirationDate.format("YYYY-MM-DDTHH:mm:ss") : null,
                status: 1, // Luôn là 'active'
            };

            setLoading(true);
            const res = await updateVoucher(voucherId, formattedValues);
            if (res && res.data) {
                notification.success({
                    message: "Cập nhật Voucher",
                    description: "Cập nhật voucher thành công",
                });
                onSuccess();
                onClose();
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
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Cập nhật
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                onValuesChange={handleValuesChange}
            >
                <Form.Item name="code" label="Tên Voucher" rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}>
                    <Input />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                            <InputNumber min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="discountAmount"
                            label="Giảm giá (Số tiền)"
                            rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá!' }]}
                        >
                            <InputNumber min={0} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="discountPercent"
                            label="Giảm giá (Phần trăm)"
                            rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
                        >
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="minPurchaseAmount" label="Số tiền tối thiểu để mua" rules={[{ required: true, message: 'Vui lòng nhập số tiền tối thiểu!' }]}>
                            <InputNumber min={0} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="maxDiscountAmount" label="Số tiền tối đa giảm giá" rules={[{ required: true, message: 'Vui lòng nhập số tiền tối đa giảm giá!' }]}>
                            <InputNumber min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="expirationDate" label="Ngày hết hạn" rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}>
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="termsAndConditions" label="Điều khoản và điều kiện">
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VoucherUpdateModal;
