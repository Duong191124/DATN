import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';

// Hàm tạo dữ liệu ngẫu nhiên
const generateFakeData = (numPoints, min, max) => {
    return Array.from({ length: numPoints }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
};

const AccountStats = () => {

    const [lable, setLable] = useState(['Admin', 'User', 'Guest', 'Moderator', 'Others']);

    useEffect(() => {

        const fakeAccountData = generateFakeData(5, 10, 60);

        const options = {
            series: fakeAccountData,
            chart: {
                type: 'donut',
                height: 350,
            },
            labels: lable, // Tên các nhóm tài khoản
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
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

        const chart = new ApexCharts(document.querySelector('#account-chart'), options);
        chart.render();

        // Cleanup chart on component unmount
        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <div>
            <h2>Account Statistics</h2>
            <div id="account-chart"></div>
        </div>
    );
};

export default AccountStats;
