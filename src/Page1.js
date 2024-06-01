import React from 'react';
import './App.css'; // Ensure you have the styles in App.css

const Page1 = () => {
    return (
        <div className="page-container">
            <h1>Longhorn Cards Scoreboard</h1>
            <iframe
                src="http://127.0.0.1:8050" // Ensure this URL matches the one printed by your Dash app
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="Scoreboard"
            ></iframe>
        </div>
    );
};

export default Page1;
