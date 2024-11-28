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

    if (type === 'amount') {
      form.setFieldsValue({ discountPercent: 0, maxDiscountAmount: 0 }); // Đặt phần trăm giảm giá và maxDiscountAmount là 0
    } else if (type === 'percent') {
      form.setFieldsValue({ discountAmount: 0 }); // Đặt tiền giảm giá là 0
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({ discountType: 'amount' }); // Đặt giá trị mặc định khi mở modal
      setDiscountType('amount'); // Đồng bộ hóa state
      form.setFieldsValue({ maxDiscountAmount: 0 }); // Đặt giá trị Giảm giá tối đa là 0 nếu là 'amount'
    }
  }, [isModalOpen, form]);
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
      loadData(); // Gọi lại hàm loadData để tải lại trang
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
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.discountType === 'amount') {
              form.setFieldsValue({ discountPercent: 0, maxDiscountAmount: 0 }); // Đặt giá trị mặc định là 0
            }
            if (changedValues.discountType === 'percent') {
              form.setFieldsValue({ discountAmount: 0 }); // Đặt giá trị mặc định là 0
            }
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
              rules={[
                { required: true, message: 'Vui lòng nhập số tiền giảm giá!' },
                {
                  validator: (_, value) => {
                    if (discountType === 'amount') {
                      if (!value || value <= 0 || value > 10000000) {
                        return Promise.reject(new Error('Số tiền giảm giá phải nằm trong khoảng từ 0 đến 10,000,000 VNĐ!'));
                      }
                    }
                    return Promise.resolve();
                  },
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minPurchaseAmount = getFieldValue('minPurchaseAmount');
                    if (discountType === 'amount' && value > minPurchaseAmount) {
                      return Promise.reject(new Error('Số tiền giảm giá không được lớn hơn số tiền mua tối thiểu!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền giảm giá"
                min={0} // Giá trị tối thiểu
                max={10000000} // Giá trị tối đa
                disabled={discountType === 'percent'} // Disable nếu loại giảm giá là phần trăm
              />
            </Form.Item>
            <Form.Item
              label="Phần trăm giảm giá (%)"
              name="discountPercent"
              rules={[
                { required: true, message: 'Vui lòng nhập phần trăm giảm giá!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (discountType === 'percent') {
                      if (!value || value <= 0 || value > 50) {
                        return Promise.reject(new Error('Phần trăm giảm giá không được vượt quá 50!'));
                      }
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
                max={50}
                disabled={discountType === "amount"} // Disable nếu là tiền
              />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Số tiền mua tối thiểu (VNĐ)"
              name="minPurchaseAmount"
              rules={[
                { required: true, message: 'Vui lòng nhập số tiền mua tối thiểu!' },
                {
                  validator: (_, value) => {
                    if (value < 0 || value > 10000000) {
                      return Promise.reject(new Error('Số tiền trong khoảng từ 0 đến 10,000,000 VNĐ!'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền mua tối thiểu"
                min={0}
                max={10000000}
              />
            </Form.Item>

            <Form.Item
              label="Giảm giá tối đa (VNĐ)"
              name="maxDiscountAmount"
              rules={[
                { required: true, message: 'Vui lòng nhập số tiền giảm giá tối đa!' },
                {
                  validator: (_, value) => {
                    if (discountType === 'percent') {
                      if (!value || value <= 0 || value > 10000000) {
                        return Promise.reject(
                          new Error('Số tiền trong khoảng từ 0 đến 10,000,000 VNĐ!')
                        );
                      }
                    }
                    return Promise.resolve();
                  },
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minPurchaseAmount = getFieldValue('minPurchaseAmount');
                    if (discountType === 'percent' && value > minPurchaseAmount) {
                      return Promise.reject(
                        new Error('Số tiền không được lớn hơn số tiền mua tối thiểu!')
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ width: '48%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền giảm giá tối đa"
                min={0}
                max={10000000}
                disabled={discountType === 'amount'}
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
