import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useTable, useBlockLayout } from 'react-table';
import { Scatter, Line, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import Fuse from 'fuse.js';
import './App.css';
import Navbar from './Navbar';

const CustomScoreboard = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [playerData, setPlayerData] = useState([]);

    const defaultSelectedNames = JSON.parse(localStorage.getItem('selectedNames')) || [{ value: 'All Players', label: 'All Players' }];
    const defaultSelectedSports = JSON.parse(localStorage.getItem('selectedSports')) || [{ value: 'All Sports', label: 'All Sports' }];
    const defaultSelectedTrends = JSON.parse(localStorage.getItem('selectedTrends')) || [{ value: 'All Trends', label: 'All Trends' }];
    const defaultRankFilters = JSON.parse(localStorage.getItem('rankFilters')) || {
        CompositeRank: [0, 100],
        TechnicalRank: [0, 100],
        SentimentRank: [0, 100],
        FundamentalRank: [0, 100]
    };

    const [selectedNames, setSelectedNames] = useState(defaultSelectedNames);
    const [selectedSports, setSelectedSports] = useState(defaultSelectedSports);
    const [selectedTrends, setSelectedTrends] = useState(defaultSelectedTrends);
    const [rankFilters, setRankFilters] = useState(defaultRankFilters);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Composite_Ranks.xlsx', {
                    responseType: 'arraybuffer'
                });

                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                setData(worksheet);
                setFilteredData(worksheet);
            } catch (error) {
                console.error('Error fetching the data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        filterData();
        localStorage.setItem('selectedNames', JSON.stringify(selectedNames));
        localStorage.setItem('selectedSports', JSON.stringify(selectedSports));
        localStorage.setItem('selectedTrends', JSON.stringify(selectedTrends));
        localStorage.setItem('rankFilters', JSON.stringify(rankFilters));
    }, [selectedNames, selectedSports, selectedTrends, rankFilters, data]);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/player_data.json');
                setPlayerData(response.data);
            } catch (error) {
                console.error('Error fetching player data:', error);
            }
        };

        fetchPlayerData();
    }, []);

    const getUniqueOptions = (key) => {
        const options = data.map(row => row[key]);
        const uniqueOptions = [...new Set(options)];
        return uniqueOptions.map(option => ({ value: option, label: option }));
    };

    const filterData = () => {
        let filtered = data;

        if (!selectedNames.some(option => option.value === 'All Players')) {
            filtered = filtered.filter(row => selectedNames.some(option => option.value === row.Name));
        }

        if (!selectedSports.some(option => option.value === 'All Sports')) {
            filtered = filtered.filter(row => selectedSports.some(option => option.value === row.Sport));
        }

        if (!selectedTrends.some(option => option.value === 'All Trends')) {
            filtered = filtered.filter(row => selectedTrends.some(option => option.value === row.Trend));
        }

        filtered = filtered.filter(row =>
            row['Composite Rank'] >= rankFilters.CompositeRank[0] && row['Composite Rank'] <= rankFilters.CompositeRank[1] &&
            row['Technical Rank'] >= rankFilters.TechnicalRank[0] && row['Technical Rank'] <= rankFilters.TechnicalRank[1] &&
            row['Sentiment Rank'] >= rankFilters.SentimentRank[0] && row['Sentiment Rank'] <= rankFilters.SentimentRank[1] &&
            row['Fundamental Rank'] >= rankFilters.FundamentalRank[0] && row['Fundamental Rank'] <= rankFilters.FundamentalRank[1]
        );

        setFilteredData(filtered);
    };

    const resetFilters = () => {
        setSelectedNames([{ value: 'All Players', label: 'All Players' }]);
        setSelectedSports([{ value: 'All Sports', label: 'All Sports' }]);
        setSelectedTrends([{ value: 'All Trends', label: 'All Trends' }]);
        setRankFilters(defaultRankFilters);
    };

    const calculateAverages = () => {
        const numericColumns = filteredData.length > 0 ? Object.keys(filteredData[0]).filter(key => !isNaN(filteredData[0][key])) : [];
        const averages = { Name: 'Average Values:' };

        numericColumns.forEach(column => {
            const total = filteredData.reduce((sum, row) => sum + parseFloat(row[column] || 0), 0);
            averages[column] = Math.round(total / filteredData.length);
        });

        return averages;
    };

    const averages = calculateAverages();

    const getValueColor = (value) => {
        if (value < 0) return 'red';
        return 'green';
    };

    const columns = React.useMemo(
        () =>
            data.length > 0
                ? Object.keys(data[0]).map(key => ({
                    Header: key,
                    accessor: key
                }))
                : [],
        [data]
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data: filteredData
        },
        useBlockLayout
    );

    const getColor = (value) => {
        const red = 255 - Math.round((value / 100) * 255);
        const green = Math.round((value / 100) * 255);
        return `rgba(${red}, ${green}, 0, 0.6)`;
    };

    const minFundamentalRank = Math.min(...filteredData.map(row => row['Fundamental Rank']));

    const scatterData = {
        datasets: [
            {
                label: 'Sentiment vs Technical Rank',
                data: filteredData.map(row => ({
                    x: row['Technical Rank'],
                    y: row['Sentiment Rank'],
                    backgroundColor: getColor(row['Composite Rank']),
                    borderColor: getColor(row['Composite Rank']),
                    label: row['Name'],
                    sport: row['Sport'],
                    compositeRank: row['Composite Rank'],
                    fundamentalRank: row['Fundamental Rank'],
                    sentimentRank: row['Sentiment Rank'],
                    technicalRank: row['Technical Rank'],
                    trend: row['Trend'],
                    percentFromHigh: row['% from High'],
                    percentFromLow: row['% from Low'],
                    percentFromAvg: row['% from Avg'],
                    percentFrom1YrAvg: row['% from 1-Yr Avg'],
                    percentFrom3MoAvg: row['% from 3-Mo Avg'],
                    r: 5 + (row['Fundamental Rank'] - minFundamentalRank) / 2,
                })),
                pointBackgroundColor: filteredData.map(row => getColor(row['Composite Rank'])),
                pointBorderColor: filteredData.map(row => getColor(row['Composite Rank'])),
                pointRadius: filteredData.map(row => 5 + (row['Fundamental Rank'] - minFundamentalRank) / 2),
            },
            {
                label: 'Average',
                data: [{
                    x: averages['Technical Rank'],
                    y: averages['Sentiment Rank'],
                    label: 'Average',
                    r: 5 + (averages['Fundamental Rank'] - minFundamentalRank) / 2,
                }],
                backgroundColor: 'rgba(205, 133, 63, 0.6)',
                borderColor: 'rgba(205, 133, 63, 1)',
                pointRadius: 5 + (averages['Fundamental Rank'] - minFundamentalRank) / 2,
            },
        ],
    };

    const scatterOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const data = tooltipItem.raw;
                        return [
                            `Name: ${data.label}`,
                            `Sport: ${data.sport}`,
                            `Composite Rank: ${data.compositeRank}`,
                            `Fundamental Rank: ${data.fundamentalRank}`,
                            `Sentiment Rank: ${data.sentimentRank}`,
                            `Technical Rank: ${data.technicalRank}`,
                            `Trend: ${data.trend}`,
                            `% from High: ${data.percentFromHigh}%`,
                            `% from Low: ${data.percentFromLow}%`,
                            `% from Avg: ${data.percentFromAvg}`,
                            `% from 1-Yr Avg: ${data.percentFrom1YrAvg}`,
                            `% from 3-Mo Avg: ${data.percentFrom3MoAvg}`
                        ];
                    }
                }
            },
            annotation: {
                annotations: {
                    xLine: {
                        type: 'line',
                        xMin: 50,
                        xMax: 50,
                        borderColor: 'peru',
                        borderWidth: 2,
                    },
                    yLine: {
                        type: 'line',
                        yMin: 50,
                        yMax: 50,
                        borderColor: 'peru',
                        borderWidth: 2,
                    },
                    topRight: {
                        type: 'box',
                        xMin: 50,
                        xMax: 100,
                        yMin: 50,
                        yMax: 100,
                        backgroundColor: 'rgba(144, 238, 144, 0.3)',
                    },
                    topLeft: {
                        type: 'box',
                        xMin: 0,
                        xMax: 50,
                        yMin: 50,
                        yMax: 100,
                        backgroundColor: 'rgba(255, 255, 102, 0.3)',
                    },
                    bottomRight: {
                        type: 'box',
                        xMin: 50,
                        xMax: 100,
                        yMin: 0,
                        yMax: 50,
                        backgroundColor: 'rgba(173, 216, 230, 0.3)',
                    },
                    bottomLeft: {
                        type: 'box',
                        xMin: 0,
                        xMax: 50,
                        yMin: 0,
                        yMax: 50,
                        backgroundColor: 'rgba(255, 182, 193, 0.3)',
                    },
                }
            },
            datalabels: {
                color: 'peru',
                anchor: 'end',
                align: 'end',
                formatter: function (value, context) {
                    return context.dataset.data[context.dataIndex].label || context.dataset.label;
                },
                clip: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Technical Rank',
                },
                min: 0,
                max: 100,
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 10,
                    padding: 10,
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Sentiment Rank',
                },
                min: 0,
                max: 100,
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 10,
                    padding: 10,
                }
            }
        },
        layout: {
            padding: {
                left: 50,
                right: 50,
                top: 50,
                bottom: 50,
            }
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getUniqueRandomColor = (usedColors) => {
        let color;
        do {
            color = getRandomColor();
        } while (usedColors.includes(color));
        return color;
    };

    const usedColors = [];

    const lineChartData = {
        labels: ['12/22', '01/23', '02/23', '03/23', '04/23', '05/23', '06/23', '07/23', '08/23', '09/23', '10/23', '11/23', '12/23', '01/24', '02/24', '03/24', '04/24', '05/24'],
        datasets: [
            ...selectedNames
                .filter(name => name.value !== 'All Players')
                .map(name => {
                    const playerData = filteredData.find(row => row.Name === name.value);
                    if (!playerData) {
                        return null;
                    }
                    const color = getUniqueRandomColor(usedColors);
                    usedColors.push(color);
                    return {
                        label: name.label,
                        data: [
                            playerData['12/22'], playerData['01/23'], playerData['02/23'], playerData['03/23'], playerData['04/23'], playerData['05/23'],
                            playerData['06/23'], playerData['07/23'], playerData['08/23'], playerData['09/23'], playerData['10/23'], playerData['11/23'],
                            playerData['12/23'], playerData['01/24'], playerData['02/24'], playerData['03/24'], playerData['04/24'], playerData['05/24']
                        ],
                        borderColor: color,
                        backgroundColor: color,
                        fill: false
                    };
                }).filter(dataset => dataset !== null),
            {
                label: 'Average',
                data: [
                    averages['12/22'], averages['01/23'], averages['02/23'], averages['03/23'], averages['04/23'], averages['05/23'],
                    averages['06/23'], averages['07/23'], averages['08/23'], averages['09/23'], averages['10/23'], averages['11/23'],
                    averages['12/23'], averages['01/24'], averages['02/24'], averages['03/24'], averages['04/24'], averages['05/24']
                ],
                borderColor: 'peru',
                backgroundColor: 'peru',
                fill: false,
                borderWidth: 3,
                borderDash: [10, 5]
            }
        ]
    };

    const lineChartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    };

    const totalPlayers = filteredData.length;
    const footballCount = filteredData.filter(row => row.Sport === 'Football').length;
    const baseballCount = filteredData.filter(row => row.Sport === 'Baseball').length;
    const basketballCount = filteredData.filter(row => row.Sport === 'Basketball').length;

    const pieChartData = {
        labels: ['Football', 'Baseball', 'Basketball'],
        datasets: [
            {
                data: [
                    Math.round((footballCount / totalPlayers) * 100),
                    Math.round((baseballCount / totalPlayers) * 100),
                    Math.round((basketballCount / totalPlayers) * 100)
                ],
                backgroundColor: ['rgba(205, 133, 63, 0.6)', 'rgba(210, 180, 140, 0.6)', 'rgba(139, 69, 19, 0.6)'],
                borderColor: ['rgba(205, 133, 63, 1)', 'rgba(210, 180, 140, 1)', 'rgba(139, 69, 19, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const pieChartOptions = {
        plugins: {
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                },
                formatter: (value) => `${value}%`,
            },
        },
    };

    const fuse = new Fuse(playerData, {
        keys: ['Player'],
        threshold: 0.3
    });

    const getPlayerReturnData = (name) => {
        const result = fuse.search(name);
        if (result.length > 0) {
            const player = result[0].item;
            return {
                ytdReturn: player['YTD Return'] !== null ? player['YTD Return'].toFixed(2) : 'N/A',
                year2023Return: player['Year 2023 Return'] !== null ? player['Year 2023 Return'].toFixed(2) : 'N/A'
            };
        }
        return { ytdReturn: 'N/A', year2023Return: 'N/A' };
    };

    const calculateReturnAverages = () => {
        let totalYTD = 0, total2023 = 0, countYTD = 0, count2023 = 0;

        selectedNames.forEach(name => {
            if (name.value !== 'All Players') {
                const playerReturnData = getPlayerReturnData(name.value);
                if (playerReturnData.ytdReturn !== 'N/A') {
                    totalYTD += parseFloat(playerReturnData.ytdReturn);
                    countYTD++;
                }
                if (playerReturnData.year2023Return !== 'N/A') {
                    total2023 += parseFloat(playerReturnData.year2023Return);
                    count2023++;
                }
            }
        });

        const avgYTD = countYTD ? (totalYTD / countYTD).toFixed(2) : 'N/A';
        const avg2023 = count2023 ? (total2023 / count2023).toFixed(2) : 'N/A';

        return { avgYTD, avg2023 };
    };

    const { avgYTD, avg2023 } = calculateReturnAverages();

    const calculateTableAverages = () => {
        const ytdTotals = [];
        const year2023Totals = [];
        selectedNames.forEach(name => {
            if (name.value !== 'All Players') {
                const playerReturnData = getPlayerReturnData(name.value);
                if (playerReturnData.ytdReturn !== 'N/A') {
                    ytdTotals.push(parseFloat(playerReturnData.ytdReturn));
                }
                if (playerReturnData.year2023Return !== 'N/A') {
                    year2023Totals.push(parseFloat(playerReturnData.year2023Return));
                }
            }
        });

        const avgYTD = ytdTotals.length ? (ytdTotals.reduce((sum, value) => sum + value, 0) / ytdTotals.length).toFixed(2) : 'N/A';
        const avg2023 = year2023Totals.length ? (year2023Totals.reduce((sum, value) => sum + value, 0) / year2023Totals.length).toFixed(2) : 'N/A';

        return { avgYTD, avg2023 };
    };

    const tableAverages = calculateTableAverages();

    return (
        <div className="scoreboard-page-container">
            <Navbar />
            <div className="title-container">
                <h1 className="scoreboard-center-text">Custom Scoreboard</h1>
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Logo_Simple.png" alt="Logo" className="title-logo" />
            </div>
            <p style={{ color: 'peru', fontWeight: 'bold' }}>
                Select your players to create a custom scoreboard of analytics
            </p>
            <div className="watchlist-container" style={{ border: '2px solid peru', padding: '10px', margin: '20px 0' }}>
                <h2>Create Your Watchlist:</h2>
                <div className="scoreboard-filter">
                    <label>Name</label>
                    <Select
                        isMulti
                        options={[{ value: 'All Players', label: 'All Players' }, ...getUniqueOptions('Name')]}
                        value={selectedNames}
                        onChange={setSelectedNames}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                    />
                </div>
                {selectedNames.length > 0 && selectedNames[0].value !== 'All Players' && (
                    <div className="selected-names">
                        <h3>Selected Names:</h3>
                        <ul>
                            {selectedNames.map((name, index) => (
                                <li key={index}>{name.label}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <button onClick={resetFilters} style={{ backgroundColor: 'peru', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                    Reset Filters
                </button>
            </div>
            <div className="overview-container" style={{ border: '2px solid peru', padding: '10px', margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="pie-chart-container" style={{ width: '50%', margin: 'auto' }}>
                    <Pie data={pieChartData} options={pieChartOptions} />
                </div>
                <div className="average-values" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <h3 style={{ gridColumn: '1 / span 2' }}>Average Values</h3>
                    <div>Composite Rank:</div><div style={{ color: getValueColor(averages['Composite Rank']) }}>{averages['Composite Rank']}</div>
                    <div>Fundamental Rank:</div><div style={{ color: getValueColor(averages['Fundamental Rank']) }}>{averages['Fundamental Rank']}</div>
                    <div>Sentiment Rank:</div><div style={{ color: getValueColor(averages['Sentiment Rank']) }}>{averages['Sentiment Rank']}</div>
                    <div>Technical Rank:</div><div style={{ color: getValueColor(averages['Technical Rank']) }}>{averages['Technical Rank']}</div>
                    <div>% from High:</div><div style={{ color: getValueColor(averages['% from High']) }}>{averages['% from High']}%</div>
                    <div>% from Low:</div><div style={{ color: getValueColor(averages['% from Low']) }}>{averages['% from Low']}%</div>
                    <div>YTD Return:</div><div style={{ color: getValueColor(avgYTD) }}>{avgYTD}</div>
                    <div>Year 2023 Return:</div><div style={{ color: getValueColor(avg2023) }}>{avg2023}</div>
                </div>
            </div>
            <div className="scoreboard-filters center-filters">
                <div className="scoreboard-filter">
                    <label>Sport</label>
                    <Select
                        isMulti
                        options={[{ value: 'All Sports', label: 'All Sports' }, ...getUniqueOptions('Sport')]}
                        value={selectedSports}
                        onChange={setSelectedSports}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                    />
                </div>
                <div className="scoreboard-filter" style={{ marginLeft: '20px' }}>
                    <label>Trend</label>
                    <Select
                        isMulti
                        options={[
                            { value: 'All Trends', label: 'All Trends' },
                            { value: 'Strong Uptrend', label: 'Strong Uptrend' },
                            { value: 'Uptrend', label: 'Uptrend' },
                            { value: 'Downtrend', label: 'Downtrend' },
                            { value: 'Strong Downtrend', label: 'Strong Downtrend' }
                        ]}
                        value={selectedTrends}
                        onChange={setSelectedTrends}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                    />
                </div>
                <div className="additional-filters-text" style={{ marginLeft: '20px', alignSelf: 'center' }}>
                    <h3>Additional Filters</h3>
                </div>
            </div>
            <div className="scoreboard-filters center-filters">
                <div className="scoreboard-filter">
                    <label>Composite Rank</label>
                    <Slider
                        range
                        min={0}
                        max={100}
                        defaultValue={rankFilters.CompositeRank}
                        onChange={(value) => setRankFilters({ ...rankFilters, CompositeRank: value })}
                    />
                </div>
                <div className="scoreboard-filter">
                    <label>Technical Rank</label>
                    <Slider
                        range
                        min={0}
                        max={100}
                        defaultValue={rankFilters.TechnicalRank}
                        onChange={(value) => setRankFilters({ ...rankFilters, TechnicalRank: value })}
                    />
                </div>
                <div className="scoreboard-filter">
                    <label>Sentiment Rank</label>
                    <Slider
                        range
                        min={0}
                        max={100}
                        defaultValue={rankFilters.SentimentRank}
                        onChange={(value) => setRankFilters({ ...rankFilters, SentimentRank: value })}
                    />
                </div>
                <div className="scoreboard-filter">
                    <label>Fundamental Rank</label>
                    <Slider
                        range
                        min={0}
                        max={100}
                        defaultValue={rankFilters.FundamentalRank}
                        onChange={(value) => setRankFilters({ ...rankFilters, FundamentalRank: value })}
                    />
                </div>
            </div>
            <div className="scoreboard-table-container">
                <div {...getTableProps()} className="scoreboard-table">
                    <div>
                        {headerGroups.map(headerGroup => (
                            <div {...headerGroup.getHeaderGroupProps()} className="tr">
                                {headerGroup.headers.map(column => (
                                    <div {...column.getHeaderProps()} className={`th ${column.sticky ? 'sticky' : ''}`}>
                                        {column.render('Header')}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <div {...row.getRowProps()} className="tr">
                                    {row.cells.map(cell => (
                                        <div {...cell.getCellProps()} className={`td ${cell.column.sticky ? 'sticky' : ''}`}>
                                            {cell.render('Cell')}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        {filteredData.length > 0 && (
                            <div className="tr average-row" style={{ borderTop: '4px solid peru' }}>
                                {columns.map((column, index) => (
                                    <div key={column.accessor} className="td">
                                        {index === 0 ? 'Average Values:' : averages[column.accessor] || ''}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {filteredData.length > 0 && (
                <div className="scatterplot-container">
                    <Scatter data={scatterData} options={scatterOptions} />
                </div>
            )}
            {selectedNames.length > 0 && selectedNames[0].value !== 'All Players' && (
                <div className="line-chart-container" style={{ marginTop: '50px' }}>
                    <h2 style={{ color: 'peru', fontWeight: 'bold' }}>Google Trends Over Time</h2>
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>
            )}
            <div className="player-returns-table" style={{ marginTop: '50px' }}>
                <h2 style={{ color: 'peru', fontWeight: 'bold' }}>Player Returns</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid peru' }}>
                            <th style={{ padding: '10px' }}>Player Name</th>
                            <th style={{ padding: '10px' }}>YTD Return</th>
                            <th style={{ padding: '10px' }}>Year 2023 Return</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedNames.filter(name => name.value !== 'All Players').map((name, index) => {
                            const playerReturnData = getPlayerReturnData(name.value);
                            return (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{name.label}</td>
                                    <td style={{ padding: '10px', color: getValueColor(parseFloat(playerReturnData.ytdReturn)) }}>{playerReturnData.ytdReturn}</td>
                                    <td style={{ padding: '10px', color: getValueColor(parseFloat(playerReturnData.year2023Return)) }}>{playerReturnData.year2023Return}</td>
                                </tr>
                            );
                        })}
                        <tr style={{ borderTop: '2px solid peru', fontWeight: 'bold' }}>
                            <td style={{ padding: '10px' }}>Average Returns</td>
                            <td style={{ padding: '10px', color: getValueColor(parseFloat(tableAverages.avgYTD)) }}>{tableAverages.avgYTD}</td>
                            <td style={{ padding: '10px', color: getValueColor(parseFloat(tableAverages.avg2023)) }}>{tableAverages.avg2023}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <footer style={{ marginTop: '50px', padding: '20px', borderTop: '2px solid peru' }}>
                <p>
                    The Longhorn Cards Player Scoreboard incorporates historical player card prices (Technical Rank),
                    player career statistics aggregated for all seasons played (Fundamental Rank), and Google Trends
                    interest/popularity (Sentiment Rank).
                </p>
                <p>
                    (Player Scatterplot: Color of Bubble = Composite Rank, Size of Bubble = Fundamental Rank | Player Table: Active = Active Player or Retired;
                    Trend = Current technical trend is based on short- and long-term historical card prices; Percentages reflect current card price levels relative to high,
                    low, and different average price levels; Dates shown are for the Sentiment Rank based on Google Trends for that month)
                </p>
            </footer>
        </div>
    );
};

export default CustomScoreboard;
