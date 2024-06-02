import React from 'react';
import { Link } from 'react-router-dom';

const BlogPost = ({ content }) => {
    return (
        <div>
            <img
                src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Logo_Simple.png"
                alt="Logo"
                className="app-logo"
            />
            <h2>{content.Title}</h2>
            <p><strong>Date:</strong> {content.Date}</p>
            {content.Image && <img src={content.Image} alt={content.Title} style={{ maxWidth: '100%' }} />}
            <p>{content.Details}</p>
            <Link to="/">Back to Blog List</Link>
        </div>
    );
};

export default BlogPost;
