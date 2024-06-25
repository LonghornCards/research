import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const PageCollection = () => {
    const [tableData, setTableData] = useState(() => {
        const savedData = localStorage.getItem('tableData');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [costRange, setCostRange] = useState([0, 1000]);
    const [qtyRange, setQtyRange] = useState([0, 1000]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [fileName, setFileName] = useState('No file chosen');
    const fileInputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('tableData', JSON.stringify(tableData));
    }, [tableData]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    const newData = results.data.map(row => ({
                        Title: row.Title,
                        Price: parseFloat(row.Price).toFixed(2),
                        Cost: parseInt(row.Cost, 10),
                        Qty: parseInt(row.Qty, 10),
                        Date: new Date(row.Date).toISOString().substr(0, 10),
                        Tags: row.Tags || ''
                    }));

                    setTableData((prevTableData) => {
                        const updatedData = [...prevTableData];

                        newData.forEach(newRow => {
                            const existingIndex = updatedData.findIndex(row => row.Title === newRow.Title);

                            if (existingIndex !== -1) {
                                updatedData[existingIndex] = newRow;
                            } else {
                                updatedData.push(newRow);
                            }
                        });

                        return updatedData;
                    });
                }
            });
        }
    };

    const handleInputChange = (index, field, value) => {
        const newData = [...tableData];
        if (field === 'Date') {
            newData[index][field] = value;
        } else if (field === 'Price') {
            newData[index][field] = parseFloat(value).toFixed(2);
        } else if (field === 'Tags') {
            newData[index][field] = value;
        } else {
            newData[index][field] = parseInt(value, 10);
        }
        setTableData(newData);
    };

    const handleCheckboxChange = (index) => {
        const newSelectedRows = [...selectedRows];
        if (newSelectedRows.includes(index)) {
            const rowIndex = newSelectedRows.indexOf(index);
            newSelectedRows.splice(rowIndex, 1);
        } else {
            newSelectedRows.push(index);
        }
        setSelectedRows(newSelectedRows);
    };

    const deleteSelectedRows = () => {
        const newData = tableData.filter((_, index) => !selectedRows.includes(index));
        setTableData(newData);
        setSelectedRows([]);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Collection');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, 'CardCollection.xlsx');
    };

    const addNewRow = () => {
        const newRow = {
            Title: '',
            Price: 0,
            Cost: 0,
            Qty: 0,
            Date: new Date().toISOString().substr(0, 10),
            Tags: ''
        };
        setTableData([...tableData, newRow]);
    };

    const deleteCollection = () => {
        setTableData([]);
    };

    const cardCount = tableData.filter(row => row.Title && typeof row.Title === 'string').length;
    const cardQuantity = tableData.reduce((sum, row) => sum + (row.Qty || 0), 0);
    const totalValue = tableData.reduce((sum, row) => sum + ((row.Price * row.Qty) || 0), 0);
    const totalCost = tableData.reduce((sum, row) => sum + ((row.Cost * row.Qty) || 0), 0);

    const totalGainLoss = totalValue - totalCost;
    const totalPercentageGainLoss = totalCost !== 0 ? Math.round((totalValue / totalCost - 1) * 100) : 'N/A';

    const formatNumber = (num) => {
        return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const getBaseName = (title) => {
        return title.replace(/\s*\([^)]*\)/g, '').replace(/\s*\/\d+\s*/g, '').trim();
    };

    const calculateGainLoss = (price, cost, qty) => {
        return Math.round((price - cost) * qty);
    };

    const calculatePercentageGainLoss = (price, cost) => {
        return cost !== 0 ? Math.round(((price / cost) - 1) * 100) : 'N/A';
    };

    const getGainLossClass = (value) => {
        return value >= 0 ? 'gain-positive' : 'gain-negative';
    };

    const getPercentageGainLossClass = (percentage) => {
        const numericValue = parseFloat(percentage);
        return numericValue >= 0 ? 'gain-positive' : 'gain-negative';
    };

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleTagChange = (selectedOptions) => {
        const selected = selectedOptions.map(option => option.value);
        setSelectedTags(selected);
    };

    const handlePriceRangeChange = (event, index) => {
        const newRange = [...priceRange];
        newRange[index] = event.target.value;
        setPriceRange(newRange);
    };

    const handleCostRangeChange = (event, index) => {
        const newRange = [...costRange];
        newRange[index] = event.target.value;
        setCostRange(newRange);
    };

    const handleQtyRangeChange = (event, index) => {
        const newRange = [...qtyRange];
        newRange[index] = event.target.value;
        setQtyRange(newRange);
    };

    const getUniqueTags = () => {
        const allTags = tableData.reduce((acc, row) => {
            if (row.Tags) {
                acc.push(...row.Tags.split(',').map(tag => tag.trim()));
            }
            return acc;
        }, []);
        return [...new Set(allTags)];
    };

    const filteredData = tableData.filter(row =>
        row.Title.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedTags.length === 0 || selectedTags.every(tag => row.Tags.includes(tag))) &&
        row.Price >= priceRange[0] && row.Price <= priceRange[1] &&
        row.Cost >= costRange[0] && row.Cost <= costRange[1] &&
        row.Qty >= qtyRange[0] && row.Qty <= qtyRange[1]
    );

    const calculateTotals = () => {
        const total = filteredData.reduce((acc, row) => {
            acc.Price += parseFloat(row.Price) * row.Qty;
            acc.Cost += row.Cost * row.Qty;
            acc.Qty += row.Qty;
            acc.GainLoss += parseFloat(calculateGainLoss(row.Price, row.Cost, row.Qty));
            return acc;
        }, { Price: 0, Cost: 0, Qty: 0, GainLoss: 0 });

        const avgPercentageGainLoss = total.Cost !== 0 ? Math.round(((total.Price / total.Cost) - 1) * 100) : 'N/A';

        return {
            Price: total.Price.toFixed(2),
            Cost: total.Cost.toFixed(2),
            Qty: total.Qty,
            GainLoss: total.GainLoss,
            AvgPercentageGainLoss: avgPercentageGainLoss
        };
    };

    const totals = calculateTotals();

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        const sortedData = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        setTableData(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortButton = (key) => (
        <div className="sort-button-container">
            <button onClick={() => sortData(key)} className="sort-button">▲</button>
            <button onClick={() => sortData(key)} className="sort-button">▼</button>
        </div>
    );

    const uniqueTags = getUniqueTags().sort();
    const tagOptions = uniqueTags.map(tag => ({ value: tag, label: tag }));

    const resetFilters = () => {
        setSearchText('');
        setSelectedTags([]);
        setPriceRange([0, 1000]);
        setCostRange([0, 1000]);
        setQtyRange([0, 1000]);
    };

    const chartData = {
        labels: filteredData.map(row => row.Title),
        datasets: [{
            label: 'Quantity',
            data: filteredData.map(row => row.Qty),
            backgroundColor: 'peru'
        }]
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const row = filteredData[context.dataIndex];
                        return [
                            `Title: ${row.Title}`,
                            `Price: ${row.Price}`,
                            `Cost: ${row.Cost}`,
                            `Qty: ${row.Qty}`,
                            `Gain/Loss: ${calculateGainLoss(row.Price, row.Cost, row.Qty)}`,
                            `% Gain/Loss: ${calculatePercentageGainLoss(row.Price, row.Cost)}%`
                        ];
                    }
                }
            }
        },
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    color: 'black'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    },
                    color: 'black'
                }
            }
        },
        layout: {
            padding: {
                bottom: 20, // Added padding to provide space for x-axis labels
            },
        },
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="page-collection-custom">
            <div className="input-container-with-image">
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/portfolioimage.png" alt="Portfolio" className="side-image" />
                <h1 className="page-title-custom">Build Your Card Collection</h1>
            </div>
            <p className="page-description-custom">Add your card collection to store and update market prices</p>
            <div className="file-upload-container">
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/upload.svg"
                    alt="Upload CSV File"
                    className="upload-image-custom"
                    title="Upload CSV File"
                    style={{ cursor: 'pointer', height: '40px', marginRight: '10px' }}
                    onClick={handleImageClick}
                />
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="file-input-custom"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <span>{fileName}</span>
                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/sample_csv.csv" target="_blank" rel="noopener noreferrer" className="sample-csv-link" style={{ textDecoration: 'underline' }}>
                    See Sample .csv File
                </a>
            </div>
            <div className="summary-container-custom">
                <div>Card Count: {cardCount}</div>
                <div>Card Quantity: {cardQuantity}</div>
                <div>Total Value: ${formatNumber(totalValue)}</div>
                <div>Total Cost: ${formatNumber(totalCost)}</div>
                <div>Total Gain/Loss: <span className={totalGainLoss >= 0 ? 'gain-positive' : 'gain-negative'}>${formatNumber(totalGainLoss)}</span></div>
                <div>Total % Gain/Loss: <span className={totalPercentageGainLoss >= 0 ? 'gain-positive' : 'gain-negative'}>{totalPercentageGainLoss}%</span></div>
            </div>
            <div className="search-container-custom">
                <div className="search-group">
                    <label htmlFor="search">Search Card Titles:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        className="search-input-custom input-title-long"
                    />
                </div>
                <div className="search-group">
                    <label htmlFor="tags" className="tags-label">Select Tags:</label>
                    <Select
                        id="tags"
                        isMulti
                        value={tagOptions.filter(option => selectedTags.includes(option.value))}
                        onChange={handleTagChange}
                        options={tagOptions}
                        className="tags-select-custom"
                        classNamePrefix="select"
                    />
                </div>
                <div className="search-group">
                    <label htmlFor="price-range" className="price-range-label">Price Range:</label>
                    <input
                        type="number"
                        id="price-range-min"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(e, 0)}
                        className="price-range-input"
                    />
                    <input
                        type="number"
                        id="price-range-max"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(e, 1)}
                        className="price-range-input"
                    />
                </div>
                <div className="search-group">
                    <label htmlFor="cost-range" className="cost-range-label">Cost Range:</label>
                    <input
                        type="number"
                        id="cost-range-min"
                        value={costRange[0]}
                        onChange={(e) => handleCostRangeChange(e, 0)}
                        className="cost-range-input"
                    />
                    <input
                        type="number"
                        id="cost-range-max"
                        value={costRange[1]}
                        onChange={(e) => handleCostRangeChange(e, 1)}
                        className="cost-range-input"
                    />
                </div>
                <div className="search-group">
                    <label htmlFor="qty-range" className="qty-range-label">Qty Range:</label>
                    <input
                        type="number"
                        id="qty-range-min"
                        value={qtyRange[0]}
                        onChange={(e) => handleQtyRangeChange(e, 0)}
                        className="qty-range-input"
                    />
                    <input
                        type="number"
                        id="qty-range-max"
                        value={qtyRange[1]}
                        onChange={(e) => handleQtyRangeChange(e, 1)}
                        className="qty-range-input"
                    />
                </div>
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/reset.svg"
                    alt="Reset Filters"
                    className="reset-filters-image-custom"
                    title="Reset Filters"
                    style={{ cursor: 'pointer', height: '40px' }}
                    onClick={resetFilters}
                />
            </div>
            <div className="table-container-custom">
                <table className="collection-table-custom">
                    <thead>
                        <tr>
                            <th>Delete Row</th>
                            <th>News Search</th>
                            <th>Price Search</th>
                            <th>Base Name</th>
                            <th>
                                Title {getSortButton('Title')}
                            </th>
                            <th>
                                Price {getSortButton('Price')}
                            </th>
                            <th>
                                Cost {getSortButton('Cost')}
                            </th>
                            <th>
                                Qty {getSortButton('Qty')}
                            </th>
                            <th>
                                Date {getSortButton('Date')}
                            </th>
                            <th>
                                Gain/Loss {getSortButton('GainLoss')}
                            </th>
                            <th>
                                % Gain/Loss {getSortButton('PercentageGainLoss')}
                            </th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(index)}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>
                                <td>
                                    <Link to={`/aisearch?query=${encodeURIComponent(getBaseName(row.Title))}`}>
                                        Search News
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/cardprices?query=${encodeURIComponent(getBaseName(row.Title))}`}>
                                        Search Price
                                    </Link>
                                </td>
                                <td className="base-name-column">{getBaseName(row.Title)}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.Title}
                                        onChange={(e) => handleInputChange(index, 'Title', e.target.value)}
                                        className="input-title-custom"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={row.Price}
                                        onChange={(e) => handleInputChange(index, 'Price', e.target.value)}
                                        className="input-custom input-price-custom"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.Cost}
                                        onChange={(e) => handleInputChange(index, 'Cost', e.target.value)}
                                        className="input-custom input-cost-custom"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.Qty}
                                        onChange={(e) => handleInputChange(index, 'Qty', e.target.value)}
                                        className="input-custom input-qty-custom"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={row.Date}
                                        onChange={(e) => handleInputChange(index, 'Date', e.target.value)}
                                        className="input-custom input-date-custom"
                                    />
                                </td>
                                <td className={getGainLossClass(calculateGainLoss(row.Price, row.Cost, row.Qty))}>
                                    {calculateGainLoss(row.Price, row.Cost, row.Qty)}
                                </td>
                                <td className={getPercentageGainLossClass(calculatePercentageGainLoss(row.Price, row.Cost))}>
                                    {calculatePercentageGainLoss(row.Price, row.Cost)}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.Tags}
                                        onChange={(e) => handleInputChange(index, 'Tags', e.target.value)}
                                        className="input-tags-custom"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5">Totals</td>
                            <td>${totals.Price}</td>
                            <td>${totals.Cost}</td>
                            <td>{totals.Qty}</td>
                            <td></td> {/* Empty cell under Date column */}
                            <td className={totals.GainLoss >= 0 ? 'gain-positive' : 'gain-negative'}>${totals.GainLoss}</td>
                            <td className={totals.AvgPercentageGainLoss >= 0 ? 'gain-positive' : 'gain-negative'}>{totals.AvgPercentageGainLoss}%</td>
                            <td></td> {/* Empty cell under Tags column */}
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="button-group-custom">
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/plus.svg"
                    alt="Add New Row"
                    onClick={addNewRow}
                    className="add-row-image-custom"
                    title="Add New Row"
                    style={{ cursor: 'pointer', height: '40px' }}
                />
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/minus.svg"
                    alt="Delete Selected Rows"
                    onClick={deleteSelectedRows}
                    className="delete-rows-image-custom"
                    title="Delete Selected Rows"
                    style={{ cursor: 'pointer', height: '40px' }}
                />
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/csv.svg"
                    alt="Export to CSV"
                    onClick={exportToExcel}
                    className="export-image-custom"
                    title="Export to CSV"
                    style={{ cursor: 'pointer', height: '40px' }}
                />
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/delete.svg"
                    alt="Delete Collection"
                    onClick={deleteCollection}
                    className="delete-image-custom"
                    title="Delete Collection"
                    style={{ cursor: 'pointer', height: '40px' }}
                />
            </div>
            <div className="chart-container" style={{ border: '5px solid peru', padding: '20px', marginTop: '20px' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="footer">
                Longhorn Cards & Collectibles LLC
            </div>
        </div>
    );
};

export default PageCollection;
