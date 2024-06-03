import React from 'react';
import './App.css';

const Page_Blog = () => {
    return (
        <div className="page-blog">
            <h1>Longhorn Cards Research Blog</h1>
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
                                Our overall Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player. Also provided is the current price trend and percentages from different price levels.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.23.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.23.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/22/24</td>
                            <td className="top-align">MLB Google Trends Rankings Heatmap</td>
                            <td className="top-align">This heatmap shows rankings over time for key MLB players using Google Trends to measure interest and popularity.</td>
                            <td className="top-align">
                                This heatmap shows rankings over time for key MLB players using Google Trends to measure interest and popularity.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.22.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.22.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/21/24</td>
                            <td className="top-align">NFL Google Trends Rankings Heatmap</td>
                            <td className="top-align">This heatmap shows rankings over time for key NFL players (plus a few 2024 Draft Picks) using Google Trends to measure interest and popularity.</td>
                            <td className="top-align">
                                This heatmap shows rankings over time for key NFL players (plus a few 2024 Draft Picks) using Google Trends to measure interest and popularity.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.21.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.21.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/20/24</td>
                            <td className="top-align">NBA Google Trends Rankings Heatmap</td>
                            <td className="top-align">This heatmap shows rankings over time for key NBA players using Google Trends to measure interest and popularity.</td>
                            <td className="top-align">
                                This heatmap shows rankings over time for key NBA players using Google Trends to measure interest and popularity.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.20.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.20.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/19/24</td>
                            <td className="top-align">NFL Top 10 Draft Picks - Google Trends</td>
                            <td className="top-align">Google Trends for the Top 10 NFL Draft Picks in 2024.</td>
                            <td className="top-align">
                                Google Trends for the Top 10 NFL Draft Picks in 2024. JJ McCarthy is head of the pack in terms of interest along with Caleb Williams.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.19.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.19.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/18/24</td>
                            <td className="top-align">Google Trends</td>
                            <td className="top-align">Google Trends over the past 5 years for a few key NBA players.</td>
                            <td className="top-align">
                                Google Trends over the past 5 years for a few key NBA players. Can see how Anthony Edwards has soared in popularity. Plotting his Google trend versus his card prices helps visualize the associated spike in card values.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.18.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.18.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/17/24</td>
                            <td className="top-align">NFL Wide Receiver & Tight End Rankings</td>
                            <td className="top-align">The NFL Wide Receiver/Tight End rankings below are based on Career statistics across numerous categories.</td>
                            <td className="top-align">
                                The NFL Wide Receiver/Tight End rankings below are based on Career statistics across numerous categories. The Overall Score is a proprietary formula that applies different weightings to a variety of key statistics.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.17.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.17.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/16/24</td>
                            <td className="top-align">NFL Quarterback Rankings</td>
                            <td className="top-align">The NFL Quarterback rankings below are based on Career statistics across numerous categories.</td>
                            <td className="top-align">
                                The NFL Quarterback rankings below are based on Career statistics across numerous categories. The Overall Score is a proprietary formula that applies different weightings to a variety of key statistics.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.16.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.16.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/14/24</td>
                            <td className="top-align">Player Scatterplots</td>
                            <td className="top-align">Now available on our website are comparisons for player scores versus how far their current price level is from their all-time high price level.</td>
                            <td className="top-align">
                                Now available on our website are comparisons for player scores versus how far their current price level is from their all-time high price level.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.14.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.14.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/13/24</td>
                            <td className="top-align">Sports Player Performance - May 2024</td>
                            <td className="top-align">This is our inaugural report for Sports Player Index Performance for key players across baseball, basketball, and football relative to their peers.</td>
                            <td className="top-align">
                                This is our inaugural report for Sports Player Index Performance for key players across baseball, basketball, and football relative to their peers. The index data for the players is determined by historical card prices, and provides YTD return, YTD relative return, and current Relative Strength for that player.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.13.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.13.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/12/24</td>
                            <td className="top-align">Sports Player Screen - May 2024</td>
                            <td className="top-align">This is our inaugural screen of what we consider 'blue chip' players that have available card price/index data to analyze.</td>
                            <td className="top-align">
                                This is our inaugural screen of what we consider 'blue chip' players that have available card price/index data to analyze. The list provides a score by player (card) as well as current price trend: Strong Uptrend, Uptrend, Downtrend, or Strong Downtrend. The list includes both Active and Retired players, primarily across Football, Basketball, and Baseball. The analysis and final score considers the historical price movement of the player index as calculated from card sales as well as that price movement relative to an index of cards associated with that players sport. For example, a football player's prices are compared to an index of football players.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.12.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.12.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/11/24</td>
                            <td className="top-align">NBA Player Index Performance Comparison</td>
                            <td className="top-align">Highlighting 4 players in the NBA playoffs this year to compare their performance over the past year based on card prices: Anthony Edwards, Jalen Brunson, Nikola Jokic, and Jayson Tatum.</td>
                            <td className="top-align">
                                Highlighting 4 players in the NBA playoffs this year to compare their performance over the past year based on card prices: Anthony Edwards, Jalen Brunson, Nikola Jokic, and Jayson Tatum. Jalen Brunson has soared in value over the past year with a return of 265%, while more recently Anthony Edwards has spiked 65% during the playoffs. Nikola Jokic is holding steady at the higher end of his range, and Jayson Tatum has declined nearly 30% - the bulk of which has occurred since March.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.11.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.11.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/10/24</td>
                            <td className="top-align">Recent Card Sales (May 2024)</td>
                            <td className="top-align">This list provides the top 20 sales for football, baseball, and basketball cards within a price range of $100 to $1000.</td>
                            <td className="top-align">
                                This list provides the top 20 sales for football, baseball, and basketball cards within a price range of $100 to $1000. One of the most heavily traded segments of the market. The 2018 Panini Prizm #280 Luka Doncic rookie card (PSA 10) sold for as high as $2000 in 2021, and has been in the $200-300 range for the past year.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.10.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.10.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td className="top-align">05/09/24</td>
                            <td className="top-align">Sports Card Market Update April 2024</td>
                            <td className="top-align">The broad sports card index is up double-digits YTD, but baseball, football, and basketball indexes are still consolidating. The market is still a ways off all-time-highs set in 2021 but has realized strong long-term returns. See this month's update for more detail.</td>
                            <td className="top-align">
                                Although the broad CSI flagship sports card index is up 12% year-to-date, the Baseball, Football, and Basketball indexes are still posting negative returns. After hitting a peak in 2021, the broad index is down 24% from all-time-highs and has been consolidating over the past 1- and 3-years. All indexes are posting positive double-digit returns over longer 5- and 10-year time horizons. Football cards are leading with annualized returns of nearly 30% over the past 10-years.
                            </td>
                            <td className="top-align">
                                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.9.24.png" target="_blank" rel="noopener noreferrer">
                                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.9.24.png" alt="Blog Post" className="blog-image" />
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Page_Blog;
