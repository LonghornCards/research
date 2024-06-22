import React, { useRef, useEffect, useState } from 'react';
import Modal from 'react-modal';
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
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.1; // Slow down the video playback
        }
    }, []);

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        // Check session storage for modal display flag
        const isModalDisplayed = sessionStorage.getItem('isModalDisplayed');

        if (!isModalDisplayed) {
            // If modal hasn't been displayed in this session, show it and set the flag
            setModalIsOpen(true);
            sessionStorage.setItem('isModalDisplayed', 'true');
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
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Promo Modal"
                className="promo-modal"
                overlayClassName="promo-overlay"
            >
                <div className="modal-content">
                    <h2>Website Special: 50% Off!</h2>
                    <a
                        href="https://www.ebay.com/sme/atx-longhorn/Extra-50-off/so.html?_soffType=CodedCouponOffer&_soffid=bMJGWoyPh_VctvBoAi9eHQ%253D%253D&mkcid=16&ssspo=5vDCbFbgQti&ssuid=5vDCbFbgQti&mkrid=711-127632-2357-0&widget_ver=artemis&sssrc=3798573&mkevt=1&media=COPY"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="coupon-text"
                    >
                        Get your coupon
                    </a>
                    <p>Use this website-only coupon code to get an extra 50% off on eBay! Limit to 1 per customer, $100 max discount. Offer valid until December 2025.</p>
                    <button onClick={closeModal}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default App;
