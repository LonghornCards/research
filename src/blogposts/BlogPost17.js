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

const BlogPost17 = () => {
    const shareUrl = window.location.href;
    const title = "New Highs/Lows: Card Collecting and Sports";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="full-blog-summary">
            <h2 className="blog-title">New Highs/Lows: Card Collecting and Sports</h2>

            <img className="blog-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_6.13.24.png" alt="Blog Post 6.13.24" />

            <p className="blog-paragraph">
                Here is a snapshot of 4 players whose card prices hit new highs or lows over the past month. Nicola Jokic, Shai Gilgeous-Alexander, and Jordan Love soared to new highs in May, while Chet Holmgren's average card prices hit a new all-time low during the month. Since 2019, Shai Gilgeous-Alexander's card prices have returned 825% cumulatively, Nicola Jokic has returned 1,827% since 2017, and Jordan Love's card prices have appreciated 123% since 2021. However, Chet Holmgren's card prices have lost 45% on average since tracking began in 2023.
            </p>

            <h3 className="blog-subtitle">The Joy of Card Collecting</h3>
            <p className="blog-paragraph">
                Card collecting is more than just a hobby; it is a passion that unites fans, brings back nostalgic memories, and keeps the excitement of sports alive off the field. Collecting cards of your favorite players and teams offers a tangible connection to the game, allowing fans to celebrate milestones, memorable plays, and historic seasons.
            </p>
            <p className="blog-paragraph">
                For many, the joy of card collecting begins in childhood. Opening packs of cards, trading with friends, and organizing collections are experiences that create lasting memories. The thrill of finding a rare card or completing a set is unparalleled, and these moments become cherished memories shared with family and friends.
            </p>

            <h3 className="blog-subtitle">Spotlight on Nicola Jokic</h3>
            <p className="blog-paragraph">
                Nicola Jokic, the Serbian sensation, has captured the hearts of basketball fans worldwide. His unique playing style and remarkable skills have made him a standout player. Collecting Jokic's cards allows fans to celebrate his journey from a second-round draft pick to an MVP. His cards have seen an incredible rise, with a return of 1,827% since 2017, making them prized possessions for collectors.
            </p>
            <p className="blog-paragraph">
                Jokic's cards are not just valuable; they are a testament to his hard work and perseverance. Each card tells a story, from his early days in the league to his rise as one of the top players in the NBA. Collectors cherish these cards, not just for their monetary value but for the memories they represent.
            </p>

            <h3 className="blog-subtitle">Shai Gilgeous-Alexander's Meteoric Rise</h3>
            <p className="blog-paragraph">
                Shai Gilgeous-Alexander's journey in the NBA has been nothing short of spectacular. Since 2019, his card prices have soared by 825%, reflecting his growing influence and popularity. Collectors who have followed his career from the beginning take pride in owning his cards, which symbolize his evolution into a key player.
            </p>
            <p className="blog-paragraph">
                Gilgeous-Alexander's cards are a favorite among collectors for their potential and the excitement they bring. Watching his games and tracking his progress adds a layer of engagement and anticipation for collectors, making the hobby even more enjoyable.
            </p>

            <h3 className="blog-subtitle">Jordan Love: A New Hope</h3>
            <p className="blog-paragraph">
                Jordan Love's entry into the NFL brought a wave of excitement among fans and collectors alike. Since 2021, his card prices have appreciated by 123%, indicating the high hopes placed on his shoulders. Collecting Love's cards is a way for fans to show their support and belief in his potential.
            </p>
            <p className="blog-paragraph">
                Each Jordan Love card is a piece of his early career, capturing the moments that could define his legacy. For collectors, these cards are not just about future value; they are about being part of Love's journey from the start.
            </p>

            <h3 className="blog-subtitle">The Challenge of Chet Holmgren</h3>
            <p className="blog-paragraph">
                On the other end of the spectrum, Chet Holmgren's card prices have faced challenges, dropping by 45% on average since tracking began in 2023. Despite this, collectors continue to find value in his cards, appreciating the potential for future growth and the uniqueness of his playing style.
            </p>
            <p className="blog-paragraph">
                Collecting Holmgren's cards is a testament to the faith and hope collectors have in his future. Each card represents the possibility of a turnaround and the excitement of watching a young player develop and overcome obstacles.
            </p>

            <h3 className="blog-subtitle">Card Collecting: A Community Affair</h3>
            <p className="blog-paragraph">
                Card collecting is more than an individual pursuit; it is a community affair. Collectors often connect with each other to trade cards, share stories, and celebrate their favorite players. Online forums, social media groups, and card shows provide platforms for collectors to interact and build friendships.
            </p>
            <p className="blog-paragraph">
                Being part of the card collecting community enhances the experience, providing opportunities to learn, grow, and connect with others who share the same passion. It is a hobby that brings people together, fostering a sense of camaraderie and shared enthusiasm for sports.
            </p>

            <h3 className="blog-subtitle">The Future of Card Collecting</h3>
            <p className="blog-paragraph">
                The future of card collecting is bright, with advancements in technology and a growing interest in sports driving the hobby forward. Digital cards, enhanced designs, and interactive features are making collecting even more exciting and accessible.
            </p>
            <p className="blog-paragraph">
                For new and seasoned collectors, the thrill of the hunt continues to be a driving force. Whether it is finding a rare card, completing a set, or discovering a new favorite player, the joy of card collecting remains timeless.
            </p>
            <p className="blog-paragraph">
                In conclusion, card collecting is a celebration of sports, memories, and community. It is a hobby that transcends generations, bringing fans closer to the game and each other. As we look forward to new highs and lows in card prices, let us remember that the true value of collecting lies in the joy and connections it brings.
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

export default BlogPost17;
