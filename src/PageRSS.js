import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import Select from 'react-select';
import { sortBy } from 'lodash';
import { Helmet } from 'react-helmet'; // Import react-helmet for the title
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
                    const res = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
                    const articlesWithSource = await Promise.all(res.data.items.map(async item => {
                        const content = await fetchArticleContent(item.link);
                        return { ...item, source: feed.name, content };
                    }));
                    allArticles.push(...articlesWithSource);
                } catch (error) {
                    console.error(`Error fetching RSS feed from ${feed.name}:`, error.response ? error.response.data : error.message);
                }
            }
            setArticles(reset ? allArticles : [...articles, ...allArticles]);
        } catch (error) {
            console.error("Error fetching RSS feeds:", error);
        }
        setLoading(false);
    };

    const fetchArticleContent = async (url) => {
        try {
            const res = await axios.get(url);
            const $ = cheerio.load(res.data);
            return $('body').text();
        } catch (error) {
            console.error(`Error fetching article content from ${url}:`, error.message);
            return '';
        }
    };

    useEffect(() => {
        fetchRSS(true);
        const interval = setInterval(() => fetchRSS(true), 3600000); // 3600000 ms = 1 hour

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

    const handleSourceChange = (selectedOptions) => {
        setSelectedSources(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleLoadMore = () => {
        fetchRSS();
    };

    const handleResetSearch = () => {
        setSearchTerm('');
    };

    const filteredArticles = articles.filter(article =>
        (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedSources.length === 0 || selectedSources.includes(article.source))
    );

    const sortedArticles = sortBy(filteredArticles, [sortField]);
    if (sortOrder === 'desc') {
        sortedArticles.reverse();
    }

    const articleCountBySource = articles.reduce((acc, article) => {
        acc[article.source] = (acc[article.source] || 0) + 1;
        return acc;
    }, {});

    const sourceOptions = RSS_FEEDS.map(feed => ({
        value: feed.name,
        label: `${feed.name} (${articleCountBySource[feed.name] || 0})`
    }));

    return (
        <div className="page-rss-custom">
            <Helmet>
                <title>Sports RSS Feeds</title>
            </Helmet>
            <div className="header-custom">
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/espn.jpeg" alt="ESPN RSS" className="header-image-custom" />
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/fox.png" alt="Fox RSS" className="header-image-custom" />
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/cbs.jpeg" alt="CBS RSS" className="header-image-custom" />
                <h1>Sports RSS Feeds</h1>
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/texas.png" alt="Texas RSS" className="header-image-custom" />
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/ncaa.png" alt="NCAA RSS" className="header-image-custom" />
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/yahoo.jpeg" alt="Yahoo RSS" className="header-image-custom" />
            </div>
            <div className="search-sort-custom">
                <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Search articles"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input-custom"
                    />
                    <img
                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/reset.svg"
                        alt="Reset Search"
                        title="Reset Search"
                        className="sort-icon"
                        onClick={handleResetSearch}
                    />
                </div>
                <Select
                    options={sourceOptions}
                    isMulti
                    placeholder="Filter by Source"
                    onChange={handleSourceChange}
                    className="source-select-custom"
                />
                <div className="sort-images-custom">
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/sort.svg" alt="Sort by Title" title="Sort by Title" className="sort-icon" onClick={() => handleSortChange('title')} />
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/calendar.svg" alt="Sort by Date" title="Sort by Date" className="sort-icon" onClick={() => handleSortChange('pubDate')} />
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/source.svg" alt="Sort by Source" title="Sort by Source" className="sort-icon" onClick={() => handleSortChange('source')} />
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
            {loading && <div>Loading...</div>}
            <img
                src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/download.svg"
                alt="Load More"
                title="Load More"
                onClick={handleLoadMore}
                className="load-more-image"
            />
        </div>
    );
};

export default PageRSS;
