import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { Select, Row, Col, Table } from "antd";
import { topSellingProducts } from "../../service/api.service";

const { Option } = Select;

const BestSeller = () => {
  const [dataBestSeller, setDataBestSeller] = useState([]);
  const [dataProductsAttribute, setDataProductsAttribute] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    day: null,
    month: null,
    year: new Date().getFullYear(),
  });

  const [maxDays, setMaxDays] = useState(31);

  // Fetch data từ API
  const getTop10BestSeller = async (day, month, year) => {
    try {
      setDataBestSeller([]);
      const data = await topSellingProducts(day, month, year);
      if (data?.data) {
        setDataBestSeller(data.data.topSellingProducts);
        setDataProductsAttribute(data.data.topSellingProductsAttributes);
      } else {
        console.warn("No data available for the selected filters.");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    getTop10BestSeller(selectedDate.day, selectedDate.month, selectedDate.year);
  }, [selectedDate]);

  useEffect(() => {
    const productNames = dataBestSeller.map(
      (item) => item.productName || "Unknown"
    );
    const salesData = dataBestSeller.map((item) => item.totalSold || 0);

    const colors = [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#546E7A",
      "#26A69A",
      "#D10CE8",
      "#FF5733",
      "#33FF57",
    ];

    const options = {
      series: [
        {
          name: "Số lượng đã bán",
          data: salesData,
        },
      ],
      chart: {
        type: "bar",
        height: 400,
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: productNames,
        labels: {
          style: {
            colors: colors,
            fontSize: "12px",
          },
        },
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#bestseller-chart"),
      options
    );
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataBestSeller]);
  // Xử lý thay đổi ngày, tháng, năm
  const handleChange = (value, field) => {
    const updatedDate = { ...selectedDate, [field]: value };
    // Cập nhật số ngày dựa theo tháng/năm
    if (field === "month" || field === "year") {
      const daysInMonth = new Date(
        updatedDate.year || new Date().getFullYear(),
        updatedDate.month || 1,
        0
      ).getDate();
      setMaxDays(daysInMonth);

      // Reset ngày nếu lớn hơn số ngày hợp lệ
      if (updatedDate.day > daysInMonth) {
        updatedDate.day = null;
      }
    }

    setSelectedDate(updatedDate);
  };

  // Tạo danh sách ngày, tháng, năm
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const columns = [
    {
      title: "Product Code",
      dataIndex: "productCode",
      key: "productCode",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Total Sold",
      dataIndex: "totalSold",
      key: "totalSold",
    },
  ];
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: "bold", color: "#333" }}>
        Top 10 Best-Selling Products
      </h2>

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Select
            placeholder="Select Year"
            style={{ width: "100%" }}
            onChange={(value) => handleChange(value, "year")}
            value={selectedDate.year}
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Select
            placeholder="Select Month"
            style={{ width: "100%" }}
            onChange={(value) => handleChange(value, "month")}
            value={selectedDate.month}
            allowClear
          >
            {months.map((month) => (
              <Option key={month} value={month}>
                {month}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Select
            placeholder="Select Day"
            style={{ width: "100%" }}
            onChange={(value) => handleChange(value, "day")}
            value={selectedDate.day}
            disabled={!selectedDate.month || !selectedDate.year}
            allowClear
          >
            {days.map((day) => (
              <Option key={day} value={day}>
                {day}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <div id="bestseller-chart" style={{ maxWidth: "100%" }}></div>
      <Table
        columns={columns}
        dataSource={dataProductsAttribute}
        rowKey="key"
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
};

export default BestSeller;
