import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './App.css'; // Reference the App.css file

const PageCSI = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        fetch('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/CSI_Index_Returns.csv')
            .then(response => response.text())
            .then(csv => {
                Papa.parse(csv, {
                    header: true,
                    complete: (results) => {
                        // Filter out rows with no data and get columns
                        const filteredData = results.data.filter(row => Object.values(row).some(value => value));
                        setColumns(Object.keys(results.data[0]));
                        setData(filteredData);
                    }
                });
            });
    }, []);

    const formatCell = (value, isIndex) => {
        if (isIndex) return value;
        const floatValue = parseFloat(value).toFixed(1);
        const color = parseFloat(value) >= 0 ? 'green' : 'red';
        return <span style={{ color }}>{floatValue}%</span>;
    };

    return (
        <div className="page-csi" style={{ paddingTop: '70px' }}>
            <h1 className="page-csi-title">Card Price Index Returns</h1>
            <div className="table-container">
                <table className="index-returns-table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className="index-returns-table-header">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className={`index-returns-table-cell ${col === 'Index' ? '' : 'center'}`}>
                                        {formatCell(row[col], col === 'Index')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ height: '50px' }}></div> {/* Empty container for spacing */}
            <p className="disclosure-paragraph">
                *Annualized Returns; Source: Card Ladder; Calculations performed by Longhorn Cards & Collectibles. Data as of 06/30/2024.
            </p>
        </div>
    );
};

export default PageCSI;
