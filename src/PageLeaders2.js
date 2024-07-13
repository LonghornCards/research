import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js';
import Plot from 'react-plotly.js'; // Ensure Plot is correctly imported
import './App.css';
import Select from 'react-select';

const PageLeaders2 = () => {
    const [selectedYear, setSelectedYear] = useState(2023);
    const [selectedStat, setSelectedStat] = useState('QBR');
    const [topQBRPlayers, setTopQBRPlayers] = useState([]);
    const [topYdsPlayers, setTopYdsPlayers] = useState([]);
    const [topCmpPlayers, setTopCmpPlayers] = useState([]);
    const [topYGPlayers, setTopYGPlayers] = useState([]);
    const [topTDPlayers, setTopTDPlayers] = useState([]);
    const [topYRPlayers, setTopYRPlayers] = useState([]);
    const [topRecPlayers, setTopRecPlayers] = useState([]);
    const [topCtchPlayers, setTopCtchPlayers] = useState([]);
    const [topSkPlayers, setTopSkPlayers] = useState([]);
    const [fullTableData, setFullTableData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [pivotData, setPivotData] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedPivotStat, setSelectedPivotStat] = useState('QBR');
    const [years, setYears] = useState([]);
    const [startYear, setStartYear] = useState('2005');
    const [endYear, setEndYear] = useState('2023');
    const [playerLinks, setPlayerLinks] = useState({});

    useEffect(() => {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: process.env.REACT_APP_AWS_REGION
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'NFL_Season_Stats.xlsx'
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const workbook = XLSX.read(data.Body, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const filteredData = jsonData.filter(row => row.Year && row.Year.toString().includes(selectedYear.toString()));
            setFullTableData(filteredData);

            const sortedQBRData = filteredData.sort((a, b) => b.QBR - a.QBR).slice(0, 5);
            setTopQBRPlayers(sortedQBRData);

            const sortedYdsData = filteredData.sort((a, b) => b.Yds - a.Yds).slice(0, 5);
            setTopYdsPlayers(sortedYdsData);

            const sortedCmpData = filteredData.sort((a, b) => b['Cmp%'] - a['Cmp%']).slice(0, 5);
            setTopCmpPlayers(sortedCmpData);

            const sortedYGData = filteredData.sort((a, b) => b['Y/G'] - a['Y/G']).slice(0, 5);
            setTopYGPlayers(sortedYGData);

            const sortedTDData = filteredData.sort((a, b) => b.TD - a.TD).slice(0, 5);
            setTopTDPlayers(sortedTDData);

            const filteredYRData = filteredData.filter(player => player['Y/R'] !== '');
            const sortedYRData = filteredYRData.sort((a, b) => b['Y/R'] - a['Y/R']).slice(0, 5);
            setTopYRPlayers(sortedYRData);

            const sortedRecData = filteredData.sort((a, b) => b.Rec - a.Rec).slice(0, 5);
            setTopRecPlayers(sortedRecData);

            const sortedCtchData = filteredData.sort((a, b) => b['Ctch%'] - a['Ctch%']).slice(0, 5);
            setTopCtchPlayers(sortedCtchData);

            const sortedSkData = filteredData.sort((a, b) => b.Sk - a.Sk).slice(0, 5);
            setTopSkPlayers(sortedSkData);

            setBarChartData(filteredData);

            const validYears = jsonData
                .map(row => row.Year)
                .filter(year => /^\d{4}/.test(year))
                .sort((a, b) => a - b);
            setYears([...new Set(validYears)]);

            const pivotData = jsonData.reduce((acc, row) => {
                const { Year, Name, ...stats } = row;
                const yearValue = Year ? Year.toString().substring(0, 4) : Year;
                if (!acc[Name]) acc[Name] = {};
                acc[Name][yearValue] = stats;
                return acc;
            }, {});
            setPivotData(pivotData);
        });
    }, [selectedYear]);

    useEffect(() => {
        if (fullTableData.length > 0) {
            const sortedBarChartData = [...fullTableData]
                .filter(player => player[selectedStat] !== undefined && player[selectedStat] !== '')
                .sort((a, b) => b[selectedStat] - a[selectedStat]);
            setBarChartData(sortedBarChartData);
        }
    }, [selectedStat, fullTableData]);

    useEffect(() => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'NFL_Season_Stats.xlsx'
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const workbook = XLSX.read(data.Body, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const validYears = jsonData
                .map(row => row.Year)
                .filter(year => /^\d{4}/.test(year))
                .sort((a, b) => a - b);
            setYears([...new Set(validYears)]);

            const pivotData = jsonData.reduce((acc, row) => {
                const { Year, Name, ...stats } = row;
                const yearValue = Year ? Year.toString().substring(0, 4) : Year;
                if (!acc[Name]) acc[Name] = {};
                acc[Name][yearValue] = stats;
                return acc;
            }, {});
            setPivotData(pivotData);
        });
    }, [startYear, endYear]);

    const loadCompositeRanks = async () => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'Composite_Ranks.xlsx'
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const workbook = XLSX.read(data.Body, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            const fuse = new Fuse(jsonData, {
                keys: ['Name'],
                threshold: 0.3
            });

            const links = {};
            fullTableData.forEach(player => {
                const result = fuse.search(player.Name);
                if (result.length > 0) {
                    links[player.Name] = `/PageSnapshot?player=${encodeURIComponent(player.Name)}`;
                }
            });
            setPlayerLinks(links);
        });
    };

    useEffect(() => {
        loadCompositeRanks();
    }, [fullTableData]);

    const getGradientColor = (value, min, max, reverse) => {
        if (value === 0 || isNaN(value)) return 'lightgray';
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
                                {column === 'Name' && playerLinks[player.Name] ? (
                                    <a href={playerLinks[player.Name]}>{player[column]}</a>
                                ) : (
                                    player[column]
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderFullTable = (data) => {
        const sortedData = [...data].sort((a, b) => b.QBR - a.QBR);
        const columns = Object.keys(data[0] || {}).filter(col => col !== 'Year');
        return renderTable(sortedData, columns);
    };

    const renderPivotTable = (pivotData) => {
        const filteredYears = years.filter(year => year >= startYear && year <= endYear);
        const names = Object.keys(pivotData)
            .filter(name => selectedNames.length === 0 || selectedNames.includes(name))
            .filter(name => filteredYears.some(year => pivotData[name][year]));

        const allValuesByYear = filteredYears.map(year =>
            names.map(name => parseFloat(pivotData[name][year]?.[selectedPivotStat]) || 0)
        );

        const minMaxValuesByYear = allValuesByYear.map(values => ({
            min: Math.min(...values),
            max: Math.max(...values),
        }));

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
                        {names.filter(name => filteredYears.some(year => parseFloat(pivotData[name][year]?.[selectedPivotStat]) > 0)).map(name => (
                            <tr key={name}>
                                <td style={{ border: '1px solid peru' }}>
                                    {playerLinks[name] ? <a href={playerLinks[name]}>{name}</a> : name}
                                </td>
                                {filteredYears.map((year, index) => (
                                    <td key={year} style={{ border: '1px solid peru', backgroundColor: getGradientColor(parseFloat(pivotData[name][year]?.[selectedPivotStat]) || 0, minMaxValuesByYear[index].min, minMaxValuesByYear[index].max, reverseGradient) }}>
                                        {isNaN(pivotData[name][year]?.[selectedPivotStat]) || pivotData[name][year]?.[selectedPivotStat] === 0 || isNaN(parseFloat(pivotData[name][year]?.[selectedPivotStat])) ? 'N/A' : pivotData[name][year]?.[selectedPivotStat]}
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
        setSelectedPivotStat(selectedOptions ? selectedOptions.value : 'QBR');
    };

    const nameOptions = Object.keys(pivotData).map(name => ({ value: name, label: name }));
    const statOptions = [
        { value: 'G', label: 'G' },
        { value: 'GS', label: 'GS' },
        { value: 'QBrec', label: 'QBrec' },
        { value: 'Cmp', label: 'Cmp' },
        { value: 'Att', label: 'Att' },
        { value: 'Cmp%', label: 'Cmp%' },
        { value: 'Yds', label: 'Yds' },
        { value: 'TD', label: 'TD' },
        { value: 'TD%', label: 'TD%' },
        { value: 'Int', label: 'Int' },
        { value: 'Int%', label: 'Int%' },
        { value: '1D', label: '1D' },
        { value: 'Succ%', label: 'Succ%' },
        { value: 'Lng', label: 'Lng' },
        { value: 'Y/A', label: 'Y/A' },
        { value: 'AY/A', label: 'AY/A' },
        { value: 'Y/C', label: 'Y/C' },
        { value: 'Y/G', label: 'Y/G' },
        { value: 'Rate', label: 'Rate' },
        { value: 'QBR', label: 'QBR' },
        { value: 'Sk', label: 'Sk' },
        { value: 'Sk%', label: 'Sk%' },
        { value: 'NY/A', label: 'NY/A' },
        { value: 'ANY/A', label: 'ANY/A' },
        { value: '4QC', label: '4QC' },
        { value: 'GWD', label: 'GWD' },
        { value: 'AV', label: 'AV' },
        { value: 'Tgt', label: 'Tgt' },
        { value: 'Rec', label: 'Rec' },
        { value: 'Y/R', label: 'Y/R' },
        { value: 'R/G', label: 'R/G' },
        { value: 'Ctch%', label: 'Ctch%' },
        { value: 'Y/Tgt', label: 'Y/Tgt' },
        { value: 'A/G', label: 'A/G' },
        { value: 'Touch', label: 'Touch' },
        { value: 'Y/Tch', label: 'Y/Tch' },
        { value: 'YScm', label: 'YScm' },
        { value: 'RRTD', label: 'RRTD' },
        { value: 'Fmb', label: 'Fmb' },
    ];

    const yearOptions = years.map(year => ({ value: year, label: year }));

    return (
        <div className="leaders-page">
            <a href="/PageStats" className="return-link">Return to Statistics Page</a>
            <h1>Football Leaderboards</h1>
            <p>View current season leaders and detailed statistics for key football players</p>
            <div className="leaders-container">
                <h2>NFL Football Leaders</h2>
                <div>
                    <label htmlFor="year-select">Select Year: </label>
                    <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                        {yearOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="leaders-subcontainers">
                    <div className="leaders-subcontainer">
                        {renderTable(topQBRPlayers, ['Name', 'QBR'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topYdsPlayers, ['Name', 'Yds'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topCmpPlayers, ['Name', 'Cmp%'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topYGPlayers, ['Name', 'Y/G'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topTDPlayers, ['Name', 'TD'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topYRPlayers, ['Name', 'Y/R'])}
                    </div>
                </div>
                <div className="leaders-subcontainers">
                    <div className="leaders-subcontainer">
                        {renderTable(topRecPlayers, ['Name', 'Rec'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topCtchPlayers, ['Name', 'Ctch%'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topSkPlayers, ['Name', 'Sk'])}
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
                <p>Glossary for fundamental stats: The tables above provide comprehensive statistics for NFL players. These statistics are sourced from Sports-Reference.com</p>
                <p>G -- Games played</p>
                <p>GS -- Games started</p>
                <p>QBrec -- Quarterback record as starter</p>
                <p>Cmp -- Completions</p>
                <p>Att -- Pass attempts</p>
                <p>Cmp% -- Completion percentage</p>
                <p>Yds -- Passing yards</p>
                <p>TD -- Passing touchdowns</p>
                <p>TD% -- Touchdown percentage</p>
                <p>Int -- Interceptions</p>
                <p>Int% -- Interception percentage</p>
                <p>1D -- First downs</p>
                <p>Succ% -- Success percentage</p>
                <p>Lng -- Longest pass</p>
                <p>Y/A -- Yards per attempt</p>
                <p>AY/A -- Adjusted yards per attempt</p>
                <p>Y/C -- Yards per completion</p>
                <p>Y/G -- Yards per game</p>
                <p>Rate -- Passer rating</p>
                <p>QBR -- Total quarterback rating</p>
                <p>Sk -- Sacks</p>
                <p>Sk% -- Sack percentage</p>
                <p>NY/A -- Net yards per pass attempt</p>
                <p>ANY/A -- Adjusted net yards per pass attempt</p>
                <p>4QC -- Fourth quarter comebacks</p>
                <p>GWD -- Game-winning drives</p>
                <p>AV -- Approximate value</p>
                <p>Tgt -- Targets</p>
                <p>Rec -- Receptions</p>
                <p>Y/R -- Yards per reception</p>
                <p>R/G -- Receptions per game</p>
                <p>Ctch% -- Catch percentage</p>
                <p>Y/Tgt -- Yards per target</p>
                <p>A/G -- Assists per game</p>
                <p>Touch -- Touches</p>
                <p>Y/Tch -- Yards per touch</p>
                <p>YScm -- Yards from scrimmage</p>
                <p>RRTD -- Rushing/receiving touchdowns</p>
                <p>Fmb -- Fumbles</p>
            </div>
        </div>
    );
}

export default PageLeaders2;


