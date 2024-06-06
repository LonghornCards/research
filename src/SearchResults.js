import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ResultsContainer = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: calc(100% - 60px);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  overflow-y: auto;
  padding: 20px;
  z-index: 1001;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  background-color: red;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
`;

const fetchData = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return worksheet;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchProducts = async () => {
    try {
        const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/products_json.json');
        return response.data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
    }
};

const SearchResults = ({ query, onClose }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const nflData = await fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NFL_Stats.xlsx');
            const nbaData = await fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NBA_Stats.xlsx');
            const mlbData = await fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/MLB_Stats.xlsx');
            const compositeData = await fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Composite_Ranks.xlsx');
            const nflTrends = await fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_NFL.xlsx');
            const nbaTrends = await fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_NBA.xlsx');
            const mlbTrends = await fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_MLB.xlsx');
            const products = await fetchProducts();
            const blogEntries = [
                {
                    title: 'Player Scoreboard - Top 25',
                    details: 'The Longhorns Cards Player Scoreboard Top 25 Players by Composite Rank',
                    id: 'blog-player-scoreboard-top-25'
                },
                {
                    title: 'Player Scoreboard',
                    details: 'The Longhorn Cards Player Scoreboard ranks Football, Basketball, and Baseball players using historical card sale prices, player career statistics, and Google Trends interest.',
                    id: 'blog-player-scoreboard'
                },
                // Other blog entries...
            ];

            const pages = [
                { title: "Home", url: "/" },
                { title: "Store", url: "/page_store" },
                { title: "Scoreboard", url: "/page_scoreboard" },
                { title: "Google Trends", url: "/page_googletrends" },
                { title: "Player Statistics", url: "/page_stats" },
                { title: "eBay Card Sales", url: "/page_cardsearch" },
                { title: "Blog", url: "/page_blog" },
                { title: "About", url: "/about" }
            ];

            const combinedData = [
                ...pages,
                ...nflData.map(player => ({ ...player, type: 'NFL', id: `row-${player.Name.replace(/\s+/g, '-').toLowerCase()}` })),
                ...nbaData.map(player => ({ ...player, type: 'NBA', id: `row-${player.Name.replace(/\s+/g, '-').toLowerCase()}` })),
                ...mlbData.map(player => ({ ...player, type: 'MLB', id: `row-${player.Name.replace(/\s+/g, '-').toLowerCase()}` })),
                ...compositeData.map(player => ({ ...player, type: 'Composite', id: `row-${player.Name.replace(/\s+/g, '-').toLowerCase()}` })),
                ...nflTrends.map(trend => ({ ...trend, type: 'NFL Trend', id: `nfl-trend-${trend.PLAYER.replace(/\s+/g, '-').toLowerCase()}` })),
                ...nbaTrends.map(trend => ({ ...trend, type: 'NBA Trend', id: `nba-trend-${trend.PLAYER.replace(/\s+/g, '-').toLowerCase()}` })),
                ...mlbTrends.map(trend => ({ ...trend, type: 'MLB Trend', id: `mlb-trend-${trend.PLAYER.replace(/\s+/g, '-').toLowerCase()}` })),
                ...products.map(product => ({ title: product.Title, type: 'Product', id: `product-${product.Title.replace(/\s+/g, '-').toLowerCase()}`, url: `/page_products#product-${product.Title.replace(/\s+/g, '-').toLowerCase()}` })),
                ...blogEntries.map(entry => ({ ...entry, type: 'Blog', id: `blog-${entry.title.replace(/\s+/g, '-').toLowerCase()}` }))
            ];

            setData(combinedData);
        };

        loadData();
    }, []);

    const fuse = new Fuse(data, {
        keys: ['title', 'Name', 'details', 'PLAYER'],
        threshold: 0.3 // Adjust this value to control match sensitivity
    });

    const results = fuse.search(query).map(result => result.item);

    return (
        <ResultsContainer>
            <CloseButton onClick={onClose}>Close</CloseButton>
            <h2>Search Results for "{query}"</h2>
            <ul>
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <li key={index}>
                            {result.url ? (
                                <Link to={result.url} onClick={onClose} style={{ color: 'white' }}>{result.title}</Link>
                            ) : result.type === 'NFL Trend' || result.type === 'NBA Trend' || result.type === 'MLB Trend' ? (
                                <Link to={`/page_googletrends#${result.id}`} onClick={onClose} style={{ color: 'white' }}>
                                    {result.PLAYER} ({result.type})
                                </Link>
                            ) : result.type === 'Product' ? (
                                <Link to={`/page_products#${result.id}`} onClick={onClose} style={{ color: 'white' }}>
                                    {result.title} ({result.type})
                                </Link>
                            ) : result.type === 'Player Statistics' ? (
                                <Link to={`/page_stats#${result.id}`} onClick={onClose} style={{ color: 'white' }}>
                                    {result.Name} ({result.type})
                                </Link>
                            ) : (
                                <Link to={`/page_blog#${result.id}`} onClick={onClose} style={{ color: 'white' }}>
                                    {result.title} ({result.type})
                                </Link>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No results found</li>
                )}
            </ul>
        </ResultsContainer>
    );
};

export default SearchResults;
