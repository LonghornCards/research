import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Helmet } from 'react-helmet'; // Import Helmet from react-helmet
import './App.css';

const About = () => {
    return (
        <div className="about-container">
            <Helmet>
                <title>About Longhorn Cards</title>
            </Helmet>
            <div className="about-video-container">
                <video autoPlay muted loop playsInline className="about-background-video">
                    <source src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/about_background.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="about-content">
                <h1>About Us</h1>
                <p>Welcome! Our focus is on providing high-quality sports cards and cutting-edge research & analytics for the sports card market.</p>
                <p>Create a free account to subscribe to our newsletters and bookmark our page for updated research & new products.</p>
                <p>This website is still under construction, please check back soon for updates!</p>
                <p>Based in Austin, TX and Founded in 2023.</p>
            </div>
            <div className="contact-information">
                <p>Contact us for more information: <a href="mailto:info@longhornsportscards.com">info@longhornsportscards.com</a></p>
                <Link to="/privacy-policy">Privacy Policy</Link>
            </div>
            <div className="footer-bar"></div>
        </div>
    );
}

export default About;
