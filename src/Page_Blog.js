import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './App.css';

const Page_Blog = () => {
    const [blogPosts, setBlogPosts] = useState([]);

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

                const sortedPosts = worksheet.sort((a, b) => new Date(b.Date) - new Date(a.Date));
                setBlogPosts(sortedPosts);
            } catch (error) {
                console.error("Error fetching the blog data: ", error);
            }
        };

        fetchBlogData();
    }, []);

    return (
        <div className="page-container">
            <h1>All Blog Posts</h1>
            <div className="blog-list">
                {blogPosts.map((post, index) => (
                    <div key={index} className="blog-post">
                        <h2>{post.Title}</h2>
                        <p><strong>Date:</strong> {new Date(post.Date).toLocaleDateString()}</p>
                        {post.Image && <img src={post.Image} alt={post.Title} className="blog-image" />}
                        <p><strong>Summary:</strong> {post.Summary}</p>
                        <p><strong>Details:</strong> {post.Details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page_Blog;
