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

const BlogPost19 = () => {
    const shareUrl = window.location.href;
    const title = "Google Trends Summary for Sports Card Collectors: Top 25 Player Rankings";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="full-blog-summary">
            <h2 className="blog-title">Google Trends Summary for Sports Card Collectors: Top 25 Player Rankings</h2>

            <img className="blog-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_7.8.24.png" alt="Blog Post 7.8.24" />

            <p className="blog-paragraph">
                Google Trends is a powerful tool that measures interest over time and popularity, providing valuable insights into various topics, including sports players. For professional sports card collectors, these trends can be instrumental in predicting card price movements. The attached Google Trends summary showcases the top 25 sports players' rankings, offering a detailed view of their popularity and market dynamics over the past year.
            </p>

            <p className="blog-paragraph">
                This analysis is essential for collectors aiming to make informed investment decisions in the sports card market.
            </p>

            <h3 className="blog-subtitle">Overview of the Top 25 Players</h3>
            <p className="blog-paragraph">
                The summary highlights the interest levels of 25 players from different sports such as football, basketball, and baseball. Players are ranked based on their monthly popularity scores, averaged over various periods (3 months, 12 months) and compared to identify trends. The data reveals fascinating patterns and potential opportunities for card collectors.
            </p>

            <h3 className="blog-subtitle">Key Highlights</h3>
            <p className="blog-paragraph">
                <b>J.J. McCarthy (Football):</b> Consistently high Google Trend scores throughout the year, indicating strong and steady interest. His 12-month average is 87, with a slight increase to a 3-month average of 99, signaling an uptrend.
            </p>
            <p className="blog-paragraph">
                <b>Luka Doncic (Basketball):</b> High scores reflect substantial interest, with his 12-month average at 91 and a 3-month average at 88. His consistent performance makes him a solid choice for collectors.
            </p>
            <p className="blog-paragraph">
                <b>Elly De La Cruz (Baseball):</b> Demonstrates significant fluctuations, with peaks at certain months indicating bursts of interest. His 12-month average is 62, while his 3-month average jumps to 99, suggesting a strong recent uptrend.
            </p>
            <p className="blog-paragraph">
                <b>Caitlin Clark (Basketball):</b> Shows a notable trend with high interest levels in specific months, particularly in the early part of the year. Her 12-month average is 62, with a 3-month average also at 99, pointing to a resurgence in popularity.
            </p>
            <p className="blog-paragraph">
                <b>Travis Kelce (Football):</b> Maintains a consistent level of interest with an overall uptrend. His 12-month average is 91, and his 3-month average is 80.
            </p>

            <h3 className="blog-subtitle">Mid-Tier Highlights</h3>
            <p className="blog-paragraph">
                <b>Tyreek Hill (Football):</b> Known for his explosive play style, Tyreek Hill's scores show a strong uptrend. His 12-month average is 94, with a slight increase in his 3-month average to 95, indicating sustained interest.
            </p>
            <p className="blog-paragraph">
                <b>Bobby Witt Jr. (Baseball):</b> Exhibits a solid performance with consistent scores. His 12-month average is 81, and his 3-month average is 84, suggesting a steady uptrend.
            </p>
            <p className="blog-paragraph">
                <b>Lebron James (Basketball):</b> A legend in the sport, Lebron's scores remain high but show a slight downtrend. His 12-month average is 92, and his 3-month average is 87, reflecting a minor decline in interest.
            </p>
            <p className="blog-paragraph">
                <b>Shohei Ohtani (Baseball):</b> Continues to be a standout player, with high scores and a strong presence. His 12-month average is 93, with a 3-month average of 91, indicating slight fluctuations but overall strong interest.
            </p>
            <p className="blog-paragraph">
                <b>Bryce Harper (Baseball):</b> Consistently maintains high interest levels, with a 12-month average of 89 and a 3-month average of 82, showing a stable trend.
            </p>

            <h3 className="blog-subtitle">Lower Tier Insights</h3>
            <p className="blog-paragraph">
                <b>Tom Brady (Football):</b> Despite a slight downtrend, Brady remains a significant figure in football. His 12-month average is 87, with a 3-month average of 78.
            </p>
            <p className="blog-paragraph">
                <b>Michael Jordan (Basketball):</b> The legend's popularity remains strong, though slightly declining. His 12-month average is 92, with a 3-month average of 87.
            </p>
            <p className="blog-paragraph">
                <b>Corbin Carroll (Baseball):</b> Shows a considerable increase in recent interest. His 12-month average is 75, with a 3-month average of 79, indicating an uptrend.
            </p>
            <p className="blog-paragraph">
                <b>Deion Sanders (Football):</b> Interest levels are stable with slight fluctuations. His 12-month average is 85, with a 3-month average of 82.
            </p>
            <p className="blog-paragraph">
                <b>Lamar Jackson (Football):</b> Demonstrates a strong uptrend, with his 12-month average at 88 and his 3-month average at 99, reflecting a significant increase in interest.
            </p>

            <h3 className="blog-subtitle">Noteworthy Trends</h3>
            <p className="blog-paragraph">
                <b>Uptrends:</b> Players like J.J. McCarthy, Luka Doncic, and Elly De La Cruz are experiencing strong uptrends, indicating rising interest and potential price increases for their cards.
            </p>
            <p className="blog-paragraph">
                <b>Downtrends:</b> Despite high overall interest, some players like Tom Brady and Lebron James show minor downtrends, which might affect their card prices.
            </p>
            <p className="blog-paragraph">
                <b>Stable Interest:</b> Several players, such as Bobby Witt Jr. and Bryce Harper, exhibit stable interest, suggesting steady market value for their cards.
            </p>

            <h3 className="blog-subtitle">Conclusion</h3>
            <p className="blog-paragraph">
                The Google Trends summary provides critical insights for sports card collectors. By understanding the popularity trends of players, collectors can make strategic decisions about buying, holding, or selling their cards. The data reveals that uptrends are prevalent among many top players, indicating potential opportunities for investment. However, collectors should also be mindful of downtrends and stable interest levels, as these can impact the market dynamics. With this comprehensive analysis, collectors are better equipped to navigate the sports card market and optimize their collections.
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

export default BlogPost19;
