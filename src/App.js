import React, { useRef, useEffect } from 'react';
import './App.css';

const App = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.1; // Slow down the video playback
        }
    }, []);

    return (
        <div>
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
                <div className="welcome-message">Welcome to Longhorn Cards Research!</div>
            </div>
            <div className="page-content">
                <h1>Under Construction</h1>
                <p>Please check out our research & store - don't mind the construction.  Thank you!</p>
            </div>
        </div>
    );
};

export default App;
