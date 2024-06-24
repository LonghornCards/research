import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import './App.css';

Chart.register(ChartDataLabels);

const CardPrices = () => {
    const [cardDetails, setCardDetails] = useState('');
    const [formattedDetails, setFormattedDetails] = useState('');
    const [cardPrices, setCardPrices] = useState([]);
    const [additionalPrices, setAdditionalPrices] = useState(null);
    const additionalPricesRef = useRef(null);
    const fetchButtonRef = useRef(null);
    const resultsRef = useRef(null);

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();

    useEffect(() => {
        const queryParam = query.get('query');
        if (queryParam) {
            setCardDetails(queryParam);
            const formatted = queryParam.split(' ').join('+');
            setFormattedDetails(formatted);
        }
    }, [query]);

    const handleInputChange = (event) => {
        const input = event.target.value;
        setCardDetails(input);
        const formatted = input.split(' ').join('+');
        setFormattedDetails(formatted);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchButtonRef.current.click();
        }
    };

    const fetchCardPrices = async () => {
        const url = `https://www.sportscardspro.com/api/products?t=8b0ccba1cb45ed4a3db702d1296e7478a26f87a4&q=${formattedDetails}`;

        try {
            const response = await axios.get(url);
            if (response.data && response.data.status === 'success') {
                setCardPrices(response.data.products || []);
                setTimeout(() => {
                    resultsRef.current.scrollIntoView({ behavior: 'smooth' });
                }, 100); // Allow some time for the results to render before scrolling
            }
        } catch (error) {
            console.error('Error fetching card prices:', error);
        }
    };

    const fetchAdditionalPrices = async (id) => {
        const url = `https://www.sportscardspro.com/api/product?t=8b0ccba1cb45ed4a3db702d1296e7478a26f87a4&id=${id}`;

        try {
            const response = await axios.get(url);
            if (response.data && response.data.status === 'success') {
                setAdditionalPrices(response.data);
                setTimeout(() => {
                    additionalPricesRef.current.scrollIntoView({ behavior: 'smooth' });
                }, 100); // Allow some time for the additional prices to render before scrolling
            }
        } catch (error) {
            console.error('Error fetching additional prices:', error);
        }
    };

    const resetInput = () => {
        setCardDetails('');
        setFormattedDetails('');
    };

    const chartData = additionalPrices ? {
        labels: ['PSA 10', 'BGS 9.5', 'Graded 9', 'Graded 8', 'Graded 7', 'Ungraded'],
        datasets: [
            {
                label: additionalPrices['product-name'],
                data: [
                    additionalPrices['manual-only-price'] / 100, // PSA 10 Price
                    additionalPrices['box-only-price'] / 100, // BGS 9.5 Price
                    additionalPrices['graded-price'] / 100,
                    additionalPrices['new-price'] / 100,
                    additionalPrices['cib-price'] / 100,
                    additionalPrices['loose-price'] / 100
                ],
                backgroundColor: [
                    '#CD853F',  // Peru for PSA 10
                    '#C19A6B', // Camel for BGS 9.5
                    '#F5DEB3', // Wheat for Graded 9
                    '#F4A460', // SandyBrown for Graded 8
                    '#D2B48C', // Tan for Graded 7
                    '#A0522D' // Light Brown for Ungraded
                ],
                borderColor: 'rgba(205, 133, 63, 1)',
                borderWidth: 1
            }
        ]
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: 'peru',
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    }
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'peru'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'peru'
                }
            },
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold'
                },
                formatter: (value) => `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
            }
        }
    };

    return (
        <div className="card-prices page-container">
            <Link to="/dashboard" className="return-link">Back to Dashboard</Link>
            <h1 className="center-text">Search for Card Prices</h1>
            <div className="input-container-with-image">
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/sportscardpro.jpeg" alt="Sports Card Pro" className="side-image" />
                <div className="input-container">
                    <div className="input-wrapper">
                        <p className="instruction-text">Enter card details:</p>
                        <input
                            type="text"
                            value={cardDetails}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter card details"
                            className="card-input"
                            maxLength="80"
                        />
                        <div className="button-container">
                            <button ref={fetchButtonRef} onClick={fetchCardPrices} className="fetch-card-prices-button">Fetch Card Prices</button>
                            <button onClick={resetInput} className="reset-button">Reset</button>
                        </div>
                    </div>
                    <p className="example-text">Example: "1986 Fleer Michael Jordan"</p>
                </div>
            </div>
            <p>Formatted Details: {formattedDetails}</p>

            <div ref={resultsRef}>
                {cardPrices.length > 0 && (
                    <div className="card-prices-table-container" style={{ maxHeight: '400px', overflowY: 'auto', margin: '0 auto', width: '100%', maxWidth: '800px' }}>
                        <h3>Cards:</h3>
                        <table className="card-prices-table">
                            <thead>
                                <tr>
                                    <th>Set</th>
                                    <th>ID</th>
                                    <th>Card Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cardPrices.map((card, index) => (
                                    <tr key={index}>
                                        <td>{card['console-name']}</td>
                                        <td>
                                            <a href="#" onClick={() => fetchAdditionalPrices(card.id)}>{card.id}</a>
                                        </td>
                                        <td>{card['product-name']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {additionalPrices && (
                    <div ref={additionalPricesRef} style={{ border: '5px solid peru', padding: '20px', margin: '20px 0', overflowX: 'auto', maxWidth: '100%' }}>
                        <h3>Prices:</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="card-prices-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>ID</th>
                                        <th>Set</th>
                                        <th>Card Title</th>
                                        <th>Ungraded Price</th>
                                        <th>Graded 7 Price</th>
                                        <th>Graded 8 Price</th>
                                        <th>Graded 9 Price</th>
                                        <th>BGS 9.5 Price</th>
                                        <th>PSA 10 Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{additionalPrices.status}</td>
                                        <td>{additionalPrices.id}</td>
                                        <td>{additionalPrices['console-name']}</td>
                                        <td>{additionalPrices['product-name']}</td>
                                        <td>${(additionalPrices['loose-price'] / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>${(additionalPrices['cib-price'] / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>${(additionalPrices['new-price'] / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>${(additionalPrices['graded-price'] / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>${(additionalPrices['box-only-price'] / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>${(additionalPrices['manual-only-price'] / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {chartData && (
                    <div className="chart-container" style={{ width: '100%', height: '400px', marginTop: '20px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}
                <p style={{ color: 'peru', fontStyle: 'italic', marginTop: '20px' }}>
                    Source: SportsCardsPro.com for current and historic sports card prices. Prices are updated daily from sources across the internet so you can be sure the data is accurate and timely. Data from sold listings on eBay and the SportsCardPro Marketplace are used as inputs for proprietary algorithms to calculate the current market price. All of the sales data is combined to determine the current market price. The algorithm will consider things like most recent sale price, median price, average price, and age weighted average price. The algorithm takes outliers into account and the date when sales occurred. The title and description for the listing are used to determine the grade of the card. The prices shown do not include shipping costs or any other transaction related costs. The price shown is the price people are paying for the items themselves.
                </p>
            </div>
        </div>
    );
};

export default CardPrices;
