import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import './App.css';

const PageLeaders3 = () => {
    const [selectedYear, setSelectedYear] = useState(2024);
    const [selectedStat, setSelectedStat] = useState('PTS');
    const [topPointsPlayers, setTopPointsPlayers] = useState([]);
    const [topAssistsPlayers, setTopAssistsPlayers] = useState([]);
    const [topReboundsPlayers, setTopReboundsPlayers] = useState([]);
    const [topStealsPlayers, setTopStealsPlayers] = useState([]);
    const [topBlocksPlayers, setTopBlocksPlayers] = useState([]);
    const [topFGPercentagePlayers, setTopFGPercentagePlayers] = useState([]);
    const [fullTableData, setFullTableData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    useEffect(() => {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: process.env.REACT_APP_AWS_REGION
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'NBA_Season_Stats.xlsx' // Change the key to point to the NBA stats file
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

            const sortedPointsData = filteredData.sort((a, b) => b.PTS - a.PTS).slice(0, 5);
            setTopPointsPlayers(sortedPointsData);

            const sortedAssistsData = filteredData.sort((a, b) => b.AST - a.AST).slice(0, 5);
            setTopAssistsPlayers(sortedAssistsData);

            const sortedReboundsData = filteredData.sort((a, b) => b.REB - a.REB).slice(0, 5);
            setTopReboundsPlayers(sortedReboundsData);

            const sortedStealsData = filteredData.sort((a, b) => b.STL - a.STL).slice(0, 5);
            setTopStealsPlayers(sortedStealsData);

            const sortedBlocksData = filteredData.sort((a, b) => b.BLK - a.BLK).slice(0, 5);
            setTopBlocksPlayers(sortedBlocksData);

            const sortedFGPercentageData = filteredData.sort((a, b) => b["FG%"] - a["FG%"]).slice(0, 5);
            setTopFGPercentagePlayers(sortedFGPercentageData);

            setBarChartData(filteredData);
        });
    }, [selectedYear]);

    useEffect(() => {
        if (fullTableData.length > 0) {
            const sortedBarChartData = [...fullTableData].sort((a, b) => b[selectedStat] - a[selectedStat]);
            setBarChartData(sortedBarChartData);
        }
    }, [selectedStat, fullTableData]);

    const renderTable = (data, columns) => (
        <table className="leaders-table">
            <thead>
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
        const columns = Object.keys(data[0] || {}).filter(col => col !== 'Year');
        return renderTable(sortedData, columns);
    };

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    const handleStatChange = (event) => {
        setSelectedStat(event.target.value);
    };

    return (
        <div className="leaders-page">
            <h1>Basketball Leaderboards</h1>
            <p>View current season leaders and detailed statistics for key basketball players</p>
            <div className="leaders-container">
                <h2>NBA Basketball Leaders</h2>
                <div>
                    <label htmlFor="year-select">Select Year: </label>
                    <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                        <option value={2022}>2022</option>
                        <option value={2021}>2021</option>
                        <option value={2020}>2020</option>
                        <option value={2019}>2019</option>
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
                        {renderTable(topReboundsPlayers, ['Name', 'REB'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topStealsPlayers, ['Name', 'STL'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topBlocksPlayers, ['Name', 'BLK'])}
                    </div>
                    <div className="leaders-subcontainer">
                        {renderTable(topFGPercentagePlayers, ['Name', 'FG%'])}
                    </div>
                </div>
                <div className="scrollable-container">
                    {renderFullTable(fullTableData)}
                </div>
                <div className="bar-chart-container">
                    <div>
                        <label htmlFor="stat-select">Select Statistic: </label>
                        <select id="stat-select" value={selectedStat} onChange={handleStatChange}>
                            <option value="PTS">PTS</option>
                            <option value="AST">AST</option>
                            <option value="REB">REB</option>
                            <option value="STL">STL</option>
                            <option value="BLK">BLK</option>
                            <option value="FG%">FG%</option>
                            <option value="3P%">3P%</option>
                            <option value="FT%">FT%</option>
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
            <div className="glossary-container" style={{ textAlign: 'left' }}>
                <p>Glossary for fundamental stats: The tables above provide comprehensive statistics for NFL, NBA, and MLB players. These statistics are sourced from Sports-Reference.com</p>
                <p>1D -- First downs passing</p>
                <p>2B -- Doubles Hit/Allowed</p>
                <p>2P -- 2-Point Field Goals Per Game</p>
                <p>2PA -- 2-Point Field Goal Attempts Per Game</p>
                <p>2P% -- 2-Point Field Goal Percentage</p>
                <p>3B -- Triples Hit/Allowed</p>
                <p>3P -- 3-Point Field Goals Per Game</p>
                <p>3PA -- 3-Point Field Goal Attempts Per Game</p>
                <p>3P% -- 3-Point Field Goal Percentage</p>
                <p>4QC -- Comebacks led by quarterback.</p>
                <p>AB -- At Bats</p>
                <p>ANY/A -- Adjusted Net Yards per Pass Attempt</p>
                <p>AST -- Assists Per Game</p>
                <p>AV -- Approximate Value is our attempt to attach a single number to every player-season since 1960.</p>
                <p>AY/A -- Adjusted Yards gained per pass attempt</p>
                <p>Awards -- Summary of how player did in awards voting that year.</p>
                <p>BB -- Bases on Balls/Walks</p>
                <p>BLK -- Blocks Per Game</p>
                <p>Cmp% -- Percentage of Passes Completed</p>
                <p>CS -- Caught Stealing</p>
                <p>DRB -- Defensive Rebounds Per Game</p>
                <p>eFG% -- Effective Field Goal Percentage</p>
                <p>FG -- Field Goals Per Game</p>
                <p>FGA -- Field Goal Attempts Per Game</p>
                <p>FG% -- Field Goal Percentage</p>
                <p>FT -- Free Throws Per Game</p>
                <p>FTA -- Free Throw Attempts Per Game</p>
                <p>FT% -- Free Throw Percentage</p>
                <p>G -- Games played</p>
                <p>GDP -- Double Plays Grounded Into</p>
                <p>GS -- Games started as an offensive or defensive player</p>
                <p>GWD -- Game-winning drives led by quarterback.</p>
                <p>H -- Hits/Hits Allowed</p>
                <p>HBP -- Times Hit by a Pitch</p>
                <p>HR -- Home Runs Hit/Allowed</p>
                <p>IBB -- Intentional Bases on Balls</p>
                <p>Int -- Interceptions thrown</p>
                <p>Int% -- Percentage of Times Intercepted when Attempting to Pass</p>
                <p>MP -- Minutes Played Per Game</p>
                <p>NY/A -- Net Yards gained per pass attempt</p>
                <p>OBP -- (H + BB + HBP)/(At Bats + BB + HBP + SF)</p>
                <p>OPS -- On-Base + Slugging Percentages</p>
                <p>OPS+ -- OPS+</p>
                <p>ORB -- Offensive Rebounds Per Game</p>
                <p>PA -- Plate Appearances</p>
                <p>PF -- Personal Fouls Per Game</p>
                <p>PTS -- Points Per Game</p>
                <p>QBR -- NFL Quarterback Rating</p>
                <p>QBrec -- Team record in games started by this QB (regular season)</p>
                <p>R -- Runs Scored/Allowed</p>
                <p>RBI -- Runs Batted In</p>
                <p>SB -- Stolen Bases</p>
                <p>SF -- Sacrifice Flies</p>
                <p>SH -- Sacrifice Hits (Sacrifice Bunts)</p>
                <p>Sk% -- Percentage of Time Sacked when Attempting to Pass: Times Sacked / (Passes Attempted + Times Sacked)</p>
                <p>SLG -- Total Bases/At Bats</p>
                <p>SO -- Strikeouts</p>
                <p>STL -- Steals Per Game</p>
                <p>Succ% -- Passing Success Rate</p>
                <p>TB -- Total Bases</p>
                <p>TOV -- Turnovers Per Game</p>
                <p>TRB -- Total Rebounds Per Game</p>
                <p>TD% -- Percentage of Touchdowns Thrown when Attempting to Pass</p>
                <p>Y/A -- Yards gained per pass attempt</p>
                <p>Y/C -- Yards gained per pass completion (Passing Yards) / (Passes Completed)</p>
                <p>Y/G -- Yards gained per game played</p>
            </div>
        </div>
    );
}

export default PageLeaders3;
