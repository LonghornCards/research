import React, { useEffect } from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    EmailIcon,
    WhatsappIcon,
} from 'react-share';
import '../App.css';

const BlogPost18 = () => {
    const shareUrl = window.location.href;
    const title = "Longhorn Cards Player Scoreboard June 2024 Update";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="full-blog-summary">
            <h2 className="blog-title">Longhorn Cards Player Scoreboard June 2024 Update</h2>

            <img className="blog-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_7.7.24.png" alt="Blog Post 7.7.24" />

            <p className="blog-paragraph">
                The June 2024 update of the Longhorn Cards Player Scoreboard provides a comprehensive overview of the top sports players, ranked by their Composite Rank, which combines Technical Rank, Sentiment Rank, and Fundamental Rank. This detailed analysis is essential for sports card collectors looking to make informed investment decisions. This blog post will delve into the specifics of each player's ranking, status, and card value trends, offering valuable insights into the current market dynamics.  This summary is for the top 25 players in the Scoreboard.
            </p>

            <h3 className="blog-subtitle">Top Ranked Players</h3>
            <p className="blog-paragraph">
                The leaderboard is dominated by a mix of retired legends and active superstars from various sports, including baseball, basketball, and football. Each player's Composite Rank is a weighted measure of their Fundamental, Technical, and Sentiment Ranks, providing a holistic view of their market performance.
            </p>

            <h3 className="blog-subtitle">1. Lou Gehrig (Baseball, Retired)</h3>
            <p className="blog-paragraph">
                <b>Composite Rank:</b> 100<br />
                <b>Fundamental Rank:</b> 97<br />
                <b>Technical Rank:</b> 93<br />
                <b>Sentiment Rank:</b> 90<br />
                <b>Trend:</b> Strong Uptrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -20%<br />
                - % from Low: 936%<br />
                - % from Average: 72%<br />
                - % from 1-Year Average: 4%<br />
                - % from 3-Month Average: 2%<br />
                Lou Gehrig remains a top pick for collectors, with his card prices showing a strong uptrend. The price is currently 20% below its peak but has surged 936% from its lowest point, indicating significant market interest.
            </p>

            <h3 className="blog-subtitle">2. Michael Jordan (Basketball, Retired)</h3>
            <p className="blog-paragraph">
                <b>Composite Rank:</b> 99<br />
                <b>Fundamental Rank:</b> 97<br />
                <b>Technical Rank:</b> 90<br />
                <b>Sentiment Rank:</b> 88<br />
                <b>Trend:</b> Strong Uptrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -26%<br />
                - % from Low: 1766%<br />
                - % from Average: 89%<br />
                - % from 1-Year Average: 8%<br />
                - % from 3-Month Average: 7%<br />
                Michael Jordan's cards continue to be highly valued, with a notable 1766% increase from their lowest price. Despite being 26% off their peak, the strong uptrend indicates ongoing robust demand.
            </p>

            <h3 className="blog-subtitle">3. Tyreek Hill (Football, Active)</h3>
            <p className="blog-paragraph">
                <b>Composite Rank:</b> 98<br />
                <b>Fundamental Rank:</b> 90<br />
                <b>Technical Rank:</b> 80<br />
                <b>Sentiment Rank:</b> 96<br />
                <b>Trend:</b> Strong Uptrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -20%<br />
                - % from Low: 6642%<br />
                - % from Average: 24%<br />
                - % from 1-Year Average: 8%<br />
                - % from 3-Month Average: 1%<br />
                Tyreek Hill's active status and performance have driven his card prices up by 6642% from their lowest point. The strong uptrend reflects his rising popularity and market value.
            </p>

            <h3 className="blog-subtitle">4. Patrick Mahomes (Football, Active)</h3>
            <p className="blog-paragraph">
                <b>Composite Rank:</b> 97<br />
                <b>Fundamental Rank:</b> 100<br />
                <b>Technical Rank:</b> 76<br />
                <b>Sentiment Rank:</b> 87<br />
                <b>Trend:</b> Strong Uptrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -44%<br />
                - % from Low: 5593%<br />
                - % from Average: 10%<br />
                - % from 1-Year Average: 5%<br />
                - % from 3-Month Average: 0%<br />
                Patrick Mahomes, with a perfect Fundamental Rank, continues to attract collectors, with a substantial 5593% increase from his card's lowest price. The strong uptrend signals ongoing interest.
            </p>

            <h3 className="blog-subtitle">5. Barry Bonds (Baseball, Retired)</h3>
            <p className="blog-paragraph">
                <b>Composite Rank:</b> 96<br />
                <b>Fundamental Rank:</b> 95<br />
                <b>Technical Rank:</b> 82<br />
                <b>Sentiment Rank:</b> 75<br />
                <b>Trend:</b> Strong Uptrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -49%<br />
                - % from Low: 1636%<br />
                - % from Average: 70%<br />
                - % from 1-Year Average: 8%<br />
                - % from 3-Month Average: 7%<br />
                Barry Bonds' cards show a significant rise from their lowest prices, with a 1636% increase. The price remains 49% below its peak, but the strong uptrend suggests increasing demand.
            </p>

            <h3 className="blog-subtitle">Mid-Ranked Players</h3>
            <p className="blog-paragraph">
                <b>6. Jerry Rice (Football, Retired)</b><br />
                <b>Composite Rank:</b> 94<br />
                <b>Fundamental Rank:</b> 67<br />
                <b>Technical Rank:</b> 99<br />
                <b>Sentiment Rank:</b> 78<br />
                <b>Trend:</b> Strong Uptrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -34%<br />
                - % from Low: 6435%<br />
                - % from Average: 115%<br />
                - % from 1-Year Average: 17%<br />
                - % from 3-Month Average: 14%<br />
                Jerry Rice's cards have surged 6435% from their lowest point, reflecting strong market performance.
            </p>

            <p className="blog-paragraph">
                <b>7. CeeDee Lamb (Football, Active)</b><br />
                <b>Composite Rank:</b> 93<br />
                <b>Fundamental Rank:</b> 82<br />
                <b>Technical Rank:</b> 61<br />
                <b>Sentiment Rank:</b> 100<br />
                <b>Trend:</b> Uptrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -58%<br />
                - % from Low: 46%<br />
                - % from Average: -4%<br />
                - % from 1-Year Average: 1%<br />
                - % from 3-Month Average: -1%<br />
                CeeDee Lamb's cards are trending upwards, with a significant sentiment rank indicating high market confidence.
            </p>

            <h3 className="blog-subtitle">Lower Ranked Players</h3>
            <p className="blog-paragraph">
                <b>20. Larry Bird (Basketball, Retired)</b><br />
                <b>Composite Rank:</b> 80<br />
                <b>Fundamental Rank:</b> 96<br />
                <b>Technical Rank:</b> 54<br />
                <b>Sentiment Rank:</b> 75<br />
                <b>Trend:</b> Downtrend<br />
                <b>Price Metrics:</b> <br />
                - % from High: -59%<br />
                - % from Low: 1389%<br />
                - % from Average: 46%<br />
                - % from 1-Year Average: -16%<br />
                - % from 3-Month Average: -12%<br />
                Larry Bird's cards have seen a downtrend, but they have still increased 1389% from their lowest point.
            </p>

            <h3 className="blog-subtitle">Noteworthy Trends</h3>
            <p className="blog-paragraph">
                The scoreboard also reveals key trends:
                <ul>
                    <li><b>Strong Uptrend:</b> Indicates a substantial and continuous increase in card prices. Examples include Lou Gehrig, Michael Jordan, and Tyreek Hill.</li>
                    <li><b>Uptrend:</b> Represents a positive but less pronounced increase in prices. CeeDee Lamb is a notable example.</li>
                    <li><b>Downtrend:</b> Reflects a decrease in card prices from their recent peaks. Players like Larry Bird and Tom Brady fall into this category.</li>
                </ul>
            </p>

            <h3 className="blog-subtitle">Conclusion</h3>
            <p className="blog-paragraph">
                The June 2024 update of the Longhorn Cards Player Scoreboard provides critical insights for sports card collectors. Understanding the Composite Rank and associated trends can help collectors make strategic decisions. Whether targeting retired legends like Lou Gehrig and Michael Jordan or betting on active players like Tyreek Hill and Patrick Mahomes, this comprehensive analysis offers a clear picture of the current sports card market landscape. Stay tuned for further updates and happy collecting!
            </p>

            <div className="share-buttons">
                <h3 className="blog-subtitle">Share This Post</h3>
                <FacebookShareButton url={shareUrl} quote={title}>
                    <FacebookIcon size={36} />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={title}>
                    <TwitterIcon size={36} />
                </TwitterShareButton>
                <EmailShareButton url={shareUrl} subject={title} body="Check out this article!">
                    <EmailIcon size={36} />
                </EmailShareButton>
                <WhatsappShareButton url={shareUrl} title={title}>
                    <WhatsappIcon size={36} />
                </WhatsappShareButton>
            </div>
        </div>
    );
};

export default BlogPost18;
