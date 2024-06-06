import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import Plot from 'react-plotly.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Page_Returns = () => {
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [selectedSport, setSelectedSport] = useState('All Players');

    useEffect(() => {
        axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/player_data.json')
            .then(response => {
                setData(response.data);
                setFilteredData(response.data); // Initialize filteredData with all players
            })
            .catch(error => {
                console.error('Error fetching the data', error);
            });
    }, []);

    useEffect(() => {
        if (data) {
            if (selectedSport === 'All Players') {
                setFilteredData(data);
            } else {
                setFilteredData(data.filter(player => player.Sport === selectedSport));
            }
        }
    }, [data, selectedSport]);

    const handleSportChange = (e) => {
        setSelectedSport(e.target.value);
    };

    if (!filteredData) {
        return <div>Loading...</div>;
    }

    const sortedYTD = [...filteredData].sort((a, b) => b['YTD Return'] - a['YTD Return']);
    const sorted2023 = [...filteredData].sort((a, b) => b['Year 2023 Return'] - a['Year 2023 Return']);

    const getGradientColors = (values) => {
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        return values.map(value => {
            const ratio = (value - minValue) / (maxValue - minValue);
            const green = Math.round(255 * ratio);
            const red = Math.round(255 * (1 - ratio));
            return `rgba(${red}, ${green}, 0, 0.6)`;
        });
    };

    const ytdColors = getGradientColors(sortedYTD.map(item => item['YTD Return']));
    const year2023Colors = getGradientColors(sorted2023.map(item => item['Year 2023 Return']));

    const ytdChartData = {
        labels: sortedYTD.map(item => item.Player),
        datasets: [
            {
                label: 'YTD Return',
                data: sortedYTD.map(item => item['YTD Return']),
                backgroundColor: ytdColors,
                borderColor: ytdColors,
                borderWidth: 1,
            },
        ],
    };

    const year2023ChartData = {
        labels: sorted2023.map(item => item.Player),
        datasets: [
            {
                label: 'Year 2023 Return',
                data: sorted2023.map(item => item['Year 2023 Return']),
                backgroundColor: year2023Colors,
                borderColor: year2023Colors,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                title: {
                    display: true,
                    text: 'Player',
                    color: 'peru',
                    font: {
                        size: 14,
                    },
                },
                ticks: {
                    maxTicksLimit: 10,
                    callback: function (value) {
                        return value.length > 10 ? value.slice(0, 10) + '...' : value;
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                display: false,
            },
        },
    };

    const players = filteredData.map(player => player.Player);
    const lowValues = filteredData.map(player => player.Low);
    const currentValues = filteredData.map(player => player.Current);
    const highValues = filteredData.map(player => player.High);

    const normalizedLowValues = lowValues.map(() => 0);
    const normalizedHighValues = highValues.map((value, index) => (value - lowValues[index]) / (highValues[index] - lowValues[index]) * 100);
    const normalizedCurrentValues = currentValues.map((value, index) => (value - lowValues[index]) / (highValues[index] - lowValues[index]) * 100);
    const normalizedRangeValues = normalizedHighValues.map((high, i) => high - normalizedLowValues[i]);

    const performanceColors = getGradientColors(normalizedCurrentValues);

    return (
        <div className="page-returns">
            <h1 className="returns-title">Card Price Returns Year-to-Date & Calendar Year 2023</h1>
            <div className="dropdown-container">
                <select className="dropdown-select" value={selectedSport} onChange={handleSportChange}>
                    <option value="All Players">All Players</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Baseball">Baseball</option>
                </select>
            </div>
            <div className="chart-container">
                <div className="chart-subplot">
                    <h2 className="chart-title">Year to Date</h2>
                    <Bar data={ytdChartData} options={options} />
                </div>
                <div className="chart-subplot">
                    <h2 className="chart-title">Year 2023</h2>
                    <Bar data={year2023ChartData} options={options} />
                </div>
            </div>
            <div className="performance-container">
                <h2 className="chart-title">Card Price vs. High/Low Price</h2>
                <Plot
                    data={[
                        {
                            x: normalizedRangeValues,
                            y: players,
                            name: 'High-Low Range',
                            type: 'bar',
                            orientation: 'h',
                            base: normalizedLowValues,
                            marker: {
                                color: 'rgba(54, 162, 235, 0.6)', // Blue bar
                                line: {
                                    width: 1,
                                },
                            },
                        },
                        {
                            x: normalizedCurrentValues,
                            y: players,
                            name: 'Current',
                            type: 'scatter',
                            mode: 'markers',
                            marker: {
                                color: performanceColors, // Gradient marker
                                size: 10,
                            },
                        },
                    ]}
                    layout={{
                        title: { text: 'Current card price vs. historical high/low card price normalized', font: { color: 'peru' } },
                        barmode: 'overlay',
                        xaxis: { title: 'Values', range: [0, 100] },
                        yaxis: { title: 'Players' },
                        height: 900,
                        width: 1200,
                        margin: { l: 150, r: 50, b: 50, t: 50, pad: 4 },
                    }}
                    config={{ responsive: true }}
                />
            </div>
            <div className="info-paragraph">
                <p>This data is sourced from Card Ladder and calculations performed by Longhorn Cards.</p>
                <p>Card Ladder calculates a player index based on a basket of cards for each player to determine an average index value.</p>
                <p>Performance calculations based on player index values over the specified time-frame and the high/low range is normalized.</p>
            </div>
        </div>
    );
};

export default Page_Returns;
