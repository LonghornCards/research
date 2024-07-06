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
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [filteredTablesData, setFilteredTablesData] = useState(null);
    const [selectedChartStatus, setSelectedChartStatus] = useState('All');
    const [selectedChartSport, setSelectedChartSport] = useState('All Players');
    const [filteredChartData, setFilteredChartData] = useState(null);

    const [csiData, setCsiData] = useState({
        'CSI 50 Index': { ytdReturn: 0, year2023Return: 0 },
        'CSI Football Index': { ytdReturn: 0, year2023Return: 0 },
        'CSI Basketball Index': { ytdReturn: 0, year2023Return: 0 },
        'CSI Baseball Index': { ytdReturn: 0, year2023Return: 0 },
    });

    useEffect(() => {
        axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/player_data.json')
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);
                setFilteredTablesData(response.data);
                setFilteredChartData(response.data);
                extractCsiData(response.data);
            })
            .catch(error => {
                console.error('Error fetching the data', error);
            });
    }, []);

    useEffect(() => {
        if (data) {
            let filtered = data;
            if (selectedSport !== 'All Players') {
                filtered = filtered.filter(player => player.Sport === selectedSport);
            }
            setFilteredData(filtered);
        }
    }, [data, selectedSport]);

    useEffect(() => {
        if (data) {
            let filtered = data;
            if (selectedStatus !== 'All') {
                filtered = filtered.filter(player => player.Status === selectedStatus);
            }
            setFilteredTablesData(filtered);
        }
    }, [data, selectedStatus]);

    useEffect(() => {
        if (data) {
            let filtered = data;
            if (selectedChartStatus !== 'All') {
                filtered = filtered.filter(player => player.Status === selectedChartStatus);
            }
            if (selectedChartSport !== 'All Players') {
                filtered = filtered.filter(player => player.Sport === selectedChartSport);
            }
            setFilteredChartData(filtered);
        }
    }, [data, selectedChartStatus, selectedChartSport]);

    const extractCsiData = (data) => {
        const csiIndices = [
            'CSI 50 Index',
            'CSI Football Index',
            'CSI Basketball Index',
            'CSI Baseball Index'
        ];
        const newCsiData = {};

        csiIndices.forEach(index => {
            const csiEntry = data.find(player => player.Player === index);
            if (csiEntry) {
                newCsiData[index] = {
                    ytdReturn: csiEntry['YTD Return'],
                    year2023Return: csiEntry['Year 2023 Return']
                };
            }
        });
        setCsiData(newCsiData);
    };

    const handleSportChange = (e) => {
        setSelectedSport(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleChartStatusChange = (e) => {
        setSelectedChartStatus(e.target.value);
    };

    const handleChartSportChange = (e) => {
        setSelectedChartSport(e.target.value);
    };

    if (!filteredData || !filteredTablesData || !filteredChartData) {
        return <div>Loading...</div>;
    }

    const sortAndExtract = (sport, order = 'desc') => {
        const sortedData = filteredTablesData
            .filter(player => player.Sport === sport && !player.Player.includes('CSI'))
            .sort((a, b) => order === 'desc' ? b['YTD Return'] - a['YTD Return'] : a['YTD Return'] - b['YTD Return']);

        return sortedData.slice(0, 5).map(player => ({
            Player: player.Player,
            YTDReturn: Math.round(player['YTD Return']),
            Year2023Return: Math.round(player['Year 2023 Return'])
        }));
    };

    const topFootball = sortAndExtract('Football', 'desc');
    const topBasketball = sortAndExtract('Basketball', 'desc');
    const topBaseball = sortAndExtract('Baseball', 'desc');

    const bottomFootball = sortAndExtract('Football', 'asc').reverse();
    const bottomBasketball = sortAndExtract('Basketball', 'asc').reverse();
    const bottomBaseball = sortAndExtract('Baseball', 'asc').reverse();

    const sortedYTD = [...filteredChartData].sort((a, b) => b['YTD Return'] - a['YTD Return']);
    const sorted2023 = [...filteredChartData].sort((a, b) => b['Year 2023 Return'] - a['Year 2023 Return']);

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

    const players = filteredChartData.map(player => player.Player);
    const lowValues = filteredChartData.map(player => player.Low);
    const currentValues = filteredChartData.map(player => player.Current);
    const highValues = filteredChartData.map(player => player.High);

    const normalizedLowValues = lowValues.map(() => 0);
    const normalizedHighValues = highValues.map((value, index) => (value - lowValues[index]) / (highValues[index] - lowValues[index]) * 100);
    const normalizedCurrentValues = currentValues.map((value, index) => (value - lowValues[index]) / (highValues[index] - lowValues[index]) * 100);
    const normalizedRangeValues = normalizedHighValues.map((high, i) => high - normalizedLowValues[i]);

    const performanceColors = getGradientColors(normalizedCurrentValues);

    const formatNumber = (number) => {
        const roundedNumber = Math.round(number);
        return {
            value: `${roundedNumber}%`,
            color: roundedNumber >= 0 ? 'green' : 'red'
        };
    };

    return (
        <div className="page-returns">
            <h1 className="returns-title">Card Price Returns Year-to-Date & Calendar Year 2023</h1>
            <h2 className="subtitle">Top Returns Year-to-Date</h2>
            <div className="status-toggle">
                <span>Select Active or Retired Players</span>
                <select className="dropdown-select" value={selectedStatus} onChange={handleStatusChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Retired">Retired</option>
                </select>
            </div>
            <div className="new-container">
                <div className="sub-container">
                    <div className="table-title">Football</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="table-header">
                                <th className="table-cell">Player</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>YTD Return</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>2023 Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topFootball.map((player, index) => (
                                <tr key={index}>
                                    <td className="table-cell" title={player.Player}>{player.Player}</td>
                                    <td className="table-cell" style={{ color: formatNumber(player.YTDReturn).color, textAlign: 'center' }}>
                                        {formatNumber(player.YTDReturn).value}
                                    </td>
                                    <td className="table-cell" style={{ color: formatNumber(player.Year2023Return).color, textAlign: 'center' }}>
                                        {formatNumber(player.Year2023Return).value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="sub-container">
                    <div className="table-title">Basketball</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="table-header">
                                <th className="table-cell">Player</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>YTD Return</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>2023 Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topBasketball.map((player, index) => (
                                <tr key={index}>
                                    <td className="table-cell" title={player.Player}>{player.Player}</td>
                                    <td className="table-cell" style={{ color: formatNumber(player.YTDReturn).color, textAlign: 'center' }}>
                                        {formatNumber(player.YTDReturn).value}
                                    </td>
                                    <td className="table-cell" style={{ color: formatNumber(player.Year2023Return).color, textAlign: 'center' }}>
                                        {formatNumber(player.Year2023Return).value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="sub-container">
                    <div className="table-title">Baseball</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="table-header">
                                <th className="table-cell">Player</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>YTD Return</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>2023 Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topBaseball.map((player, index) => (
                                <tr key={index}>
                                    <td className="table-cell" title={player.Player}>{player.Player}</td>
                                    <td className="table-cell" style={{ color: formatNumber(player.YTDReturn).color, textAlign: 'center' }}>
                                        {formatNumber(player.YTDReturn).value}
                                    </td>
                                    <td className="table-cell" style={{ color: formatNumber(player.Year2023Return).color, textAlign: 'center' }}>
                                        {formatNumber(player.Year2023Return).value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <h2 className="subtitle">Bottom Returns Year-to-Date</h2>
            <div className="new-container">
                <div className="sub-container">
                    <div className="table-title">Football</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="table-header">
                                <th className="table-cell">Player</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>YTD Return</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>2023 Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bottomFootball.map((player, index) => (
                                <tr key={index}>
                                    <td className="table-cell" title={player.Player}>{player.Player}</td>
                                    <td className="table-cell" style={{ color: formatNumber(player.YTDReturn).color, textAlign: 'center' }}>
                                        {formatNumber(player.YTDReturn).value}
                                    </td>
                                    <td className="table-cell" style={{ color: formatNumber(player.Year2023Return).color, textAlign: 'center' }}>
                                        {formatNumber(player.Year2023Return).value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="sub-container">
                    <div className="table-title">Basketball</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="table-header">
                                <th className="table-cell">Player</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>YTD Return</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>2023 Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bottomBasketball.map((player, index) => (
                                <tr key={index}>
                                    <td className="table-cell" title={player.Player}>{player.Player}</td>
                                    <td class="table-cell" style={{ color: formatNumber(player.YTDReturn).color, textAlign: 'center' }}>
                                        {formatNumber(player.YTDReturn).value}
                                    </td>
                                    <td className="table-cell" style={{ color: formatNumber(player.Year2023Return).color, textAlign: 'center' }}>
                                        {formatNumber(player.Year2023Return).value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="sub-container">
                    <div className="table-title">Baseball</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr className="table-header">
                                <th className="table-cell">Player</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>YTD Return</th>
                                <th className="table-cell" style={{ textAlign: 'center' }}>2023 Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bottomBaseball.map((player, index) => (
                                <tr key={index}>
                                    <td className="table-cell" title={player.Player}>{player.Player}</td>
                                    <td className="table-cell" style={{ color: formatNumber(player.YTDReturn).color, textAlign: 'center' }}>
                                        {formatNumber(player.YTDReturn).value}
                                    </td>
                                    <td className="table-cell" style={{ color: formatNumber(player.Year2023Return).color, textAlign: 'center' }}>
                                        {formatNumber(player.Year2023Return).value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New container for CSI indices returns */}
            <div className="csi-container" style={{ border: '2px solid peru', padding: '20px', margin: '20px 0' }}>
                <h2 className="csi-title">CSI Index Returns</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr className="table-header">
                            <th className="table-cell">Index</th>
                            <th className="table-cell" style={{ textAlign: 'center' }}>YTD Return</th>
                            <th className="table-cell" style={{ textAlign: 'center' }}>2023 Return</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(csiData).map((index, idx) => (
                            <tr key={idx}>
                                <td className="table-cell">{index}</td>
                                <td className="table-cell" style={{ textAlign: 'center', color: formatNumber(csiData[index].ytdReturn).color }}>
                                    {formatNumber(csiData[index].ytdReturn).value}
                                </td>
                                <td className="table-cell" style={{ textAlign: 'center', color: formatNumber(csiData[index].year2023Return).color }}>
                                    {formatNumber(csiData[index].year2023Return).value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="chart-status-toggle">
                <span>Select Active or Retired Players</span>
                <select className="dropdown-select" value={selectedChartStatus} onChange={handleChartStatusChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Retired">Retired</option>
                </select>
            </div>
            <div className="chart-sport-toggle">
                <span>Select Sport</span>
                <select className="dropdown-select" value={selectedChartSport} onChange={handleChartSportChange}>
                    <option value="All Players">All Players</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Baseball">Baseball</option>
                </select>
            </div>
            <div className="chart-container">
                <div className="chart-subplot">
                    <h2 className="chart-title">Year to Date (6/30/24)</h2>
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
                                color: 'rgba(0,0,0,0)',
                                line: {
                                    color: 'peru',
                                    width: 2,
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
                                color: performanceColors,
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
