import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar'; // Ensure the import matches the file name
import Home from './App';
import Page_Scoreboard from './Page_Scoreboard';
import Page_Blog from './Page_Blog';
import Page3 from './Page3';
import About from './About';
import './App.css';

const AppRouter = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/page_scoreboard" element={<Page_Scoreboard />} />
                <Route path="/page_blog" element={<Page_Blog />} />
                <Route path="/page3" element={<Page3 />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
