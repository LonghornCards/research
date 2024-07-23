import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import TrendsChart from './TrendsChart';
import ScatterPlot from './ScatterPlot';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js';

const fetchCompositeRanks = async () => {
    try {
        const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Composite_Ranks.xlsx', { responseType: 'arraybuffer' });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return worksheet;
    } catch (error) {
        console.error('Error fetching composite ranks data:', error);
        return [];
    }
};

const Page_GoogleTrends = () => {
    const location = useLocation();
    const [topPlayers, setTopPlayers] = useState([]);
    const [bottomPlayers, setBottomPlayers] = useState([]);
    const [compositeRanks, setCompositeRanks] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            const [googleTrendsData, compositeRanksData] = await Promise.all([
                axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_ALL.xlsx', { responseType: 'arraybuffer' })
                    .then(response => {
                        const data = new Uint8Array(response.data);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                        return worksheet;
                    }),
                fetchCompositeRanks()
            ]);

            const sortedDataTop = googleTrendsData.sort((a, b) => b["3-Mo Average"] - a["3-Mo Average"]).slice(0, 10);
            setTopPlayers(sortedDataTop);

            const sortedDataBottom = googleTrendsData.sort((a, b) => a["3-Mo Average"] - b["3-Mo Average"]).slice(0, 10).reverse();
            setBottomPlayers(sortedDataBottom);

            setCompositeRanks(compositeRanksData);
        };

        fetchData();
    }, []);

    const getTrendStyle = (trend) => {
        switch (trend) {
            case 'Strong Uptrend':
                return { color: 'green' };
            case 'Uptrend':
                return { color: 'palegreen' };
            case 'Downtrend':
                return { color: 'indianred' };
            case 'Strong Downtrend':
                return { color: 'red' };
            default:
                return {};
        }
    };

    const fuse = new Fuse(compositeRanks, {
        keys: ['Name'],
        threshold: 0.3,
        ignoreLocation: true
    });

    const toTitleCase = (str) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderTable = (data) => {
        return data.map((row, i) => {
            const playerName = toTitleCase(row["PLAYER"]);
            const result = fuse.search(playerName);
            const isNameMatched = result.length > 0;

            return (
                <tr key={i} style={{ borderBottom: '1px solid peru' }}>
                    <td style={{ textAlign: 'left' }}>
                        {isNameMatched ? (
                            <Link to={`/PageSnapshot?player=${playerName}`}>{playerName}</Link>
                        ) : (
                            playerName
                        )}
                    </td>
                    <td style={{ textAlign: 'left' }}>{row["Sport"]}</td>
                    <td style={{ textAlign: 'center' }}>{row["24-Jun"]}</td>
                    <td style={{ textAlign: 'center' }}>{row["Average"]}</td>
                    <td style={{ textAlign: 'center' }}>{row["3-Mo Average"]}</td>
                    <td style={{ textAlign: 'center' }}>{row["12-Mo Average"]}</td>
                    <td style={{ textAlign: 'left', ...getTrendStyle(row["Google Trend"]) }}>{row["Google Trend"]}</td>
                </tr>
            );
        });
    };

    const columnNames = ["Player", "Sport", "24-Jun", "Average", "3-Mo Average", "12-Mo Average", "Google Trend"];

    return (
        <div style={{ paddingTop: '150px', padding: '20px' }}>
            <Helmet>
                <title>Player Google Trends</title>
            </Helmet>
            <h1 style={{ textAlign: 'center' }}>Sports Player Google Trends</h1>
            <p style={{ textAlign: 'center' }}>Discover the most recent Google Trends data for top sports players. Stay updated with the latest insights and trends across various sports leagues.</p>
            <div style={{ border: '2px solid peru', padding: '20px', marginTop: '20px' }}>
                <h2>Top Sports Player Google Trends</h2>
                <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                            <th style={{ textAlign: 'left' }}>Player</th>
                            <th style={{ textAlign: 'left' }}>Sport</th>
                            <th style={{ textAlign: 'center' }}>24-Jun</th>
                            <th style={{ textAlign: 'center' }}>Average</th>
                            <th style={{ textAlign: 'center' }}>3-Mo Average</th>
                            <th style={{ textAlign: 'center' }}>12-Mo Average</th>
                            <th style={{ textAlign: 'left' }}>Google Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTable(topPlayers)}
                    </tbody>
                </table>
                <h2>Bottom Sports Player Google Trends</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>
                            <th style={{ textAlign: 'left' }}>Player</th>
                            <th style={{ textAlign: 'left' }}>Sport</th>
                            <th style={{ textAlign: 'center' }}>24-Jun</th>
                            <th style={{ textAlign: 'center' }}>Average</th>
                            <th style={{ textAlign: 'center' }}>3-Mo Average</th>
                            <th style={{ textAlign: 'center' }}>12-Mo Average</th>
                            <th style={{ textAlign: 'left' }}>Google Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTable(bottomPlayers)}
                    </tbody>
                </table>
            </div>
            <p>Explore the latest Google Trends data for popular sports players across different leagues.</p>
            <div style={{ padding: '20px', marginTop: '20px', border: '2px solid peru' }}>
                <TrendsChart
                    fileUrl="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_NFL.xlsx"
                    title="NFL Google Trends"
                    style={{ height: '400px', width: '100%' }}
                />
                <TrendsChart
                    fileUrl="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_NBA.xlsx"
                    title="NBA Google Trends"
                    style={{ height: '400px', width: '100%' }}
                />
                <TrendsChart
                    fileUrl="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_MLB.xlsx"
                    title="MLB Google Trends"
                    style={{ height: '400px', width: '100%' }}
                />
            </div>
            <ScatterPlot
                fileUrl="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_ALL.xlsx"
                xAxis="3-Mo Average"
                yAxis="12-Mo Average"
                displayColumns={["PLAYER", "3-Mo Average", "12-Mo Average", "Average", "Google Trend"]}
            />
        </div>
    );
};

export default Page_GoogleTrends;
