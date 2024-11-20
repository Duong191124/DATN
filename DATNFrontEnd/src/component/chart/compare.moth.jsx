import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

// Hàm tạo dữ liệu ngẫu nhiên cho từng nhóm
const generateMonthlyData = (months, min, max) => {
    return months.map((month) => ({
        x: month,
        y: Math.floor(Math.random() * (max - min + 1)) + min,
    }));
};

const CompareMonth = () => {
    useEffect(() => {
        // Tháng cần so sánh
        const months = ['Jan', 'Feb'];

        // Tạo dữ liệu doanh thu ngẫu nhiên cho từng nhóm
        const fakeBlueData = generateMonthlyData(months, 20, 60); // Nhóm Blue
        const fakeGreenData = generateMonthlyData(months, 15, 50); // Nhóm Green
        const fakeRedData = generateMonthlyData(months, 10, 70); // Nhóm Red

        const options = {
            series: [
                {
                    name: 'Blue',
                    data: fakeBlueData,
                },
                {
                    name: 'Green',
                    data: fakeGreenData,
                },
                {
                    name: 'Red',
                    data: fakeRedData,
                },
            ],
            chart: {
                width: 600,
                type: 'line',
            },
            plotOptions: {
                line: {
                    isSlopeChart: true, // Hiển thị dạng Slope Chart
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (value) {
                        return `${value} units`; // Đơn vị hiển thị
                    },
                },
            },
            xaxis: {
                title: {
                    text: 'Months', // Trục X
                },
            },
            yaxis: {
                title: {
                    text: 'Revenue', // Trục Y
                },
            },
        };

        const chart = new ApexCharts(document.querySelector('#compare-month-chart'), options);
        chart.render();

        // Cleanup chart on component unmount
        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <>
            <h2>Compare Monthly Revenue</h2><div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '100vh',
                    backgroundColor: '#f8f9fa',
                }}
            >
                <div id="compare-month-chart"></div>
            </div>
        </>
    );
};

export default CompareMonth;
