import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import './App.css';
import Select from 'react-select';

const PageLeaders = () => {
    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedStat, setSelectedStat] = useState('H');
    const [topHitsPlayers, setTopHitsPlayers] = useState([]);
    const [topHRPlayers, setTopHRPlayers] = useState([]);
    const [topBAPlayers, setTopBAPlayers] = useState([]);
    const [topRBIPlayers, setTopRBIPlayers] = useState([]);
    const [topRunsPlayers, setTopRunsPlayers] = useState([]);
    const [topOPSPlusPlayers, setTopOPSPlusPlayers] = useState([]);
    const [fullTableData, setFullTableData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [pivotData, setPivotData] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedPivotStat, setSelectedPivotStat] = useState('HR');
    const [years, setYears] = useState([]);
    const [startYear, setStartYear] = useState('2005');
    const [endYear, setEndYear] = useState('2024');

    useEffect(() => {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: process.env.REACT_APP_AWS_REGION
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'MLB_Season_Stats.xlsx'
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const workbook = XLSX.read(data.Body, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const filteredData = jsonData.filter(row => row.Year === selectedYear);
            setFullTableData(filteredData);

            const sortedHitsData = filteredData.sort((a, b) => b.H - a.H).slice(0, 5);
            setTopHitsPlayers(sortedHitsData);

            const sortedHRData = filteredData.sort((a, b) => b.HR - a.HR).slice(0, 5);
            setTopHRPlayers(sortedHRData);

            const sortedBAData = filteredData.sort((a, b) => b.BA - a.BA).slice(0, 5);
            setTopBAPlayers(sortedBAData);

            const sortedRBIData = filteredData.sort((a, b) => b.RBI - a.RBI).slice(0, 5);
            setTopRBIPlayers(sortedRBIData);

            const sortedRunsData = filteredData.sort((a, b) => b.R - a.R).slice(0, 5);
            setTopRunsPlayers(sortedRunsData);

            const sortedOPSPlusData = filteredData.sort((a, b) => b['OPS+'] - a['OPS+']).slice(0, 5);
            setTopOPSPlusPlayers(sortedOPSPlusData);

            setBarChartData(filteredData);

            const validYears = jsonData
                .map(row => row.Year)
                .filter(year => /^\d{4}$/.test(year))
                .sort((a, b) => a - b);
            setYears([...new Set(validYears)]);

            // Create pivot data
            const pivotData = jsonData.reduce((acc, row) => {
                const { Year, Name, ...stats } = row;
                if (!acc[Name]) acc[Name] = {};
                acc[Name][Year] = stats;
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
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: process.env.REACT_APP_AWS_REGION
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'MLB_Season_Stats.xlsx'
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const workbook = XLSX.read(data.Body, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const validYears = jsonData
                .map(row => row.Year)
                .filter(year => /^\d{4}$/.test(year))
                .sort((a, b) => a - b);
            setYears([...new Set(validYears)]);

            // Create pivot data
            const pivotData = jsonData.reduce((acc, row) => {
                const { Year, Name, ...stats } = row;
                if (!acc[Name]) acc[Name] = {};
                acc[Name][Year] = stats;
                return acc;
            }, {});
            setPivotData(pivotData);
        });
    }, [startYear, endYear]);

    const getGradientColor = (value, min, max, reverse) => {
        if (value === 0) return 'lightgray';
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
        const sortedData = [...data].sort((a, b) => b.HR - a.HR);
        const columns = Object.keys(data[0] || {}).filter(col => col !== 'Year');
        return renderTable(sortedData, columns);
    };

    const renderPivotTable = (pivotData) => {
        const filteredYears = years.filter(year => year >= startYear && year <= endYear);
        const names = Object.keys(pivotData)
            .filter(name => selectedNames.length === 0 || selectedNames.includes(name))
            .filter(name => filteredYears.some(year => pivotData[name][year]?.[selectedPivotStat] > 0));

        const allValues = names.flatMap(name => filteredYears.map(year => pivotData[name][year]?.[selectedPivotStat] || 0));
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

        const reverseGradient = selectedPivotStat === 'CS' || selectedPivotStat === 'SO';

        return (
            <div className="scrollable-table">
                <table className="pivot-table" style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
                    <thead className="sticky-header">
                        <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                            <th style={{ border: '1px solid peru' }}>Name / Year</th>
                            {filteredYears.map(year => (
                                <th key={year} style={{ border: '1px solid peru' }}>{year}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {names.map(name => (
                            <tr key={name}>
                                <td style={{ border: '1px solid peru' }}>{name}</td>
                                {filteredYears.map(year => (
                                    <td key={year} style={{ border: '1px solid peru', backgroundColor: getGradientColor(pivotData[name][year]?.[selectedPivotStat] || 0, minValue, maxValue, reverseGradient) }}>
                                        {pivotData[name][year]?.[selectedPivotStat] || 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    const handleStartYearChange = (event) => {
        setStartYear(event.target.value);
    };

    const handleEndYearChange = (event) => {
        setEndYear(event.target.value);
    };

    const handleStatChange = (event) => {
        setSelectedStat(event.target.value);
    };

    const handleNameChange = (selectedOptions) => {
        setSelectedNames(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handlePivotStatChange = (selectedOptions) => {
        setSelectedPivotStat(selectedOptions ? selectedOptions.value : 'HR');
    };

    const nameOptions = Object.keys(pivotData).map(name => ({ value: name, label: name }));
    const statOptions = [
        { value: 'G', label: 'G' },
        { value: 'PA', label: 'PA' },
        { value: 'AB', label: 'AB' },
        { value: 'R', label: 'R' },
        { value: 'H', label: 'H' },
        { value: '2B', label: '2B' },
        { value: '3B', label: '3B' },
        { value: 'HR', label: 'HR' },
        { value: 'RBI', label: 'RBI' },
        { value: 'SB', label: 'SB' },
        { value: 'CS', label: 'CS' },
        { value: 'BB', label: 'BB' },
        { value: 'SO', label: 'SO' },
        { value: 'BA', label: 'BA' },
        { value: 'OBP', label: 'OBP' },
        { value: 'SLG', label: 'SLG' },
        { value: 'OPS', label: 'OPS' },
        { value: 'OPS+', label: 'OPS+' },
        { value: 'TB', label: 'TB' },
        { value: 'GDP', label: 'GDP' },
        { value: 'HBP', label: 'HBP' },
        { value: 'SH', label: 'SH' },
        { value: 'SF', label: 'SF' },
        { value: 'IBB', label: 'IBB' },
    ];

    const yearOptions = years.map(year => ({ value: year, label: year }));

    return (
        <div className="leaders-page">
            <a href="/PageStats" className="return-link">Return to Statistics Page</a>
            <h1>Baseball Leaderboards</h1>
            <p>View current season leaders and detailed statistics for key baseball players</p>
            <div className="leaders-container">
                <h2>MLB Baseball Leaders</h2>
                <div>
                    <label htmlFor="year-select">Select Year: </label>
                    <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="leaders-subcontainers">
                    <div className="leaders-subcontainer">
                        {renderTable(topHitsPlayers, ['Name', 'H'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topHRPlayers, ['Name', 'HR'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topBAPlayers, ['Name', 'BA'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topRBIPlayers, ['Name', 'RBI'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topRunsPlayers, ['Name', 'R'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topOPSPlusPlayers, ['Name', 'OPS+'])}
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
                                <option key={option.value} value={option.value}>{option.label}</option>
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
                            xaxis: { title: '' }, // Remove "Player" title
                            yaxis: { title: selectedStat },
                            width: 1000 // Increase the width by 25%
                        }}
                    />
                </div>
            </div>
            <div className="historical-statistics-container" style={{ border: '1px solid peru', padding: '20px', marginTop: '20px', textAlign: 'center' }}>
                <h2>Historical Statistics</h2>
                <div style={{ width: '50%', margin: '0 auto' }}>
                    <label htmlFor="start-year-select">Select Start Year: </label>
                    <select id="start-year-select" value={startYear} onChange={handleStartYearChange}>
                        {yearOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div style={{ width: '50%', margin: '0 auto' }}>
                    <label htmlFor="end-year-select">Select End Year: </label>
                    <select id="end-year-select" value={endYear} onChange={handleEndYearChange}>
                        {yearOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
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
                <p>Glossary for fundamental stats: The tables above provide comprehensive statistics for MLB players. These statistics are sourced from Sports-Reference.com</p>
                <p>2B -- Doubles Hit/Allowed</p>
                <p>3B -- Triples Hit/Allowed</p>
                <p>AB -- At Bats</p>
                <p>AV -- Approximate Value is our attempt to attach a single number to every player-season since 1960.</p>
                <p>Awards -- Summary of how player did in awards voting that year.</p>
                <p>BB -- Bases on Balls/Walks</p>
                <p>CS -- Caught Stealing</p>
                <p>G -- Games played</p>
                <p>GDP -- Double Plays Grounded Into</p>
                <p>H -- Hits/Hits Allowed</p>
                <p>HBP -- Times Hit by a Pitch</p>
                <p>HR -- Home Runs Hit/Allowed</p>
                <p>IBB -- Intentional Bases on Balls</p>
                <p>OBP -- (H + BB + HBP)/(At Bats + BB + HBP + SF)</p>
                <p>OPS -- On-Base + Slugging Percentages</p>
                <p>OPS+ -- OPS+</p>
                <p>PA -- Plate Appearances</p>
                <p>R -- Runs Scored/Allowed</p>
                <p>RBI -- Runs Batted In</p>
                <p>SB -- Stolen Bases</p>
                <p>SF -- Sacrifice Flies</p>
                <p>SH -- Sacrifice Hits (Sacrifice Bunts)</p>
                <p>SLG -- Total Bases/At Bats</p>
                <p>SO -- Strikeouts</p>
                <p>STL -- Steals Per Game</p>
                <p>TB -- Total Bases</p>
            </div>
        </div>
    );
}

export default PageLeaders;

