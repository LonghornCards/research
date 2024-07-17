import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Scatter } from 'react-chartjs-2';
import { Chart, LinearScale, PointElement, Tooltip, Legend, Title, CategoryScale } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import datalabels from 'chartjs-plugin-datalabels';
import Select, { components } from 'react-select';
import { useTable, useBlockLayout } from 'react-table';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';

Chart.register(LinearScale, PointElement, Tooltip, Legend, Title, annotationPlugin, datalabels, CategoryScale);

const columnOptions = [
    { value: 'Composite Rank', label: 'Composite Rank' },
    { value: 'Fundamental Rank', label: 'Fundamental Rank' },
    { value: 'Technical Rank', label: 'Technical Rank' },
    { value: 'Sentiment Rank', label: 'Sentiment Rank' }
];

const sportOptions = [
    { value: 'All Sports', label: 'All Sports' },
    { value: 'Football', label: 'Football' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Baseball', label: 'Baseball' }
];

const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Active', label: 'Active' },
    { value: 'Retired', label: 'Retired' }
];

const trendOptions = [
    { value: 'All', label: 'All' },
    { value: 'Strong Downtrend', label: 'Strong Downtrend' },
    { value: 'Downtrend', label: 'Downtrend' },
    { value: 'Uptrend', label: 'Uptrend' },
    { value: 'Strong Uptrend', label: 'Strong Uptrend' }
];

const Option = (props) => (
    <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{' '}
        <label>{props.label}</label>
    </components.Option>
);

const MultiValue = (props) => (
    <components.MultiValue {...props}>
        <span>{props.children}</span>
    </components.MultiValue>
);

