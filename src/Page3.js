import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Scatter } from 'react-chartjs-2';
import { Chart, LinearScale, PointElement, Tooltip, Legend, Title, CategoryScale } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import datalabels from 'chartjs-plugin-datalabels';
import Select from 'react-select';
import './App.css';

Chart.register(LinearScale, PointElement, Tooltip, Legend, Title, annotationPlugin, datalabels, CategoryScale);

const columnOptions = [
    { value: 'Composite Rank', label: 'Composite Rank' },
    { value: 'Fundamental Rank', label: 'Fundamental Rank' },
    { value: 'Technical Rank', label: 'Technical Rank' },
    { value: 'Sentiment Rank', label: 'Sentiment Rank' }
];

const Page3 = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [xAxis, setXAxis] = useState(columnOptions[2]); // Default to Technical Rank
    const [yAxis, setYAxis] = useState(columnOptions[3]); // Default to Sentiment Rank

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
                updateChartData(worksheet, xAxis.value, yAxis.value);
            } catch (error) {
                console.error("Error fetching the data:", error);
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
        const chartData = {
            datasets: [
                {
                    label: `${yAxis} vs ${xAxis}`,
                    data: data.map(row => ({
                        x: row[xAxis],
                        y: row[yAxis],
                        r: row['Fundamental Rank'], // Use 'Fundamental Rank' for bubble size
                        backgroundColor: getColor(row['Composite Rank'], maxCompositeRank),
                        name: row['Name'] // Add name for the data label
                    })),
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

    return (
        <div className="Page3">
            <h1 className="center-text">Sentiment vs Technical Rank Scatterplot</h1>
            <div className="filters center-filters">
                <div className="filter">
                    <label>X-Axis</label>
                    <Select
                        options={columnOptions}
                        value={xAxis}
                        onChange={handleXAxisChange}
                    />
                </div>
                <div className="filter">
                    <label>Y-Axis</label>
                    <Select
                        options={columnOptions}
                        value={yAxis}
                        onChange={handleYAxisChange}
                    />
                </div>
            </div>
            <div className="scatterplot-container">
                {chartData ? (
                    <Scatter
                        data={chartData}
                        options={{
                            layout: {
                                padding: {
                                    left: 20,
                                    right: 20,
                                    top: 20,
                                    bottom: 20
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
                                    min: 0,
                                    max: 100
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
                                    min: 0,
                                    max: 100
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
                                        },
                                        line1: {
                                            type: 'line',
                                            scaleID: 'x',
                                            value: 50,
                                            borderColor: 'peru',
                                            borderWidth: 2,
                                            label: {
                                                enabled: true,
                                                content: '50',
                                                position: 'start'
                                            }
                                        },
                                        line2: {
                                            type: 'line',
                                            scaleID: 'y',
                                            value: 50,
                                            borderColor: 'peru',
                                            borderWidth: 2,
                                            label: {
                                                enabled: true,
                                                content: '50',
                                                position: 'start'
                                            }
                                        }
                                    }
                                },
                                datalabels: {
                                    align: 'start',
                                    anchor: 'start',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    borderColor: 'rgba(0, 0, 0, 0.1)',
                                    borderRadius: 3,
                                    borderWidth: 1,
                                    color: 'black',
                                    font: {
                                        size: 10,
                                        weight: 'bold'
                                    },
                                    formatter: (value, context) => {
                                        return context.dataset.data[context.dataIndex].name;
                                    },
                                    offset: 8,
                                    padding: 3,
                                    listeners: {
                                        afterDraw: (chart) => {
                                            const ctx = chart.ctx;
                                            chart.data.datasets.forEach(dataset => {
                                                dataset.data.forEach((datapoint, index) => {
                                                    const meta = chart.getDatasetMeta(0);
                                                    const position = meta.data[index].tooltipPosition();
                                                    ctx.beginPath();
                                                    ctx.moveTo(position.x, position.y);
                                                    ctx.lineTo(position.x + 10, position.y - 10);
                                                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                                                    ctx.stroke();
                                                });
                                            });
                                        }
                                    }
                                }
                            },
                            tooltips: {
                                callbacks: {
                                    title: (tooltipItems, data) => {
                                        const dataset = data.datasets[tooltipItems[0].datasetIndex];
                                        const dataItem = dataset.data[tooltipItems[0].index];
                                        return dataItem.name;
                                    },
                                    label: (tooltipItem, data) => {
                                        const dataset = data.datasets[tooltipItem.datasetIndex];
                                        const dataItem = dataset.data[tooltipItem.index];
                                        return [
                                            `${xAxis.label}: ${dataItem.x}`,
                                            `${yAxis.label}: ${dataItem.y}`
                                        ];
                                    }
                                }
                            },
                            elements: {
                                point: {
                                    radius: (context) => context.raw.r / 2, // Adjust radius to control bubble size
                                    backgroundColor: (context) => context.raw.backgroundColor
                                }
                            }
                        }}
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </div>
    );
};

export default Page3;
