import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import Plot from 'react-plotly.js';

const PageCardHedge = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [apiResponse, setApiResponse] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [numberOfDays, setNumberOfDays] = useState('');
    const [grade, setGrade] = useState('PSA 10');
    const [modalOpen, setModalOpen] = useState(false);
    const [priceResponse, setPriceResponse] = useState([]);
    const [cardDetails, setCardDetails] = useState({});
    const [cardSummary, setCardSummary] = useState({
        lastPrice: 0,
        avgPrice: 0,
        highPrice: 0,
        lowPrice: 0,
        percentFromAvg: 0,
        percentFromHigh: 0,
        percentFromLow: 0,
        totalReturn: 0,
        dateRange: '',
    });

    const chartRef = useRef(null);

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
                const cardDetailMap = response.data.reduce((acc, card) => {
                    acc[card.card_id] = card;
                    return acc;
                }, {});
                setCardDetails(cardDetailMap);
                setError(null);
            })
            .catch((error) => {
                setApiResponse([]);
                setError('An error occurred while fetching the data.');
                console.log(error);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCardIdClick = (cardId) => {
        setSelectedCardId(cardId);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedCardId(null);
        setNumberOfDays('');
        setGrade('PSA 10');
        setPriceResponse([]);
        setCardSummary({
            lastPrice: 0,
            avgPrice: 0,
            highPrice: 0,
            lowPrice: 0,
            percentFromAvg: 0,
            percentFromHigh: 0,
            percentFromLow: 0,
            totalReturn: 0,
            dateRange: '',
        });
    };

    const handleNumberOfDaysChange = (e) => {
        setNumberOfDays(e.target.value);
    };

    const handleGradeChange = (e) => {
        setGrade(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const config = {
            method: 'GET',
            url: `https://zylalabs.com/api/2511/sports+card+and+trading+card+api/2495/get+card+prices?card_id=${encodeURIComponent(selectedCardId)}&days=${encodeURIComponent(numberOfDays)}&grade=${encodeURIComponent(grade)}`,
            headers: {
                'Authorization': 'Bearer 4393|qfialxwyOKA3fMpKcja6CaNRuzHLIa5ZCWKzb7F5'
            },
        };

        axios(config)
            .then((response) => {
                setPriceResponse(response.data);
                setError(null);
                setModalOpen(false);

                if (response.data.length > 0) {
                    const prices = response.data.map(price => parseFloat(price.price));
                    const lastPrice = prices[0];
                    const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
                    const highPrice = Math.max(...prices);
                    const lowPrice = Math.min(...prices);
                    const percentFromAvg = Math.round(((lastPrice / avgPrice) - 1) * 100);
                    const percentFromHigh = Math.round(((lastPrice / highPrice) - 1) * 100);
                    const percentFromLow = Math.round(((lastPrice / lowPrice) - 1) * 100);
                    const totalReturn = Math.round(((lastPrice / prices[prices.length - 1]) - 1) * 100);

                    const oldestDate = new Date(response.data[response.data.length - 1].closing_date).toLocaleDateString();
                    const mostRecentDate = new Date(response.data[0].closing_date).toLocaleDateString();
                    const dateRange = `${oldestDate} - ${mostRecentDate}`;

                    setCardSummary({
                        lastPrice,
                        avgPrice,
                        highPrice,
                        lowPrice,
                        percentFromAvg,
                        percentFromHigh,
                        percentFromLow,
                        totalReturn,
                        dateRange,
                    });

                    // Scroll to the chart container after setting the price response
                    setTimeout(() => {
                        if (chartRef.current) {
                            chartRef.current.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 0);
                }
            })
            .catch((error) => {
                setPriceResponse([]);
                setError('An error occurred while fetching the price data.');
                console.log(error);
            });
    };

    const handleReset = () => {
        setSearchQuery('');
        setApiResponse([]);
        setError(null);
        setSelectedCardId(null);
        setNumberOfDays('');
        setGrade('PSA 10');
        setModalOpen(false);
        setPriceResponse([]);
        setCardDetails({});
        setCardSummary({
            lastPrice: 0,
            avgPrice: 0,
            highPrice: 0,
            lowPrice: 0,
            percentFromAvg: 0,
            percentFromHigh: 0,
            percentFromLow: 0,
            totalReturn: 0,
            dateRange: '',
        });
    };

    const sortedPriceResponse = priceResponse.sort((a, b) => new Date(a.closing_date) - new Date(b.closing_date));
    const plotData = {
        x: sortedPriceResponse.map(price => new Date(price.closing_date).toLocaleDateString()),
        y: sortedPriceResponse.map(price => price.price),
        text: sortedPriceResponse.map(price => {
            const card = cardDetails[price.card_id];
            return `Description: ${card.description}<br>Number: ${card.number}<br>Variant: ${card.variant}<br>Card ID: ${card.card_id}`;
        }),
        hoverinfo: 'text',
        type: 'scatter',
        mode: 'lines',
        line: { color: 'peru' },
        name: cardDetails[selectedCardId]?.description || 'Price Data'
    };

    // Calculate 50-day rolling moving average manually
    const prices = sortedPriceResponse.map(price => parseFloat(price.price));
    const movingAvg50 = prices.map((val, index, arr) => {
        if (index < 49) return null;
        const slice = arr.slice(index - 49, index + 1);
        const sum = slice.reduce((a, b) => a + b, 0);
        return (sum / 50).toFixed(2);
    });

    // Calculate 200-day rolling moving average manually
    const movingAvg200 = prices.map((val, index, arr) => {
        if (index < 199) return null;
        const slice = arr.slice(index - 199, index + 1);
        const sum = slice.reduce((a, b) => a + b, 0);
        return (sum / 200).toFixed(2);
    });

    // Filter out null values from moving averages and corresponding dates
    const movingAvg50Filtered = movingAvg50.filter(val => val !== null);
    const movingAvg50Dates = sortedPriceResponse.slice(49).map(price => new Date(price.closing_date).toLocaleDateString());

    const movingAvg200Filtered = movingAvg200.filter(val => val !== null);
    const movingAvg200Dates = sortedPriceResponse.slice(199).map(price => new Date(price.closing_date).toLocaleDateString());

    const avgPrice = (priceResponse.reduce((a, b) => a + parseFloat(b.price), 0) / priceResponse.length).toFixed(2);

    // Data for box plot
    const boxPlotData = {
        y: sortedPriceResponse.map(price => price.price),
        text: sortedPriceResponse.map(price => new Date(price.closing_date).toLocaleDateString()), // Adding closing date to hover text
        type: 'box',
        name: cardDetails[selectedCardId]?.description || 'Price Distribution',
        boxpoints: 'all',
        jitter: 0.5,
        pointpos: -1.8,
        marker: { color: 'peru' },
        hoverinfo: 'y+text' // Show both price and closing date on hover
    };

    return (
        <div className="main-content">
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
                onKeyDown={handleKeyDown}
            />
            <p className="example-text">Example: 2018 Panini Prizm Kevin Durant</p>
            <div className="icon-container">
                <div className="icon-wrapper">
                    <img
                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/download.svg"
                        alt="Download"
                        className="download-icon-card-hedge"
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    />
                    <span className="hover-text">Search Cards</span>
                </div>
                <div className="icon-wrapper">
                    <img
                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/reset.svg"
                        alt="Reset"
                        className="reset-icon-card-hedge"
                        onClick={handleReset}
                        style={{ cursor: 'pointer' }}
                    />
                    <span className="hover-text">Reset Search</span>
                </div>
            </div>
            {priceResponse.length > 0 && (
                <div className="card-summary-container" style={{ marginBottom: '20px', border: '3px solid peru', boxShadow: '5px 5px 10px #888888', padding: '10px' }}>
                    <div className="card-summary-details">
                        <div className="summary-column">
                            <p><strong>Date Range:</strong> {cardSummary.dateRange}</p>
                            <p><strong>Description:</strong> {cardDetails[selectedCardId].description}</p>
                            <p><strong>Number:</strong> {cardDetails[selectedCardId].number}</p>
                            <p><strong>Variant:</strong> {cardDetails[selectedCardId].variant}</p>
                            <p><strong>Last Price:</strong> ${cardSummary.lastPrice}</p>
                            <p><strong>Average Price:</strong> ${cardSummary.avgPrice}</p>
                        </div>
                        <div className="summary-column">
                            <p><strong>High Price:</strong> ${cardSummary.highPrice}</p>
                            <p><strong>Low Price:</strong> ${cardSummary.lowPrice}</p>
                            <p><strong>% from Average:</strong> <span style={{ color: cardSummary.percentFromAvg >= 0 ? 'green' : 'red' }}>{cardSummary.percentFromAvg}%</span></p>
                            <p><strong>% from High:</strong> <span style={{ color: cardSummary.percentFromHigh >= 0 ? 'green' : 'red' }}>{cardSummary.percentFromHigh}%</span></p>
                            <p><strong>% from Low:</strong> <span style={{ color: cardSummary.percentFromLow >= 0 ? 'green' : 'red' }}>{cardSummary.percentFromLow}%</span></p>
                            <p><strong>Total Return:</strong> <span style={{ color: cardSummary.totalReturn >= 0 ? 'green' : 'red' }}>{cardSummary.totalReturn}%</span></p>
                        </div>
                    </div>
                    <img src={cardDetails[selectedCardId].image} alt="Card" className="summary-card-image" />
                </div>
            )}
            <div className="table-chart-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'flex-end' }}>
                {priceResponse.length > 0 && (
                    <div className="chart-container" ref={chartRef} style={{ width: '500px', height: '500px', border: '4px solid peru', padding: '10px' }}>
                        <Plot
                            data={[
                                plotData,
                                {
                                    x: movingAvg50Dates,
                                    y: movingAvg50Filtered,
                                    type: 'scatter',
                                    mode: 'lines',
                                    line: { color: 'navy' },
                                    name: '50-day Moving Average'
                                },
                                movingAvg200Filtered.length > 0 && {
                                    x: movingAvg200Dates,
                                    y: movingAvg200Filtered,
                                    type: 'scatter',
                                    mode: 'lines',
                                    line: { color: 'magenta' },
                                    name: '200-day Moving Average'
                                }
                            ].filter(Boolean)}
                            layout={{
                                title: 'Price History',
                                xaxis: { title: 'Closing Date', showgrid: false, automargin: true },
                                yaxis: { title: 'Price', showgrid: false, automargin: true },
                                showlegend: true,
                                legend: { orientation: 'h', y: -0.6 }, // Move the legend lower
                                margin: { l: 70, r: 50, b: 150, t: 50, pad: 10 },
                                shapes: [
                                    {
                                        type: 'line',
                                        x0: 0,
                                        x1: 1,
                                        xref: 'paper',
                                        y0: avgPrice,
                                        y1: avgPrice,
                                        line: {
                                            color: 'red',
                                            width: 2,
                                            dash: 'dash'
                                        }
                                    }
                                ]
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                )}
                {priceResponse.length > 0 && (
                    <div className="box-plot-container" style={{ width: '500px', height: '500px', border: '4px solid peru', padding: '10px' }}>
                        <Plot
                            data={[boxPlotData]}
                            layout={{
                                title: cardDetails[selectedCardId]?.description || 'Price Distribution',
                                yaxis: { title: 'Price', showgrid: false, automargin: true },
                                margin: { l: 70, r: 50, b: 50, t: 50, pad: 10 },
                                showlegend: false,
                            }}
                            config={{ responsive: true }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                )}
            </div>
            <div className="table-container">
                <h2>Card Search Results</h2>
                {apiResponse.length > 0 && (
                    <table className="card-hedge-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Player</th>
                                <th>Set</th>
                                <th>Number</th>
                                <th>Variant</th>
                                <th>Card ID</th>
                                <th>Image</th>
                                <th>Category</th>
                                <th>Category Group</th>
                                <th>Set Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiResponse.map((card, index) => (
                                <tr key={index}>
                                    <td>{card.description}</td>
                                    <td>{card.player}</td>
                                    <td>{card.set}</td>
                                    <td>{card.number}</td>
                                    <td>{card.variant}</td>
                                    <td>
                                        <a href="#" onClick={() => handleCardIdClick(card.card_id)}>
                                            {card.card_id}
                                        </a>
                                    </td>
                                    <td><img src={card.image} alt="Card" className="card-image" /></td>
                                    <td>{card.category}</td>
                                    <td>{card.category_group}</td>
                                    <td>{card.set_type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {cardDetails[selectedCardId] && (
                            <>
                                <img src={cardDetails[selectedCardId].image} alt="Card" className="modal-card-image" />
                                <p><strong>Description:</strong> {cardDetails[selectedCardId].description}</p>
                                <p><strong>Number:</strong> {cardDetails[selectedCardId].number}</p>
                                <p><strong>Variant:</strong> {cardDetails[selectedCardId].variant}</p>
                                <p><strong>Card ID:</strong> {cardDetails[selectedCardId].card_id}</p>
                            </>
                        )}
                        <form onSubmit={handleFormSubmit}>
                            <div>
                                <label>
                                    Number of Days (Price History):
                                    <input
                                        type="number"
                                        value={numberOfDays}
                                        onChange={handleNumberOfDaysChange}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Grade:
                                    <select value={grade} onChange={handleGradeChange} required>
                                        <option value="PSA 10">PSA 10</option>
                                        <option value="SGC 10">SGC 10</option>
                                        <option value="BGS 10">BGS 10</option>
                                        <option value="CGC 10">CGC 10</option>
                                        <option value="CSG 10">CSG 10</option>
                                        <option value="RAW">RAW</option>
                                    </select>
                                </label>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit">Get Prices</button>
                                <button type="button" onClick={handleModalClose}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}
            <p className="source-description-card-hedge">
                Source: Card Hedge. Real-time pricing data and detailed information about individual cards using an extensive database that includes names, series, rarity, and other details. Data source contains over 1 million cards, including prices for all major graders.
            </p>
        </div>
    );
};

export default PageCardHedge;
