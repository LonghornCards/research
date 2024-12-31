import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import './App.css'; // Reference App.css for styling

const RSS_FEEDS = [
    { name: 'Top Headlines', url: 'https://www.espn.com/espn/rss/news' },
    { name: 'NFL Headlines', url: 'https://www.espn.com/espn/rss/nfl/news' },
    { name: 'NBA Headlines', url: 'https://www.espn.com/espn/rss/nba/news' },
    { name: 'MLB Headlines', url: 'https://www.espn.com/espn/rss/mlb/news' },
    { name: 'ESPNU', url: 'https://www.espn.com/espn/rss/espnu/news' },
    { name: 'College Basketball Headlines', url: 'https://www.espn.com/espn/rss/ncb/news' },
    { name: 'College Football Headlines', url: 'https://www.espn.com/espn/rss/ncf/news' },
    { name: 'Fox NFL Headlines', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30&tags=fs/nfl' },
    { name: 'Fox MLB Headlines', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30&tags=fs/mlb' },
    { name: 'Fox NBA Headlines', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30&tags=fs/nba' },
    { name: 'Fox College Football Headlines', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30&tags=fs/cfb' },
    { name: 'Fox College Basketball Headlines', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&size=30&tags=fs/cbk' },
    { name: 'Fox Aggregate Sports Headlines', url: 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmuj2lUhuRhQaafhBjAJqaPU244mlTDK1i&aggregateId=7f83e8ca-6701-5ea0-96ee-072636b67336' },
    { name: 'CBS MLB Headlines', url: 'https://www.cbssports.com/rss/headlines/mlb/' },
    { name: 'CBS NBA Headlines', url: 'https://www.cbssports.com/rss/headlines/nba/' },
    { name: 'CBS NFL Headlines', url: 'https://www.cbssports.com/rss/headlines/nfl/' },
    { name: 'CBS College Basketball Headlines', url: 'https://www.cbssports.com/rss/headlines/college-basketball/' },
    { name: 'CBS College Football Headlines', url: 'https://www.cbssports.com/rss/headlines/college-football/' },
    { name: 'CBS Sports Headlines', url: 'https://www.cbssports.com/rss/headlines/' },
    { name: 'NCAA Men\'s Basketball', url: 'https://www.ncaa.com/news/basketball-men/d1/rss.xml' },
    { name: 'NCAA Football', url: 'https://www.ncaa.com/news/football/fbs/rss.xml' },
    { name: 'NCAA Baseball', url: 'https://www.ncaa.com/news/baseball/d1/rss.xml' },
    { name: 'NCAA Sports', url: 'https://www.ncaa.com/news/ncaa/d1/rss.xml' },
    { name: 'Yahoo MLB', url: 'https://sports.yahoo.com/mlb/rss/' },
    { name: 'Yahoo NFL', url: 'https://sports.yahoo.com/nfl/rss/' },
    { name: 'Yahoo NBA', url: 'https://sports.yahoo.com/nba/rss/' },
    { name: 'Yahoo College Football', url: 'https://sports.yahoo.com/college-football/rss/' },
    { name: 'Yahoo College Basketball', url: 'https://sports.yahoo.com/college-basketball/rss/' },
    { name: 'Yahoo MLB News', url: 'https://sports.yahoo.com/mlb/news/rss/' },
    { name: 'Yahoo NFL News', url: 'https://sports.yahoo.com/nfl/news/rss/' },
    { name: 'Yahoo NBA News', url: 'https://sports.yahoo.com/nba/news/rss/' },
    { name: 'Yahoo College Sports News', url: 'https://sports.yahoo.com/college-sports/news/rss/' },
    { name: 'Texas Longhorns General', url: 'http://texaslonghorns.com/rss.aspx?path=general' },
    { name: 'Texas Longhorns Baseball', url: 'http://texaslonghorns.com/rss.aspx?path=baseball' },
    { name: 'Texas Longhorns Men\'s Basketball', url: 'http://texaslonghorns.com/rss.aspx?path=mbball' },
    { name: 'Texas Longhorns Football', url: 'http://texaslonghorns.com/rss.aspx?path=football' },
    { name: 'Texas Longhorns Men\'s Golf', url: 'http://texaslonghorns.com/rss.aspx?path=mgolf' }
];

const PageRSS = () => {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedSources, setSelectedSources] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRSS = async (reset = false) => {
        setLoading(true);
        const allArticles = [];
        try {
            for (const feed of RSS_FEEDS) {
                try {
                    const res = await axios.get(
                        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`
                    );
                    const articlesWithSource = res.data.items.map(item => ({
                        ...item,
                        source: feed.name,
                    }));
                    allArticles.push(...articlesWithSource);
                } catch (error) {
                    console.error(`Error fetching RSS feed from ${feed.name}:`, error.message);
                }
            }
            setArticles(reset ? allArticles : [...articles, ...allArticles]);
        } catch (error) {
            console.error('Error fetching RSS feeds:', error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRSS(true);
        const interval = setInterval(() => fetchRSS(true), 3600000); // Refresh every hour
        return () => clearInterval(interval);
    }, []);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortOrder(order);
    };
    const handleSourceChange = (selectedOptions) =>
        setSelectedSources(selectedOptions ? selectedOptions.map(option => option.value) : []);
    const handleLoadMore = () => fetchRSS();
    const handleResetSearch = () => setSearchTerm('');

    const filteredArticles = articles.filter(
        article =>
            (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedSources.length === 0 || selectedSources.includes(article.source))
    );

    const sortedArticles = sortBy(filteredArticles, [sortField]);
    if (sortOrder === 'desc') sortedArticles.reverse();

    const sourceOptions = RSS_FEEDS.map(feed => ({
        value: feed.name,
        label: `${feed.name} (${articles.filter(a => a.source === feed.name).length})`,
    }));

    return (
        <div className="page-rss-custom">
            <Helmet>
                <title>Sports RSS Feeds</title>
            </Helmet>
            <div className="header-custom">
                <h1>Sports RSS Feeds</h1>
            </div>
            <div className="search-sort-custom">
                <input
                    type="text"
                    placeholder="Search articles"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Select
                    options={sourceOptions}
                    isMulti
                    placeholder="Filter by Source"
                    onChange={handleSourceChange}
                />
                <button onClick={() => handleSortChange('title')}>Sort by Title</button>
                <button onClick={() => handleSortChange('pubDate')}>Sort by Date</button>
                <button onClick={() => handleSortChange('source')}>Sort by Source</button>
                <button onClick={handleResetSearch}>Reset Search</button>
            </div>
            <div className="articles-custom">
                {sortedArticles.map((article, index) => (
                    <div key={index} className="article-custom">
                        <h2>{article.title}</h2>
                        <p>Source: {article.source}</p>
                        <p>{new Date(article.pubDate).toLocaleString()}</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                            Read more
                        </a>
                    </div>
                ))}
            </div>
            {loading && <p>Loading...</p>}
            <button onClick={handleLoadMore}>Load More</button>
        </div>
    );
};

export default PageRSS;
