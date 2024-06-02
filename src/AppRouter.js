import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './App';
import Page_Scoreboard from './Page_Scoreboard';
import Page2 from './Page2';
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
                <Route path="/page2" element={<Page2 />} />
                <Route path="/page3" element={<Page3 />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
