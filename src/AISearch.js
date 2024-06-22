import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sentiment from 'sentiment';
import html2canvas from 'html2canvas';

const sentiment = new Sentiment();

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

const AISearch = () => {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inputText, setInputText] = useState("");
    const [keywords, setKeywords] = useState("");
    const [articles, setArticles] = useState([]);
    const [allText, setAllText] = useState('');
    const [wordFrequency, setWordFrequency] = useState([]);
    const [wordCount, setWordCount] = useState(0);
    const visualizationRef = useRef(null);

    const fetchResponse = async () => {
        setLoading(true);
        setError(null);
        setKeywords("");
        setArticles([]);

        try {
            const result = await axios.post('http://localhost:3002/api/openai', {
                messages: [{ role: "system", content: inputText }],
            });
            setResponse(result.data);

            // After fetching response, fetch keywords
            fetchKeywords(result.data);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchKeywords = (responseText) => {
        if (responseText) {
            // Simple noun extraction based on capitalization
            const words = responseText.match(/\b[A-Z][a-z]*\b/g) || []; // Match capitalized words
            const extractedKeywords = words
                .map(word => word.toLowerCase())
                .join("+");
            setKeywords(extractedKeywords);
            console.log(extractedKeywords);

            // After fetching keywords, fetch articles
            fetchArticles(extractedKeywords);
        } else {
            setLoading(false);
        }
    };

    const fetchArticles = async (keywordsText) => {
        if (keywordsText) {
            const options = {
                method: 'GET',
                url: `https://google-news13.p.rapidapi.com/search?keyword=${keywordsText}`,
                params: { lr: 'en-US' },
                headers: {
                    'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                    'x-rapidapi-host': 'google-news13.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                setArticles(response.data.items);
                extractTextFromArticles(response.data.items);
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const extractTextFromArticles = (articlesArray) => {
        const textPromises = articlesArray.map(async article => {
            try {
                const response = await axios.get(article.newsUrl);
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            fetchResponse();
        }
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

    return (
        <div className="aiSearch-container">
            <h1>Search Google News via ChatGPT</h1>
            <div className="aiSearch-search-box-container">
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/openai.png"
                    alt="OpenAI"
                    className="aiSearch-image"
                />
                <div className="aiSearch-search-box">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={1000}
                        rows={4}
                        cols={50}
                        placeholder="Enter your search"
                    />
                </div>
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/googlenews.jpg"
                    alt="Google News"
                    className="aiSearch-image"
                />
            </div>
            <p style={{ marginTop: "10px", marginBottom: "10px", fontStyle: "italic" }}>
                (Example: "How many points did Michael Jordan average?")
            </p>
            <button onClick={fetchResponse} disabled={loading} className="aiSearch-fetch-button">
                {loading ? "Loading..." : "Fetch ChatGPT Response"}
            </button>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            <div className="aiSearch-content-left">
                {response && (
                    <div className="aiSearch-response-container">
                        <p className="aiSearch-response-label">OpenAI ChatGPT Response:</p>
                        <div className="aiSearch-response-box">
                            <p>{response}</p>
                        </div>
                    </div>
                )}
                {articles.length > 0 && (
                    <div className="aiSearch-articles-container">
                        <h3 className="aiSearch-articles-title">Google News Articles:</h3>
                        <table className="aiSearch-articles-table">
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
                                {articles.map((article, index) => (
                                    <tr key={index}>
                                        <td>{article.title}</td>
                                        <td>{article.snippet}</td>
                                        <td>{article.publisher}</td>
                                        <td>{formatDate(article.timestamp)}</td>
                                        <td><a href={article.newsUrl} target="_blank" rel="noopener noreferrer">Read more</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="aiSearch-all-text-container">
                    <h3>Combined Text from All Articles:</h3>
                    <div>
                        <p>{allText}</p>
                    </div>
                </div>
                <div className="aiSearch-word-frequency-container">
                    <h3>Word Frequency Analysis (Remaining Words: {wordCount}):</h3>
                    <div>
                        <ul>
                            {wordFrequency.map(([word, count], index) => (
                                <li key={index}>{word}: {count}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="aiSearch-word-frequency-display" ref={visualizationRef}>
                    <h3>Word Frequency Visualization:</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                        {wordFrequency.map(([word, count], index) => (
                            <span key={index} style={{
                                fontSize: `${0.1 + Math.log(count) * 0.3}rem`,
                                color: getSentimentColor(word),
                                fontWeight: 'bold',
                                margin: '5px',
                                whiteSpace: 'nowrap'
                            }}>
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="aiSearch-export-container">
                <button onClick={exportAsImage} className="aiSearch-export-button">Export as PNG</button>
            </div>
            <p style={{ fontStyle: 'italic' }}>Sources: OpenAI's text generation models (often referred to as generative pre-trained transformers or "GPT" models for short), like GPT-4 and GPT-3.5, have been trained to understand natural and formal language. Models like GPT-4 allow text outputs in response to their inputs. The inputs to these models are also referred to as "prompts". Google News API provides access to the latest news and articles from various news sources worldwide.</p>
        </div>
    );
};

export default AISearch;
