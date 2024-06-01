import React from 'react';
import './App.css';
// import Home from './Home';


function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Welcome to Longhorn Cards Research!</h1>
            </header>
            <img src="https://github.com/LonghornCards/research/raw/main/LogoSimple.jpg" alt="Logo" className="logo" />
            <p>
                This page is under construction. Please visit our sister site at {' '}
                <a href="https://www.longhorncardsatx.com" target="_blank" rel="noopener noreferrer">
                    Longhorn Cards & Collectibles
                </a>.
            </p>
        </div>
    );
}

export default App;
