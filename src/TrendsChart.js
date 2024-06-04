import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TrendsChart = ({ fileUrl, title, idPrefix }) => {
    const [data, setData] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                const workbook = XLSX.read(response.data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const headers = jsonData[0];
                const playersData = jsonData.slice(1).map(row => {
                    let playerData = {};
                    headers.forEach((header, index) => {
                        playerData[header] = row[index];
                    });
                    return playerData;
                });

                setData(playersData);
                const uniquePlayers = [...new Set(playersData.map(item => item['PLAYER']))];
                setPlayers(uniquePlayers);
            } catch (error) {
                console.error('Error fetching the data', error);
            }
        };

        fetchData();
    }, [fileUrl]);

    useEffect(() => {
        if (selectedPlayers.length === 0) {
            setChartData({ labels: [], datasets: [] });
            return;
        }

        const selectedData = data.filter(item => selectedPlayers.includes(item['PLAYER']));
        const dates = Object.keys(data[0]).slice(1);

        const datasets = selectedPlayers.map(player => {
            const playerData = selectedData.find(item => item['PLAYER'] === player);
            return {
                label: player,
                data: dates.map(date => playerData[date]),
                fill: false,
                borderColor: getRandomColor(),
            };
        });

        setChartData({ labels: dates, datasets });
    }, [selectedPlayers, data]);

    const handlePlayerSelection = event => {
        const value = Array.from(event.target.selectedOptions, option => option.value);
        setSelectedPlayers(value);
    };

    const handleReset = () => {
        setSelectedPlayers([]);
    };

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <div className="trends-chart">
            <h2>{title}</h2>
            <div style={{ marginBottom: '20px' }}>
                <p>Google Trends score reflects monthly search interest for the respective player</p>
            </div>
            <div className="dropdown-container">
                <label>Select Players:</label>
                <select multiple value={selectedPlayers} onChange={handlePlayerSelection} className="dropdown-select">
                    {players.length > 0 ? (
                        players.map(player => (
                            <option key={player} value={player}>
                                {player}
                            </option>
                        ))
                    ) : (
                        <option>Loading players...</option>
                    )}
                </select>
            </div>
            <button onClick={handleReset} className="reset-button">Reset Selection</button>
            <div className="chart-container">
                {selectedPlayers.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p>Please select at least one player to display the chart.</p>
                )}
            </div>
        </div>
    );
};

export default TrendsChart;
