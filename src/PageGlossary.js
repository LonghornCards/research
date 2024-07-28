import React, { useState } from 'react';
import './App.css';
import { Helmet } from 'react-helmet';

const glossaryData = [
    { term: "1st Bowman", definition: "A player's 1st Bowman card is their first professional baseball card, released before their official RC." },
    { term: "Acetate", definition: "A transparent plastic sometimes used in the making of cards rather than traditional paper card stock. While popular among many collectors, acetate cards have been known to suffer from discoloration over the years." },
    { term: "Altered", definition: "When a card has been changed from its original condition. Examples of alterations range from trimming edges and corners to recoloring faded pictures." },
    { term: "Authenticity Guarantee", definition: "A service provided by eBay where qualifying trading cards sold over a certain threshold are automatically shipped to CSG for authentication before being sent to the buyer." },
    { term: "Autograph", definition: "A card that is autographed by a player, celebrity, or other subject. Autos are a type of chase card -- they are more limited, and thus more valuable, than the more common cards in a set." },
    { term: "Base Card", definition: "Base cards make up the base set, which is the most common set of cards in a sports or non-sport product." },
    { term: "Blaster Box", definition: "A blaster box is a type of retail box that is commonly distributed at large retail stores like Walmart and Target (as opposed to Hobby shops or online exclusives). Blaster boxes tend to have fewer packs per box (anywhere from 4 to 15) and, like other retail products, tend to have a lower price point, making them an accessible option for newcomers to The Hobby." },
    { term: "Book Card", definition: "When one or more cards -- generally, autographed cards or relics -- are combined together to open like a book." },
    { term: "Box Loader", definition: "Box loaders -- or toppers -- are special, single cards or sets of cards that are only available as inserts in hobby boxes. Box loaders are usually larger than standard-size cards and are meant as a unique opportunity for collectors to engage in the Hobby." },
    { term: "Breaking", definition: "Breaking refers to the practice of opening multiple boxes or cases of a product at the same time, and then distributing the cards to a larger group of paying customers. Breakers sell 'slots' to their breaks, and customers receive a defined portion of the opened product. In some cases, the customers will pay for a specific team, which entitles them to any card belonging to a player from that team; in other cases, the customer is simply given a randomized allotment." },
    { term: "Card Sleeve", definition: "These are plastic sleeves used to protect cards. The most popular kind -- Penny Sleeves -- get their name for being inexpensive: they cost a penny." },
    { term: "Card Stock", definition: "Card stock refers to the type of paper or material used to produce trading cards. Card stock can vary in thickness, depending on the set and type of card. Thicker card stock is often used for higher-end or premium products." },
    { term: "Case Hit", definition: "Boxes are shipped from manufacturers in cases, and for some products, a special card will be inserted 'one per case'. These case hits are more rare and thus more valuable to collectors." },
    { term: "Cello Pack", definition: "A retail format where packs of cards are wrapped in a plastic similar to cellophane. Cello Packs come in full boxes, typically with 24 packs, and are often hung from a rack at retailers for single purchase. Note: pronounced 'sello' as opposed to 'chello' (like the instrument)." },
    { term: "Centering", definition: "One of the major categories used when determining the grade of a card. Borders are the most common way to determine centering, though things like logos and lettering can be used for full-bleed cards without borders." },
    { term: "Chase Card", definition: "Any given set of cards will include a limited number of chase cards, which are highly coveted by collectors. Some examples of chase cards include: autographed cards, rare parallels, rare rookie cards, relic cards, and insert cards. Unlike common base cards, chase cards are more rare and valuable." },
    { term: "Chasing the Rainbow", definition: "A modern collecting phenomenon where you collect different color parallel cards of a player." },
    { term: "Checklist", definition: "A list of every card in a given product -- every base card, every parallel, every autographed card, etc." },
    { term: "Combination Card", definition: "Combination cards feature two or more players, teams, or other elements on a single card. These cards come in various designs: one player on each side, players arranged in a unique design on the card, dual or triple autos, and even relic cards receive the combination card treatment." },
    { term: "Commemorative", definition: "A collectible created to acknowledge a historic event, record-breaking achievement, anniversary or other special event." },
    { term: "Completist", definition: "A collector who is driven to possess every card of a given set, year, team, player, or category. If they collect 2021 Topps Chrome Baseball, the completist will hunt down every card from that checklist -- including every base card, parallel, auto, etc. For many collectors, common cards from a given set will have little value." },
    { term: "Die-cut", definition: "A trading card that has had part of the card stock removed to create a specific shape, design or function, such as a stand-up. In today's collecting era, such cards are used as inserts and are usually short-printed." },
    { term: "Error Card", definition: "A card that contains a mistake or error resulting in a variation (aka VAR). Error cards may include misspellings, statistical errors, incorrect photos, or other mistakes." },
    { term: "Event-Worn", definition: "A piece of memorabilia that has been worn by a player at a non-specific game or event. For example, a jersey or jersey patch that was worn at a rookie's signing session." },
    { term: "Factory Set", definition: "Factory Set refers to a specific way to sell baseball cards. Instead of random packs being placed in a retail box or hobby box, a full set is packaged and sold in a single box." },
    { term: "Facsimile Signature", definition: "An autograph that has been applied to a trading card using a stamp, or as part of the overall printing process. It is, in fact, a replica signature of the subject but was not applied to the card's surface by the subject themselves." },
    { term: "Foil", definition: "A metallic texture sometimes applied to cards to enhance the design. Foil cards are often highly condition sensitive, like Derek Jeter's 1993 SP Foil rookie card, which only has a population of 21 in PSA 10." },
    { term: "Game-Used", definition: "A piece of memorabilia that has been used in a professional sporting event. These items can include, but are not limited to: bats, jerseys, fielding gloves, batting gloves, bases, etc." },
    { term: "Game-Worn", definition: "A piece of memorabilia that has been worn by a player in an official game, which is then embedded in a trading card -- commonly referred to as a Relic Card." },
    { term: "Gem Mint", definition: "The condition rating given to a card that receives a PSA 10, BGS 9.5, SGC 10 or CSG 10." },
    { term: "Graded Card", definition: "A card that has had its authenticity verified and the quality of its physical condition evaluated by a grading service like PSA, BGS, SGC or CSG." },
    { term: "Hanger Pack", definition: "A retail format of trading cards that hangs rather than sit on a shelf. Ultra-modern hanger packs/boxes typically contain a single pack of cards." },
    { term: "Hit", definition: "A modern hobby term referring to higher-valued chase cards. Autographs, relic cards, insert cards, and coveted rookie cards are all commonly understood to be hits." },
    { term: "Hobby Box", definition: "Hobby boxes are high-end boxes that typically feature a greater number of chase cards, which makes them more expensive/valuable. Unlike retail boxes, which are widely distributed in big box stores (think: Walmart or Target), hobby boxes are usually distributed exclusively through hobby shops or online." },
    { term: "Hobby-Exclusive", definition: "Refers to products that only appear in hobby formats. This can be entire products that only have hobby box configurations (National Treasures, Flawless) or the specific contents of a product like parallels, inserts or other chases." },
    { term: "Insert Card", definition: "Insert cards refer to any non-base and non-parallel cards in a trading card set. These cards typically have their own themes, names, designs, and numberings." },
    { term: "Jersey Card", definition: "A trading card that contains a small piece -- or 'swatch' -- of a player's jersey. Unlike Patch Cards, which are taken from specific parts of the jersey (i.e. the logo or number), jersey swatches are typically single-color and consist of basic mesh or cloth material." },
    { term: "Numbered", definition: "Numbered cards are short-printed (e.g. limited edition), and the print run is specified on either the front or back of the card." },
    { term: "One of One", definition: "A 1/1 card is the rarest type of trading card, making it especially appealing to collectors." },
    { term: "One-Touch", definition: "A magnetic holder typically used by collectors for mid- to high-end cards that aren't graded but need protection similar to a top loader. One-Touch holders are generally preferred to top loaders when it comes to eye appeal and displayability." },
    { term: "Parallel", definition: "Most trading card products have a base set, made up of common cards, and then a smaller number of more-limited parallel cards. These cards essentially 'run parallel' to the base set -- they have a similar look and design, but are distinguished by a unique physical quality." },
    { term: "Patch Card", definition: "Cards that specifically feature a multi-colored jersey patch embedded in the card itself. Sometimes the jersey patches are game-used, but not always." },
    { term: "Player Collector", definition: "A collector who seeks out cards of a specific player, just as a team collector seeks out cards of a specific team." },
    { term: "Pop Report", definition: "A pop report is a published census showing the total number of cards graded by a third-party grading company. For any given card in any given grade (e.g. Mint 10), there will be a published pop report showing how many times the grading service has awarded that exact grade to that exact card." },
    { term: "Printing Plate", definition: "A printing plate is the thin metal plate used to print cards. They typically come in four different colors: cyan, magenta, yellow, and black. Printing plates are often offered as one-of-one collectibles for each color." },
    { term: "Print Run", definition: "Refers to the overall number of copies of a single card. Some cards have small print runs like 1/1 while others have been printed millions of times." },
    { term: "Prospecting", definition: "Prospecting is collecting cards of young players who have yet to reach the MLB. In many ways, Prospecting is all about finding as many cards of potential future All Stars as possible." },
    { term: "Raw", definition: "A card that hasn't been graded and slabbed by a third-party service like PSA or BGS. When you buy a pack of Topps baseball cards, you are buying raw cards. If you send those raw cards to a grading service, they will become graded cards." },
    { term: "Razz", definition: "Another name for a lottery or raffle that involves cards. An example of a razz features the original owner raffling off a card through 10 spots at $10 per spot. A winner is selected at random from that group to receive the card." },
    { term: "Redemption Card", definition: "With redemption cards, the owner exchanges or 'redeems' the card with the manufacturer and receives a hit (typically, autographed) card at a later date." },
    { term: "Refractor", definition: "Refractor Cards utilize a special printing technology to create a unique visual effect. The cards refract light to create a prism or rainbow-like look and colorful shine. Most products include multiple types of refractors, each of which is named for their different colors." },
    { term: "Relic Card", definition: "A card that contains a piece of memorabilia embedded in the card itself -- from a swatch of fabric from a player's jersey to a piece of game-used baseball." },
    { term: "Reprint", definition: "A reproduction of a card that was previously printed. New collectors should pay special attention to sale listings marked 'RP' as these are not original copies of the presented card." },
    { term: "Retail Box", definition: "These are lower-priced boxes that are widely distributed and available in large retail stores like Walmart or Target. A retail box may have the same base set as a higher-end hobby box, but will have fewer guaranteed hits and chase cards." },
    { term: "Retail-Exclusive", definition: "Refers to cards that appear only in retail formats. Examples could be inserts that only appear in Blaster Boxes or parallels that only appear in Hanger Boxes." },
    { term: "Rookie Card", definition: "Rookie cards refer to players' first cards once they make their Major League debut. In most cases, rookie cards are stamped with some kind of designation (e.g. 'RC') on the front or back, and that designation will appear on the card that same year as the debut or, in some cases, the following year." },
    { term: "RPA", definition: "Abbreviation for Rookie Patch Autograph. These types of cards are often the most desirable and expensive in the hobby." },
    { term: "Scarce", definition: "A card or series of cards with limited availability. The term is very subjective and today is used all too liberally to hype a card's value. It should be noted that when using the term in reference to vintage trading cards, 'scarce' cards are easier to obtain than 'rare' (see above) cards." },
    { term: "Short Print", definition: "A card that is printed in lower quantities than other cards in the same set. Short prints, or super short prints (SSPs), are much more scarce than common cards, and thus more valuable to collectors." },
    { term: "Sketch Card", definition: "Sketch Cards are one-of-one, hand-drawn cards created by the licensed artist from a particular set. They are the same size as regular trading cards and include the artist's signature." },
    { term: "Slabbing", definition: "Slabbing is a synonym for grading. A slabbed card is a graded card. 'That card is probably worth some money -- you should get it slabbed'." },
    { term: "Superfractor", definition: "A superfractor is the rarest type of refractor card. Superfractors are short-printed, 1-of-1 cards, which means that for any given card, there will be only one superfractor of that card in the entire product. Because they are 1/1, superfractors are among the most desired and valuable cards in any set." },
    { term: "Super Short Print", definition: "Abbreviated SSP, these cards are even more rare than short-prints. While there are no stated print runs for an SSP, the pack odds are definitively more rare than SP. Typically a print run under 50 is considered SSP." },
    { term: "Team Collector", definition: "A collector who seeks out cards of a specific team, just as a player collector seeks out cards of a specific player." },
    { term: "Toploader", definition: "Toploaders are thick, plastic encasings used to protect and store cards. Valuable cards are typically placed in a thin penny sleeve and then in a toploader for maximum protection." },
    { term: "Variation", definition: "A card that is different -- usually in small and subtle ways -- from its common counterparts in the same set. The most common variations include: a different color background or lettering, a corrected error, a name misspelling, or a photo variation. Variations are almost always intentional." },
    { term: "Vintage", definition: "A subjective term that describes older cards. A widely accepted cutoff is 1980, with cards produced before then considered vintage by modern standards." },
    { term: "Wax", definition: "A commonly-used Hobby term, wax refers to an unopened box or case of cards. To 'rip wax' or 'break wax' is to open a sealed box or case -- often vintage boxes that have been kept unopened for years." },
];

const PageGlossary = () => {
    const [selectedTerm, setSelectedTerm] = useState('');

    const handleTermChange = (event) => {
        setSelectedTerm(event.target.value);
    };

    const filteredGlossary = selectedTerm
        ? glossaryData.filter(item => item.term === selectedTerm)
        : glossaryData;

    return (
        <div className="glossary-container">
            <Helmet>
                <title>Sports Card Glossary</title>
            </Helmet>
            <h1 className="glossary-title">Sports Trading Card Glossary</h1>
            <select onChange={handleTermChange} value={selectedTerm} className="term-dropdown">
                <option value="">All Terms</option>
                {glossaryData.map((item, index) => (
                    <option key={index} value={item.term}>{item.term}</option>
                ))}
            </select>
            <div className="glossary-content">
                {filteredGlossary.map((item, index) => (
                    <div key={index} className="glossary-item">
                        <h3 className="glossary-term">{item.term}</h3>
                        <p className="glossary-definition">{item.definition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PageGlossary;
