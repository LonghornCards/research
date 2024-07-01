// PageBlog.js
import React, { useEffect } from 'react';
import './App.css';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Import useAuth
import blogEntries from './PageBlogContent';  // Import blog content

const PageBlog = () => {
    const { isLoggedIn } = useAuth();  // Use the useAuth hook to get the authentication state
    const location = useLocation();

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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PageBlog;
