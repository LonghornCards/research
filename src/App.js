import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './App.css';

function App() {
    const [blogPost, setBlogPost] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog.xlsx', {
                    responseType: 'arraybuffer'
                });
                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false, dateNF: 'yyyy-mm-dd' });

                const mostRecentPost = worksheet.reduce((latest, post) => {
                    return new Date(post.Date) > new Date(latest.Date) ? post : latest;
                }, worksheet[0]);

                setBlogPost(mostRecentPost);
            } catch (error) {
                console.error("Error fetching the blog data: ", error);
            }
        };

        fetchBlogData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Logo_Simple.png" className="App-logo" alt="logo" />
                <p className="welcome-message">Welcome to Longhorn Cards Research! Under Construction</p>
            </header>
            {blogPost && (
                <div className="blog-container">
                    <h2>Most Recent Blog Post</h2>
                    <p><strong>Date:</strong> {new Date(blogPost.Date).toLocaleDateString()}</p>
                    <p><strong>Title:</strong> {blogPost.Title}</p>
                    <img src={blogPost.Image} alt={blogPost.Title} className="blog-image" />
                    <p><strong>Summary:</strong> {blogPost.Summary}</p>
                    <p><strong>Details:</strong> {blogPost.Details}</p>
                </div>
            )}
        </div>
    );
}

export default App;
