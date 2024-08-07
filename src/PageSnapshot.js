import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import Fuse from 'fuse.js';
import './App.css';
import { Helmet } from 'react-helmet';


const PageSnapshot = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const playerName = queryParams.get('player');
    const [playerData, setPlayerData] = useState(null);
    const [compositeData, setCompositeData] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [sportsData, setSportsData] = useState(null);
    const [detailedStats, setDetailedStats] = useState(null);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [dateValues, setDateValues] = useState([]);
    const [previousYearValue, setPreviousYearValue] = useState(null);
    const [rebase, setRebase] = useState(false);
    const [wikiSummary, setWikiSummary] = useState('');
    const [wikiIntroduction, setWikiIntroduction] = useState('');
    const [wikiInfobox, setWikiInfobox] = useState('');
    const [wikiImage, setWikiImage] = useState(null);
    const [playerNames, setPlayerNames] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(playerName || 'Patrick Mahomes');

    useEffect(() => {
        fetchPlayerNames();
    }, []);

    useEffect(() => {
        if (selectedPlayer) {
            fetchPlayerData(selectedPlayer);
            fetchCompositeData(selectedPlayer);
            fetchTrendData(selectedPlayer);
            fetchWikipediaData(selectedPlayer);
        }
    }, [selectedPlayer]);

    useEffect(() => {
        if (playerData && playerData.Sport) {
            fetchSportsData(selectedPlayer, playerData.Sport);
            fetchDetailedStats(selectedPlayer, playerData.Sport, selectedYear);
        }
    }, [playerData, selectedYear]);

    const fetchPlayerNames = async () => {
        try {
            const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Composite_Ranks.xlsx', {
                responseType: 'arraybuffer',
            });

            const data = new Uint8Array(response.data);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            const names = worksheet.map(row => row.Name);
            setPlayerNames(names);
        } catch (error) {
            console.error('Error fetching player names:', error);
        }
    };

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

            const fuse = new Fuse(worksheet, {
                keys: ['Name'],
                threshold: 0.3
            });

            const result = fuse.search(player);

            if (result.length > 0) {
                const playerInfo = result[0].item;
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

            const fuse = new Fuse(worksheet, {
                keys: ['PLAYER'],
                threshold: 0.3
            });

            const result = fuse.search(player);

            if (result.length > 0) {
                const playerInfo = result[0].item;

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

    const fetchDetailedStats = async (player, sport, year) => {
        let url = '';
        let filterColumn = 'Year';
        let defaultFilterValue = 'Career';

        if (sport === 'Football') {
            url = 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NFL_Season_Stats.xlsx';
            filterColumn = 'Year';
            defaultFilterValue = 'Career';
        } else if (sport === 'Basketball') {
            url = 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NBA_Season_Stats.xlsx';
            filterColumn = 'Season';
            defaultFilterValue = 'Career';
        } else if (sport === 'Baseball') {
            url = 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/MLB_Season_Stats.xlsx';
            filterColumn = 'Year';
            defaultFilterValue = '162 Game Avg.';
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

                const fuse = new Fuse(worksheet, {
                    keys: ['Name'],
                    threshold: 0.3
                });

                const result = fuse.search(player);

                if (result.length > 0) {
                    const playerInfo = result[0].item;

                    let availableYears = [...new Set(worksheet.filter(row => row.Name === playerInfo.Name).map(row => row[filterColumn]))];
                    availableYears = availableYears.filter(year => year !== defaultFilterValue).sort((a, b) => parseInt(a) - parseInt(b));
                    availableYears.unshift(defaultFilterValue);
                    setAvailableYears(availableYears);
                    setSelectedYear(defaultFilterValue);

                    const yearStats = worksheet.filter(row => row[filterColumn] === (year || defaultFilterValue) && row.Name === playerInfo.Name);

                    if (yearStats.length > 0) {
                        setDetailedStats(yearStats[0]);
                    } else {
                        setDetailedStats(null);
                    }
                } else {
                    setDetailedStats(null);
                }
            } catch (error) {
                console.error('Error fetching detailed stats:', error);
            }
        }
    };

    const fetchWikipediaData = async (player) => {
        try {
            const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(player)}`);
            const data = response.data;

            setWikiSummary(data.extract);
            setWikiImage(data.thumbnail ? data.thumbnail.source : null);

            const contentResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(player)}`);
            const parser = new DOMParser();
            const doc = parser.parseFromString(contentResponse.data, 'text/html');
            const infoboxElement = doc.querySelector('.infobox');

            if (infoboxElement) {
                const links = infoboxElement.querySelectorAll('a');
                links.forEach(link => {
                    link.replaceWith(link.textContent);
                });
            }

            setWikiInfobox(infoboxElement ? infoboxElement.outerHTML : 'No infobox found.');
            const introElement = doc.querySelector('.mw-parser-output > p');
            setWikiIntroduction(introElement ? introElement.textContent : '');
        } catch (error) {
            console.error('Error fetching Wikipedia data:', error);
            setWikiSummary('No Wikipedia summary found.');
            setWikiImage(null);
            setWikiInfobox('No infobox found.');
            setWikiIntroduction('No introduction found.');
        }
    };

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

    const divideSportsData = (data) => {
        const keys = Object.keys(data);
        const half = Math.ceil(keys.length / 2);
        const firstHalf = keys.slice(0, half);
        const secondHalf = keys.slice(half);
        return [firstHalf, secondHalf];
    };

    const rebaseValues = (values) => {
        if (values.length === 0) return [];
        const baseValue = values[0].value;
        return values.map(item => ({
            date: item.date,
            value: (item.value / baseValue) * 100
        }));
    };

    const handleYearChange = async (event) => {
        const selectedYear = event.target.value;
        setSelectedYear(selectedYear);
        if (playerData && playerData.Sport) {
            await fetchDetailedStats(selectedPlayer, playerData.Sport, selectedYear);
        }
    };

    const handlePlayerChange = (event) => {
        const newPlayer = event.target.value;
        setSelectedPlayer(newPlayer);
        navigate(`?player=${newPlayer}`);
    };

    return (
        <div className="page-snapshot" style={{ paddingTop: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Helmet>
                    <title>Player Snapshot</title>
                </Helmet>
                <h1 className="page-title">{`Player Snapshot${selectedPlayer ? `: ${selectedPlayer}` : ''}`}</h1>
                {wikiImage && <img className="player-image" src={wikiImage} alt={`${selectedPlayer} profile`} style={{ maxHeight: '150px', marginLeft: '20px', objectFit: 'contain' }} />}
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="player-select">Select Player: </label>
                <select id="player-select" value={selectedPlayer} onChange={handlePlayerChange}>
                    {playerNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>
            <p className="page-description">
                Below are the snapshots of various player statistics across different categories.
            </p>
            <div className="stat-container">
                {selectedPlayer && (
                    <div className="stat-category" style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1 }}>
                            <h2 className="category-title">{selectedPlayer}</h2>
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
                                <p>No data found for {selectedPlayer}</p>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={rebase}
                                        onChange={() => setRebase(!rebase)}
                                    />
                                    Rebase to 100
                                </label>
                            </div>
                            {dateValues.length > 0 && (
                                <Plot
                                    data={[
                                        {
                                            x: dateValues.map(d => d.date),
                                            y: rebase ? rebaseValues(dateValues).map(d => d.value) : dateValues.map(d => d.value),
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
                {selectedPlayer && compositeData ? (
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
                                        <td style={{ border: '1px solid peru', padding: '8px', color: getTrendColor(compositeData['Trend']) }}>
                                            {compositeData['Trend']}
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
                    <p>No composite rank data found for {selectedPlayer}</p>
                )}
            </div>
            <div className="stat-container">
                <h2 className="category-title">Sport Statistics</h2>
                {selectedPlayer && sportsData ? (
                    <div className="stat-category" style={{ display: 'flex', flexDirection: 'row' }}>
                        {divideSportsData(sportsData).map((halfData, index) => (
                            <div key={index} style={{ flex: 1 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                                            <th style={{ border: '1px solid peru', padding: '8px' }}>Metric</th>
                                            <th style={{ border: '1px solid peru', padding: '8px' }}>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {halfData.map(key => (
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
                        ))}
                    </div>
                ) : (
                    <p>No sports data found for {selectedPlayer}</p>
                )}
            </div>
            <div className="stat-container" style={{ border: '1px solid peru', padding: '20px' }}>
                <h2 className="category-title">Player Profile</h2>
                <p className="page-description left-align">
                    {wikiSummary}
                </p>
                <p className="page-description left-align">
                    {wikiIntroduction}
                </p>
            </div>
            <div className="stat-container">
                <h2 className="category-title">Detailed Statistics</h2>
                {availableYears.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="year-select">Select Year: </label>
                        <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedPlayer && detailedStats ? (
                    <div className="stat-category" style={{ display: 'flex', flexDirection: 'row' }}>
                        {divideSportsData(detailedStats).map((halfData, index) => (
                            <div key={index} style={{ flex: 1 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                                            <th style={{ border: '1px solid peru', padding: '8px' }}>Metric</th>
                                            <th style={{ border: '1px solid peru', padding: '8px' }}>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {halfData.map(key => (
                                            <tr key={key}>
                                                <td style={{ border: '1px solid peru', padding: '8px' }}><strong>{key}</strong></td>
                                                <td style={{ border: '1px solid peru', padding: '8px', ...getStyleForRank(key, detailedStats[key]) }}>
                                                    {detailedStats[key]}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No detailed statistics found for {selectedPlayer}</p>
                )}
            </div>
            <div className="stat-container" style={{ border: '1px solid peru', padding: '20px', textAlign: 'center' }}>
                <h2 className="category-title">Infobox</h2>
                {wikiImage && <img src={wikiImage} alt={`${selectedPlayer} profile`} style={{ maxHeight: '150px', marginBottom: '20px', objectFit: 'contain' }} />}
                <div className="page-description" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div dangerouslySetInnerHTML={{ __html: wikiInfobox }} style={{ maxWidth: '600px', textAlign: 'left' }}></div>
                </div>
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




