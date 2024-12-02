import React from "react";
import { Tabs } from "antd";
import ChartChannel from "../component/chart/chanel.product";
import ProductChart from "../component/chart/product.chart";
import AccountStats from "../component/chart/account.donut";
import BestSeller from "../component/chart/best.saler";

const ChartPage = () => {
  const items = [
    {
      key: "1",
      label: "Doanh thu",
      children: <ChartChannel />,
    },
    {
      key: "2",
      label: "Thống kê sản phẩm",
      children: <ProductChart />,
    },
    {
      key: "3",
      label: "Top 10 sản phẩm bán chạy",
      children: <BestSeller />,
    },

    {
      key: "4",
      label: "Thống kê tài khoản",
      children: <AccountStats />,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ChartPage;
