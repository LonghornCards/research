import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Fuse from 'fuse.js';
import Sentiment from 'sentiment';
import html2canvas from 'html2canvas';
import './App.css';
import Navbar from './Navbar';

const commonEnglishWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at'
]);

const prepositionsAndConjunctions = new Set([
    'aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'anti', 'around', 'as', 'at', 'before',
    'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'concerning', 'considering', 'despite',
    'down', 'during', 'except', 'excepting', 'excluding', 'following', 'for', 'from', 'in', 'inside', 'into', 'like', 'minus',
    'near', 'of', 'off', 'on', 'onto', 'opposite', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since',
    'than', 'through', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with',
    'within', 'without', 'and', 'but', 'for', 'nor', 'or', 'so', 'yet'
]);

const pronouns = new Set([
    'I', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'mine', 'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves'
]);

const sentiment = new Sentiment();

const GoogleNewsPage = () => {
    const [players, setPlayers] = useState('');
    const [submittedPlayers, setSubmittedPlayers] = useState('');
    const [sportsNews, setSportsNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [allText, setAllText] = useState('');
    const [wordFrequency, setWordFrequency] = useState([]);
    const [wordCount, setWordCount] = useState(0); // State to hold the count of words after exclusions
    const inputRef = useRef(null);
    const visualizationRef = useRef(null);

    const handleInputChange = (event) => {
        setPlayers(event.target.value);
    };

    const handleSubmit = () => {
        setSubmittedPlayers(players);
        filterNews(players);
    };

    const handleReset = () => {
        setFilteredNews(sportsNews);
        setPlayers('');
        setSubmittedPlayers('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchSportsNews();
        }
    };

    const filterNews = (playerNames) => {
        const names = playerNames.split(',').map(name => name.trim());
        const fuseOptions = {
            keys: ['title', 'snippet'],
            threshold: 0.3,
            findAllMatches: true
        };

        const fuse = new Fuse(sportsNews, fuseOptions);
        const filtered = names.flatMap(name => fuse.search(name).map(result => result.item));
        const uniqueFiltered = Array.from(new Set(filtered));
        setFilteredNews(uniqueFiltered);
    };

    const fetchSportsNews = async () => {
        let url = 'https://google-news13.p.rapidapi.com/sport';
        if (players.trim()) {
            const formattedPlayers = players.split(',').map(name => name.trim().replace(/\s+/g, '+')).join('+');
            url = `https://google-news13.p.rapidapi.com/search?keyword=${formattedPlayers}`;
        }

        const options = {
            method: 'GET',
            url: url,
            params: { lr: 'en-US' },
            headers: {
                'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                'x-rapidapi-host': 'google-news13.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            setSportsNews(response.data.items);
            setFilteredNews(response.data.items);
            extractTextFromLinks(response.data.items);
        } catch (error) {
            console.error('Error fetching sports news:', error);
        }
    };

    const extractTextFromLinks = (newsArray) => {
        const textPromises = newsArray.map(async news => {
            try {
                const response = await axios.get(news.newsUrl);
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.data, 'text/html');
                return doc.body.innerText || '';
            } catch (error) {
                console.error('Error extracting text from link:', error);
                return '';
            }
        });

        Promise.all(textPromises).then(texts => {
            const combinedText = texts.join(' ');
            setAllText(combinedText);
            performWordFrequencyAnalysis(combinedText);
        });
    };

    const performWordFrequencyAnalysis = (text) => {
        const cleanedText = text.replace(/[^\w\s]/gi, '').toLowerCase();
        const words = cleanedText.split(/\s+/);
        const wordCounts = {};

        words.forEach(word => {
            if (
                commonEnglishWords.has(word) ||
                prepositionsAndConjunctions.has(word) ||
                pronouns.has(word) ||
                /\d/.test(word) ||
                /_/.test(word) ||
                word.length <= 2 ||
                word.length >= 10
            ) return;
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });

        const filteredWordCounts = Object.entries(wordCounts).filter(([word, count]) => count >= 20); // Updated exclusion
        const sortedWordCounts = filteredWordCounts.sort((a, b) => b[1] - a[1]);
        setWordFrequency(sortedWordCounts);
        setWordCount(sortedWordCounts.length); // Update the count of words after exclusions

        // Update the text with filtered words
        const filteredWordsSet = new Set(filteredWordCounts.map(([word]) => word));
        const filteredText = words.filter(word => filteredWordsSet.has(word)).join(' ');
        setAllText(filteredText);
    };

    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp));
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    const sortNewsByDate = (newsArray) => {
        return newsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const getSentimentColor = (word) => {
        const result = sentiment.analyze(word);
        if (result.score > 0) return 'green';
        if (result.score < 0) return 'red';
        return 'lightgray';
    };

    const exportAsImage = () => {
        const element = visualizationRef.current;
        const originalHeight = element.style.height;
        element.style.height = `${element.scrollHeight}px`;

        html2canvas(element).then(canvas => {
            const link = document.createElement('a');
            link.download = 'word-frequency-visualization.png';
            link.href = canvas.toDataURL();
            link.click();

            element.style.height = originalHeight;
        });
    };

    useEffect(() => {
        setFilteredNews(sortNewsByDate(filteredNews));
    }, [filteredNews]);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <div className="google-news-page">
            <Navbar />
            <div className="content-container">
                <h1 className="page-title">Google News</h1>
                <p className="instruction-text">Select players to generate articles and a news feed</p>
                <div className="input-container">
                    <div className="input-section">
                        <label htmlFor="players" className="player-label">Select Your Players: </label>
                        <input
                            type="text"
                            id="players"
                            value={players}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter player names separated by commas"
                            className="player-input"
                            ref={inputRef}
                        />
                        <div className="button-widget">
                            <button onClick={handleReset} className="widget-button" style={{ width: '150px' }}>Reset Filter</button>
                        </div>
                    </div>
                    {submittedPlayers && (
                        <div className="submitted-data">
                            <h3>Submitted Players:</h3>
                            <p>{submittedPlayers}</p>
                        </div>
                    )}
                </div>
                <div className="button-container">
                    <button onClick={fetchSportsNews} className="fetch-sports-news-button">Fetch Sports News</button>
                </div>
                <div className="sports-news-container">
                    {filteredNews.length > 0 && (
                        <div className="sports-news-list">
                            <h3>Sports News:</h3>
                            <table className="sports-news-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Snippet</th>
                                        <th>Publisher</th>
                                        <th>Publication Date</th>
                                        <th>Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNews.map((news, index) => (
                                        <tr key={index}>
                                            <td>{news.title}</td>
                                            <td>{news.snippet}</td>
                                            <td>{news.publisher}</td>
                                            <td>{formatDate(news.timestamp)}</td>
                                            <td><a href={news.newsUrl} target="_blank" rel="noopener noreferrer">Read more</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="all-text-container" style={{ maxHeight: '200px', overflowY: 'scroll', marginTop: '20px' }}>
                    <h3>Combined Text from All Articles:</h3>
                    <p>{allText}</p>
                </div>
                <div className="word-frequency-container" style={{ maxHeight: '200px', overflowY: 'scroll', marginTop: '20px' }}>
                    <h3>Word Frequency Analysis (Remaining Words: {wordCount}):</h3> {/* Display the count of remaining words */}
                    <ul>
                        {wordFrequency.map(([word, count], index) => (
                            <li key={index}>{word}: {count}</li>
                        ))}
                    </ul>
                </div>
                <div className="word-frequency-display" ref={visualizationRef} style={{ border: '2px solid peru', padding: '10px', marginTop: '20px', width: '100%', height: 'auto', boxSizing: 'border-box' }}>
                    <h3>Word Frequency Visualization: {submittedPlayers}</h3> {/* Display the submitted players */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        {wordFrequency.map(([word, count], index) => (
                            <span key={index} style={{
                                fontSize: `${0.1 + Math.log(count) * 0.3}rem`, // Adjusted base size and scale factor
                                color: getSentimentColor(word), // Color based on sentiment
                                fontWeight: 'bold',
                                margin: '5px',
                                whiteSpace: 'nowrap'
                            }}>
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="export-container" style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button onClick={exportAsImage} className="export-button" style={{ padding: '10px 20px', fontSize: '16px' }}>Export as PNG</button>
                </div>
            </div>
        </div>
    );
};

export default GoogleNewsPage;
