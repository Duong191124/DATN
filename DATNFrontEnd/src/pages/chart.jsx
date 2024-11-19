import React from "react";
import { Tabs } from "antd";
import ChartChannel from "../component/chart/chanel.product";
import ProductChart from "../component/chart/product.chart";
import AccountStats from "../component/chart/account.donut";
import CompareMonth from "../component/chart/compare.moth";

const ChartPage = () => {
    const items = [
        {
            key: "1",
            label: "Product Chart",
            children: <ProductChart />,
        },
        {
            key: "2",
            label: "Channel Chart",
            children: <ChartChannel />,
        },
        {
            key: "3",
            label: "Compare moth",
            children: <CompareMonth />,
        },
        {
            key: "4",
            label: "Account Chart",
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
