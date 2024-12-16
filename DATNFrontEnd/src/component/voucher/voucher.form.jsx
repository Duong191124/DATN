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
    setDiscountType(type);

    if (type === 'amount') {
      form.setFieldsValue({ discountPercent: null, maxDiscountAmount: null });
    } else if (type === 'percent') {
      form.setFieldsValue({ discountAmount: null });
    }
  };


  useEffect(() => {
    if (isModalOpen) {
      form.setFieldsValue({ discountType: 'amount' }); // Đặt giá trị mặc định khi mở modal
      setDiscountType('amount'); // Đồng bộ hóa state
      form.setFieldsValue({ maxDiscountAmount: null }); // Đặt giá trị Giảm giá tối đa là 0 nếu là 'amount'
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
            discountAmount: null,
            discountPercent: null,
            maxDiscountAmount: null,
            expirationDate: moment().startOf('day').add(1, 'days'),
            status: 1,
          }}
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.discountType === 'amount') {
              form.setFieldsValue({ discountPercent: null, maxDiscountAmount: null }); // Đặt giá trị mặc định là 0
            }
            if (changedValues.discountType === 'percent') {
              form.setFieldsValue({ discountAmount: null }); // Đặt giá trị mặc định là 0
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
                {
                  validator: (_, value) => {
                    if (discountType === 'amount') {
                      if (value === null || value === undefined) {
                        return Promise.reject(new Error('Vui lòng nhập số tiền giảm giá!'));
                      }
                      if (value >= 1000 && value < 10000000) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Số tiền giảm giá phải nằm trong khoảng từ 1,000 đến dưới 10,000,000 VNĐ!'));
                    }
                    return Promise.resolve(); // Không bắt lỗi khi loại giảm giá không phải là tiền
                  },
                },
              ]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền giảm giá"
                min={1000}
                max={10000000}
                disabled={discountType === 'percent'} // Disable khi loại giảm giá là phần trăm
              />
            </Form.Item>
            <Form.Item
              label="Phần trăm giảm giá (%)"
              name="discountPercent"
              rules={[
                {
                  validator: (_, value) => {
                    if (discountType === 'percent') {
                      if (value === null || value === undefined) {
                        return Promise.reject(new Error('Vui lòng nhập phần trăm giảm giá!'));
                      }
                      if (value > 0 && value <= 50) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Phần trăm giảm giá phải lớn hơn 0 và không được vượt quá 50!'));
                    }
                    return Promise.resolve(); // Không bắt lỗi khi loại giảm giá không phải là phần trăm
                  },
                },
              ]}
              style={{ width: '48%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập phần trăm giảm giá"
                min={0}
                max={50}
                disabled={discountType === 'amount'} // Disable khi loại giảm giá là tiền
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
                {
                  validator: (_, value) => {
                    if (discountType === 'percent') {
                      if (value === null || value === undefined) {
                        return Promise.reject(new Error('Vui lòng nhập số tiền giảm giá tối đa!'));
                      }
                      if (value > 0 && value <= 10000000) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Số tiền giảm giá tối đa phải lớn hơn 0 và không vượt quá 10,000,000 VNĐ!'));
                    }
                    return Promise.resolve(); // Không bắt lỗi khi loại giảm giá không phải là phần trăm
                  },
                },
              ]}
              style={{ width: '48%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền giảm giá tối đa"
                min={0}
                max={10000000}
                disabled={discountType === 'amount'} // Disable khi loại giảm giá là tiền
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
                style={{ width: '100%' }}
                format={"DD-MM-YYYY"}
                disabledDate={(current) => current && current < moment().startOf("day")}
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
