import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import * as XLSX from 'xlsx';

const GradingScatterplot = () => {
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Card_Grade_Price_Data.xlsx');
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const companies = jsonData.map(row => row.Company);
            const prices = jsonData.map(row => row['Min Price']);
            const turnaround = jsonData.map(row => row.Turnaround);

            const textpositions = companies.map((_, index) => {
                return index % 2 === 0 ? 'top right' : 'bottom left';
            });

            const trace = {
                x: turnaround,
                y: prices,
                mode: 'markers+text',
                type: 'scatter',
                text: companies,
                textposition: textpositions,
                textfont: {
                    color: 'black',
                    size: 14
                },
                marker: {
                    opacity: 0
                }
            };

            const layout = {
                title: 'Card Grading Companies: Price vs Turnaround',
                xaxis: { title: 'Turnaround Time (days)', showgrid: false },
                yaxis: { title: 'Minimum Price ($)', showgrid: false },
                shapes: [
                    {
                        type: 'rect',
                        xref: 'x',
                        yref: 'y',
                        x0: 0,
                        y0: 0,
                        x1: 90,
                        y1: 50,
                        fillcolor: 'rgba(255, 255, 0, 0.3)',
                        line: {
                            width: 0
                        }
                    },
                    {
                        type: 'rect',
                        xref: 'x',
                        yref: 'y',
                        x0: 0,
                        y0: 0,
                        x1: 60,
                        y1: 40,
                        fillcolor: 'rgba(0, 0, 255, 0.3)',
                        line: {
                            width: 0
                        }
                    },
                    {
                        type: 'rect',
                        xref: 'x',
                        yref: 'y',
                        x0: 0,
                        y0: 0,
                        x1: 30,
                        y1: 20,
                        fillcolor: 'rgba(0, 128, 0, 0.3)',
                        line: {
                            width: 0
                        }
                    }
                ]
            };

            Plotly.newPlot('gradingScatterPlot', [trace], layout);
        };

        fetchData();
    }, []);

    return (
        <div id="GradingScatterplot" className="company-section">
            <h2>Grading Scatterplot</h2>
            <div id="gradingScatterPlot" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default GradingScatterplot;