const Player_Scoreboard = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [xAxis, setXAxis] = useState(columnOptions[2]); // Default to Technical Rank
    const [yAxis, setYAxis] = useState(columnOptions[3]); // Default to Sentiment Rank
    const [selectedSport, setSelectedSport] = useState(sportOptions[0]); // Default to All Sports
    const [filteredData, setFilteredData] = useState([]);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedTrend, setSelectedTrend] = useState(trendOptions[0]); // Default to All
    const [bubbleSize, setBubbleSize] = useState(columnOptions[1]); // Default to Fundamental Rank
    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]); // Default to All
    const [topFootball, setTopFootball] = useState([]);
    const [topBasketball, setTopBasketball] = useState([]);
    const [topBaseball, setTopBaseball] = useState([]);
    const [bottomFootball, setBottomFootball] = useState([]);
    const [bottomBasketball, setBottomBasketball] = useState([]);
    const [bottomBaseball, setBottomBaseball] = useState([]);
    const chartRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

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
                filterAndSortData(worksheet);
                filterTableData(worksheet, selectedName, selectedSport, selectedTrend, selectedStatus);
                updateChartData(worksheet, xAxis.value, yAxis.value, selectedSport.value, bubbleSize.value);
            } catch (error) {
                console.error('Error fetching the data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 0);
            }
        }
    }, [location]);

    const getColor = (compositeRank, maxRank) => {
        const ratio = compositeRank / maxRank;
        const r = Math.floor(255 * (1 - ratio));
        const g = Math.floor(255 * ratio);
        return `rgb(${r}, ${g}, 0)`;
    };

    const getBackgroundColor = (value, max) => {
        const ratio = value / max;
        const r = Math.floor(255 * (1 - ratio));
        const g = Math.floor(255 * ratio);
        return `rgba(${r}, ${g}, 0, 0.5)`;
    };

    const getTrendColor = (value) => {
        if (value === 'Strong Downtrend') return 'red';
        if (value === 'Downtrend') return 'indianred';
        if (value === 'Uptrend') return 'green';
        if (value === 'Strong Uptrend') return 'limegreen';
        return 'transparent';
    };

    const updateChartData = (data, xAxis, yAxis, sport, bubbleSize) => {
        const filteredData = filterDataBySport(data, sport);
        const maxCompositeRank = Math.max(...filteredData.map(row => row['Composite Rank']));
        const maxSizeRank = Math.max(...filteredData.map(row => row[bubbleSize]));
        const scalingFactor = 50 / maxSizeRank; // Adjust scaling factor as needed

        const chartData = {
            datasets: [
                {
                    label: "Scoreboard Scatterplot",
                    data: filteredData.map(row => {
                        const size = row[bubbleSize] ? row[bubbleSize] * scalingFactor : 5;
                        return {
                            x: row[xAxis],
                            y: row[yAxis],
                            r: size,
                            backgroundColor: getColor(row['Composite Rank'], maxCompositeRank),
                            compositeRank: row['Composite Rank'],
                            fundamentalRank: row['Fundamental Rank'],
                            sentimentRank: row['Sentiment Rank'],
                            technicalRank: row['Technical Rank'],
                            name: row['Name']
                        };
                    })
                }
            ]
        };

        setChartData(chartData);
    };

    const filterDataBySport = (data, sport) => {
        if (sport === 'All Sports') {
            return data.filter(row => ['Football', 'Basketball', 'Baseball'].includes(row.Sport));
        }
        return data.filter(row => row.Sport === sport);
    };

    const handleXAxisChange = selectedOption => {
        if (selectedOption) {
            setXAxis(selectedOption);
            updateChartData(data, selectedOption.value, yAxis.value, selectedSport.value, bubbleSize.value);
        }
    };

    const handleYAxisChange = selectedOption => {
        if (selectedOption) {
            setYAxis(selectedOption);
            updateChartData(data, xAxis.value, selectedOption.value, selectedSport.value, bubbleSize.value);
        }
    };

    const handleSportChange = selectedOption => {
        if (selectedOption) {
            setSelectedSport(selectedOption);
            filterTableData(data, selectedName, selectedOption, selectedTrend, selectedStatus);
            updateChartData(data, xAxis.value, yAxis.value, selectedOption.value, bubbleSize.value);
        }
    };

    const handleBubbleSizeChange = selectedOption => {
        if (selectedOption) {
            setBubbleSize(selectedOption);
            updateChartData(data, xAxis.value, yAxis.value, selectedSport.value, selectedOption.value);
        }
    };

    const handleNameChange = selectedOption => {
        setSelectedName(selectedOption);
        filterTableData(data, selectedOption, selectedSport, selectedTrend, selectedStatus);
    };

    const handleTrendChange = selectedOption => {
        setSelectedTrend(selectedOption);
        filterTableData(data, selectedName, selectedSport, selectedOption, selectedStatus);
    };

    const handleStatusChange = selectedOption => {
        setSelectedStatus(selectedOption);
        filterTableData(data, selectedName, selectedSport, selectedTrend, selectedOption);
    };

    const filterTableData = (data, names, sport, trends, statuses) => {
        let filtered = data;

        if (names && names.value && names.value !== 'All Players') {
            filtered = filtered.filter(row => row.Name === names.value);
        }

        if (sport && sport.value && sport.value !== 'All Sports') {
            filtered = filtered.filter(row => row.Sport === sport.value);
        }

        if (trends && trends.value && trends.value !== 'All') {
            filtered = filtered.filter(row => row.Trend === trends.value);
        }

        if (statuses && statuses.value && statuses.value !== 'All') {
            filtered = filtered.filter(row => row.Status === statuses.value);
        }

        setFilteredData(filtered);
        updateChartData(filtered, xAxis.value, yAxis.value, sport ? sport.value : 'All Sports', bubbleSize.value);
    };

    const getUniqueOptions = key => {
        const options = data.map(row => row[key]);
        const uniqueOptions = [...new Set(options)];
        return uniqueOptions.map(option => ({ value: option, label: option }));
    };

    const getUniquePlayerOptions = () => {
        const uniqueOptions = getUniqueOptions('Name');
        return [{ value: 'All Players', label: 'All Players' }, ...uniqueOptions];
    };

    const columns = React.useMemo(
        () =>
            data.length > 0
                ? Object.keys(data[0]).map(key => ({
                    Header: key,
                    accessor: key,
                    sticky: key === 'Name' // Make the Name column sticky
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

    const filterAndSortData = (data) => {
        const getTopPlayers = (sport) => {
            return data
                .filter(row => row.Sport === sport)
                .sort((a, b) => b['Composite Rank'] - a['Composite Rank'])
                .slice(0, 5)
                .map(row => ({ name: row.Name, rank: row['Composite Rank'] }));
        };

        const getBottomPlayers = (sport) => {
            return data
                .filter(row => row.Sport === sport)
                .sort((a, b) => a['Composite Rank'] - b['Composite Rank'])
                .slice(0, 5)
                .reverse()
                .map(row => ({ name: row.Name, rank: row['Composite Rank'] }));
        };

        setTopFootball(getTopPlayers('Football'));
        setTopBasketball(getTopPlayers('Basketball'));
        setTopBaseball(getTopPlayers('Baseball'));

        setBottomFootball(getBottomPlayers('Football'));
        setBottomBasketball(getBottomPlayers('Basketball'));
        setBottomBaseball(getBottomPlayers('Baseball'));
    };

    const handlePlayerClick = (playerName) => {
        navigate(`/page-snapshot?player=${encodeURIComponent(playerName)}`);
    };

    return (
        <div className="scoreboard-page-container">
            <Helmet>
                <title>Player Scoreboard</title>
            </Helmet>
            <div className="scoreboard-summary">
                <p className="scoreboard-top-paragraph">The Longhorn Cards Player Scoreboard provides a comprehensive analysis of player rankings using historical card prices, player career statistics, and Google Trends search interest.</p>

                <p>The Composite Rank is calculated from historical card sale prices (Technical Rank), player career statistics for every season (Fundamental Rank), and Google Trends search interest (Sentiment Rank).</p>

                <p>Included in the Scoreboard are key active players across Football, Basketball, and Baseball. Use the filters to display & explore different player metrics.</p>

            </div>
            <h1 style={{ color: 'peru', fontWeight: 'bold' }}>Longhorn Cards Player Scoreboard</h1>
            <h2 className="table-title">Scoreboard Top 5 Rankings</h2>
            <div className="tables-container">
                {['Football', 'Basketball', 'Baseball'].map((sport, index) => (
                    <div key={index} className="table-sub-container">
                        <h3 className="sport-title">{sport}</h3>
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th style={{ textAlign: 'center' }}>Composite Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(sport === 'Football' ? topFootball : sport === 'Basketball' ? topBasketball : topBaseball).map((player, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>
                                            {player.name}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{player.rank}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <h2 className="table-title">Scoreboard Bottom 5 Rankings</h2>
            <div className="tables-container">
                {['Football', 'Basketball', 'Baseball'].map((sport, index) => (
                    <div key={index} className="table-sub-container">
                        <h3 className="sport-title">{sport}</h3>
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th style={{ textAlign: 'center' }}>Composite Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(sport === 'Football' ? bottomFootball : sport === 'Basketball' ? bottomBasketball : bottomBaseball).map((player, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>
                                            {player.name}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{player.rank}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <div className="scoreboard-filters center-filters">
                <div className="scoreboard-filter">
                    <label>X-Axis</label>
                    <Select options={columnOptions} value={xAxis} onChange={handleXAxisChange} />
                </div>
                <div className="scoreboard-filter">
                    <label>Y-Axis</label>
                    <Select options={columnOptions} value={yAxis} onChange={handleYAxisChange} />
                </div>
                <div className="scoreboard-filter">
                    <label>Sport</label>
                    <Select options={sportOptions} value={selectedSport} onChange={handleSportChange} />
                </div>
                <div className="scoreboard-filter">
                    <label>Bubble Size</label>
                    <Select options={columnOptions} value={bubbleSize} onChange={handleBubbleSizeChange} />
                </div>
            </div>
            <div className="scoreboard-scatterplot-container">
                {chartData ? (
                    <div className="responsive-chart">
                        <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Logo.png" alt="Logo" style={{ position: 'absolute', top: 20, left: 20, width: '100px', height: 'auto', zIndex: 10 }} />
                        <Scatter
                            data={chartData}
                            options={{
                                layout: {
                                    padding: {
                                        left: 20, // Adjusted padding
                                        right: 20, // Adjusted padding
                                        top: 20, // Adjusted padding
                                        bottom: 20 // Adjusted padding
                                    }
                                },
                                scales: {
                                    x: {
                                        type: 'linear',
                                        title: {
                                            display: true,
                                            text: xAxis ? xAxis.label : '',
                                            color: 'peru',
                                            font: {
                                                size: 16,
                                                weight: 'bold'
                                            }
                                        },
                                        grid: {
                                            display: false
                                        },
                                        min: -10, // Added buffer to the min value to prevent labels from being cut off
                                        max: 110 // Added buffer to the max value to prevent labels from being cut off
                                    },
                                    y: {
                                        type: 'linear',
                                        title: {
                                            display: true,
                                            text: yAxis ? yAxis.label : '',
                                            color: 'peru',
                                            font: {
                                                size: 16,
                                                weight: 'bold'
                                            }
                                        },
                                        grid: {
                                            display: false
                                        },
                                        min: -10, // Added buffer to the min value to prevent labels from being cut off
                                        max: 110 // Added buffer to the max value to prevent labels from being cut off
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    annotation: {
                                        annotations: {
                                            upperRight: {
                                                type: 'box',
                                                xMin: 50,
                                                xMax: 100,
                                                yMin: 50,
                                                yMax: 100,
                                                backgroundColor: 'rgba(144, 238, 144, 0.2)', // Light green
                                                borderWidth: 0
                                            },
                                            upperLeft: {
                                                type: 'box',
                                                xMin: 0,
                                                xMax: 50,
                                                yMin: 50,
                                                yMax: 100,
                                                backgroundColor: 'rgba(255, 255, 224, 0.2)', // Light yellow
                                                borderWidth: 0
                                            },
                                            lowerLeft: {
                                                type: 'box',
                                                xMin: 0,
                                                xMax: 50,
                                                yMin: 0,
                                                yMax: 50,
                                                backgroundColor: 'rgba(240, 128, 128, 0.2)', // Light coral
                                                borderWidth: 0
                                            },
                                            lowerRight: {
                                                type: 'box',
                                                xMin: 50,
                                                xMax: 100,
                                                yMin: 0,
                                                yMax: 50,
                                                backgroundColor: 'rgba(173, 216, 230, 0.2)', // Light blue
                                                borderWidth: 0
                                            }
                                        }
                                    },
                                    datalabels: {
                                        align: 'end',
                                        anchor: 'end',
                                        formatter: function (value, context) {
                                            return context.dataset.data[context.dataIndex].name;
                                        },
                                        color: 'peru'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                const name = context.raw.name;
                                                const xValue = context.raw.x;
                                                const yValue = context.raw.y;
                                                const compositeRank = context.raw.compositeRank;
                                                const fundamentalRank = context.raw.fundamentalRank;
                                                const sentimentRank = context.raw.sentimentRank;
                                                const technicalRank = context.raw.technicalRank;
                                                return [
                                                    `Name: ${name}`,
                                                    `${context.dataset.label}:`,
                                                    `X: ${xValue}`,
                                                    `Y: ${yValue}`,
                                                    `Composite Rank: ${compositeRank}`,
                                                    `Fundamental Rank: ${fundamentalRank}`,
                                                    `Sentiment Rank: ${sentimentRank}`,
                                                    `Technical Rank: ${technicalRank}`
                                                ];
                                            }
                                        }
                                    }
                                },
                                elements: {
                                    point: {
                                        backgroundColor: function (context) {
                                            const compositeRank = context.raw.compositeRank;
                                            const maxCompositeRank = Math.max(...data.map(row => row['Composite Rank']));
                                            return getColor(compositeRank, maxCompositeRank);
                                        },
                                        radius: function (context) {
                                            return context.raw.r || 5;
                                        }
                                    }
                                }
                            }}
                            ref={chartRef}
                        />
                    </div>
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
            <div className="scoreboard-info-section">
                <p>Detailed Player Scoreboard Information</p>
            </div>
            <h2 className="scoreboard-center-text">Filter by Player, Sport, Trend, and Status:</h2>
            <div className="scoreboard-filters center-filters">
                <div className="scoreboard-filter">
                    <label>Player</label>
                    <Select
                        options={getUniquePlayerOptions()}
                        value={selectedName}
                        onChange={handleNameChange}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
                <div className="scoreboard-filter">
                    <label>Sport</label>
                    <Select
                        options={sportOptions}
                        value={selectedSport}
                        onChange={handleSportChange}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
                <div className="scoreboard-filter">
                    <label>Trend</label>
                    <Select
                        options={trendOptions}
                        value={selectedTrend}
                        onChange={handleTrendChange}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
                <div className="scoreboard-filter">
                    <label>Status</label>
                    <Select
                        options={statusOptions}
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        closeMenuOnSelect={true}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
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
                                <div {...row.getRowProps()} className="tr" id={`row-${row.original.Name.replace(/\s+/g, '-').toLowerCase()}`}>
                                    {row.cells.map(cell => (
                                        <div
                                            {...cell.getCellProps()}
                                            className={`td ${cell.column.sticky ? 'sticky' : ''}`}
                                            style={{
                                                backgroundColor: cell.column.id !== 'Name' && cell.column.id !== 'Sport' && cell.column.id !== 'Status' && cell.column.id !== 'Trend' && cell.column.id !== '% from Low' && cell.column.id !== '% from High' ? getBackgroundColor(cell.value, Math.max(...data.map(row => row[cell.column.id]))) : cell.column.id === 'Trend' ? getTrendColor(cell.value) : 'transparent',
                                                color: cell.column.id === '% from Low' || cell.column.id === '% from High' ? (cell.value >= 0 ? 'green' : 'red') : 'inherit'
                                            }}
                                        >
                                            {cell.column.id === 'Name' ? (
                                                cell.value
                                            ) : (
                                                cell.render('Cell')
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="scoreboard-text-section">
                <p>The Longhorn Cards Player Scoreboard incorporates historical player card prices (Technical Rank), player career statistics aggregated for all seasons played (Fundamental Rank), and Google Trends interest/popularity (Sentiment Rank.)</p>
                <p>(Player Scatterplot: Color of Bubble = Composite Rank | Player Table: Active = Active Player or Retired; Trend = Current technical trend is based on short- and long-term historical card prices; Percentages reflect current card price levels relative to high, low, and different average price levels; Dates shown are for the Sentiment Rank based on Google Trends for that month)</p>
            </div>
        </div>
    );
};

export default Player_Scoreboard;
