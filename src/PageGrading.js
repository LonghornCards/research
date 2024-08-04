import React from 'react';
import { Helmet } from 'react-helmet';
import './App.css'; // Importing the CSS for styling

// Importing components from the PAGE-GRADING folder
import Intro from './PAGE-GRADING/Intro';
import PSA from './PAGE-GRADING/PSA';
import BGS from './PAGE-GRADING/BGS';
import SGC from './PAGE-GRADING/SGC';
import CGC from './PAGE-GRADING/CGC';
import ISA from './PAGE-GRADING/ISA';
import HGA from './PAGE-GRADING/HGA';
import TAG from './PAGE-GRADING/TAG';
import ArenaClub from './PAGE-GRADING/ArenaClub';
import RareEdition from './PAGE-GRADING/RareEdition';
import Edge from './PAGE-GRADING/Edge';
import KSA from './PAGE-GRADING/KSA';
import GMG from './PAGE-GRADING/GMG';
import AGS from './PAGE-GRADING/AGS';
import WCG from './PAGE-GRADING/WCG';
import GMA from './PAGE-GRADING/GMA';
import RCG from './PAGE-GRADING/RCG';
import MNT from './PAGE-GRADING/MNT';
import PGI from './PAGE-GRADING/PGI';
import FCG from './PAGE-GRADING/FCG';
import DCI from './PAGE-GRADING/DCI';
import GradingScatterplot from './PAGE-GRADING/GradingScatterplot';
import Conclusion from './PAGE-GRADING/Conclusion';

const PageGrading = () => {
    return (
        <div className="grading-container" style={{ paddingTop: '70px' }}>
            <Helmet>
                <title>Sports Trading Cards Grading Companies</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <h1 className="page-title">Sports Trading Cards Grading Companies</h1>
            <div className="content-wrapper">
                <div className="text-container">
                    <section id="intro" className="content-section">
                        <Intro />
                    </section>
                    <section id="PSA" className="content-section">
                        <PSA />
                    </section>
                    <section id="BGS" className="content-section">
                        <BGS />
                    </section>
                    <section id="SGC" className="content-section">
                        <SGC />
                    </section>
                    <section id="CGC" className="content-section">
                        <CGC />
                    </section>
                    <section id="ISA" className="content-section">
                        <ISA />
                    </section>
                    <section id="HGA" className="content-section">
                        <HGA />
                    </section>
                    <section id="TAG" className="content-section">
                        <TAG />
                    </section>
                    <section id="Arena-Club" className="content-section">
                        <ArenaClub />
                    </section>
                    <section id="Rare-Edition" className="content-section">
                        <RareEdition />
                    </section>
                    <section id="Edge" className="content-section">
                        <Edge />
                    </section>
                    <section id="KSA" className="content-section">
                        <KSA />
                    </section>
                    <section id="GMG" className="content-section">
                        <GMG />
                    </section>
                    <section id="AGS" className="content-section">
                        <AGS />
                    </section>
                    <section id="WCG" className="content-section">
                        <WCG />
                    </section>
                    <section id="GMA" className="content-section">
                        <GMA />
                    </section>
                    <section id="RCG" className="content-section">
                        <RCG />
                    </section>
                    <section id="MNT" className="content-section">
                        <MNT />
                    </section>
                    <section id="PGI" className="content-section">
                        <PGI />
                    </section>
                    <section id="FCG" className="content-section">
                        <FCG />
                    </section>
                    <section id="DCI" className="content-section">
                        <DCI />
                    </section>
                    <section id="grading-scatterplot" className="content-section">
                        <GradingScatterplot />
                    </section>
                    <section id="Conclusion" className="content-section">
                        <Conclusion />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PageGrading;
