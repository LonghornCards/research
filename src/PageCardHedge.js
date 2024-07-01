import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const PageCardHedge = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [apiResponse, setApiResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        const config = {
            method: 'GET',
            url: `https://zylalabs.com/api/2511/sports+card+and+trading+card+api/2494/card+search?search=${encodeURIComponent(searchQuery)}`,
            headers: {
                'Authorization': 'Bearer 4393|qfialxwyOKA3fMpKcja6CaNRuzHLIa5ZCWKzb7F5'
            },
        };

        axios(config)
            .then((response) => {
                setApiResponse(response.data);
                setError(null);
            })
            .catch((error) => {
                setApiResponse(null);
                setError('An error occurred while fetching the data.');
                console.log(error);
            });
    };

    return (
        <div className="page-card-hedge">
            <div className="header-card-hedge">
                <h1>Search Card Hedge Prices</h1>
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/cardhedge.jpeg"
                    alt="Card Hedge"
                    className="header-image-card-hedge"
                />
            </div>
            <p className="description-card-hedge">
                Search for real-time pricing data and detailed information about individual cards
            </p>
            <input
                type="text"
                placeholder="Enter card details..."
                maxLength="200"
                className="search-box-card-hedge"
                value={searchQuery}
                onChange={handleInputChange}
            />
            <img
                src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/download.svg"
                alt="Download"
                className="download-icon-card-hedge"
                onClick={handleSearch}
                style={{ cursor: 'pointer' }}
            />
            {apiResponse && (
                <div className="api-response-container">
                    <h2>API Response</h2>
                    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                </div>
            )}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}
            <img
                src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/comingsoon.jpeg"
                alt="Coming Soon"
                className="coming-soon-image"
            />
            <p className="source-description-card-hedge">
                Source: Card Hedge. Real-time pricing data and detailed information about individual cards using an extensive database that includes names, series, rarity, and other details. Data source contains over 1 million cards, including prices for all major graders.
            </p>
        </div>
    );
};

export default PageCardHedge;
