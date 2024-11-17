import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, notification, Radio } from 'antd';
import moment from 'moment';
import { createVoucher } from '../../service/api.service';

const { TextArea } = Input;

const VoucherForm = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loadData, onCreate } = props;
  const [discountType, setDiscountType] = useState('amount'); // Mặc định là 'amount'

  const handleDiscountTypeChange = (e) => {
    const type = e.target.value;
    setDiscountType(type); // Cập nhật discountType

    if (type === "amount") {
      form.setFieldsValue({ discountPercent: 0, maxDiscountAmount: 0 }); // Đặt phần trăm giảm giá là 0
    } else if (type === "percent") {
      form.setFieldsValue({ discountAmount: 0 }); // Đặt tiền giảm giá là 0
    }
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const formattedValues = {
      ...values,
      discountAmount: values.discountAmount?.toString(),
      discountPercent: values.discountPercent?.toString(),
      minPurchaseAmount: values.minPurchaseAmount?.toString(),
      maxDiscountAmount: values.maxDiscountAmount?.toString(),
      expirationDate: values.expirationDate ? moment(values.expirationDate).format("YYYY-MM-DDTHH:mm:ss") : null,
      customers: null,
      status: 1, // Đặt status tự động là 1
    };

    const res = await createVoucher(
      formattedValues.code,
      formattedValues.quantity,
      formattedValues.discountAmount,
      formattedValues.discountPercent,
      formattedValues.expirationDate,
      formattedValues.minPurchaseAmount,
      formattedValues.maxDiscountAmount,
      formattedValues.termsAndConditions,
      formattedValues.customers
    );

    if (res && res.data) {
      notification.success({
        message: "Tạo Voucher",
        description: "Tạo voucher thành công"
      });
      resetCloseModal();
      onCreate(formattedValues);
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
            expirationDate: moment().startOf('day').add(1, 'days'),
            status: 1,
            discountAmount: 0,
            discountPercent: 0,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Tên Voucher"
              name="code"
              rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <Input />
            </Form.Item>
          </div>

          {/* Chọn loại giảm giá */}
          <Form.Item label="Loại Giảm Giá" name="discountType" rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}>
            <Radio.Group onChange={handleDiscountTypeChange} value={discountType}>
              <Radio value="amount">Giảm Giá Tiền</Radio>
              <Radio value="percent">Giảm Giá Phần Trăm</Radio>
            </Radio.Group>
          </Form.Item>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Giảm giá tiền (VNĐ)"
              name="discountAmount"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá!' }]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền giảm giá"
                min={0}
                disabled={discountType === "percent"} // Disable nếu là phần trăm
              />
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
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập phần trăm giảm giá"
                min={0}
                max={100}
                disabled={discountType === "amount"} // Disable nếu là tiền
              />
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
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền giảm giá tối đa"
                min={0}
                value={discountType === "amount" ? 0 : undefined} // Set to 0 if "amount" is selected
                disabled={discountType === "amount"} // Disable if "amount" is selected
              />
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
            rules={[{ required: true, message: 'Vui lòng nhập điều khoản và điều kiện!' }]}>
            <TextArea rows={4} placeholder="Nhập điều khoản và điều kiện sử dụng voucher" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherForm;
