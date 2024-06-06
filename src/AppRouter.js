import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './App';
import Page_Scoreboard from './Page_Scoreboard';
import Page_Blog from './Page_Blog';
import Page_Store from './Page_Store';
import About from './About';
import Page_GoogleTrends from './Page_GoogleTrends';
import Page_CardSearch from './Page_CardSearch';
import Page_Stats from './Page_Stats';
import Login from './Login';
import PrivacyPolicy from './PrivacyPolicy';
import Page_Products from './Page_Products';
import Page_GradedCards from './Page_GradedCards';
import Page_RawCards from './Page_RawCards'; // Import the Page_RawCards component

import './App.css';

const AppRouter = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/page_scoreboard" element={<Page_Scoreboard />} />
                <Route path="/page_googletrends" element={<Page_GoogleTrends />} />
                <Route path="/page_stats" element={<Page_Stats />} />
                <Route path="/page_cardsearch" element={<Page_CardSearch />} />
                <Route path="/page_blog" element={<Page_Blog />} />
                <Route path="/page_store" element={<Page_Store />} />
                <Route path="/page_products" element={<Page_Products />} />
                <Route path="/page_gradedcards" element={<Page_GradedCards />} />
                <Route path="/page_rawcards" element={<Page_RawCards />} /> {/* Add the Page_RawCards route */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
