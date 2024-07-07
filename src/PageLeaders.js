import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import './App.css';

const PageLeaders = () => {
    const [leaders, setLeaders] = useState({});

    useEffect(() => {
        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: process.env.REACT_APP_AWS_REGION
        });

        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'Sports_Stats/baseball_leaders.json'
        };

        s3.getObject(params, (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const jsonData = JSON.parse(data.Body.toString('utf-8'));
            setLeaders(jsonData);
        });
    }, []);

    return (
        <div className="page-leaders">
            <h1>Sports Leaderboards</h1>
            <p>View current season statistics leaders for players across football, basketball, and baseball</p>
            <div className="vertical-leaders">
                <div className="large-container">
                    <h2>Football Leaders</h2>
                    {/* Add football leaderboard content here */}
                </div>
                <div className="large-container">
                    <h2>Basketball Leaders</h2>
                    {/* Add basketball leaderboard content here */}
                </div>
                <div className="large-container">
                    <h2>Baseball Leaders</h2>
                    {Object.keys(leaders).map(section => (
                        <div key={section}>
                            <h3>{section}</h3>
                            {leaders[section].map((table, index) => (
                                <div key={index}>
                                    <h4>{table.title}</h4>
                                    <table className="leaderboard-table">
                                        <thead>
                                            <tr>
                                                {table.data.length > 0 && Object.keys(table.data[0]).map(header => (
                                                    <th key={header}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.data.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {Object.values(row).map((cell, cellIndex) => (
                                                        <td key={cellIndex}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PageLeaders;
