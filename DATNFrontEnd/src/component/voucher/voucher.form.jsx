import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, notification } from 'antd';
import moment from 'moment';
import { createVoucher } from '../../service/api.service';

const { TextArea } = Input;

const VoucherForm = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loadData, onCreate } = props;

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const formattedValues = {
      ...values,
      discountAmount: values.discountAmount?.toString(),
      discountPercent: values.discountPercent?.toString(),
      minPurchaseAmount: values.minPurchaseAmount?.toString(),
      maxDiscountAmount: values.maxDiscountAmount?.toString(),
      // Chuyển đổi expirationDate sang định dạng LocalDateTime
      expirationDate: values.expirationDate ? moment(values.expirationDate).format("YYYY-MM-DDTHH:mm:ss") : null,
      customers: null, // Đặt customers luôn là null
    };
    console.log("Sending data:", formattedValues);

    const res = await createVoucher(
      formattedValues.code,
      formattedValues.quantity,
      formattedValues.discountAmount,
      formattedValues.discountPercent,
      formattedValues.expirationDate,
      formattedValues.minPurchaseAmount,
      formattedValues.maxDiscountAmount,
      formattedValues.termsAndConditions,
      formattedValues.customers  // Khách hàng luôn là null
    );

    if (res && res.data) {
      notification.success({
        message: "Tạo Voucher",
        description: "Tạo voucher thành công"
      });
      resetCloseModal();
      onCreate(formattedValues); // Gọi onCreate để tải lại dữ liệu sau khi tạo thành công
    } else {
      notification.error({
        message: "Tạo Voucher",
        description: JSON.stringify(res.message)
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
        <Button onClick={() => setIsModalOpen(true)} type="primary">Tạo Voucher</Button>
      </div>

      <Modal
        title="Tạo Voucher"
        open={isModalOpen}
        onOk={() => { form.submit(); }}
        onCancel={resetCloseModal}
        okText="Tạo"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            expirationDate: moment().startOf('day').add(1, 'days'), // Đặt thời gian giờ phút mặc định
            status: 1, // Trường này luôn được thiết lập là 1
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Mã Voucher"
              name="code"
              rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <Input />
            </Form.Item>
          </div>

          {/* Bỏ trường khách hàng */}

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Giảm giá tiền (VNĐ)"
              name="discountAmount"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá!' }]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số tiền giảm giá" min={0} />
            </Form.Item>

            <Form.Item
              label="Phần trăm giảm giá (%)"
              name="discountPercent"
              rules={[ 
                { required: true, message: 'Vui lòng nhập phần trăm giảm giá!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value > 100) {
                      return Promise.reject(new Error('Phần trăm giảm giá không được vượt quá 100!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ width: '48%' }}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập phần trăm giảm giá" min={0} max={100} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Số tiền mua tối thiểu (VNĐ)"
              name="minPurchaseAmount"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền mua tối thiểu!' }]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số tiền mua tối thiểu" min={0} />
            </Form.Item>

            <Form.Item
              label="Giảm giá tối đa (VNĐ)"
              name="maxDiscountAmount"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá tối đa!' }]}
              style={{ width: '48%' }}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số tiền giảm giá tối đa" min={0} />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Ngày hết hạn"
              name="expirationDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày hết hạn!' }]}
              style={{ width: '48%' }}
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }} 
                format={"DD-MM-YYYY HH:mm:ss"} 
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Số lượng voucher"
            name="quantity"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng voucher!' }]}
            style={{ width: '48%', marginRight: '4%' }}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng voucher" min={1} />
          </Form.Item>

          <Form.Item
            label="Điều khoản và điều kiện"
            name="termsAndConditions"
            rules={[{ required: true, message: 'Vui lòng nhập điều khoản và điều kiện!' }]}
          >
            <TextArea rows={4} placeholder="Nhập điều khoản và điều kiện sử dụng voucher" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherForm;
