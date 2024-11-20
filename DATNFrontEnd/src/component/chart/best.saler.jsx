import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

// Hàm tạo dữ liệu ngẫu nhiên cho sản phẩm bán chạy
const generateBestSellerData = (names, min, max) => {
    return names.map(() => Math.floor(Math.random() * (max - min + 1)) + min);
};

const BestSeller = () => {
    useEffect(() => {
        // Tên sản phẩm giả định
        const productNames = [
            ['John', 'Doe'],
            ['Joe', 'Smith'],
            ['Jake', 'Williams'],
            'Amber',
            ['Peter', 'Brown'],
            ['Mary', 'Evans'],
            ['David', 'Wilson'],
            ['Lily', 'Roberts'],
            'Chris',
            'Anna',
        ];

        // Dữ liệu fake cho doanh số
        const fakeSalesData = generateBestSellerData(productNames, 10, 50); // Số lượng bán từ 10 đến 50

        const colors = [
            '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
            '#546E7A', '#26A69A', '#D10CE8', '#FF5733', '#33FF57',
        ];

        const options = {
            series: [
                {
                    data: fakeSalesData,
                },
            ],
            chart: {
                width: 900,
                type: 'bar',
                events: {
                    click: function (chart, w, e) {
                        console.log('Chart clicked', chart, w, e); // Thao tác sự kiện click
                    },
                },
            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
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
                        fontSize: '12px',
                    },
                },
            },
        };

        // Tạo biểu đồ
        const chart = new ApexCharts(document.querySelector('#bestseller-chart'), options);
        chart.render();

        // Dọn dẹp khi component bị hủy
        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <>
            <h2 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
                Top 10 Best-Selling Products
            </h2>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    minHeight: '100vh',
                }}
            >

                <div id="bestseller-chart" style={{ maxWidth: '100%' }}></div>
            </div>
        </>
    );
};

export default BestSeller;
