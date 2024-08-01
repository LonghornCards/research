import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Plot from 'react-plotly.js';
import moment from 'moment';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import './App.css';

const LazyImage = ({ src, alt }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            });
        });

        observer.observe(imgRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return <img ref={imgRef} src={isVisible ? src : ''} alt={alt} className="card-image" />;
};

const PageOneofOne = () => {
    const [cardData, setCardData] = useState([]);
    const [filteredCardData, setFilteredCardData] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const cardRefs = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Card_Sales_1of1.xlsx',
                    {
                        responseType: 'arraybuffer',
                    }
                );
                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setCardData(json);
                setFilteredCardData(json);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const convertSerialDate = (serial) => {
        const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
        return moment(date).format('MMMM YYYY');
    };

    const sortedCardData = useMemo(() => {
        return [...filteredCardData].sort((a, b) => b['Price Sold'] - a['Price Sold']);
    }, [filteredCardData]);

    const handleBarClick = (data) => {
        const cardTitle = data.points[0].x;
        const cardIndex = sortedCardData.findIndex(card => card['Card Title'] === cardTitle);
        if (cardRefs.current[cardIndex]) {
            cardRefs.current[cardIndex].scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSelectChange = (selectedOptions) => {
        setSelectedCards(selectedOptions || []);
        if (selectedOptions && selectedOptions.length > 0) {
            const selectedTitles = selectedOptions.map(option => option.value);
            setFilteredCardData(cardData.filter(card => selectedTitles.includes(card['Card Title'])));
        } else {
            setFilteredCardData(cardData);
        }
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);

        if (searchValue) {
            const filteredData = cardData.filter(card =>
                card['Card Title'].toLowerCase().includes(searchValue)
            );
            setFilteredCardData(filteredData);
        } else {
            setFilteredCardData(cardData);
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedCards([]);
        setFilteredCardData(cardData);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const cardOptions = cardData.map(card => ({
        value: card['Card Title'],
        label: card['Card Title']
    }));

    const filteredDisplayData = useMemo(() => {
        return selectedCards.length === 0
            ? sortedCardData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            : sortedCardData.filter(card => selectedCards.some(selected => selected.value === card['Card Title']));
    }, [sortedCardData, selectedCards, currentPage]);

    const hobbyBoxPrices = sortedCardData.map(card => card['Price Sold']);
    const averagePrice = hobbyBoxPrices.reduce((acc, price) => acc + price, 0) / hobbyBoxPrices.length;
    const medianPrice = hobbyBoxPrices.sort((a, b) => a - b)[Math.floor(hobbyBoxPrices.length / 2)];

    const totalPages = Math.ceil(filteredCardData.length / itemsPerPage);

    return (
        <div className="page-one-of-one">
            <Helmet>
                <title>One-of-One Gallery</title>
            </Helmet>
            <h1>Sports Trading Card One-of-One (1/1) Gallery</h1>
            <p>
                Welcome to the gallery of one-of-one ("1/1") sports trading cards recently sold across different major platforms.
            </p>
            <p>
                This list only includes Football, Basketball, and Baseball cards with sales prices greater than $1000.  Search for players to see average price levels.
            </p>
            <p>
                Data is through July 2024 and sourced from 17 different platforms including eBay, Goldin, Heritage, My Slabs, Fanatics, ALT, and Pristine Auctions.
            </p>
            {sortedCardData.length > 0 && (
                <Plot
                    data={[
                        {
                            type: 'bar',
                            x: sortedCardData.slice(0, 100).map(card => card['Card Title']), // Only show top 100 items
                            y: sortedCardData.slice(0, 100).map(card => card['Price Sold']),
                            marker: { color: 'peru' },
                            name: 'Price Sold',
                        },
                        {
                            type: 'scatter',
                            x: sortedCardData.slice(0, 100).map(card => card['Card Title']),
                            y: Array(100).fill(averagePrice),
                            mode: 'lines',
                            name: 'Average Price',
                            line: { color: 'blue', dash: 'dash' },
                        },
                        {
                            type: 'scatter',
                            x: sortedCardData.slice(0, 100).map(card => card['Card Title']),
                            y: Array(100).fill(medianPrice),
                            mode: 'lines',
                            name: 'Median Price',
                            line: { color: 'red', dash: 'dot' },
                        },
                    ]}
                    layout={{
                        title: 'One-of-One (1/1) Card Sales',
                        xaxis: {
                            title: 'Card Title',
                            automargin: true,
                            tickfont: { size: 8 },
                            titlefont: { size: 14 },
                        },
                        yaxis: {
                            title: 'Price Sold ($)',
                            automargin: true,
                            type: 'log'
                        },
                        margin: { t: 50, b: 200, l: 50, r: 50 },
                        plot_bgcolor: '#f9f9f9',
                        paper_bgcolor: '#f9f9f9',
                        annotations: [
                            {
                                x: sortedCardData[sortedCardData.length - 1]['Card Title'],
                                y: averagePrice,
                                xref: 'x',
                                yref: 'y',
                                text: `Avg: $${averagePrice.toFixed(2)}`,
                                showarrow: true,
                                arrowhead: 2,
                                ax: 0,
                                ay: -40,
                                font: {
                                    color: 'blue',
                                    size: 12,
                                },
                            },
                            {
                                x: sortedCardData[sortedCardData.length - 1]['Card Title'],
                                y: medianPrice,
                                xref: 'x',
                                yref: 'y',
                                text: `Median: $${medianPrice.toFixed(2)}`,
                                showarrow: true,
                                arrowhead: 2,
                                ax: 0,
                                ay: -20,
                                font: {
                                    color: 'red',
                                    size: 12,
                                },
                            },
                        ],
                    }}
                    onClick={handleBarClick}
                    style={{ width: '100%', height: '1000px' }}
                />
            )}
            <div className="search-and-select-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search Card Titles"
                    className="search-box"
                />
                <Select
                    isMulti
                    options={cardOptions}
                    value={selectedCards}
                    onChange={handleSelectChange}
                    className="multi-select"
                    classNamePrefix="select"
                    placeholder="Select Card Titles"
                />
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/reset.svg"
                    alt="Reset"
                    onClick={handleReset}
                    className="reset-button"
                />
            </div>
            <div className="card-gallery">
                {filteredDisplayData.map((card, index) => (
                    <div key={index} className="card-item" ref={el => cardRefs.current[index] = el}>
                        <a href={card['Image']} target="_blank" rel="noopener noreferrer">
                            <LazyImage src={card['Image']} alt={card['Card Title']} />
                        </a>
                        <div className="card-details">
                            <h2>{card['Card Title']}</h2>
                            <p><strong>Date Sold:</strong> {convertSerialDate(card['Date Sold'])}</p>
                            <p><strong>Price Sold:</strong> ${card['Price Sold'].toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            {filteredCardData.length > itemsPerPage && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="page-number"
                    >
                        First
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-number"
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-number"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="page-number"
                    >
                        Last
                    </button>
                </div>
            )}
        </div>
    );
};

export default PageOneofOne;
