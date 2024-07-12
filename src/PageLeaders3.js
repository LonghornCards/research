import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import './App.css';
import Select from 'react-select';

const PageLeaders3 = () => {
    const [selectedYear, setSelectedYear] = useState('2023');
    const [selectedStat, setSelectedStat] = useState('PTS');
    const [topPointsPlayers, setTopPointsPlayers] = useState([]);
    const [topAssistsPlayers, setTopAssistsPlayers] = useState([]);
    const [topReboundsPlayers, setTopReboundsPlayers] = useState([]);
    const [topBlocksPlayers, setTopBlocksPlayers] = useState([]);
    const [topFGPercentagePlayers, setTopFGPercentagePlayers] = useState([]);
    const [topThreePointPercentagePlayers, setTopThreePointPercentagePlayers] = useState([]);
    const [fullTableData, setFullTableData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [pivotData, setPivotData] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedPivotStat, setSelectedPivotStat] = useState('PTS');
    const [availableYears, setAvailableYears] = useState([]);
    const [startYear, setStartYear] = useState('2005');
    const [endYear, setEndYear] = useState('2023');

    useEffect(() => {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: process.env.REACT_APP_AWS_REGION
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'NBA_Season_Stats.xlsx'
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const workbook = XLSX.read(data.Body, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const years = [...new Set(jsonData.map(row => row.Season.substring(0, 4)))].sort();
            setAvailableYears(years);

            const filteredData = jsonData.filter(row => row.Season && row.Season.startsWith(selectedYear));
            setFullTableData(filteredData);

            const sortedPointsData = filteredData.sort((a, b) => b.PTS - a.PTS).slice(0, 5);
            setTopPointsPlayers(sortedPointsData);

            const sortedAssistsData = filteredData.sort((a, b) => b.AST - a.AST).slice(0, 5);
            setTopAssistsPlayers(sortedAssistsData);

            const sortedReboundsData = filteredData.sort((a, b) => b.TRB - a.TRB).slice(0, 5);
            setTopReboundsPlayers(sortedReboundsData);

            const sortedBlocksData = filteredData.sort((a, b) => b.BLK - a.BLK).slice(0, 5);
            setTopBlocksPlayers(sortedBlocksData);

            const sortedFGPercentageData = filteredData.sort((a, b) => b["FG%"] - a["FG%"]).slice(0, 5);
            setTopFGPercentagePlayers(sortedFGPercentageData);

            const sortedThreePointPercentageData = filteredData.sort((a, b) => b["3P%"] - a["3P%"]).slice(0, 5);
            setTopThreePointPercentagePlayers(sortedThreePointPercentageData);

            setBarChartData(filteredData);

            const pivotData = jsonData.reduce((acc, row) => {
                const { Season, Name, ...stats } = row;
                if (Season && Name) {
                    if (!acc[Name]) acc[Name] = {};
                    acc[Name][Season.substring(0, 4)] = stats;
                }
                return acc;
            }, {});
            setPivotData(pivotData);
        });
    }, [selectedYear]);

    useEffect(() => {
        if (fullTableData.length > 0) {
            const sortedBarChartData = [...fullTableData].sort((a, b) => b[selectedStat] - a[selectedStat]);
            setBarChartData(sortedBarChartData);
        }
    }, [selectedStat, fullTableData]);

    useEffect(() => {
        if (startYear && endYear) {
            const filteredPivotData = Object.keys(pivotData).reduce((acc, name) => {
                acc[name] = Object.keys(pivotData[name])
                    .filter(year => year >= startYear && year <= endYear)
                    .reduce((subAcc, year) => {
                        subAcc[year] = pivotData[name][year];
                        return subAcc;
                    }, {});
                return acc;
            }, {});
            setPivotData(filteredPivotData);
        }
    }, [startYear, endYear]);

    const getGradientColor = (value, min, max, reverse = false) => {
        if (value === 0 || isNaN(value) || typeof value !== 'number') return 'lightgray';
        const ratio = (value - min) / (max - min);
        const red = reverse ? Math.max(0, 255 * ratio) : Math.max(0, 255 - (255 * ratio));
        const green = reverse ? Math.max(0, 255 - (255 * ratio)) : Math.max(0, 255 * ratio);
        return `rgb(${red},${green},0)`;
    };

    const renderTable = (data, columns) => (
        <table className="leaders-table">
            <thead className="sticky-header">
                <tr>
                    {columns.map(column => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((player, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <td key={colIndex}>
                                {player[column]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderFullTable = (data) => {
        const sortedData = [...data].sort((a, b) => b.PTS - a.PTS);
        const columns = Object.keys(data[0] || {}).filter(col => col !== 'Season');
        return renderTable(sortedData, columns);
    };

    const renderPivotTable = (pivotData) => {
        const years = availableYears.filter(year => year >= startYear && year <= endYear);
        const names = Object.keys(pivotData)
            .filter(name => selectedNames.length === 0 || selectedNames.includes(name))
            .filter(name => years.some(year => pivotData[name][year]?.[selectedPivotStat] > 0));

        const minMaxValues = {};
        years.forEach(year => {
            const values = names.map(name => {
                const value = pivotData[name][year]?.[selectedPivotStat];
                return (typeof value === 'number') ? value : 0;
            });
            minMaxValues[year] = { min: Math.min(...values), max: Math.max(...values) };
        });

        return (
            <div className="scrollable-table">
                <table className="pivot-table" style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
                    <thead className="sticky-header">
                        <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                            <th style={{ border: '1px solid peru' }}>Name / Year</th>
                            {years.map(year => (
                                <th key={year} style={{ border: '1px solid peru' }}>{year}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {names.map(name => (
                            <tr key={name}>
                                <td style={{ border: '1px solid peru' }}>{name}</td>
                                {years.map(year => {
                                    const value = pivotData[name][year]?.[selectedPivotStat];
                                    const { min, max } = minMaxValues[year];
                                    return (
                                        <td key={year} style={{ border: '1px solid peru', backgroundColor: getGradientColor(value, min, max) }}>
                                            {value !== undefined ? value : 'N/A'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value.substring(0, 4));
    };

    const handleStatChange = (event) => {
        setSelectedStat(event.target.value);
    };

    const handleNameChange = (selectedOptions) => {
        setSelectedNames(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handlePivotStatChange = (selectedOptions) => {
        setSelectedPivotStat(selectedOptions ? selectedOptions.value : 'PTS');
    };

    const handleStartYearChange = (event) => {
        setStartYear(event.target.value);
    };

    const handleEndYearChange = (event) => {
        setEndYear(event.target.value);
    };

    const nameOptions = Object.keys(pivotData).map(name => ({ value: name, label: name }));
    const statOptions = [
        { value: 'G', label: 'G' },
        { value: 'GS', label: 'GS' },
        { value: 'MP', label: 'MP' },
        { value: 'FG', label: 'FG' },
        { value: 'FGA', label: 'FGA' },
        { value: 'FG%', label: 'FG%' },
        { value: '3P', label: '3P' },
        { value: '3PA', label: '3PA' },
        { value: '3P%', label: '3P%' },
        { value: '2P', label: '2P' },
        { value: '2PA', label: '2PA' },
        { value: '2P%', label: '2P%' },
        { value: 'eFG%', label: 'eFG%' },
        { value: 'FT', label: 'FT' },
        { value: 'FTA', label: 'FTA' },
        { value: 'FT%', label: 'FT%' },
        { value: 'ORB', label: 'ORB' },
        { value: 'DRB', label: 'DRB' },
        { value: 'TRB', label: 'TRB' },
        { value: 'AST', label: 'AST' },
        { value: 'STL', label: 'STL' },
        { value: 'BLK', label: 'BLK' },
        { value: 'TOV', label: 'TOV' },
        { value: 'PF', label: 'PF' },
        { value: 'PTS', label: 'PTS' },
    ];

    return (
        <div className="leaders-page">
            <a href="/PageStats" className="return-link">Return to Statistics Page</a>
            <h1>Basketball Leaderboards</h1>
            <p>View current season leaders and detailed statistics for key basketball players</p>
            <div className="leaders-container">
                <h2>NBA Basketball Leaders</h2>
                <div>
                    <label htmlFor="year-select">Select Year: </label>
                    <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}-{parseInt(year) + 1}</option>
                        ))}
                    </select>
                </div>
                <div className="leaders-subcontainers">
                    <div className="leaders-subcontainer">
                        {renderTable(topPointsPlayers, ['Name', 'PTS'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topAssistsPlayers, ['Name', 'AST'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topReboundsPlayers, ['Name', 'TRB'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topBlocksPlayers, ['Name', 'BLK'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topFGPercentagePlayers, ['Name', 'FG%'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topThreePointPercentagePlayers, ['Name', '3P%'])}
                    </div>
                </div>
                <div className="scrollable-container">
                    {renderFullTable(fullTableData)}
                </div>
                <div className="bar-chart-container">
                    <div>
                        <label htmlFor="stat-select">Select Statistic: </label>
                        <select id="stat-select" value={selectedStat} onChange={handleStatChange}>
                            {statOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Plot
                        data={[
                            {
                                x: barChartData.map(player => player.Name),
                                y: barChartData.map(player => player[selectedStat]),
                                type: 'bar',
                                marker: { color: 'blue' },
                            },
                        ]}
                        layout={{
                            title: `Top Players by ${selectedStat}`,
                            xaxis: { title: '' },
                            yaxis: { title: selectedStat },
                            width: 1000
                        }}
                    />
                </div>
            </div>
            <div className="historical-statistics-container" style={{ border: '1px solid peru', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
                <h2>Historical Statistics</h2>
                <div style={{ width: '50%', margin: '0 auto' }}>
                    <label htmlFor="start-year-select">Select Start Year: </label>
                    <select id="start-year-select" value={startYear} onChange={handleStartYearChange}>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div style={{ width: '50%', margin: '0 auto' }}>
                    <label htmlFor="end-year-select">Select End Year: </label>
                    <select id="end-year-select" value={endYear} onChange={handleEndYearChange}>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div style={{ width: '50%', margin: '0 auto' }}>
                    <label htmlFor="name-select">Select Names: </label>
                    <Select
                        isMulti
                        id="name-select"
                        options={nameOptions}
                        onChange={handleNameChange}
                        className="name-select"
                        styles={{ container: base => ({ ...base, width: '100%' }) }}
                    />
                </div>
                <div style={{ width: '50%', margin: '20px auto' }}>
                    <label htmlFor="statistic-select">Select Statistic: </label>
                    <Select
                        id="statistic-select"
                        options={statOptions}
                        onChange={handlePivotStatChange}
                        className="statistic-select"
                        styles={{ container: base => ({ ...base, width: '100%' }) }}
                    />
                </div>
                {renderPivotTable(pivotData)}
            </div>
            <div className="glossary-container" style={{ textAlign: 'left' }}>
                <p>Glossary for fundamental stats: The tables above provide comprehensive statistics for NBA players. These statistics are sourced from Sports-Reference.com</p>
                <p>2P -- 2-Point Field Goals Per Game</p>
                <p>2PA -- 2-Point Field Goal Attempts Per Game</p>
                <p>2P% -- 2-Point Field Goal Percentage</p>
                <p>3P -- 3-Point Field Goals Per Game</p>
                <p>3PA -- 3-Point Field Goal Attempts Per Game</p>
                <p>3P% -- 3-Point Field Goal Percentage</p>
                <p>AST -- Assists Per Game</p>
                <p>AV -- Approximate Value is our attempt to attach a single number to every player-season since 1960.</p>
                <p>Awards -- Summary of how player did in awards voting that year.</p>
                <p>BLK -- Blocks Per Game</p>
                <p>DRB -- Defensive Rebounds Per Game</p>
                <p>eFG% -- Effective Field Goal Percentage</p>
                <p>FG -- Field Goals Per Game</p>
                <p>FGA -- Field Goal Attempts Per Game</p>
                <p>FG% -- Field Goal Percentage</p>
                <p>FT -- Free Throws Per Game</p>
                <p>FTA -- Free Throw Attempts Per Game</p>
                <p>FT% -- Free Throw Percentage</p>
                <p>G -- Games played</p>
                <p>GS -- Games started as an offensive or defensive player</p>
                <p>MP -- Minutes Played Per Game</p>
                <p>ORB -- Offensive Rebounds Per Game</p>
                <p>PF -- Personal Fouls Per Game</p>
                <p>PTS -- Points Per Game</p>
                <p>TOV -- Turnovers Per Game</p>
                <p>TRB -- Total Rebounds Per Game</p>
            </div>
        </div>
    );
}

export default PageLeaders3;
