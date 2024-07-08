// PageBlogContent.js
const blogEntries = [
    {
        date: '07/07/24',
        title: 'Longhorn Cards Player Scoreboard June 2024',
        summary: 'The Longhorn Cards Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player.',
        details: (
            <span>
                Updated for June 2024, our Longhorn Cards Player Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player. Also provided is the current price trend and percentages from different price levels.
            </span>
        ),
        fullPostLink: '/blog_post18',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_7.7.24.png'
    },
    {
        date: '06/13/24',
        title: 'New Highs/Lows',
        summary: 'New high/low card prices for a few select players over the last month.',
        details: (
            <span>
                Here is a snapshot of 4 players whose card prices hit new highs or lows over the past month. Nicola Jokic, Shai Gilgeous-Alexander, and Jordan Love soared to new highs in May, while Chet Holmgren's average card prices hit a new all-time low during the month.
            </span>
        ),
        fullPostLink: '/blog_post17',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_6.13.24.png'
    },
    {
        date: '05/31/24',
        title: 'Player Scoreboard - Top 25',
        summary: 'The Longhorns Cards Player Scoreboard Top 25 Players by Composite Rank',
        details: (
            <span>
                This table provides a summary of the current Top 25 players in the Longhorn Scoreboard. The rankings include historical card prices, player career statistics, and Google Trends interest. Key players across Football, Baseball, and Basketball are included.
            </span>
        ),
        fullPostLink: '/blog_post16',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.31.24.png'
    },
    {
        date: '05/26/24',
        title: 'Player Scoreboard',
        summary: 'The Longhorn Cards Player Scoreboard ranks Football, Basketball, and Baseball players using historical card sale prices, player career statistics, and Google Trends interest.',
        details: (
            <span>
                The Longhorn Cards Player Scoreboard ranks Football, Basketball, and Baseball players using historical card sale prices, player career statistics, and Google Trends interest.
            </span>
        ),
        fullPostLink: '/blog_post15',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.26.24.png'
    },
    {
        date: '05/23/24',
        title: 'Longhorn Cards Player Scoreboard May 2024',
        summary: 'Our overall Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player.',
        details: (
            <span>
                Our overall Scoreboard combines player career statistics, historical card prices, and Google Trends sentiment to calculate a Composite Rank for each player. Also provided is the current price trend and percentages from different price levels.
            </span>
        ),
        fullPostLink: '/blog_post14',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.23.24.png'
    },
    {
        date: '05/22/24',
        title: 'MLB Google Trends Rankings Heatmap',
        summary: 'This heatmap shows rankings over time for key MLB players using Google Trends to measure interest and popularity.',
        details: (
            <span>
                This heatmap shows rankings over time for key MLB players using Google Trends to measure interest and popularity.
            </span>
        ),
        fullPostLink: '/blog_post13',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.22.24.png'
    },
    {
        date: '05/21/24',
        title: 'NFL Google Trends Rankings Heatmap',
        summary: 'This heatmap shows rankings over time for key NFL players (plus a few 2024 Draft Picks) using Google Trends to measure interest and popularity.',
        details: (
            <span>
                This heatmap shows rankings over time for key NFL players (plus a few 2024 Draft Picks) using Google Trends to measure interest and popularity.
            </span>
        ),
        fullPostLink: '/blog_post12',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.21.24.png'
    },
    {
        date: '05/20/24',
        title: 'NBA Google Trends Rankings Heatmap',
        summary: 'This heatmap shows rankings over time for key NBA players using Google Trends to measure interest and popularity.',
        details: (
            <span>
                This heatmap shows rankings over time for key NBA players using Google Trends to measure interest and popularity.
            </span>
        ),
        fullPostLink: '/blog_post11',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.20.24.png'
    },
    {
        date: '05/19/24',
        title: 'NFL Top 10 Draft Picks - Google Trends',
        summary: 'Google Trends for the Top 10 NFL Draft Picks in 2024.',
        details: (
            <span>
                Google Trends for the Top 10 NFL Draft Picks in 2024. JJ McCarthy is head of the pack in terms of interest along with Caleb Williams.
            </span>
        ),
        fullPostLink: '/blog_post10',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.19.24.png'
    },
    {
        date: '05/18/24',
        title: 'Google Trends',
        summary: 'Google Trends over the past 5 years for a few key NBA players.',
        details: (
            <span>
                Google Trends over the past 5 years for a few key NBA players. Can see how Anthony Edwards has soared in popularity. Plotting his Google trend versus his card prices helps visualize the associated spike in card values.
            </span>
        ),
        fullPostLink: '/blog_post9',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.18.24.png'
    },
    {
        date: '05/17/24',
        title: 'NFL Wide Receiver & Tight End Rankings',
        summary: 'The NFL Wide Receiver/Tight End rankings below are based on Career statistics across numerous categories.',
        details: (
            <span>
                The NFL Wide Receiver/Tight End rankings below are based on Career statistics across numerous categories. The Overall Score is a proprietary formula that applies different weightings to a variety of key statistics.
            </span>
        ),
        fullPostLink: '/blog_post8',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.17.24.png'
    },
    {
        date: '05/16/24',
        title: 'NFL Quarterback Rankings',
        summary: 'The NFL Quarterback rankings below are based on Career statistics across numerous categories.',
        details: (
            <span>
                The NFL Quarterback rankings below are based on Career statistics across numerous categories. The Overall Score is a proprietary formula that applies different weightings to a variety of key statistics.
            </span>
        ),
        fullPostLink: '/blog_post7',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.16.24.png'
    },
    {
        date: '05/14/24',
        title: 'Player Scatterplots',
        summary: 'Now available on our website are comparisons for player scores versus how far their current price level is from their all-time high price level.',
        details: (
            <span>
                Now available on our website are comparisons for player scores versus how far their current price level is from their all-time high price level.
            </span>
        ),
        fullPostLink: '/blog_post6',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.14.24.png'
    },
    {
        date: '05/13/24',
        title: 'Sports Player Performance - May 2024',
        summary: 'This is our inaugural report for Sports Player Index Performance for key players across baseball, basketball, and football relative to their peers.',
        details: (
            <span>
                This is our inaugural report for Sports Player Index Performance for key players across baseball, basketball, and football relative to their peers. The index data for the players is determined by historical card prices, and provides YTD return, YTD relative return, and current Relative Strength for that player.
            </span>
        ),
        fullPostLink: '/blog_post5',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.13.24.png'
    },
    {
        date: '05/12/24',
        title: 'Sports Player Screen - May 2024',
        summary: 'This is our inaugural screen of what we consider \'blue chip\' players that have available card price/index data to analyze.',
        details: (
            <span>
                This is our inaugural screen of what we consider 'blue chip' players that have available card price/index data to analyze. The list provides a score by player (card) as well as current price trend: Strong Uptrend, Uptrend, Downtrend, or Strong Downtrend. The list includes both Active and Retired players, primarily across Football, Basketball, and Baseball. The analysis and final score considers the historical price movement of the player index as calculated from card sales as well as that price movement relative to an index of cards associated with that players sport. For example, a football player's prices are compared to an index of football players.
            </span>
        ),
        fullPostLink: '/blog_post4',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.12.24.png'
    },
    {
        date: '05/11/24',
        title: 'NBA Player Index Performance Comparison',
        summary: 'Highlighting 4 players in the NBA playoffs this year to compare their performance over the past year based on card prices: Anthony Edwards, Jalen Brunson, Nikola Jokic, and Jayson Tatum.',
        details: (
            <span>
                Highlighting 4 players in the NBA playoffs this year to compare their performance over the past year based on card prices: Anthony Edwards, Jalen Brunson, Nikola Jokic, and Jayson Tatum. Jalen Brunson has soared in value over the past year with a return of 265%, while more recently Anthony Edwards has spiked 65% during the playoffs. Nikola Jokic is holding steady at the higher end of his range, and Jayson Tatum has declined nearly 30% - the bulk of which has occurred since March.
            </span>
        ),
        fullPostLink: '/blog_post3',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.11.24.png'
    },
    {
        date: '05/10/24',
        title: 'Recent Card Sales (May 2024)',
        summary: 'This list provides the top 20 sales for football, baseball, and basketball cards within a price range of $100 to $1000.',
        details: (
            <span>
                This list provides the top 20 sales for football, baseball, and basketball cards within a price range of $100 to $1000. One of the most heavily traded segments of the market. The 2018 Panini Prizm #280 Luka Doncic rookie card (PSA 10) sold for as high as $2000 in 2021, and has been in the $200-300 range for the past year.
            </span>
        ),
        fullPostLink: '/blog_post2',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.10.24.png'
    },
    {
        date: '05/09/24',
        title: 'Sports Card Market Update April 2024',
        summary: 'The broad sports card index is up double-digits YTD, but baseball, football, and basketball indexes are still consolidating. The market is still a ways off all-time-highs set in 2021 but has realized strong long-term returns. See this month\'s update for more detail.',
        details: (
            <span>
                Although the broad CSI flagship sports card index is up 12% year-to-date, the Baseball, Football, and Basketball indexes are still posting negative returns. After hitting a peak in 2021, the broad index is down 24% from all-time-highs and has been consolidating over the past 1- and 3-years. All indexes are posting positive double-digit returns over longer 5- and 10-year time horizons. Football cards are leading with annualized returns of nearly 30% over the past 10-years.
            </span>
        ),
        fullPostLink: '/blog_post1',
        imageUrl: 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Blog/Blog_Post_5.9.24.png'
    }
];

export default blogEntries;
