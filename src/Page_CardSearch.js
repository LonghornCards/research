import React, { useState } from 'react';

const Page_CardSearch = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSearch = (event) => {
        event.preventDefault(); // Prevent form from submitting
        const formattedFirstName = encodeURIComponent(firstName.trim());
        const formattedLastName = encodeURIComponent(lastName.trim());
        const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${formattedFirstName}+${formattedLastName}&_sacat=64482&LH_SaleItems=1&rt=nc&LH_Sold=1&LH_Complete=1`;
        window.open(searchUrl, '_blank');
    };

    return (
        <div className="page-card-search">
            <div className="video-background-container">
                <video className="video-background" autoPlay muted loop>
                    <source src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/background_cardsearch.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="content">
                <h1>eBay Sale Card Search</h1>
                <form className="search-box" onSubmit={handleSearch}>
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
                    <button type="submit">Search</button>
                </form>
            </div>
        </div>
    );
};

export default Page_CardSearch;
