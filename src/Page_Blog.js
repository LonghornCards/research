import React from 'react';
import './App.css';

const Page_Blog = () => {
    return (
        <div className="page-blog">
            <h1>Longhorn Cards Research Blog</h1>
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
                    <tr>
                        <td className="top-align">05/31/24</td>
                        <td className="top-align">Player Scoreboard - Top 25</td>
                        <td className="top-align">The Longhorns Cards Player Scoreboard Top 25 Players by Composite Rank</td>
                        <td className="top-align">
                            This table provides a summary of the current Top 25 players in the Longhorn Scoreboard. The rankings include historical card prices, player career statistics, and Google Trends interest. Key players across Football, Baseball, and Basketball are included.
                        </td>
                        <td className="top-align">
                            <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.31.24.png" target="_blank" rel="noopener noreferrer">
                                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.31.24.png" alt="Blog Post" className="blog-image" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td className="top-align">05/26/24</td>
                        <td className="top-align">Player Scoreboard</td>
                        <td className="top-align">The Longhorn Cards Player Scoreboard ranks Football, Basketball, and Baseball players using historical card sale prices, player career statistics, and Google Trends interest.</td>
                        <td className="top-align">
                            The Longhorn Cards Player Scoreboard ranks Football, Basketball, and Baseball players using historical card sale prices, player career statistics, and Google Trends interest.
                        </td>
                        <td className="top-align">
                            <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.26.24.png" target="_blank" rel="noopener noreferrer">
                                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.26.24.png" alt="Blog Post" className="blog-image" />
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td className="top-align">05/23/24</td>
                        <td className="top-align">Longhorn Cards Player Scoreboard May 2024</td>
                        <td className="top-align">Our overall Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player.</td>
                        <td className="top-align">
                            Our overall Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player.  Also provided is the current price trend and percentages from different price levels.
                        </td>
                        <td className="top-align">
                            <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.23.24.png" target="_blank" rel="noopener noreferrer">
                                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.23.24.png" alt="Blog Post" className="blog-image" />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Page_Blog;
