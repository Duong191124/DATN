import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { Radio, Table } from "antd"; // Chỉ cần Table của antd
import { productsStatistics } from "../../service/api.service";
import moment from "moment";

const ChartChannel = () => {
  const [productStatistics, setProductStatistics] = useState([]);
  const [view, setView] = useState("month");
  const [tableData, setTableData] = useState([]); // Dữ liệu bảng
  // Hàm nhóm dữ liệu theo tháng
  const groupByMonth = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const month = item.month;
      if (!grouped[month]) {
        grouped[month] = { onlineRevenue: 0, offlineRevenue: 0 };
      }
      grouped[month].onlineRevenue += item.onlineRevenue;
      grouped[month].offlineRevenue += item.offlineRevenue;
    });
    return grouped;
  };

  // Hàm nhóm dữ liệu theo ngày
  const groupByDay = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const day = item.day;
      if (!grouped[day]) {
        grouped[day] = { onlineRevenue: 0, offlineRevenue: 0 };
      }
      grouped[day].onlineRevenue += item.onlineRevenue;
      grouped[day].offlineRevenue += item.offlineRevenue;
    });
    return grouped;
  };

  // Hàm nhóm dữ liệu theo năm
  const groupByYear = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const year = item.year;
      if (!grouped[year]) {
        grouped[year] = { onlineRevenue: 0, offlineRevenue: 0 };
      }
      grouped[year].onlineRevenue += item.onlineRevenue;
      grouped[year].offlineRevenue += item.offlineRevenue;
    });
    return grouped;
  };
  // Hàm nhóm dữ liệu theo tuần
  const groupByWeekInMonth = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const itemDate = moment(item.day);
      const startOfMonth = itemDate.clone().startOf("month");

      // Tính tuần trong tháng (1, 2, 3, 4)
      const weekInMonth =
        Math.ceil(itemDate.diff(startOfMonth, "days") / 7) + 1;

      // Tạo key duy nhất cho từng tuần trong mỗi tháng (YYYY-MM - Week X)
      const key = `${itemDate.format("YYYY-MM")} - Week ${weekInMonth}`;

      // Khởi tạo nếu chưa có key
      if (!grouped[key]) {
        grouped[key] = { onlineRevenue: 0, offlineRevenue: 0 };
      }

      // Cộng doanh thu cho mỗi tuần trong tháng
      grouped[key].onlineRevenue += item.onlineRevenue || 0;
      grouped[key].offlineRevenue += item.offlineRevenue || 0;
    });

    // Chỉnh lại key để đảm bảo tuần được nhóm đúng thứ tự trong tháng
    const sortedGrouped = Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});
    return sortedGrouped;
  };

  // Lấy dữ liệu thống kê sản phẩm từ API
  const getProductsStatistics = async () => {
    try {
      const data = await productsStatistics();
      if (data?.data) {
        setProductStatistics(data.data);
      }
    } catch (error) {
      console.error("Error fetching product statistics", error);
    }
  };

  useEffect(() => {
    getProductsStatistics();
  }, []);

  useEffect(() => {
    if (productStatistics.length === 0) return;

    let groupedData;
    let labels;
    let onlineRevenueData;
    let offlineRevenueData;
    let tableRows = [];

    if (view === "month") {
      groupedData = groupByMonth(productStatistics);
      labels = Object.keys(groupedData).sort();
      onlineRevenueData = labels.map(
        (key) => groupedData[key]?.onlineRevenue || 0
      );
      offlineRevenueData = labels.map(
        (key) => groupedData[key]?.offlineRevenue || 0
      );

      tableRows = labels.map((month) => ({
        key: month,
        period: month,
        onlineRevenue: groupedData[month].onlineRevenue,
        offlineRevenue: groupedData[month].offlineRevenue,
      }));
    } else if (view === "day") {
      groupedData = groupByDay(productStatistics);
      labels = Object.keys(groupedData);
      onlineRevenueData = labels.map((day) => groupedData[day].onlineRevenue);
      offlineRevenueData = labels.map((day) => groupedData[day].offlineRevenue);

      tableRows = labels.map((day) => ({
        key: day,
        period: day,
        onlineRevenue: groupedData[day].onlineRevenue,
        offlineRevenue: groupedData[day].offlineRevenue,
      }));
    } else if (view === "year") {
      groupedData = groupByYear(productStatistics);
      labels = Object.keys(groupedData);
      onlineRevenueData = labels.map(
        (year) => groupedData[year]?.onlineRevenue || 0
      );
      offlineRevenueData = labels.map(
        (year) => groupedData[year]?.offlineRevenue || 0
      );

      tableRows = labels.map((year) => ({
        key: year,
        period: year,
        onlineRevenue: groupedData[year].onlineRevenue,
        offlineRevenue: groupedData[year].offlineRevenue,
      }));
    } else if (view === "week") {
      groupedData = groupByWeekInMonth(productStatistics); // Nhóm dữ liệu theo tuần
      labels = Object.keys(groupedData);
      onlineRevenueData = labels.map(
        (week) => groupedData[week]?.onlineRevenue || 0
      );
      offlineRevenueData = labels.map(
        (week) => groupedData[week]?.offlineRevenue || 0
      );
      tableRows = labels.map((week) => ({
        key: week,
        period: `${week}`,
        onlineRevenue: groupedData[week].onlineRevenue,
        offlineRevenue: groupedData[week].offlineRevenue,
      }));
    }

    setTableData(tableRows); // Cập nhật dữ liệu bảng

    const options = {
      series: [
        {
          name: "Online Revenue",
          type: "area",
          data: onlineRevenueData,
        },
        {
          name: "Offline Revenue",
          type: "line",
          data: offlineRevenueData,
        },
      ],
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        type: "solid",
        opacity: [0.35, 1],
      },
      labels: labels, // Gắn các tháng/ngày/năm làm nhãn trên trục X
      markers: {
        size: 0,
      },
      yaxis: [
        {
          title: {
            text: "Revenue (VNĐ)",
          },
          labels: {
            formatter: function (value) {
              return value.toLocaleString() + " đ";
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toLocaleString() + " đ";
            }
            return y;
          },
        },
      },
    };

    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [productStatistics, view]);

  const handleViewChange = (e) => {
    setView(e.target.value);
  };

  const columns = [
    {
      title: "Giai đoạn",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Doanh thu online (đ)",
      dataIndex: "onlineRevenue",
      key: "onlineRevenue",
      render: (text) => text.toLocaleString() + " đ",
    },
    {
      title: "Doanh thu offline (đ)",
      dataIndex: "offlineRevenue",
      key: "offlineRevenue",
      render: (text) => text.toLocaleString() + " đ",
    },
    {
      title: "Tổng doanh thu (đ)",
      key: "totalRevenue",
      render: (text, record) => {
        const totalRevenue =
          (record.onlineRevenue || 0) + (record.offlineRevenue || 0);
        return totalRevenue.toLocaleString() + " đ";
      },
    },
  ];
  return (
    <div>
      <h2>Doanh thu của online và offline</h2>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
      >
        <Radio.Group onChange={handleViewChange} value={view}>
          <Radio value="day">Ngày</Radio>
          <Radio value="week">Tuần</Radio>
          <Radio value="month">Tháng</Radio>
          <Radio value="year">Năm</Radio>
        </Radio.Group>
      </div>
      <div id="chart"></div>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="key"
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
};

export default ChartChannel;
