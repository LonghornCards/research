import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import './App.css'; // Reference App.css for styling

const RSS_FEEDS = [
    { name: 'Top Headlines', url: 'https://www.espn.com/espn/rss/news' },
    { name: 'NFL Headlines', url: 'https://www.espn.com/espn/rss/nfl/news' },
    { name: 'NBA Headlines', url: 'https://www.espn.com/espn/rss/nba/news' },
    { name: 'MLB Headlines', url: 'https://www.espn.com/espn/rss/mlb/news' },
    { name: 'ESPNU', url: 'https://www.espn.com/espn/rss/espnu/news' },
    { name: 'College Basketball Headlines', url: 'https://www.espn.com/espn/rss/ncb/news' },
    { name: 'College Football Headlines', url: 'https://www.espn.com/espn/rss/ncf/news' }
];

const PageRSS = () => {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchRSS = async () => {
        const allArticles = [];
        for (const feed of RSS_FEEDS) {
            const res = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${feed.url}`);
            const articlesWithSource = res.data.items.map(item => ({ ...item, source: feed.name }));
            allArticles.push(...articlesWithSource);
        }
        setArticles(allArticles);
    };

    useEffect(() => {
        fetchRSS();
        const interval = setInterval(fetchRSS, 3600000); // 3600000 ms = 1 hour

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedArticles = sortBy(filteredArticles, [sortField]);
    if (sortOrder === 'desc') {
        sortedArticles.reverse();
    }

    return (
        <div className="page-rss-custom">
            <div className="header-custom">
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/espn.jpeg" alt="ESPN RSS" className="header-image-custom" />
                <h1>ESPN RSS Feed</h1>
            </div>
            <div className="search-sort-custom">
                <input
                    type="text"
                    placeholder="Search articles"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <div className="sort-buttons-custom">
                    <button onClick={() => handleSortChange('title')}>Sort by Title</button>
                    <button onClick={() => handleSortChange('pubDate')}>Sort by Date</button>
                    <button onClick={() => handleSortChange('source')}>Sort by Source</button>
                </div>
            </div>
            <div className="articles-custom">
                {sortedArticles.map((article, index) => (
                    <div key={index} className="article-custom">
                        <h2>{article.title}</h2>
                        <p>{article.source}</p>
                        <p>{new Date(article.pubDate).toLocaleString()}</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer">Read more</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageRSS;
