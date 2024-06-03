import React, { useRef, useEffect } from 'react';
import './App.css';

const PageStore = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.1; // Slow down the video playback
        }
    }, []);

    return (
        <div className="store-video-background-container">
            <video
                ref={videoRef}
                className="store-video-background"
                autoPlay
                loop
                muted
            >
                <source
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/homepage_background.mp4"
                    type="video/mp4"
                />
            </video>
            <div className="store-content">
                <h1>Welcome to our Store!</h1>
                <p>
                    More integrations coming soon...visit our{' '}
                    <a
                        href="https://www.ebay.com/str/longhorncardsandcollectibles?mkcid=16&mkevt=1&mkrid=711-127632-2357-0&ssspo=5vDCbFbgQti&sssrc=3418065&ssuid=5vDCbFbgQti&widget_ver=artemis&media=COPY"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        eBay store
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default PageStore;
