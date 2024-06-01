import React from 'react';

const Page1 = () => {
    return (
        <div>
            <h1>Longhorn Cards Scoreboard</h1>
            <iframe
                src="http://127.0.0.1:8050"
                style={{ width: '100%', height: '600px', border: 'none' }}
                title="Scoreboard"
            ></iframe>
        </div>
    );
};

export default Page1;
