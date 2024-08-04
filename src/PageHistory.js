import React from 'react';
import { Helmet } from 'react-helmet';
import './App.css'; // Importing the CSS for styling

// Importing new components from the PAGE-HISTORY folder
import OverviewSummary from './PAGE-HISTORY/OverviewSummary';
import HowitStarted from './PAGE-HISTORY/HowitStarted';
import PreWW from './PAGE-HISTORY/PreWW';
import PostWW from './PAGE-HISTORY/PostWW';
import JunkWax from './PAGE-HISTORY/JunkWax';
import ModernTimes from './PAGE-HISTORY/ModernTimes';
import FutureTrends from './PAGE-HISTORY/FutureTrends';
import RetailHobby from './PAGE-HISTORY/RetailHobby';
import CardVarieties from './PAGE-HISTORY/CardVarieties';
import GradingCompanies from './PAGE-HISTORY/GradingCompanies';
import Figures from './PAGE-HISTORY/Figures'; // Importing the Figures component

const PageHistory = () => {
    return (
        <div className="history-container" style={{ paddingTop: '70px' }}>
            <Helmet>
                <title>History of Sports Trading Cards</title>
            </Helmet>
            <h1 className="page-title">The History of Sports Trading Cards</h1>
            <div className="toc-wrapper">
                <h2>Table of Contents</h2>
                <ul>
                    <li><a href="#overview-summary">Overview Summary</a></li>
                    <li><a href="#how-it-started">How it Started</a></li>
                    <li><a href="#pre-ww2">Pre-World War II Era</a></li>
                    <li><a href="#post-war-boom">Post-War Boom Era</a></li>
                    <li><a href="#junk-wax-era">Junk Wax Era</a></li>
                    <li><a href="#modern-evolutions">Modern Evolutions & Creation of Scarcity</a></li>
                    <li><a href="#future-trends">Trends of the Future</a></li>
                    <li><a href="#retail-vs-hobby">Retail vs. Hobby Box Products</a></li>
                    <li><a href="#card-varieties">Understanding Card Varieties</a></li>
                    <li><a href="#grading-companies">Sports Card Grading Companies</a></li>
                </ul>
                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/History_Of_Trading_Cards.pdf" target="_blank" rel="noopener noreferrer" className="download-link">Download PDF</a>
            </div>
            <div className="content-wrapper">
                <div className="text-container">
                    <section id="overview-summary" className="content-section">
                        <OverviewSummary />
                    </section>
                    <section id="how-it-started" className="content-section">
                        <HowitStarted />
                    </section>
                    <section id="pre-ww2" className="content-section">
                        <PreWW />
                    </section>
                    <section id="post-war-boom" className="content-section">
                        <PostWW />
                    </section>
                    <section id="junk-wax-era" className="content-section">
                        <JunkWax />
                    </section>
                    <section id="modern-evolutions" className="content-section">
                        <ModernTimes />
                    </section>
                    <section id="future-trends" className="content-section">
                        <FutureTrends />
                    </section>
                    <section id="retail-vs-hobby" className="content-section">
                        <RetailHobby /> {/* Updated component usage */}
                    </section>
                    <section id="card-varieties" className="content-section">
                        <CardVarieties />
                    </section>
                    <section id="grading-companies" className="content-section">
                        <GradingCompanies />
                    </section>
                </div>
                {/* Use the Figures component to display all the images */}
                <Figures />
            </div>
        </div>
    );
};

export default PageHistory;
