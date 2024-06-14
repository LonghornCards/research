// Page_Blog.js
import React, { useEffect } from 'react';
import './App.css';
import { useLocation, Link } from 'react-router-dom';

const Page_Blog = () => {
    const blogEntries = [
        {
            date: '06/13/24',
            title: 'New Highs/Lows',
            summary: 'New high/low card prices for a few select players over the last month.',
            details: (
                <span>
                    Here is a snapshot of 4 players whose card prices hit new highs or lows over the past month. Nicola Jokic, Shai Gilgeous-Alexander, and Jordan Love soared to new highs in May, while Chet Holmgren's average card prices hit a new all-time low during the month. <Link to="/blog_post17">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_6.13.24.png'
        },
        {
            date: '05/31/24',
            title: 'Player Scoreboard - Top 25',
            summary: 'The Longhorns Cards Player Scoreboard Top 25 Players by Composite Rank',
            details: (
                <span>
                    This table provides a summary of the current Top 25 players in the Longhorn Scoreboard. The rankings include historical card prices, player career statistics, and Google Trends interest. Key players across Football, Baseball, and Basketball are included. <Link to="/blog_post16">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.31.24.png'
        },
        {
            date: '05/26/24',
            title: 'Player Scoreboard',
            summary: 'The Longhorn Cards Player Scoreboard ranks Football, Basketball, and Baseball players using historical card sale prices, player career statistics, and Google Trends interest.',
            details: (
                <span>
                    The Longhorn Cards Player Scoreboard ranks Football, Basketball, and Baseball players using historical card sale prices, player career statistics, and Google Trends interest. <Link to="/blog_post15">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.26.24.png'
        },
        {
            date: '05/23/24',
            title: 'Longhorn Cards Player Scoreboard May 2024',
            summary: 'Our overall Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player.',
            details: (
                <span>
                    Our overall Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player. Also provided is the current price trend and percentages from different price levels. <Link to="/blog_post14">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.23.24.png'
        },
        {
            date: '05/22/24',
            title: 'MLB Google Trends Rankings Heatmap',
            summary: 'This heatmap shows rankings over time for key MLB players using Google Trends to measure interest and popularity.',
            details: (
                <span>
                    This heatmap shows rankings over time for key MLB players using Google Trends to measure interest and popularity. <Link to="/blog_post13">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.22.24.png'
        },
        {
            date: '05/21/24',
            title: 'NFL Google Trends Rankings Heatmap',
            summary: 'This heatmap shows rankings over time for key NFL players (plus a few 2024 Draft Picks) using Google Trends to measure interest and popularity.',
            details: (
                <span>
                    This heatmap shows rankings over time for key NFL players (plus a few 2024 Draft Picks) using Google Trends to measure interest and popularity. <Link to="/blog_post12">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.21.24.png'
        },
        {
            date: '05/20/24',
            title: 'NBA Google Trends Rankings Heatmap',
            summary: 'This heatmap shows rankings over time for key NBA players using Google Trends to measure interest and popularity.',
            details: (
                <span>
                    This heatmap shows rankings over time for key NBA players using Google Trends to measure interest and popularity. <Link to="/blog_post11">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.20.24.png'
        },
        {
            date: '05/19/24',
            title: 'NFL Top 10 Draft Picks - Google Trends',
            summary: 'Google Trends for the Top 10 NFL Draft Picks in 2024.',
            details: (
                <span>
                    Google Trends for the Top 10 NFL Draft Picks in 2024. JJ McCarthy is head of the pack in terms of interest along with Caleb Williams. <Link to="/blog_post10">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.19.24.png'
        },
        {
            date: '05/18/24',
            title: 'Google Trends',
            summary: 'Google Trends over the past 5 years for a few key NBA players.',
            details: (
                <span>
                    Google Trends over the past 5 years for a few key NBA players. Can see how Anthony Edwards has soared in popularity. Plotting his Google trend versus his card prices helps visualize the associated spike in card values. <Link to="/blog_post9">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.18.24.png'
        },
        {
            date: '05/17/24',
            title: 'NFL Wide Receiver & Tight End Rankings',
            summary: 'The NFL Wide Receiver/Tight End rankings below are based on Career statistics across numerous categories.',
            details: (
                <span>
                    The NFL Wide Receiver/Tight End rankings below are based on Career statistics across numerous categories. The Overall Score is a proprietary formula that applies different weightings to a variety of key statistics. <Link to="/blog_post8">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.17.24.png'
        },
        {
            date: '05/16/24',
            title: 'NFL Quarterback Rankings',
            summary: 'The NFL Quarterback rankings below are based on Career statistics across numerous categories.',
            details: (
                <span>
                    The NFL Quarterback rankings below are based on Career statistics across numerous categories. The Overall Score is a proprietary formula that applies different weightings to a variety of key statistics. <Link to="/blog_post7">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.16.24.png'
        },
        {
            date: '05/14/24',
            title: 'Player Scatterplots',
            summary: 'Now available on our website are comparisons for player scores versus how far their current price level is from their all-time high price level.',
            details: (
                <span>
                    Now available on our website are comparisons for player scores versus how far their current price level is from their all-time high price level. <Link to="/blog_post6">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.14.24.png'
        },
        {
            date: '05/13/24',
            title: 'Sports Player Performance - May 2024',
            summary: 'This is our inaugural report for Sports Player Index Performance for key players across baseball, basketball, and football relative to their peers.',
            details: (
                <span>
                    This is our inaugural report for Sports Player Index Performance for key players across baseball, basketball, and football relative to their peers. The index data for the players is determined by historical card prices, and provides YTD return, YTD relative return, and current Relative Strength for that player. <Link to="/blog_post5">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.13.24.png'
        },
        {
            date: '05/12/24',
            title: 'Sports Player Screen - May 2024',
            summary: 'This is our inaugural screen of what we consider \'blue chip\' players that have available card price/index data to analyze.',
            details: (
                <span>
                    This is our inaugural screen of what we consider 'blue chip' players that have available card price/index data to analyze. The list provides a score by player (card) as well as current price trend: Strong Uptrend, Uptrend, Downtrend, or Strong Downtrend. The list includes both Active and Retired players, primarily across Football, Basketball, and Baseball. The analysis and final score considers the historical price movement of the player index as calculated from card sales as well as that price movement relative to an index of cards associated with that players sport. For example, a football player's prices are compared to an index of football players. <Link to="/blog_post4">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.12.24.png'
        },
        {
            date: '05/11/24',
            title: 'NBA Player Index Performance Comparison',
            summary: 'Highlighting 4 players in the NBA playoffs this year to compare their performance over the past year based on card prices: Anthony Edwards, Jalen Brunson, Nikola Jokic, and Jayson Tatum.',
            details: (
                <span>
                    Highlighting 4 players in the NBA playoffs this year to compare their performance over the past year based on card prices: Anthony Edwards, Jalen Brunson, Nikola Jokic, and Jayson Tatum. Jalen Brunson has soared in value over the past year with a return of 265%, while more recently Anthony Edwards has spiked 65% during the playoffs. Nikola Jokic is holding steady at the higher end of his range, and Jayson Tatum has declined nearly 30% - the bulk of which has occurred since March. <Link to="/blog_post3">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.11.24.png'
        },
        {
            date: '05/10/24',
            title: 'Recent Card Sales (May 2024)',
            summary: 'This list provides the top 20 sales for football, baseball, and basketball cards within a price range of $100 to $1000.',
            details: (
                <span>
                    This list provides the top 20 sales for football, baseball, and basketball cards within a price range of $100 to $1000. One of the most heavily traded segments of the market. The 2018 Panini Prizm #280 Luka Doncic rookie card (PSA 10) sold for as high as $2000 in 2021, and has been in the $200-300 range for the past year. <Link to="/blog_post2">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.10.24.png'
        },
        {
            date: '05/09/24',
            title: 'Sports Card Market Update April 2024',
            summary: 'The broad sports card index is up double-digits YTD, but baseball, football, and basketball indexes are still consolidating. The market is still a ways off all-time-highs set in 2021 but has realized strong long-term returns. See this month\'s update for more detail.',
            details: (
                <span>
                    Although the broad CSI flagship sports card index is up 12% year-to-date, the Baseball, Football, and Basketball indexes are still posting negative returns. After hitting a peak in 2021, the broad index is down 24% from all-time-highs and has been consolidating over the past 1- and 3-years. All indexes are posting positive double-digit returns over longer 5- and 10-year time horizons. Football cards are leading with annualized returns of nearly 30% over the past 10-years. <Link to="/blog_post1">See Full Blog Post</Link>
                </span>
            ),
            imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.9.24.png'
        }
    ];

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
                                <td className="top-align" data-label="Details">{entry.details}</td>
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

export default Page_Blog;
