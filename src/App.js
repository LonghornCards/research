import React, { useRef, useEffect } from 'react';
import './App.css';

const Announcement = () => {
    return (
        <div className="announcement-container">
            <div className="announcement-images">
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/openai.png" alt="OpenAI" />
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/googlenews.jpg" alt="Google News" />
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/sportscardpro.jpeg" alt="Sports Card Pro" />
            </div>
            <div className="announcement-message">
                New Updates! Log-in or Create a Free Account: New Premium Tools & Resources!
            </div>
        </div>
    );
};

const App = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.1; // Slow down the video playback
        }
    }, []);

    return (
        <div className="video-background-container">
            <video
                ref={videoRef}
                className="video-background"
                autoPlay
                loop
                muted
                playsInline
            >
                <source
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/longhorn_background.mp4"
                    type="video/mp4"
                />
            </video>
            <div className="welcome-message">Welcome to Longhorn Cards!</div>
            <Announcement />
        </div>
    );
};

export default App;
