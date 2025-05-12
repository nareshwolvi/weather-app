import React from 'react'
import CardLayout from './ui/CardLayout';
import Clock from "../assets/images/clock.svg";
import moment from 'moment';
import {Line} from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

// This is neccessary for displaying the chart
Chart.register(...registerables)

const LineChart = ({timeHours, temperatureData}) => {
    const data = {
        labels: timeHours.map((hour) => `${hour}`),
        datasets:[
            {
                label: "Temperature (℃)",
                data: temperatureData,
                fill: false,
                borderColor:" #FFC355",
                pointRadius: 5,
                pointBackgroundColor:" #FFC355",
                pointHoverRadius: 8,
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                grid:{
                    display: false //Hide grid lines for x-axis
                },
                tricks:{
                    color: "white" //Customize x-axis tick color
                },
                title:{
                    display: true,
                    text: "Hour",
                    color: "white", //Customize x-axis label color
                },
                border:{
                    color: "white", //Customize x-axis line color
                },
            },

            y: {
                grid:{
                    display: false, //Hide grid lines for y-axis
                },
                tricks:{
                    color: "white", //Customize y-axis tick color
                },
                title:{
                    display: true,
                    text: "Temperature",
                    color: "white", //Customize y-axis label color
                },
                border:{
                    color: "white", //Customize y-axis line color
                },
            },
        },
        plugins:{
            legend:{
                display: false,
            },
        }   
    };

    return <Line data={data} options={chartOptions} />;
};

export default function TempGraph({hourlyData}) {
    const timeHours = hourlyData?.length > 0 ? hourlyData?.map((item) => moment(new Date(item.date)).format("h:mm a")) : [];
    const temperatureData = hourlyData?.length > 0 ? hourlyData?.map((item) => Math.floor(item.values?.temperature2m)) : [];

  return (
    <CardLayout className={"temp-graph-card-layout"}>
        <div className="flex items-center">
            <img src={Clock} alt="Clock" />
            <p className="time-format-text">24-Hour Forecast</p>
        </div>
        <LineChart timeHours={timeHours} temperatureData={temperatureData}/>
    </CardLayout>
  )
}
