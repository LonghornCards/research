import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Scatter } from 'react-chartjs-2';
import { Chart, LinearScale, PointElement, Tooltip, Legend, Title, CategoryScale } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import datalabels from 'chartjs-plugin-datalabels';
import Select, { components } from 'react-select';
import { useTable, useBlockLayout } from 'react-table';
import './App.css';

Chart.register(LinearScale, PointElement, Tooltip, Legend, Title, annotationPlugin, datalabels, CategoryScale);

const columnOptions = [
    { value: 'Composite Rank', label: 'Composite Rank' },
    { value: 'Fundamental Rank', label: 'Fundamental Rank' },
    { value: 'Technical Rank', label: 'Technical Rank' },
    { value: 'Sentiment Rank', label: 'Sentiment Rank' }
];

const Option = (props) => {
    return (
        <components.Option {...props}>
            <input type="checkbox" checked={props.isSelected} onChange={() => null} />{' '}
            <label>{props.label}</label>
        </components.Option>
    );
};

const MultiValue = (props) => {
    return (
        <components.MultiValue {...props}>
            <span>{props.children}</span>
        </components.MultiValue>
    );
};

const Player_Scoreboard = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [xAxis, setXAxis] = useState(columnOptions[2]); // Default to Technical Rank
    const [yAxis, setYAxis] = useState(columnOptions[3]); // Default to Sentiment Rank
    const [filteredData, setFilteredData] = useState([]);
    const [selectedName, setSelectedName] = useState([]);
    const [selectedSport, setSelectedSport] = useState([]);
    const [selectedTrend, setSelectedTrend] = useState([]);

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
                updateChartData(worksheet, xAxis.value, yAxis.value);
            } catch (error) {
                console.error('Error fetching the data:', error);
            }
        };

        fetchData();
    }, []);

    const getColor = (compositeRank, maxRank) => {
        const ratio = compositeRank / maxRank;
        const r = Math.floor(255 * (1 - ratio));
        const g = Math.floor(255 * ratio);
        return `rgb(${r}, ${g}, 0)`;
    };

    const updateChartData = (data, xAxis, yAxis) => {
        const maxCompositeRank = Math.max(...data.map(row => row['Composite Rank']));
        const maxFundamentalRank = Math.max(...data.map(row => row['Fundamental Rank']));
        const scalingFactor = 50 / maxFundamentalRank; // Adjust scaling factor as needed

        const chartData = {
            datasets: [
                {
                    label: `${yAxis} vs ${xAxis}`,
                    data: data.map(row => ({
                        x: row[xAxis],
                        y: row[yAxis],
                        r: row['Fundamental Rank'] * scalingFactor, // Scale the bubble size
                        backgroundColor: getColor(row['Composite Rank'], maxCompositeRank),
                        compositeRank: row['Composite Rank'], // Store Composite Rank for tooltip
                        fundamentalRank: row['Fundamental Rank'], // Store Fundamental Rank for tooltip
                        sentimentRank: row['Sentiment Rank'], // Store Sentiment Rank for tooltip
                        technicalRank: row['Technical Rank'], // Store Technical Rank for tooltip
                        name: row['Name'] // Add name for the data label
                    }))
                }
            ]
        };

        setChartData(chartData);
    };

    const handleXAxisChange = selectedOption => {
        setXAxis(selectedOption);
        updateChartData(data, selectedOption.value, yAxis.value);
    };

    const handleYAxisChange = selectedOption => {
        setYAxis(selectedOption);
        updateChartData(data, xAxis.value, selectedOption.value);
    };

    const handleNameChange = selectedOptions => {
        setSelectedName(selectedOptions);
        filterTableData(selectedOptions, selectedSport, selectedTrend);
    };

    const handleSportChange = selectedOptions => {
        setSelectedSport(selectedOptions);
        filterTableData(selectedName, selectedOptions, selectedTrend);
    };

    const handleTrendChange = selectedOptions => {
        setSelectedTrend(selectedOptions);
        filterTableData(selectedName, selectedSport, selectedOptions);
    };

    const filterTableData = (names, sports, trends) => {
        let filtered = data;

        if (names.length > 0) {
            filtered = filtered.filter(row => names.some(option => option.value === row.Name));
        }

        if (sports.length > 0) {
            filtered = filtered.filter(row => sports.some(option => option.value === row.Sport));
        }

        if (trends.length > 0) {
            filtered = filtered.filter(row => trends.some(option => option.value === row.Trend));
        }

        setFilteredData(filtered);
    };

    // Get unique options for filters
    const getUniqueOptions = key => {
        const options = data.map(row => row[key]);
        const uniqueOptions = [...new Set(options)];
        return uniqueOptions.map(option => ({ value: option, label: option }));
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

    return (
        <div className="page-container">
            <h1>Longhorn Cards Player Scoreboard</h1>
            <div className="filters center-filters">
                <div className="filter">
                    <label>X-Axis</label>
                    <Select options={columnOptions} value={xAxis} onChange={handleXAxisChange} />
                </div>
                <div className="filter">
                    <label>Y-Axis</label>
                    <Select options={columnOptions} value={yAxis} onChange={handleYAxisChange} />
                </div>
            </div>
            <div className="scatterplot-container">
                {chartData ? (
                    <Scatter
                        data={chartData}
                        options={{
                            layout: {
                                padding: {
                                    left: 40, // Increased padding to prevent labels from being cut off
                                    right: 40, // Increased padding to prevent labels from being cut off
                                    top: 40, // Increased padding to prevent labels from being cut off
                                    bottom: 40 // Increased padding to prevent labels from being cut off
                                }
                            },
                            scales: {
                                x: {
                                    type: 'linear',
                                    title: {
                                        display: true,
                                        text: xAxis.label,
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
                                        text: yAxis.label,
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
                                        return context.raw.r;
                                    }
                                }
                            }
                        }}
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
            <h2 className="center-text">Filter by Player, Sport, and Trend:</h2>
            <div className="filters center-filters">
                <div className="filter">
                    <label>Player</label>
                    <Select
                        isMulti
                        options={getUniqueOptions('Name')}
                        value={selectedName}
                        onChange={handleNameChange}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
                <div className="filter">
                    <label>Sport</label>
                    <Select
                        isMulti
                        options={getUniqueOptions('Sport')}
                        value={selectedSport}
                        onChange={handleSportChange}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
                <div className="filter">
                    <label>Trend</label>
                    <Select
                        isMulti
                        options={getUniqueOptions('Trend')}
                        value={selectedTrend}
                        onChange={handleTrendChange}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
            </div>
            <div className="table-container">
                <div {...getTableProps()} className="table">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player_Scoreboard;
