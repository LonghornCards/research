import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import './App.css'; // Ensure this path is correct based on your project structure

const PageCSI = () => {
    const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        // Fetch CSV data from AWS S3
        const fetchData = async () => {
            const response = await fetch('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/CSI_Index_Returns.csv');
            const reader = response.body.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value);
            const parsedData = Papa.parse(csv, { header: true });
            // Filter out any rows that are empty or contain only empty cells
            const filteredData = parsedData.data.filter(row =>
                Object.values(row).some(value => value.trim() !== '')
            );
            setCsvData(filteredData);
        };

        fetchData();
    }, []);

    const formatValue = (value, key) => {
        if (key !== 'Index') {
            const floatValue = parseFloat(value.replace('%', ''));
            const isPositive = floatValue >= 0;
            return (
                <td className={isPositive ? 'positive' : 'negative'}>
                    {floatValue.toFixed(2)}%
                </td>
            );
        }
        return <td>{value}</td>;
    };

    const getValueForChart = (value) => {
        if (value) {
            return parseFloat(value.replace('%', ''));
        }
        return 0;
    };

    const columns = ['Year-to-Date', '1-Month', '3-Months', '1-Year', '3-Years*', '5-Years*', '10-Years*', '20-Years*'];

    return (
        <div className="page-csi" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Helmet>
                <title>Card Price Index Returns</title>
            </Helmet>
            <div className="content-wrapper" style={{ maxWidth: '1200px', textAlign: 'center', padding: '0 10px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h1 style={{ margin: 0 }}>Card Price Index Returns</h1>
                    <p>These index returns reflect average card prices for different subsets across football, basketball, and baseball.</p>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <table style={{ margin: '0 auto', width: '100%', maxWidth: '100%', border: '1px solid peru', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                {csvData.length > 0 && Object.keys(csvData[0]).map((key) => (
                                    <th key={key} style={{ backgroundColor: 'peru', color: 'white', fontWeight: 'bold' }}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, index) => (
                                <tr key={index}>
                                    {Object.entries(row).map(([key, value], i) => (
                                        formatValue(value, key)
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {csvData.length > 0 && columns.map(column => (
                        <div key={column} style={{ margin: '20px auto', width: '100%', maxWidth: '100%' }}>
                            <Plot
                                data={[
                                    {
                                        x: csvData.map(row => row.Index),
                                        y: csvData.map(row => getValueForChart(row[column])),
                                        type: 'bar',
                                        marker: {
                                            color: csvData.map(row => getValueForChart(row[column]) >= 0 ? 'green' : 'red')
                                        },
                                    },
                                ]}
                                layout={{ title: `${column} Returns by Index`, autosize: true }}
                                useResizeHandler={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    ))}
                </div>

                <p>*Annualized Return. Data Source: Card Ladder as of 06/30/2024. Calculations performed by Longhorn Cards & Collectibles.</p>
            </div>
        </div>
    );
};

export default PageCSI;
