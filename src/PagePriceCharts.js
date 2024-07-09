import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './App.css';  // Shared styles

const PagePriceCharts = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([{ value: 'CSI 50 Index', label: 'CSI 50 Index' }]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Player_Index_Returns.xlsx', {
                    responseType: 'arraybuffer',
                });
                const workbook = XLSX.read(response.data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                setData(worksheet);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedPlayers.length === 0 || data.length === 0) {
            setChartData([]);
            return;
        }

        const playerData = selectedPlayers.map(player => {
            const playerEntries = data.filter(entry => entry.Player === player.value);
            const dateColumns = ['12/31/2023', '1/31/2024', '2/29/2024', '3/31/2024', '4/30/2024', '5/31/2024', '6/30/2024'];
            const dates = dateColumns.filter(date => playerEntries[0][date] !== undefined);
            const values = dates.map(date => playerEntries[0][date]);
            const initialPrice = values[0] || 100; // Rebase to 100

            return {
                x: dates,
                y: values.map(value => (value / initialPrice) * 100),
                type: 'scatter',
                mode: 'lines+markers',
                name: player.label,
            };
        });

        setChartData(playerData);
    }, [selectedPlayers, data]);

    const playerOptions = [...new Set(data.map(entry => entry.Player))]
        .sort()
        .map(player => ({
            value: player,
            label: player,
        }));

    const generateSummaryTable = () => {
        if (selectedPlayers.length === 0 || data.length === 0) return null;

        const summaryData = selectedPlayers.map(player => {
            const playerEntry = data.find(entry => entry.Player === player.value);
            const current = playerEntry.Current;
            const average = playerEntry.Average;
            const high = playerEntry.High;
            const low = playerEntry.Low;
            const threeMoAvg = playerEntry['3-Mo Average'];
            const oneYrAvg = playerEntry['1-Yr Average'];
            const return12_31_2023 = playerEntry['12/31/2023'];
            const return01_31_2024 = playerEntry['1/31/2024'];
            const return02_29_2024 = playerEntry['2/29/2024'];
            const return03_31_2024 = playerEntry['3/31/2024'];
            const return04_30_2024 = playerEntry['4/30/2024'];
            const return05_31_2024 = playerEntry['5/31/2024'];
            const return06_30_2024 = playerEntry['6/30/2024'];
            const return12_31_2022 = playerEntry['12/31/2022'];

            const percentFrom = (value, base) => ((value - base) / base * 100).toFixed(2) + '%';
            const yearToDateReturn = percentFrom(current, return12_31_2023);
            const threeMoReturn = percentFrom(current, return03_31_2024);
            const sixMoReturn = percentFrom(current, return12_31_2023);
            const return2023 = percentFrom(return12_31_2023, return12_31_2022);

            const getCellClass = (value) => {
                const numericValue = parseFloat(value);
                return numericValue > 0 ? 'positive' : (numericValue < 0 ? 'negative' : '');
            };

            return (
                <tr key={player.value}>
                    <td>{player.label}</td>
                    {[return06_30_2024, return05_31_2024, return04_30_2024, return03_31_2024, return02_29_2024, return01_31_2024, return12_31_2023, return12_31_2022].map((date, index) => (
                        <td key={index}>{date}</td>
                    ))}
                    <td>{high}</td>
                    <td>{low}</td>
                    <td>{current}</td>
                    <td>{average}</td>
                    <td>{playerEntry.Open}</td>
                    <td>{oneYrAvg}</td>
                    <td>{threeMoAvg}</td>
                    <td className={getCellClass(percentFrom(current, average))}>{percentFrom(current, average)}</td>
                    <td className={getCellClass(percentFrom(current, high))}>{percentFrom(current, high)}</td>
                    <td className={getCellClass(percentFrom(current, low))}>{percentFrom(current, low)}</td>
                    <td className={getCellClass(percentFrom(current, threeMoAvg))}>{percentFrom(current, threeMoAvg)}</td>
                    <td className={getCellClass(percentFrom(current, oneYrAvg))}>{percentFrom(current, oneYrAvg)}</td>
                    <td className={getCellClass(yearToDateReturn)}>{yearToDateReturn}</td>
                    <td className={getCellClass(threeMoReturn)}>{threeMoReturn}</td>
                    <td className={getCellClass(sixMoReturn)}>{sixMoReturn}</td>
                    <td className={getCellClass(return2023)}>{return2023}</td>
                </tr>
            );
        });

        return (
            <table className="pricechart-summary-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>6/30/2024</th>
                        <th>5/31/2024</th>
                        <th>4/30/2024</th>
                        <th>3/31/2024</th>
                        <th>2/29/2024</th>
                        <th>1/31/2024</th>
                        <th>12/31/2023</th>
                        <th>12/31/2022</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Current</th>
                        <th>Average</th>
                        <th>Open</th>
                        <th>1-Yr Average</th>
                        <th>3-Mo Average</th>
                        <th>% from Average</th>
                        <th>% from High</th>
                        <th>% from Low</th>
                        <th>% from 3-Mo Average</th>
                        <th>% from 1-Yr Average</th>
                        <th>Year-to-Date Return</th>
                        <th>3-Mo Return</th>
                        <th>6-Mo Return</th>
                        <th>2023 Return</th>
                    </tr>
                </thead>
                <tbody>
                    {summaryData}
                </tbody>
            </table>
        );
    };

    return (
        <div className="pricechart-page-price-charts">
            <h1 className="pricechart-title">Player Card Prices Over Time</h1>
            <p className="pricechart-description">Track the historical prices of your favorite sports players' cards over time.</p>
            <Select
                isMulti
                options={playerOptions}
                value={selectedPlayers}
                onChange={setSelectedPlayers}
                className="pricechart-player-select"
                placeholder="Select Players"
            />
            <div className="pricechart-chart-container">
                <Plot
                    data={chartData}
                    layout={{ autosize: true, title: 'Historical Card Prices' }}
                    useResizeHandler={true}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <div className="pricechart-summary-container">
                <h2>Summary Table</h2>
                {generateSummaryTable()}
            </div>
            <div className="pricechart-disclosure-container">
                <p>This data is sourced from Card Ladder and calculations performed by Longhorn Cards. Card Ladder calculates a player index based on a basket of cards for each player to determine an average index value.</p>
            </div>
        </div>
    );
};

export default PagePriceCharts;
