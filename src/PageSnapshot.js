import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import Fuse from 'fuse.js';
import './App.css';

const PageSnapshot = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const playerName = queryParams.get('player');
    const [playerData, setPlayerData] = useState(null);
    const [compositeData, setCompositeData] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [sportsData, setSportsData] = useState(null);
    const [dateValues, setDateValues] = useState([]);
    const [previousYearValue, setPreviousYearValue] = useState(null);

    useEffect(() => {
        if (playerName) {
            fetchPlayerData(playerName);
            fetchCompositeData(playerName);
            fetchTrendData(playerName);
        }
    }, [playerName]);

    const fetchPlayerData = async (player) => {
        try {
            const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Player_Index_Returns.xlsx', {
                responseType: 'arraybuffer',
            });

            const data = new Uint8Array(response.data);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const playerInfo = worksheet.find(row => row.Player === player);

            if (playerInfo) {
                setPlayerData(playerInfo);

                // Extract date columns
                const dateColumns = Object.keys(playerInfo).filter(key => {
                    const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                    return datePattern.test(key) && new Date(key) >= new Date('12/31/2023');
                });

                const values = dateColumns.map(date => ({
                    date,
                    value: playerInfo[date]
                })).reverse();

                setDateValues(values);
                setPreviousYearValue(playerInfo['12/31/2022']);
            } else {
                setPlayerData(null);
                setDateValues([]);
                setPreviousYearValue(null);
            }
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    };

    const fetchCompositeData = async (player) => {
        try {
            const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Composite_Ranks.xlsx', {
                responseType: 'arraybuffer',
            });

            const data = new Uint8Array(response.data);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const playerInfo = worksheet.find(row => row.Name === player);

            if (playerInfo) {
                setCompositeData(playerInfo);
            } else {
                setCompositeData(null);
            }
        } catch (error) {
            console.error('Error fetching composite data:', error);
        }
    };

    const fetchTrendData = async (player) => {
        try {
            const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_ALL.xlsx', {
                responseType: 'arraybuffer',
            });

            const data = new Uint8Array(response.data);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Fuzzy search for player name
            const fuse = new Fuse(worksheet, {
                keys: ['PLAYER'],
                threshold: 0.3
            });

            const result = fuse.search(player);

            if (result.length > 0) {
                const playerInfo = result[0].item;

                // Extract date columns starting from January 2021
                const dateColumns = Object.keys(playerInfo).filter(key => {
                    const datePattern = /^[0-9]{2}-[A-Za-z]+$/;
                    return datePattern.test(key);
                });

                const values = dateColumns.map(date => ({
                    date,
                    value: playerInfo[date]
                }));

                setTrendData(values);
            } else {
                setTrendData([]);
            }
        } catch (error) {
            console.error('Error fetching trend data:', error);
        }
    };

    const fetchSportsData = async (player, sport) => {
        let url = '';
        if (sport === 'Football') {
            url = 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NFL_Stats.xlsx';
        } else if (sport === 'Basketball') {
            url = 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NBA_Stats.xlsx';
        } else if (sport === 'Baseball') {
            url = 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/MLB_Stats.xlsx';
        }

        if (url) {
            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                });

                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                // Fuzzy search for player name
                const fuse = new Fuse(worksheet, {
                    keys: ['Name'],
                    threshold: 0.3
                });

                const result = fuse.search(player);

                if (result.length > 0) {
                    const playerInfo = result[0].item;
                    setSportsData(playerInfo);
                } else {
                    setSportsData(null);
                }
            } catch (error) {
                console.error('Error fetching sports data:', error);
            }
        }
    };

    useEffect(() => {
        if (playerData && playerData.Sport) {
            fetchSportsData(playerName, playerData.Sport);
        }
    }, [playerData]);

    const calculatePercentage = (current, reference) => {
        if (reference === 0) return 'N/A';
        return ((current - reference) / reference * 100).toFixed(2) + '%';
    };

    const getRankColor = (rank) => {
        if (rank < 25) return 'red';
        if (rank >= 25 && rank < 50) return 'indianred';
        if (rank >= 50 && rank < 75) return 'green';
        if (rank >= 75 && rank <= 100) return 'limegreen';
        return 'black';
    };

    const getTrendColor = (trend) => {
        if (trend === 'Strong Downtrend') return 'red';
        if (trend === 'Downtrend') return 'indianred';
        if (trend === 'Uptrend') return 'green';
        if (trend === 'Strong Uptrend') return 'limegreen';
        return 'black';
    };

    const getStyleForRank = (text, value) => {
        if (text.includes('Rank')) {
            return { color: getRankColor(value) };
        }
        return {};
    };

    const getPercentageStyle = (value) => {
        if (parseFloat(value) < 0) return { color: 'red' };
        if (parseFloat(value) > 0) return { color: 'green' };
        return {};
    };

    return (
        <div className="page-snapshot" style={{ paddingTop: '60px' }}>
            <h1 className="page-title">Player Snapshot</h1>
            <p className="page-description">
                Below are the snapshots of various player statistics across different categories.
            </p>
            <div className="stat-container">
                {playerName && (
                    <div className="stat-category" style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1 }}>
                            <h2 className="category-title">{playerName}</h2>
                            {playerData ? (
                                <div className="player-data" style={{ display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                        <p><strong>Sport:</strong> {playerData.Sport}</p>
                                        <p><strong>Status:</strong> {playerData.Status}</p>
                                        <p><strong>Current:</strong> {playerData.Current}</p>
                                        <p><strong>High:</strong> {playerData.High}</p>
                                        <p><strong>Low:</strong> {playerData.Low}</p>
                                        <p><strong>Average:</strong> {playerData.Average}</p>
                                        <p><strong>Open:</strong> {playerData.Open}</p>
                                        <p><strong>1-Yr Average:</strong> {playerData['1-Yr Average']}</p>
                                        <p><strong>3-Mo Average:</strong> {playerData['3-Mo Average']}</p>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p><strong>% from High:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData.High))}>{calculatePercentage(playerData.Current, playerData.High)}</span></p>
                                        <p><strong>% from Low:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData.Low))}>{calculatePercentage(playerData.Current, playerData.Low)}</span></p>
                                        <p><strong>% from Avg:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData.Average))}>{calculatePercentage(playerData.Current, playerData.Average)}</span></p>
                                        <p><strong>% from 1-Yr Avg:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData['1-Yr Average']))}>{calculatePercentage(playerData.Current, playerData['1-Yr Average'])}</span></p>
                                        <p><strong>% from 3-Mo Avg:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData['3-Mo Average']))}>{calculatePercentage(playerData.Current, playerData['3-Mo Average'])}</span></p>
                                        <p><strong>3-Mo Return:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData['3-Mo Average']))}>{calculatePercentage(playerData.Current, playerData['3-Mo Average'])}</span></p>
                                        <p><strong>6-Mo Return:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData['12/31/2023']))}>{calculatePercentage(playerData.Current, playerData['12/31/2023'])}</span></p>
                                        <p><strong>Year-to-Date Return:</strong> <span style={getPercentageStyle(calculatePercentage(playerData.Current, playerData['12/31/2023']))}>{calculatePercentage(playerData.Current, playerData['12/31/2023'])}</span></p>
                                        <p><strong>2023 Return:</strong> <span style={getPercentageStyle(calculatePercentage(playerData['12/31/2023'], previousYearValue))}>{calculatePercentage(playerData['12/31/2023'], previousYearValue)}</span></p>
                                    </div>
                                </div>
                            ) : (
                                <p>No data found for {playerName}</p>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            {dateValues.length > 0 && (
                                <Plot
                                    data={[
                                        {
                                            x: dateValues.map(d => d.date),
                                            y: dateValues.map(d => d.value),
                                            type: 'scatter',
                                            mode: 'lines+markers',
                                            marker: { color: 'blue' },
                                        },
                                    ]}
                                    layout={{ title: 'Player Performance Over Time', xaxis: { title: 'Date' }, yaxis: { title: 'Value' } }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="stat-container">
                <h2 className="category-title">Composite Ranks</h2>
                {playerName && compositeData ? (
                    <div className="stat-category" style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                                        <th style={{ border: '1px solid peru', padding: '8px' }}>Metric</th>
                                        <th style={{ border: '1px solid peru', padding: '8px' }}>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ border: '1px solid peru', padding: '8px' }}><strong>Composite Rank</strong></td>
                                        <td style={{ border: '1px solid peru', padding: '8px', color: getRankColor(compositeData['Composite Rank']) }}>
                                            {compositeData['Composite Rank']}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid peru', padding: '8px' }}><strong>Fundamental Rank</strong></td>
                                        <td style={{ border: '1px solid peru', padding: '8px', color: getRankColor(compositeData['Fundamental Rank']) }}>
                                            {compositeData['Fundamental Rank']}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid peru', padding: '8px' }}><strong>Technical Rank</strong></td>
                                        <td style={{ border: '1px solid peru', padding: '8px', color: getRankColor(compositeData['Technical Rank']) }}>
                                            {compositeData['Technical Rank']}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid peru', padding: '8px' }}><strong>Sentiment Rank</strong></td>
                                        <td style={{ border: '1px solid peru', padding: '8px', color: getRankColor(compositeData['Sentiment Rank']) }}>
                                            {compositeData['Sentiment Rank']}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ border: '1px solid peru', padding: '8px' }}><strong>Trend</strong></td>
                                        <td style={{ border: '1px solid peru', padding: '8px', color: getTrendColor(compositeData.Trend) }}>
                                            {compositeData.Trend}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ flex: 1 }}>
                            {trendData.length > 0 ? (
                                <Plot
                                    data={[
                                        {
                                            x: trendData.map(d => d.date),
                                            y: trendData.map(d => d.value),
                                            type: 'scatter',
                                            mode: 'lines+markers',
                                            marker: { color: 'green' },
                                        },
                                    ]}
                                    layout={{ title: 'Google Trends Over Time', xaxis: { title: 'Date' }, yaxis: { title: 'Trend Value' } }}
                                />
                            ) : (
                                <Plot
                                    data={[]}
                                    layout={{ title: 'Google Trends Over Time', xaxis: { title: 'Date' }, yaxis: { title: 'Trend Value' } }}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <p>No composite rank data found for {playerName}</p>
                )}
            </div>
            <div className="stat-container">
                <h2 className="category-title">Sport Statistics</h2>
                {playerName && sportsData ? (
                    <div className="stat-category" style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                                        <th style={{ border: '1px solid peru', padding: '8px' }}>Metric</th>
                                        <th style={{ border: '1px solid peru', padding: '8px' }}>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(sportsData).map(key => (
                                        <tr key={key}>
                                            <td style={{ border: '1px solid peru', padding: '8px' }}><strong>{key}</strong></td>
                                            <td style={{ border: '1px solid peru', padding: '8px', ...getStyleForRank(key, sportsData[key]) }}>
                                                {sportsData[key]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p>No sports data found for {playerName}</p>
                )}
            </div>
            <div className="stat-container">
                <h2 className="category-title">Glossary</h2>
                <p className="page-description left-align">
                    The Longhorn Cards Player Scoreboard incorporates historical player card prices (Technical Rank), player career statistics aggregated for all seasons played (Fundamental Rank), and Google Trends interest/popularity (Sentiment Rank). Glossary for fundamental stats: The tables above provide comprehensive statistics for NFL, NBA, and MLB players. These statistics are sourced from Sports-Reference.com as of April 2024.
                </p>
                <p className="page-description left-align">
                    <strong>1D</strong> -- First downs passing<br />
                    <strong>2B</strong> -- Doubles Hit/Allowed<br />
                    <strong>2P</strong> -- 2-Point Field Goals Per Game<br />
                    <strong>2PA</strong> -- 2-Point Field Goal Attempts Per Game<br />
                    <strong>2P%</strong> -- 2-Point Field Goal Percentage<br />
                    <strong>3B</strong> -- Triples Hit/Allowed<br />
                    <strong>3P</strong> -- 3-Point Field Goals Per Game<br />
                    <strong>3PA</strong> -- 3-Point Field Goal Attempts Per Game<br />
                    <strong>3P%</strong> -- 3-Point Field Goal Percentage<br />
                    <strong>4QC</strong> -- Comebacks led by quarterback.<br />
                    <strong>AB</strong> -- At Bats<br />
                    <strong>ANY/A</strong> -- Adjusted Net Yards per Pass Attempt<br />
                    <strong>AST</strong> -- Assists Per Game<br />
                    <strong>AV</strong> -- Approximate Value is our attempt to attach a single number to every player-season since 1960.<br />
                    <strong>AY/A</strong> -- Adjusted Yards gained per pass attempt<br />
                    <strong>Awards</strong> -- Summary of how player did in awards voting that year.<br />
                    <strong>BB</strong> -- Bases on Balls/Walks<br />
                    <strong>BLK</strong> -- Blocks Per Game<br />
                    <strong>Cmp%</strong> -- Percentage of Passes Completed<br />
                    <strong>CS</strong> -- Caught Stealing<br />
                    <strong>DRB</strong> -- Defensive Rebounds Per Game<br />
                    <strong>eFG%</strong> -- Effective Field Goal Percentage<br />
                    <strong>FG</strong> -- Field Goals Per Game<br />
                    <strong>FGA</strong> -- Field Goal Attempts Per Game<br />
                    <strong>FG%</strong> -- Field Goal Percentage<br />
                    <strong>FT</strong> -- Free Throws Per Game<br />
                    <strong>FTA</strong> -- Free Throw Attempts Per Game<br />
                    <strong>FT%</strong> -- Free Throw Percentage<br />
                    <strong>G</strong> -- Games played<br />
                    <strong>GDP</strong> -- Double Plays Grounded Into<br />
                    <strong>GS</strong> -- Games started as an offensive or defensive player<br />
                    <strong>GWD</strong> -- Game-winning drives led by quarterback.<br />
                    <strong>H</strong> -- Hits/Hits Allowed<br />
                    <strong>HBP</strong> -- Times Hit by a Pitch<br />
                    <strong>HR</strong> -- Home Runs Hit/Allowed<br />
                    <strong>IBB</strong> -- Intentional Bases on Balls<br />
                    <strong>Int</strong> -- Interceptions thrown<br />
                    <strong>Int%</strong> -- Percentage of Times Intercepted when Attempting to Pass<br />
                    <strong>MP</strong> -- Minutes Played Per Game<br />
                    <strong>NY/A</strong> -- Net Yards gained per pass attempt<br />
                    <strong>OBP</strong> -- (H + BB + HBP)/(At Bats + BB + HBP + SF)<br />
                    <strong>OPS</strong> -- On-Base + Slugging Percentages<br />
                    <strong>OPS+</strong> -- OPS+<br />
                    <strong>ORB</strong> -- Offensive Rebounds Per Game<br />
                    <strong>PA</strong> -- Plate Appearances<br />
                    <strong>PF</strong> -- Personal Fouls Per Game<br />
                    <strong>PTS</strong> -- Points Per Game<br />
                    <strong>QBR</strong> -- NFL Quarterback Rating<br />
                    <strong>QBrec</strong> -- Team record in games started by this QB (regular season)<br />
                    <strong>R</strong> -- Runs Scored/Allowed<br />
                    <strong>RBI</strong> -- Runs Batted In<br />
                    <strong>SB</strong> -- Stolen Bases<br />
                    <strong>SF</strong> -- Sacrifice Flies<br />
                    <strong>SH</strong> -- Sacrifice Hits (Sacrifice Bunts)<br />
                    <strong>Sk%</strong> -- Percentage of Time Sacked when Attempting to Pass: Times Sacked / (Passes Attempted + Times Sacked)<br />
                    <strong>SLG</strong> -- Total Bases/At Bats<br />
                    <strong>SO</strong> -- Strikeouts<br />
                    <strong>STL</strong> -- Steals Per Game<br />
                    <strong>Succ%</strong> -- Passing Success Rate<br />
                    <strong>TB</strong> -- Total Bases<br />
                    <strong>TOV</strong> -- Turnovers Per Game<br />
                    <strong>TRB</strong> -- Total Rebounds Per Game<br />
                    <strong>TD%</strong> -- Percentage of Touchdowns Thrown when Attempting to Pass<br />
                    <strong>Y/A</strong> -- Yards gained per pass attempt<br />
                    <strong>Y/C</strong> -- Yards gained per pass completion (Passing Yards) / (Passes Completed)<br />
                    <strong>Y/G</strong> -- Yards gained per game played<br />
                </p>
            </div>
        </div>
    );
};

export default PageSnapshot;
