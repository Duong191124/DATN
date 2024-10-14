import React from "react";
import { Select } from "antd";

const CounterSaleStaff = ({ staffList, onStaffSelect }) => {
  return (
    <>
      <h3 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd" }}>
        Nhân viên
      </h3>
      <div>
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn nhân viên"
          onChange={(value) => onStaffSelect(value)}
        >
          {staffList.map((staff) => (
            <Select.Option key={staff.id} value={staff.id}>
              {staff.name}
            </Select.Option>
          ))}
        </Select>
      </div>
    </>
  );
};

export default CounterSaleStaff;
