// PageBlog.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Import useAuth
import blogEntries from './PageBlogContent';  // Import blog content
import Modal from 'react-modal';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    EmailShareButton,
    EmailIcon
} from 'react-share';

Modal.setAppElement('#root');  // To avoid screen readers problems

const PageBlog = () => {
    const { isLoggedIn } = useAuth();  // Use the useAuth hook to get the authentication state
    const location = useLocation();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');
    const [currentTitle, setCurrentTitle] = useState('');

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 0);
            }
        }
    }, [location]);

    const openModal = (url, title) => {
        setCurrentUrl(url);
        setCurrentTitle(title);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleCopyLink = (link) => {
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="page-blog">
            <h1>Longhorn Cards Research Blog</h1>
            <a href="/login" style={{ textDecoration: 'none' }}>
                <h2 style={{ color: 'peru', fontWeight: 'bold' }}>
                    Subscribe to our newsletter for updates
                </h2>
            </a>
            <div className="blog-table-container">
                <table className="blog-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Summary</th>
                            <th>Details</th>
                            <th>Image</th>
                            <th>Share</th> {/* Add a Share column */}
                        </tr>
                    </thead>
                    <tbody>
                        {blogEntries.map((entry, index) => (
                            <tr key={index} id={`blog-${entry.title.replace(/\s+/g, '-').toLowerCase()}`}>
                                <td className="top-align" data-label="Date">{entry.date}</td>
                                <td className="top-align" data-label="Title">{entry.title}</td>
                                <td className="top-align" data-label="Summary">{entry.summary}</td>
                                <td className="top-align" data-label="Details">
                                    <span>
                                        {entry.details}
                                        {isLoggedIn ? (
                                            <Link to={entry.fullPostLink}>See Full Blog Post</Link>
                                        ) : (
                                            <a href="/login">Log in to see full post</a>
                                        )}
                                    </span>
                                </td>
                                <td className="top-align" data-label="Image">
                                    <a href={entry.imageUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={entry.imageUrl} alt="Blog Post" className="blog-image" />
                                    </a>
                                </td>
                                <td className="top-align" data-label="Share">
                                    <img
                                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/share.svg"
                                        alt="Share"
                                        style={{ width: 32, height: 32, cursor: 'pointer' }}
                                        onClick={(e) => { e.preventDefault(); openModal(entry.fullPostLink, entry.title); }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Share Modal"
                className="share-modal"
                overlayClassName="share-modal-overlay"
            >
                <h2>Share this post</h2>
                <div className="share-buttons">
                    <div className="share-button">
                        <FacebookShareButton url={currentUrl} quote={currentTitle}>
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <span className="tooltip-text">Facebook</span>
                    </div>
                    <div className="share-button">
                        <TwitterShareButton url={currentUrl} title={currentTitle}>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                        <span className="tooltip-text">Twitter (X)</span>
                    </div>
                    <div className="share-button">
                        <EmailShareButton url={currentUrl} subject={currentTitle} body={currentTitle}>
                            <EmailIcon size={32} round={true} />
                        </EmailShareButton>
                        <span className="tooltip-text">Email</span>
                    </div>
                    <div className="share-button">
                        <a href={`https://www.instagram.com/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer">
                            <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/instagram.ico" alt="Instagram Share" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        </a>
                        <span className="tooltip-text">Instagram</span>
                    </div>
                    <div className="share-button">
                        <button onClick={() => handleCopyLink(currentUrl)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                            <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/copy.svg" alt="Copy Link" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        </button>
                        <span className="tooltip-text">Copy Link</span>
                    </div>
                </div>
                <button onClick={closeModal} className="close-button">Close</button>
            </Modal>
        </div>
    );
};

export default PageBlog;
