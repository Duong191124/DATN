import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "antd";
import ApexCharts from "apexcharts";
import { getProductsWithAttributeAndCustomer } from "../../service/api.service";

const ProductChart = () => {
  const [dataProducts, setDataProducts] = useState([]);
  const [dataAttributes, setDataAttributes] = useState([]);
  const [customerBoughtInTheMost, setCustomerBoughtInTheMost] = useState([]);

  const getAllProductsWithAttributeAndCustomer = async () => {
    const response = await getProductsWithAttributeAndCustomer();
    if (response?.data) {
      setDataProducts(response?.data?.totalProducts);
      setDataAttributes(response?.data?.totalAttribute);
      setCustomerBoughtInTheMost(response?.data?.customerBought);
    }
  };

  useEffect(() => {
    getAllProductsWithAttributeAndCustomer();
  }, []);

  useEffect(() => {
    const chartData = dataProducts.map((product) => product.totalQuantity);
    const productCategories = dataProducts.map(
      (product) => product.productName
    );

    const options = {
      chart: {
        type: "bar",
        height: 350,
      },
      series: [
        {
          name: "Số lượng",
          data: chartData,
        },
      ],
      xaxis: {
        categories: productCategories,
        labels: {
          rotate: 0,
          wrap: true,
          style: {
            fontSize: "14px", // Kích thước font chữ
            fontFamily: "'Roboto', sans-serif", // Font chữ đẹp
          },
        },
        title: {
          style: {
            fontSize: "16px", // Kích thước font chữ cho tiêu đề trục
            fontFamily: "'Roboto', sans-serif", // Font chữ cho tiêu đề
          },
        },
      },
    };

    const chart = new ApexCharts(document.querySelector("#chartP"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [dataProducts]);

  const attributesColumns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Size",
      dataIndex: "sizeName",
      key: "sizeName",
    },
    {
      title: "Color",
      dataIndex: "colorName",
      key: "colorName",
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
  ];

  const customerColumns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Phone",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Total Products Bought",
      dataIndex: "totalProductsBought",
      key: "totalProductsBought",
    },
  ];

  return (
    <div>
      <h2>Inventory statistics</h2>
      <div id="chartP"></div>
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Col md={11} xs={24}>
          <h3 style={{ marginBottom: "10px" }}>Product Attributes</h3>
          <Table
            columns={attributesColumns}
            dataSource={dataAttributes}
            pagination={{ pageSize: 5 }}
            rowKey="key"
          />
        </Col>
        <Col md={11} xs={24}>
          <h3 style={{ marginBottom: "10px" }}>Top 10 buyers</h3>
          <Table
            columns={customerColumns}
            dataSource={customerBoughtInTheMost}
            pagination={false}
            rowKey="key"
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProductChart;
