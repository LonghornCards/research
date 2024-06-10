import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as XLSX from 'xlsx';
import Select from 'react-select';

const ScatterPlot = ({ fileUrl, xAxis, yAxis, displayColumns }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedSports, setSelectedSports] = useState([]);

    useEffect(() => {
        fetch(fileUrl)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const workbook = XLSX.read(buffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                const headers = worksheet[0];
                const rows = worksheet.slice(1);

                const data = rows.map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                setData(data);
                setFilteredData(data);
            });
    }, [fileUrl]);

    useEffect(() => {
        let filtered = data;

        if (selectedPlayers.length > 0) {
            filtered = filtered.filter(item => selectedPlayers.includes(item['PLAYER']));
        }

        if (selectedSports.length > 0) {
            if (!selectedSports.includes('All Sports')) {
                filtered = filtered.filter(item => selectedSports.includes(item['Sport']));
            }
        }

        setFilteredData(filtered);
    }, [selectedPlayers, selectedSports, data]);

    const xData = filteredData.map(item => item[xAxis]);
    const yData = filteredData.map(item => item[yAxis]);
    const markerSizes = filteredData.map(item => Math.abs(item[xAxis] - item[yAxis]));
    const googleTrend = filteredData.map(item => item[xAxis] > item[yAxis] ? 'Uptrend' : 'Downtrend');

    const annotations = filteredData.map((item, index) => ({
        x: item[xAxis],
        y: item[yAxis],
        text: item['PLAYER'],
        showarrow: false,
        font: {
            size: 12,
            color: 'peru',
            family: 'Arial, sans-serif',
            weight: 'bold',
        },
        xanchor: 'center', // Center the text horizontally
        yanchor: 'middle', // Center the text vertically
    }));

    const playerOptions = data.map(item => ({ value: item['PLAYER'], label: item['PLAYER'] }));
    const sportOptions = [
        { value: 'All Sports', label: 'All Sports' },
        { value: 'Football', label: 'Football' },
        { value: 'Basketball', label: 'Basketball' },
        { value: 'Baseball', label: 'Baseball' },
    ];

    const handlePlayerChange = (selectedOptions) => {
        const selected = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedPlayers(selected);
    };

    const handleSportChange = (selectedOptions) => {
        const selected = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedSports(selected);
    };

    const handleResetFilter = () => {
        setSelectedPlayers([]);
        setSelectedSports([]);
    };

    const padding = 10; // Padding to prevent text cutoff

    return (
        <div className="scatterplot-container">
            <h2 className="scatterplot-title">Google Trends Scatterplot</h2>
            <p className="scatterplot-description">
                This scatterplot displays the 3-Mo and 12-Mo average Google trends for various players.
                Use the multi-selectors below to filter the players and sports you want to focus on. Click "Reset Filter"
                to clear all selections and view the entire dataset again.
            </p>
            <div className="filter-wrapper">
                <Select
                    isMulti
                    options={playerOptions}
                    onChange={handlePlayerChange}
                    value={playerOptions.filter(option => selectedPlayers.includes(option.value))}
                    placeholder="Select Players"
                    className="player-select"
                />
                <Select
                    isMulti
                    options={sportOptions}
                    onChange={handleSportChange}
                    value={sportOptions.filter(option => selectedSports.includes(option.value))}
                    placeholder="Select Sports"
                    className="sport-select"
                />
                <button onClick={handleResetFilter} className="reset-button">Reset Filter</button>
            </div>
            <Plot
                data={[
                    {
                        x: xData,
                        y: yData,
                        mode: 'markers',
                        type: 'scatter',
                        marker: {
                            size: markerSizes,
                            color: 'black',
                            opacity: 0,
                        },
                        hovertext: filteredData.map(item =>
                            `PLAYER: ${item['PLAYER']}<br>3-Mo Avg: ${item[xAxis]}<br>12-Mo Avg: ${item[yAxis]}<br>Google Trend: ${item[xAxis] > item[yAxis] ? 'Uptrend' : 'Downtrend'}`
                        ),
                        hoverinfo: 'text',
                        hoverlabel: {
                            bgcolor: 'peru',
                            font: {
                                color: 'white'
                            }
                        }
                    },
                ]}
                layout={{
                    title: {
                        text: '',
                    },
                    width: 1600, // Set the width to half the previous size
                    height: 1600, // Set the height to half the previous size
                    xaxis: {
                        title: {
                            text: '3-Mo Avg. Google Trend',
                            font: {
                                size: 16,
                                color: 'black'
                            }
                        },
                        tickangle: -45,
                        range: [Math.min(...xData) - padding, Math.max(...xData) + padding],
                    },
                    yaxis: {
                        title: {
                            text: '12-Mo Avg. Google Trend',
                            font: {
                                size: 16,
                                color: 'black'
                            }
                        },
                        range: [Math.min(...yData) - padding, Math.max(...yData) + padding],
                    },
                    margin: {
                        l: 50,
                        r: 50,
                        b: 100,
                        t: 100,
                    },
                    shapes: [
                        // Quadrant shapes
                        {
                            type: 'rect',
                            xref: 'x',
                            yref: 'y',
                            x0: 50,
                            y0: 50,
                            x1: 100,
                            y1: 100,
                            fillcolor: 'rgba(144,238,144,0.2)', // Light green
                            line: {
                                width: 0
                            }
                        },
                        {
                            type: 'rect',
                            xref: 'x',
                            yref: 'y',
                            x0: 0,
                            y0: 50,
                            x1: 50,
                            y1: 100,
                            fillcolor: 'rgba(255,255,224,0.2)', // Light yellow
                            line: {
                                width: 0
                            }
                        },
                        {
                            type: 'rect',
                            xref: 'x',
                            yref: 'y',
                            x0: 0,
                            y0: 0,
                            x1: 50,
                            y1: 50,
                            fillcolor: 'rgba(240,128,128,0.2)', // Light red
                            line: {
                                width: 0
                            }
                        },
                        {
                            type: 'rect',
                            xref: 'x',
                            yref: 'y',
                            x0: 50,
                            y0: 0,
                            x1: 100,
                            y1: 50,
                            fillcolor: 'rgba(173,216,230,0.2)', // Light blue
                            line: {
                                width: 0
                            }
                        },
                        // Quadrant divider lines
                        {
                            type: 'line',
                            x0: 50,
                            y0: 0,
                            x1: 50,
                            y1: 100,
                            line: {
                                color: 'peru',
                                width: 2,
                            }
                        },
                        {
                            type: 'line',
                            x0: 0,
                            y0: 50,
                            x1: 100,
                            y1: 50,
                            line: {
                                color: 'peru',
                                width: 2,
                            }
                        }
                    ],
                    annotations: annotations,
                }}
                config={{ responsive: true }}
            />
        </div>
    );
};

export default ScatterPlot;
