import React, { useState, useEffect } from "react";
import { Button, Input, Form, notification, Select } from "antd";

const InputField = ({
  label,
  value,
  onChange,
  required = true,
  type = "text",
}) => (
  <Form.Item label={label} required={required}>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </Form.Item>
);

const CounterSalePayment = ({
  onPayment,
  paymentInfo,
  setPaymentInfo,
  discountAmount = 0,
  selectedBill,
  cartItems,
  customerPaid,
  setCustomerPaid,
  loading,
}) => {
  const [change, setChange] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Cập nhật tổng tiền khi có sự thay đổi từ giỏ hàng
  useEffect(() => {
    if (selectedBill) {
      const newTotalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalAmount(newTotalAmount);
    } else {
      setTotalAmount(0);
    }
  }, [selectedBill, cartItems]);

  // Tính tiền thừa nếu có
  useEffect(() => {
    const totalAmountWithDiscount = totalAmount - discountAmount;
    setChange(customerPaid - totalAmountWithDiscount);
  }, [customerPaid, totalAmount, discountAmount]);

  return (
    <div className="payment">
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Thông Tin Thanh Toán
      </h3>
      <Form layout="vertical">
        <InputField
          label="Tên khách hàng"
          value={paymentInfo.customerName}
          onChange={(value) =>
            setPaymentInfo({ ...paymentInfo, customerName: value })
          }
        />
        <InputField
          label="Địa chỉ giao hàng"
          value={paymentInfo.address}
          onChange={(value) =>
            setPaymentInfo({ ...paymentInfo, address: value })
          }
        />
        <Form.Item label="Phương thức thanh toán" required>
          <Select
            value={paymentInfo.paymentMethod}
            onChange={(value) =>
              setPaymentInfo({ ...paymentInfo, paymentMethod: value })
            }
            options={[
              { value: "Cash", label: "Tiền mặt" },
              { value: "Credit Card", label: "Thẻ tín dụng" },
              { value: "PayPal", label: "PayPal" },
            ]}
            placeholder="Chọn phương thức thanh toán"
          />
        </Form.Item>
        <Form.Item>
          <h4>
            Tổng Tiền: {totalAmount ? totalAmount.toLocaleString() : "0 VNĐ"}
          </h4>
          {discountAmount > 0 && (
            <p style={{ color: "green" }}>
              (Đã giảm giá: {discountAmount.toLocaleString()} VNĐ)
            </p>
          )}
        </Form.Item>
        <Form.Item label="Tiền khách đưa" required>
          <Input
            type="number"
            value={customerPaid}
            onChange={(e) => setCustomerPaid(Number(e.target.value) || 0)}
            min={0}
          />
        </Form.Item>
        {change > 0 && (
          <Form.Item>
            <h4>Tiền thừa: {change.toLocaleString()} VNĐ</h4>
          </Form.Item>
        )}
        <Button type="primary" onClick={onPayment} loading={loading}>
          Thanh Toán
        </Button>
      </Form>
    </div>
  );
};

export default CounterSalePayment;
