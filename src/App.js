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
                This page is under construction. Please visit our shop at: {' '}
                <a href="https://www.longhorncardsatx.com" target="_blank" rel="noopener noreferrer">
                    Longhorn Cards & Collectibles
                </a>.
            </p>
            <p>
                Read our current Blog for research & analytics for the sports card market: {' '} 
                <a href="https://longhorncardsatx.com/blogs/news" target="_blank" rel="noopener noreferrer">
                    Blog
                </a>.
            </p>
        </div>
    );
}

export default App;
