import React, { useState } from 'react';
import Select from 'react-select';
import { Helmet } from 'react-helmet';
import './App.css';

const options = [
    { value: 'Sports Card Nonsense', label: 'Sports Card Nonsense' },
    { value: 'Sports Card Investor', label: 'Sports Card Investor' },
    { value: 'Sports Card Strategy Show', label: 'Sports Card Strategy Show' },
    { value: 'The Geoff Wilson Show', label: 'The Geoff Wilson Show' },
    { value: 'The True Sports Card Show', label: 'The True Sports Card Show' },
    { value: 'Hobby News Daily', label: 'Hobby News Daily' },
    { value: 'Sports Card Lessons', label: 'Sports Card Lessons' },
    { value: 'Spitballin\' Cards', label: 'Spitballin\' Cards' },
    { value: 'Stacking Slabs', label: 'Stacking Slabs' },
    { value: 'Cards To The Moon', label: 'Cards To The Moon' },
    { value: 'Lefty Cards', label: 'Lefty Cards' },
    { value: 'Sports Cards Live', label: 'Sports Cards Live' },
    { value: 'SlabStox Sports Card Trading', label: 'SlabStox Sports Card Trading' },
    { value: 'The Pat McAfee Show', label: 'The Pat McAfee Show' },
    { value: 'ESPN First Take', label: 'ESPN First Take' },
    { value: 'ESPN Sports Center Update', label: 'ESPN Sports Center Update' },
    { value: 'Fox Sports Radio', label: 'Fox Sports Radio' },
    { value: 'ESPN Daily', label: 'ESPN Daily' },
    { value: 'Card Ladder', label: 'Card Ladder' },
    { value: 'Dr. James Beckett: Sports Card Insights', label: 'Dr. James Beckett: Sports Card Insights' },
    { value: 'The Sports Card Show', label: 'The Sports Card Show' },
    { value: 'Sports Card Nation', label: 'Sports Card Nation' },
    { value: 'The Joe Rogan Experience', label: 'The Joe Rogan Experience' },
    { value: 'Barstool Sports: Barstool Rundown', label: 'Barstool Sports: Barstool Rundown' },
    { value: 'Barstool Sports: Barstool Radio', label: 'Barstool Sports: Barstool Radio' },
];

