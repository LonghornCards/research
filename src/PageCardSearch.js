import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const Page_CardSearch = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [brand, setBrand] = useState('');
    const [season, setSeason] = useState('');
    const [parallel, setParallel] = useState('');
    const [cardNum, setCardNum] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();

        let searchUrl = 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw=';

        if (season.trim()) {
            searchUrl += `${encodeURIComponent(season.trim())}+`;
        }
        if (manufacturer.trim()) {
            searchUrl += `${encodeURIComponent(manufacturer.trim())}+`;
        }
        if (brand.trim()) {
            searchUrl += `${encodeURIComponent(brand.trim())}+`;
        }
        if (cardNum.trim()) {
            searchUrl += `%23${encodeURIComponent(cardNum.trim())}+`;
        }
        if (firstName.trim()) {
            searchUrl += `${encodeURIComponent(firstName.trim())}+`;
        }
        if (lastName.trim()) {
            searchUrl += `${encodeURIComponent(lastName.trim())}+`;
        }
        if (parallel.trim()) {
            searchUrl += `${encodeURIComponent(parallel.trim())}+`;
        }

        searchUrl += '&_sacat=261328&_odkw=&_osacat=261328&LH_Complete=1&LH_Sold=1';
        window.open(searchUrl, '_blank');
    };

    return (
        <div className="page-card-search">
            <Helmet>
                <title>Search eBay Card Sales</title>
            </Helmet>
            <div className="video-background-container">
                <video className="video-background" autoPlay muted loop playsInline>
                    <source src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/background_cardsearch.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="content">
                <div className="title-container">
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/ebay.png" alt="eBay Logo" className="title-image" />
                    <h1>eBay Sale Card Search</h1>
                </div>
                <form className="search-box" onSubmit={handleSearch}>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Season"
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Manufacturer"
                            value={manufacturer}
                            onChange={(e) => setManufacturer(e.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Parallel"
                            value={parallel}
                            onChange={(e) => setParallel(e.target.value)}
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Card #"
                            value={cardNum}
                            onChange={(e) => setCardNum(e.target.value)}
                        />
                    </div>
                    <button type="submit">Search</button>
                </form>
                <div className="glossary">
                    <p><strong>Example Card:</strong> 2022-23 Panini Prizm #196 Luka Doncic Red Ice</p>
                    <p><strong>Example Entry:</strong> First Name: Luka, Last Name: Doncic, Season: 2022, Manufacturer: Panini, Brand: Prizm, Parallel: Red Ice, Card #: 196</p>
                </div>
            </div>
        </div>
    );
};

export default Page_CardSearch;
