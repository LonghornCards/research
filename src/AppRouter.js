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
import BlogPost1 from './blogposts/BlogPost1';
import BlogPost2 from './blogposts/BlogPost2';
import BlogPost3 from './blogposts/BlogPost3';
import BlogPost4 from './blogposts/BlogPost4';
import BlogPost5 from './blogposts/BlogPost5';
import BlogPost6 from './blogposts/BlogPost6';
import BlogPost7 from './blogposts/BlogPost7';
import BlogPost8 from './blogposts/BlogPost8';
import BlogPost9 from './blogposts/BlogPost9';
import BlogPost10 from './blogposts/BlogPost10';
import BlogPost11 from './blogposts/BlogPost11';
import BlogPost12 from './blogposts/BlogPost12';
import BlogPost13 from './blogposts/BlogPost13';
import BlogPost14 from './blogposts/BlogPost14';
import BlogPost15 from './blogposts/BlogPost15';
import BlogPost16 from './blogposts/BlogPost16';
import BlogPost17 from './blogposts/BlogPost17';
import BlogPost18 from './blogposts/BlogPost18';
import BlogPost19 from './blogposts/BlogPost19';
import BlogPost20 from './blogposts/BlogPost20';
import Dashboard from './Dashboard';
import CustomScoreboard from './CustomScoreboard';
import CardPrices from './CardPrices';
import AISearch from './AISearch';
import PageCollection from './PageCollection';
import PagePSA from './PagePSA';
import PageRSS from './PageRSS';
import PageCardHedge from './PageCardHedge';
import PageProfile from './PageProfile';
import PagePlayers from './PagePlayers';
import PagePodcasts from './PagePodcasts';
import PageCSI from './PageCSI';
import PageLonghorns from './PageLonghorns';
import PageSnapshot from './PageSnapshot';
import PagePriceCharts from './PagePriceCharts';
import PageHistory from './PageHistory';
import PageGlossary from './PageGlossary';
import PageGrading from './PageGrading';
import PageBrands from './PageBrands';
import HolyGrail from './HolyGrail'; // New import
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
                <Route path="/blog_post16" element={<BlogPost16 />} />
                <Route path="/blog_post17" element={<BlogPost17 />} />
                <Route path="/blog_post18" element={<BlogPost18 />} />
                <Route path="/blog_post19" element={<BlogPost19 />} />
                <Route path="/blog_post20" element={<BlogPost20 />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customscoreboard" element={<CustomScoreboard />} />
                <Route path="/cardprices" element={<CardPrices />} />
                <Route path="/aisearch" element={<AISearch />} />
                <Route path="/pagecollection" element={<PageCollection />} />
                <Route path="/pagepsa" element={<PagePSA />} />
                <Route path="/pagerss" element={<PageRSS />} />
                <Route path="/pagecardhedge" element={<PageCardHedge />} />
                <Route path="/pageprofile" element={<PageProfile />} />
                <Route path="/pageplayers" element={<PagePlayers />} />
                <Route path="/pagepodcasts" element={<PagePodcasts />} />
                <Route path="/pagecsi" element={<PageCSI />} />
                <Route path="/pagelonghorns" element={<PageLonghorns />} />
                <Route path="/pagesnapshot" element={<PageSnapshot />} />
                <Route path="/pagepricecharts" element={<PagePriceCharts />} />
                <Route path="/pagehistory" element={<PageHistory />} />
                <Route path="/pageglossary" element={<PageGlossary />} />
                <Route path="/pagegrading" element={<PageGrading />} />
                <Route path="/pagebrands" element={<PageBrands />} />
                <Route path="/holygrail" element={<HolyGrail />} /> {/* New route */}
            </Routes>
        </Router>
    );
};

export default AppRouter;
