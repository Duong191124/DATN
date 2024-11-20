import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

// Hàm tạo dữ liệu ngẫu nhiên
const generateFakeData = (numPoints, min, max) => {
    return Array.from({ length: numPoints }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
};

const ChartChannel = () => {
    useEffect(() => {
        const fakeOnlineData = generateFakeData(11, 30, 70); // Dữ liệu Online Revenue
        const fakeOfflineData = generateFakeData(11, 40, 90); // Dữ liệu Offline Revenue

        const options = {
            series: [
                {
                    name: 'Online Revenue',
                    type: 'area',
                    data: fakeOnlineData,
                },
                {
                    name: 'Offline Revenue',
                    type: 'line',
                    data: fakeOfflineData,
                },
            ],
            chart: {
                height: 350,
                type: 'line',
            },
            stroke: {
                curve: 'smooth',
            },
            fill: {
                type: 'solid',
                opacity: [0.35, 1],
            },
            labels: [
                'Dec 01',
                'Dec 02',
                'Dec 03',
                'Dec 04',
                'Dec 05',
                'Dec 06',
                'Dec 07',
                'Dec 08',
                'Dec 09',
                'Dec 10',
                'Dec 11',
            ],
            markers: {
                size: 0,
            },
            yaxis: [
                {
                    title: {
                        text: 'Online Revenue',
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: 'Offline Revenue',
                    },
                },
            ],
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== 'undefined') {
                            return y.toFixed(0) + ' points';
                        }
                        return y;
                    },
                },
            },
        };

        const chart = new ApexCharts(document.querySelector('#chart'), options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <div>
            <h2>Chanel Stistics</h2>
            <div id="chart"></div>
        </div>
    );
};

export default ChartChannel;
