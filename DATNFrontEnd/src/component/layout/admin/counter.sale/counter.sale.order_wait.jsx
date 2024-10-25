import React from "react";
import { Button } from "antd";

const CounterSaleTemporaryBills = ({
  billItems,
  onSelectBillToExchange, // Hàm đổi hóa đơn
  onRemoveBill, // Hàm lấy hóa đơn ra
}) => {
  return (
    <div>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Hóa đơn tạm chờ
      </h3>
      <ul>
        {billItems.map((bill) => (
          <li key={bill.billId}>
            <span>
              {bill.billId} - Nhân viên: {bill.staff.name}
            </span>

            {/* Nút lấy hóa đơn ra */}
            <Button
              type="primary"
              style={{ marginLeft: "10px" }}
              onClick={() => onRemoveBill(bill.billId)} // Gọi hàm lấy hóa đơn ra
            >
              Lấy ra
            </Button>

            {/* Nút đổi hóa đơn */}
            <Button
              type="dashed"
              style={{ marginLeft: "10px" }}
              onClick={() => onSelectBillToExchange(bill.billId)} // Gọi hàm đổi hóa đơn
            >
              Đổi hóa đơn
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CounterSaleTemporaryBills;
