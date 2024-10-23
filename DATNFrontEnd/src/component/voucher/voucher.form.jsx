import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, Select, notification } from 'antd';
import moment from 'moment';
import { createVoucher, fetchCustomerList, updateVoucherCustomer } from '../../service/api.service';

const { TextArea } = Input;

const VoucherForm = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const { loadData, onCreate } = props; // Nhận onCreate từ props

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetchCustomerList();
        if (res && res.data && res.data.data && res.data.data.content) {
          setCustomers(res.data.data.content); // Sử dụng "content" để lấy danh sách khách hàng
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
    fetchCustomers();
  }, []);

  // VoucherForm.js
  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const formattedValues = {
      ...values,
      expirationDate: values.expirationDate.format("YYYY-MM-DD"),
      status: Number(values.status),
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
            startDate: moment(),
            expirationDate: moment().add(1, 'days'),
            status: 1,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Mã Voucher"
              name="code"
              rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}
              style={{ width: '48%', marginRight: '4%' }} // Đặt width và margin
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Khách hàng"
              name="customers"
              rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
              style={{ width: '48%' }} // Đặt width cho Form.Item
            >
              <Select placeholder="Chọn khách hàng" allowClear>
                {Array.isArray(customers) && customers.length > 0
                  ? customers.map(customer => (
                    <Select.Option key={customer.id} value={customer.id}>
                      {customer.username}
                    </Select.Option>
                  ))
                  : <Select.Option disabled>Không có khách hàng</Select.Option>
                }
              </Select>
            </Form.Item>

          </div>

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
            {/* <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item> */}

            <Form.Item
              label="Ngày hết hạn"
              name="expirationDate"
              rules={[
                { required: true, message: 'Vui lòng chọn ngày hết hạn!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue('startDate');
                    if (value && startDate && value.isBefore(startDate, 'day')) {
                      return Promise.reject(new Error('Ngày hết hạn không được trước ngày bắt đầu!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ width: '48%' }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Form.Item
              label="Số lượng voucher"
              name="quantity"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng voucher!' }]}
              style={{ width: '48%', marginRight: '4%' }}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng voucher" min={1} />
            </Form.Item>

            {/* <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái" allowClear>
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Không hoạt động</Select.Option>
              </Select>

            </Form.Item> */}


          </div>

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
