import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Button, notification, Row, Col, Radio } from "antd";
import moment from "moment";
import { updateVoucher, fetchVoucherById } from "../../service/api.service";

const { TextArea } = Input;

const VoucherUpdateModal = ({ visible, voucherId, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [discountType, setDiscountType] = useState("amount"); // Mặc định giảm giá tiền

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
                    setDiscountType(res.data.data.discountAmount > 0 ? "amount" : "percent");
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

    const handleDiscountTypeChange = (e) => {
        const type = e.target.value;
        setDiscountType(type);
        if (type === "amount") {
            form.setFieldsValue({ discountAmount: null });
            form.setFieldsValue({ discountPercent: null });
            form.setFieldsValue({ maxDiscountAmount: null }); // Đặt về 0 khi chọn giảm giá tiền
        } else {
            form.setFieldsValue({ discountPercent: null });
            form.setFieldsValue({ discountAmount: null });
        }
    };


    const handleSubmit = async () => {
        try {
            // Kiểm tra toàn bộ form, nếu không hợp lệ sẽ hiển thị lỗi.
            await form.validateFields();

            const values = form.getFieldsValue();
            const formattedValues = {
                ...values,
                discountAmount: Number(values.discountAmount),
                discountPercent: Number(values.discountPercent),
                minPurchaseAmount: Number(values.minPurchaseAmount),
                maxDiscountAmount: Number(values.maxDiscountAmount),
                expirationDate: values.expirationDate
                    ? values.expirationDate.format("YYYY-MM-DDTHH:mm:ss")
                    : null,
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
            // Hiển thị lỗi nếu form không hợp lệ.
            notification.error({
                message: "Cập nhật Voucher",
                description: "Có lỗi xảy ra, vui lòng kiểm tra lại thông tin!",
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
                </Row>

                <Form.Item label="Loại giảm giá">
                    <Radio.Group onChange={handleDiscountTypeChange} value={discountType}>
                        <Radio value="amount">Giảm giá tiền</Radio>
                        <Radio value="percent">Giảm giá phần trăm</Radio>
                    </Radio.Group>
                </Form.Item>

                {discountType === "amount" && (
                    <Form.Item
                        name="discountAmount"
                        label="Giảm giá (Số tiền)"
                        rules={[
                            { required: true, message: "Vui lòng nhập số tiền giảm giá!" },
                            {
                                validator: (_, value) => {
                                    const minPurchaseAmount = form.getFieldValue("minPurchaseAmount");
                                    if (discountType === "percent") {
                                        if (value < 1000 || value > 10000000) {
                                            return Promise.reject(
                                                new Error("Số tiền tối đa giảm giá phải nằm trong khoảng từ 1,000 đến 10,000,000!")
                                            );
                                        }
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber min={1000} max={10000000} />
                    </Form.Item>
                )}

                {discountType === "percent" && (
                    <Form.Item
                        name="discountPercent"
                        label="Giảm giá (Phần trăm)"
                        rules={[
                            { required: true, message: "Vui lòng nhập phần trăm giảm giá!" },
                            {
                                validator: (_, value) => {
                                    if (value < 0 || value > 50) {
                                        return Promise.reject(new Error("Phần trăm giảm giá không được vượt quá 0 và thấp hơn 50!"));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber min={10} max={50}/>
                    </Form.Item>
                )}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="minPurchaseAmount"
                            label="Số tiền tối thiểu để mua"
                            rules={[
                                { required: true, message: "Vui lòng nhập số tiền tối thiểu!" },
                                {
                                    validator: (_, value) => {
                                        if (value < 0 || value > 10000000) {
                                            return Promise.reject(
                                                new Error("Số tiền tối thiểu phải nằm trong khoảng từ 0 đến 10,000,000!")
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <InputNumber min={0} max={10000000} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="maxDiscountAmount"
                            label="Số tiền tối đa giảm giá"
                            rules={[
                                {
                                    required: discountType === "percent",
                                    message: "Vui lòng nhập số tiền tối đa giảm giá!",
                                },
                                {
                                    validator: (_, value) => {
                                        const minPurchaseAmount = form.getFieldValue("minPurchaseAmount");
                                        if (discountType === "percent") {
                                            if (value < 1000 || value > 10000000) {
                                                return Promise.reject(
                                                    new Error("Số tiền tối đa giảm giá phải nằm trong khoảng từ 1,000 đến 10,000,000!")
                                                );
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <InputNumber min={1000} max={10000000} disabled={discountType === "amount"} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="expirationDate"
                    label="Ngày hết hạn"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={(current) => current && current < moment().startOf("day")}
                        disabledTime={(current) => {
                            if (moment().isSame(current, "day")) {
                                return {
                                    disabledHours: () => [...Array(moment().hour()).keys()],
                                    disabledMinutes: () => [...Array(moment().minute() + 1).keys()],
                                    disabledSeconds: () => [...Array(moment().second() + 1).keys()],
                                };
                            }
                            return {};
                        }}
                    />
                </Form.Item>
                <Form.Item name="termsAndConditions" label="Điều khoản và điều kiện">
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VoucherUpdateModal;
