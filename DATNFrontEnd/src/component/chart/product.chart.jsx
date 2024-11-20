import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const ProductChart = () => {
    useEffect(() => {
        const options = {
            chart: {
                type: 'bar',
                height: 350,
            },
            series: [
                {
                    name: 'Sales',
                    data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
                },
            ],
            xaxis: {
                categories: ["Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10",],
            },
        };

        const chart = new ApexCharts(document.querySelector('#chartP'), options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <div>
            <h2>Income Stistics</h2>
            <div id="chartP"></div>
        </div>
    );
};

export default ProductChart;
