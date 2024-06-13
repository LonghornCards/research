// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './App';
import PageScoreboard from './PageScoreboard';
import PageBlog from './PageBlog';
import About from './About';
import PageGoogleTrends from './PageGoogleTrends';
import PageCardSearch from './PageCardSearch';
import PageStats from './PageStats';
import Login from './Login';
import PrivacyPolicy from './PrivacyPolicy';
import PageProducts from './PageProducts';
import PageGradedCards from './PageGradedCards';
import PageRawCards from './PageRawCards';
import PageReturns from './PageReturns';
import BlogPost1 from './BlogPost1';
import BlogPost2 from './BlogPost2';
import BlogPost3 from './BlogPost3';
import BlogPost4 from './BlogPost4';
import BlogPost5 from './BlogPost5';
import BlogPost6 from './BlogPost6';
import BlogPost7 from './BlogPost7';
import BlogPost8 from './BlogPost8';
import BlogPost9 from './BlogPost9';
import BlogPost10 from './BlogPost10';
import BlogPost11 from './BlogPost11';
import BlogPost12 from './BlogPost12';
import BlogPost13 from './BlogPost13';
import BlogPost14 from './BlogPost14';
import BlogPost15 from './BlogPost15';
import BlogPost16 from './BlogPost16'; // Import the new BlogPost16 component

import './App.css';

const AppRouter = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pagescoreboard" element={<PageScoreboard />} />
                <Route path="/pagegoogletrends" element={<PageGoogleTrends />} />
                <Route path="/pagestats" element={<PageStats />} />
                <Route path="/pagecardsearch" element={<PageCardSearch />} />
                <Route path="/pageblog" element={<PageBlog />} />
                <Route path="/pageproducts" element={<PageProducts />} />
                <Route path="/pagegradedcards" element={<PageGradedCards />} />
                <Route path="/pagerawcards" element={<PageRawCards />} />
                <Route path="/pagereturns" element={<PageReturns />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/login" element={<Login />} />
                <Route path="/blog_post1" element={<BlogPost1 />} />
                <Route path="/blog_post2" element={<BlogPost2 />} />
                <Route path="/blog_post3" element={<BlogPost3 />} />
                <Route path="/blog_post4" element={<BlogPost4 />} />
                <Route path="/blog_post5" element={<BlogPost5 />} />
                <Route path="/blog_post6" element={<BlogPost6 />} />
                <Route path="/blog_post7" element={<BlogPost7 />} />
                <Route path="/blog_post8" element={<BlogPost8 />} />
                <Route path="/blog_post9" element={<BlogPost9 />} />
                <Route path="/blog_post10" element={<BlogPost10 />} />
                <Route path="/blog_post11" element={<BlogPost11 />} />
                <Route path="/blog_post12" element={<BlogPost12 />} />
                <Route path="/blog_post13" element={<BlogPost13 />} />
                <Route path="/blog_post14" element={<BlogPost14 />} />
                <Route path="/blog_post15" element={<BlogPost15 />} />
                <Route path="/blog_post16" element={<BlogPost16 />} /> {/* Add the new BlogPost16 route */}
            </Routes>
        </Router>
    );
};

export default AppRouter;