const PagePodcasts = () => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = selectedOptions => {
        setSelectedOptions(selectedOptions);
    };

    const isSelected = title => {
        return selectedOptions.length === 0 || selectedOptions.some(option => option.value === title);
    };

    return (
        <div className="page-podcasts">
            <Helmet>
                <title>Sports & Hobby Podcasts</title>
            </Helmet>
            <h1>Sports & Hobby Podcasts</h1>
            <p className="page-description">View Recent Podcasts Covering Sports and The Hobby</p>
            <div className="select-container">
                <Select
                    isMulti
                    name="filters"
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select podcasts to filter"
                    onChange={handleChange}
                />
            </div>
            {isSelected('Sports Card Nonsense') && (
                <>
                    <h2 className="container-title">Sports Card Nonsense</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/7wNc6wHkCViK3OcuLJG7mj?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Sports Card Investor') && (
                <>
                    <h2 className="container-title">Sports Card Investor</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/3DDfEsKDIDrTlnPOiG4ZF4/video?utm_source=generator"
                            width="100%"
                            height="351"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Sports Card Strategy Show') && (
                <>
                    <h2 className="container-title">Sports Card Strategy Show</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/4jbdUs62GK9ekON7vaxqz8/video?utm_source=generator"
                            width="100%"
                            height="351"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('The Geoff Wilson Show') && (
                <>
                    <h2 className="container-title">The Geoff Wilson Show</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/19cthTVIfykIAQej3FW3j9/video?utm_source=generator"
                            width="100%"
                            height="351"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('The True Sports Card Show') && (
                <>
                    <h2 className="container-title">The True Sports Card Show</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/38050UAnhnni0YQjINlQdO?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Hobby News Daily') && (
                <>
                    <h2 className="container-title">Hobby News Daily</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/39eXCeAQU1pnF5fyR0SRiF?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Sports Card Lessons') && (
                <>
                    <h2 className="container-title">Sports Card Lessons</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/295SzYQUu19Uk4JjtTjonx?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Spitballin\' Cards') && (
                <>
                    <h2 className="container-title">Spitballin' Cards</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/6jcVZvVqXzujKUFgUVSyhN?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Stacking Slabs') && (
                <>
                    <h2 className="container-title">Stacking Slabs</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/0HX8QMQ8r1yPEUnIMMOO7f?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Cards To The Moon') && (
                <>
                    <h2 className="container-title">Cards To The Moon</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/7cRwSepRkdaHsnFvhXOBmF?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Lefty Cards') && (
                <>
                    <h2 className="container-title">Lefty Cards</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/4saD1tnKUOFPLRuRpl2859/video?utm_source=generator"
                            width="100%"
                            height="351"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Sports Cards Live') && (
                <>
                    <h2 className="container-title">Sports Cards Live</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/3iMRU41zxzhRF1SYkDqyET?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('SlabStox Sports Card Trading') && (
                <>
                    <h2 className="container-title">SlabStox Sports Card Trading</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/4UIahi5DX98Oi3cu9rOAgO?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('The Pat McAfee Show') && (
                <>
                    <h2 className="container-title">The Pat McAfee Show</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/1ol0jP8hrNHydiAd38G6B1?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('ESPN First Take') && (
                <>
                    <h2 className="container-title">ESPN First Take</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/5LUnGGXpNoeaH1K0tWdLiB?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('ESPN Sports Center Update') && (
                <>
                    <h2 className="container-title">ESPN Sports Center Update</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/6asyAuL4QSLw0KhjSj3BUq?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Fox Sports Radio') && (
                <>
                    <h2 className="container-title">Fox Sports Radio</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/6pPEtjrf7IrBQFme1h2zog?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('ESPN Daily') && (
                <>
                    <h2 className="container-title">ESPN Daily</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/3O3sl79wUkXBvf4DVjcYq6?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Card Ladder') && (
                <>
                    <h2 className="container-title">Card Ladder</h2>
                    <div className="podcast-container">
                        <iframe
                            width="100%"
                            height="315"
                            src="https://www.youtube.com/embed/videoseries?si=QjjdUWdI7n4_-sFG&amp;list=PL6ZMizxgpisNV6fUszB103p0K6euXlthE"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Dr. James Beckett: Sports Card Insights') && (
                <>
                    <h2 className="container-title">Dr. James Beckett: Sports Card Insights</h2>
                    <div className="podcast-container">
                        <iframe
                            title="Dr. James Beckett: Sports Card Insights"
                            allowTransparency="true"
                            height="315"
                            width="100%"
                            style={{ border: 'none', minWidth: 'min(100%, 430px)' }}
                            scrolling="no"
                            data-name="pb-iframe-player"
                            src="https://www.podbean.com/player-v2/?i=x34yx-4fc50d-pbblog-playlist&share=1&download=1&fonts=Arial&skin=1&font-color=&rtl=0&logo_link=&btn-skin=7&size=315"
                            loading="lazy"
                            allowFullScreen=""
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('The Sports Card Show') && (
                <>
                    <h2 className="container-title">The Sports Card Show</h2>
                    <div className="podcast-container">
                        <iframe
                            title="The Sports Card Show"
                            allowTransparency="true"
                            height="315"
                            width="100%"
                            style={{ border: 'none', minWidth: 'min(100%, 430px)' }}
                            scrolling="no"
                            data-name="pb-iframe-player"
                            src="https://www.podbean.com/player-v2/?i=h89ci-ad21-pbblog-playlist&share=1&download=1&fonts=Arial&skin=1&font-color=&rtl=0&logo_link=&btn-skin=7&size=315"
                            loading="lazy"
                            allowFullScreen=""
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Sports Card Nation') && (
                <>
                    <h2 className="container-title">Sports Card Nation</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/0wbBkz4tQhT2wEjdUbFck1?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('The Joe Rogan Experience') && (
                <>
                    <h2 className="container-title">The Joe Rogan Experience</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk/video?utm_source=generator"
                            width="100%"
                            height="351"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Barstool Sports: Barstool Rundown') && (
                <>
                    <h2 className="container-title">Barstool Sports: Barstool Rundown</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/6XTFbLDCx65LdP2KruGwa0?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
            {isSelected('Barstool Sports: Barstool Radio') && (
                <>
                    <h2 className="container-title">Barstool Sports: Barstool Radio</h2>
                    <div className="podcast-container">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src="https://open.spotify.com/embed/show/2Bc48V9lz8sUeYStl1aVpt?utm_source=generator"
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen=""
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        ></iframe>
                    </div>
                </>
            )}
        </div>
    );
}

export default PagePodcasts;
