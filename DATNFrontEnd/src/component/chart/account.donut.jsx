import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { accountStatistics } from "../../service/api.service";

const AccountStats = () => {
  const [dataAccount, setDataAccount] = useState(null);

  const getAccountStatistics = async () => {
    const response = await accountStatistics();
    if (response?.data) {
      setDataAccount(response.data);
    }
  };

  useEffect(() => {
    getAccountStatistics();
  }, []);

  useEffect(() => {
    if (!dataAccount) return;

    // Dữ liệu từ API
    const { adminCount, managerCount, normalEmployeeCount, customer } =
      dataAccount;
    // Chuẩn bị dữ liệu cho ApexCharts
    const options = {
      series: [adminCount, managerCount, normalEmployeeCount, customer],
      chart: {
        type: "donut",
        height: 350,
      },
      labels: ["Admin", "Quản lý", "Nhân viên", "Khách hàng"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      tooltip: {
        y: {
          formatter: function (value) {
            return `${value} accounts`;
          },
        },
      },
    };

    // Tạo biểu đồ với ApexCharts
    const chart = new ApexCharts(
      document.querySelector("#account-chart"),
      options
    );
    chart.render();

    // Dọn dẹp khi unmount component
    return () => {
      chart.destroy();
    };
  }, [dataAccount]); // Re-render khi `dataAccount` thay đổi

  return (
    <div>
      <h2>Thống kê tài khoản</h2>
      <div id="account-chart"></div>
    </div>
  );
};

export default AccountStats;
