/// <reference path="pagecardsearch.js" />
import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import { Helmet } from 'react-helmet';
import * as XLSX from 'xlsx';
import './App.css';

const gradingCompanies = [
    {
        name: "PSA",
        content: `
        Founded in 1991, PSA has become one of the largest and most respected card grading services in the world. It is known for its detailed grading scale ranging from 1 to 10, with 10 being a virtually perfect card. Cards that exhibit high-end qualities with each grade, between PSA 2 and PSA 9, may achieve a half-point increase. The PSA grades are 1 (Poor), 1.5 (Fair Grade), 2 (Good), 3 (Very Good), PSA 4 (Very Good-Excellent), PSA 5 (Excellent), PSA 6 (Excellent-Mint), PSA 7 (Near Mint), PSA 8 (Near Mint-Mint), PSA 9 (Mint), and PSA 10 (Gem-Mint). PSA's encapsulation process preserves the card's condition while ensuring its authenticity.
        
        Their grading system is widely recognized and trusted, often leading to a higher resale value for cards graded by PSA. According to PSA, their research shows that PSA graded cards sell for more than competitors 9 out of 10 times. They also offer a comprehensive database of graded cards, providing valuable information for collectors.

        PSA will only grade after a trading card has been deemed authentic. Authentication is the process of verifying the originality or genuineness of a trading card. Grading is assessing the quality and condition of a trading card. PSA assigns a grade based on a variety of different qualifiers including marks on the card ("MK"), the cut of the card ("MC"), centering ("OC"), staining ("ST"), print defects ("PD"), and whether the card is out of focus ("OF"). PSA will not grade cards with evidence of trimming, re-coloring, restoration, or any other forms of tampering, or are of questionable authenticity.

        While a large part of PSA's grading process is objective, there is a component of their grading process that is somewhat subjective. PSA graders reserve the right, based on the strength or weakness of the eye appeal, to make a judgment call on the grade of a particular card. There are times when a PSA grader must make a call on a card that falls on the line between two grades and that final determination is made based on experience, eye appeal and market acceptability. To be considered a PSA 10 GEM-MT grade, which is a virtually perfect card, the card must have 4 sharp corners, sharp focus, and full original gloss. There must not be any staining but there is a small allowance for minor print imperfections. The image must be centered on the card within a tolerance not to exceed approximately 55/45 to 60/40 on the front, and 75/25 percent on the reverse.

        PSA encapsulates every trading card in a tamper-evident, sonically sealed case. These attractive, durable plastic cases provide protection from pressure and most damage. Their branded PSA LightHouse Label provides the full information for the card including the grade and card details. In 2017, PSA enhanced the security features found on the label used inside the PSA holder. Not only does this label exhibit new security properties, it also underwent a stylistic, branding makeover.

        For larger collectors or collectors who prefer secure safekeeping, PSA offers a Vault service that facilitates the safekeeping and transacting of stored cards. PSA currently has over 325,000 cards stored in their Vault worth a total value of over $300 million. Vaulted items are fully-insured, eBay-connected, and stored at no cost. Items are 100%-insured in a modern, climate-controlled facility with 24/7 security and asset management. eBay listings can be created quickly from the PSA Vault for seamless selling, and customers can ship to their unique PSA Vault ID and retrieve anytime.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/psa.jpeg"
    },
    {
        name: "BGS",
        content: `
        For over 40 years, Beckett has been a well-known name in the sports card industry, with its grading service, BGS, being established in 1999. They are especially renowned for grading newer cards. BVG as it is called, was introduced in 2001 and is the only grading service committed exclusively to vintage cards. A new addition to the line is the Beckett Grading Services Club, a new value-packed grading club that provides collectors value. The new BGS Club offers four levels of membership allowing an opportunity for every budget. BGS uses a unique grading scale that includes half-point grades, offering a more nuanced assessment of a card's condition. Their graded cards are encapsulated in tamper-evident cases. Beckett is particularly known for its thorough assessment of a card's corners, edges, surface, and centering.

        BGS grading is a process of assessing the condition of a trading card and assigning it a numerical grade based on a set of predefined criteria. There are four subgrades that are commonly used: centering, corners, edges, and surface. A card with high subgrades in all four categories will receive a high grade based on a 10-point scale, while a card with low subgrades will receive a lower numerical grade. Their scale is 1 (Poor), 2 (Good), 3 (Very Good), 4 (Very Good), 5 (Excellent), 6 (Excellent Mint), 7 (Near Mint), 8 (Near Mint), 9 (Mint), 9.5 (Gem Mint), 10 (Pristine), and 10 (Pristine 10's). Beckett reviews both the front and back of all cards in these four categories.

        Centering refers to the alignment of the card within its borders. A card with perfect centering has even borders on all sides. If a card is off-center, it can affect the overall appearance of the card and lower its grade. The corners of a trading card are one of the most critical factors in determining the card's grade. The card should be free of dings, creases, bends, or discoloration. Cards with these flaws will receive a lower grade. The edges of a trading card are another factor that is considered in grading. The edges should be crisp and free of any fraying, chipping, and dings. Cards with rough or damaged edges will receive a lower grade. Finally, the surface of the trading card refers to the front and back of the card. The surface should be free of stains, smudges, and scratches. Any surface damage, including manufacturer print defects or ink smears, will result in a lower grade.

        To be graded a BGS 10 Pristine, the centering must be 50/50 all around on front and 55/45 or better on back; the corners and edges must be perfect to the naked eye and virtually flawless under intense scrutiny; and there must be no print spots on the surface. Flawless color, devoid of registration or focus imperfections. Devoid of scratches and metallic print lines.

        BGS encapsulation is a classy design called their BGS Case Diagram, with metallic labels based on the grade. The label is Black for Perfect Pristine 10's, Gold for Pristine 10 and Gem Mint 9.5, and Silver for all other grades. The cases are safe and secure, and ultrasonically welded to be tamper-proof and water-resistant. Easy Identification of the overall numerical grade + 4 category subgrades appear on the front of the label, along with the card description for full transparency of the graded card. BGS also includes a sealed, archival inner sleeve to protect the card from internal movement that will not detract from card clarity.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image51.jpeg"
    },
    {
        name: "SGC",
        content: `
        SGC has been in the grading business since 1998 and has built a reputation for its focus on older, vintage cards. SGC is known for its straightforward grading scale and fast turnaround times. They provide a tuxedo-like black matting within their encapsulation, which enhances the card's visual appeal. Their focus on vintage cards makes them a go-to for collectors of historic baseball memorabilia.

        Similar to other grading companies, SGC uses a 1-to-10-point scale for grading cards, with half-point grades in addition to round numbers. The grades are 1 (Poor), 2 (Good), 2.5 (Good+), 3 (Very Good), 3.5 (Very Good+), 4 (Very Good/Excellent), 4.5 (Very Good/Excellent+), 5 (Excellent), 5.5 (Excellent+), 6 (Excellent/Near Mint), 6.5 (Excellent/Near Mint+), 7 (Near Mint), 7.5 (Near Mint+), 8 (Near Mint/Mint), 8.5 (Near Mint/Mint+), 9 (Mint), 9.5 (Mint+), 10 (Gem), and 10 (Pristine). An SGC 10 Pristine card is a "virtually flawless" card. 50/50 centering, crisp focus, four sharp corners, free of stains, no breaks in surface gloss, no print or refractor lines, and no visible wear under magnification.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image52.png"
    },
    {
        name: "CGC",
        content: `
        While newer to the sports card grading scene compared to others, CGC has quickly established a strong reputation, leveraging its expertise from comic book grading. CGC stands out for its state-of-the-art holder design, which offers superior protection and display qualities. The holder and label combine enhanced security features, crystal-clear optics and the most advanced archival materials for the best in display and protection. Crystal-clear optics showcase a card's color and detail, while the sturdy, ultrasonically-welded case resists impacts and tampering. To prevent counterfeiting, the CGC Cards label features microprinting, UV ink, holographic foil and a unique certification number and barcode.

        CGC is also known for their transparency - providing detailed reports on the grading process for each card. CGC was founded in 2000 and has certified over 15 million collectibles. CGC employs a team of more than 20 professional graders. Multiple experts examine each card and assign a grade according to a well-established and internationally accepted standard. Card grading at CGC is a team effort, with multiple professionals examining every card aided by advanced technology -- which helps to maximize accuracy and consistency. Each grader enters their own grade into their proprietary system, and a consensus is then reached on the final grade for the card.

        Their grading scale uses the industry standard 10-point grading scale topped by a Gem Mint 10 and, for the best of the best, a Pristine 10. A Pristine 10 is a virtually flawless card to the naked eye. The centering is 50/50, and the card has flawless color and registration. Cards that receive the CGC Pristine 10 grade, which is reserved exclusively for flawless cards under 10-times magnification, receive a special gold CGC Cards Pristine 10 label. The CGC grading scale is 1 (Poor), 1.5 (Fair), 2 (Good), 2.5 (Good+), 3 (Very Good), 3.5 (Very Good+), 4 (Very Good/Excellent), 4.5 (Very Good/Excellent+), 5 (Excellent), 5.5 (Excellent+), 6 (Excellent/Near Mint), 6.5 (Excellent/Near Mint+), 7 (Near Mint), 7.5 (Near Mint+), 8 (Near Mint/Mint), 8.5 (Near Mint/Mint+), 9 (Mint), 9.5 (Mint+), 10 (Gem Mint), and 10 (Pristine).`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image53.jpeg"
    },
    {
        name: "ISA",
        content: `
        Since 2010, International Sports Authentication (ISA) has been in the sports cards industry as well. In 2020 they were ranked amongst the top grading companies, and in 2021 they revamp their label, security, and website features. Grading involves individual judgments that are subjective and require the exercise of professional opinion, which can change from time to time. They have the standard 1-to-10-point grading scale, and assign half-point grades to high-end cards within a particular grade from ISA 1 to ISA 8 -- the primary focus is eye appeal. The grading scale is 1 (Poor), 2 (Good), 3 (Very Good), 4 (Very Good/Excellent), 5 (Excellent), 6 (Excellent/Near Mint), 7 (Near Mint), 8 (Near Mint/Mint), 9 (Mint), and 10 (Gem Mint). A card that receives a grade of ISA 10 is nearly flawless. This card has tremendous eye appeal that is unaffected by any minor print dots. It has all of its original gloss. The centering on the front of the card is between 50/50 and 55/45. The centering on the reverse of the card is no worse than 75/25. An ISA 10 possesses no staining and is in sharp focus.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image55.png"
    },
    {
        name: "HGA",
        content: `
        Outside of the top grading companies, Hybrid Grading Approach (HGA) is a newer entrant in the card grading industry, bringing innovation and technology to the forefront. HGA uses computer software for initial grading assessments, aiming to provide more consistent and objective grading. They also offer custom-colored slabs tailored to the card or team colors, which is unique in the industry. HGA claims to have revolutionized the collectible card market with a novel software approach. This approach involves scanning, analyzing, and grading cards at high resolution without subjectivity, aiming to detect imperfections that human eyes may often overlook. However, as of 07/15/2024 the company has halted new submissions while they restructure their business model and platform.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image54.png"
    },
    {
        name: "TAG",
        content: `
        Technical Authentication & Grading (TAG) is a technology-backed card grading solution that owns several patents and has been in existence for around 10 years. A convenience submission kit can be provided that contains all the supplies you need to protect and submit the cards for grading. Every TAG graded card includes a detailed Digital Imaging & Grading Report (DIG). By scanning the TAG Grade on the slab with a smartphone, you can instantly access high-res images of all the identified defects, scoring breakdowns for individual card attributes, Population, Leaderboard, Chronology, and more.

        Their patented grading system scores on a 1000-point scale & translates into an industry standard 1-10 Grade. Their highest grade is 10 Pristine and utilize half-points in addition to rounded grades. The 10 Pristine grade is characterized by 1) the front image being centered within a tolerance of ~51/49 and back image within ~54.5/45.5; 2) a card will display virtually flawless corners. No visible wear or fraying. Under high resolution imagery, the corners appear sharp and crisp with little to no fill or fray artifacts; 3) a flawless surface, exhibiting only Non-Human Observable Defects (NHOD's); and 4) a card will display virtually flawless edges. Under high resolution imagery, the edges have very minor fill or fray artifacts. Using Photometric Stereoscopic Imaging, TAG claims to offer a high level of grading accuracy.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image57.png"
    },
    {
        name: "Arena Club",
        content: `
        Arena Club was founded in 2021 and is a well-funded entrant to the sports card industry. With Derek Jeter as a founding member, the company packs star power to build credibility and awareness for their different approach. Powered by advanced machine learning, they claim their grading process is accurate, fast, and transparent. With a full grade rationale provided and explanation of how the card was scored. They convert the physical cards to digital and store the cards via an online display in your personal showroom. The digitization allows for more efficient buying, selling, and trading, and it avoids the hassles with shipping cards. All transactions are recorded on the blockchain for added security and transparency.

        For Arena Club, you submit your cards (raw or graded) to be graded, vaulted, and minted. The minting process creates a new token (NFT) on a blockchain for the card to be digitized and seamlessly transacted. Retrievals of the card have a small fee. They claim to have the lowest grading fees and commission fees in the industry, and fees can further be reduced by integrating all aspects of the buying, grading, selling, and trading. The digital showroom assigned to each user acts as a social forum in which to attract followers and highlight your collection -- with celebrities like Derek Jeter and Steve Nash currently showcasing their collections.

        Each card graded by Arena Club has an "Arena Code" unique ID that is displayed on the front label. Graded cards include subgrades for centering, corners, edges, and surface. The slabs for the cards are superior quality and custom made with an inner sleeve and specialty sized card cavity for security. The QR code on the back directs to more detailed information about the card and grading report.

        The graders, aided by computer vision and artificial intelligence, examine every detail of every card. Cards are given four sub-grades (a fifth auto grade is given to signatures), adding up to a more accurate and comprehensive overall grade. After that first round of grading, it's reviewed by another grader. Then a third round of review, before it is prepped for slabbing.

        Their ultrasonic welding machine creates an air-tight encapsulation, so the card is safe and secure in a custom slab. The slab is bagged in a sleeve, and vaulted cards are then secured and stored in their 24/7 secure surveillance facility with temperature and moisture control. Every card is fully insured and protected.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image56.png"
    },
    {
        name: "Rare Edition",
        content: `
        Rare Edition combines technology with human graders to scale their grading process and adapt to changes in the card grading industry. Their holders provide modern protections including hidden security, holo stamps, NFC chips, and a QR code to explore more information and verify. Their proprietary Computer Vision (CV) system uses a multi-step certification process to scan the cards for authenticity and grade according to their methodology. Their team researches every item to make sure each card's information is correct, along with finding out what makes it special. Every Rare Edition card has been reviewed by their team.

        Each card graded at their facility receives a comprehensive overall grade derived from data, formulas, and specific rules. The overall grade of a card is not merely an average of its sub-grades. Instead, it's determined by a blend of rules and formulas, where the objective aspects of condition and visual appeal converge with the subjective art of grading. Their grading technology, along with our human graders, reviews every card and works together to assign consistent and accurate grades. The graders review high-resolution imaging of each card while holding the card in front of them. The scans and CV results are compared against the card itself, after which our graders categorize and update any condition deviations in the system. This approach leads to the detailed grading report, where you can see exactly why your card got the grade it did.

        Everything is shown in the card's grading report. Every card is then encased after grading, and security features are added. The label is printed, and it is encased within a crystal-clear polycarbonate with Corning Gorilla Glass. The high frequency vibrations of their ultrasonic welder melt both pieces of polycarbonate together, creating a bond without the need for glue or adhesive. Once the pieces have been welded together, Corning Gorilla Glass is placed on the front and the back to provide superior scratch resistance and a premium feel.

        A unique aspect of Rare Edition is their Rare Moments feature that combines NFC technology in the Rare Edition Graded holder with content creation and video attachments to create a one-of-a-kind collectible.  With the Rare Edition graded card, you can attach your own videos creating a unique collecting experience.  Parents can gift graded cards to their children with personal videos attached, along with other experiences from third party content creation services.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image64.png"
    },
    {
        name: "Edge",
        content: `
        Edge Grading offers full Artificial Intelligence (AI) grading with human grader review and photographic proof of the grading process. Each card is evaluated by their proprietary AI image processor to microscopically scan every corner, edge and surface for defects to create an initial grading report. A human grader then reviews the card based on 18 distinct features and determines the final grade from 1-10+. A card graded as a 10 will be considered GemMint. The condition of a GemMint card would be comparable to a PSA 10, SGC 10, and BGS 9.5. Any card that has a combined score higher than 10 will be considered ULTRAMINT and will receive a grade of 10+. Grading values are based on subtraction. Each of the regions on every card begins as a 10.5. Imperfections can be worth anywhere from -.3 for microscopic wear to -6.5 for major card damage. The first occurrence of each type of damage is weighed more heavily than subsequent occurrences. A card with only microscopic wear can still potentially receive a score of ULTRAMINT.

        When averaging the measurements of the 4 regions (Corners, Edges, Centering, and Surface) the lowest scoring region will be weighed more heavily in the calculation of the final grade. The centering grade is a "maximum possible" measurement -- for example, a card with a centering grade of 8 can have a maximum overall grade of 8. Plus, overall grades cannot be more than 1 grade higher than the lowest region grade. Centering measurements are represented as a percentage. If the left border of a card measures 3mm and the right border measures 2mm in thickness, then that card would be said to have 60/40 left/right centering since the left border takes up 60% (3mm/5mm) and the right border takes up 40% (2mm/5mm) of the total border measurement.

        For a card to be graded GEMMINT or above all four corners and the edges must be sharp without visible signs of wear. Signs of chipping, rounding, or bent corners bring the card's grade down significantly. The card's surfaces must be free from minor scratches, print lines, and dimples. Cards with microscopic flaws can still sometimes grade as GEMMINT. Signs of color fading, creases, marks, stains, or large scratches and print lines bring the card's grade down significantly. For transparency, Edge provides eighteen ultra-high-resolution images of every card. Their holders and labels have been designed to accentuate a card's corners and edges while also providing detailed information about its grade in a way that does not distract from the card itself.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image63.jpeg"
    },
    {
        name: "KSA",
        content: `
        Since 1996, Canadian-owned KSA Certification has been providing card grading services and other types of services for the collectibles industry. KSA uses a 10-point certification process that includes checking centering, corners, cut, color, borders, enamel, focus, picture quality, registration, and micro imperfections. Cards are measured, checked under magnification and special lighting. KSA sonically seals all its graded cards in a scratch resistant, optical quality, UV protected holder. All cards graded by KSA have a unique serial number that corresponds to the card information and grade.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image58.png"
    },
    {
        name: "GMG",
        content: `
        Located in Minneapolis, Gem Mint Graded (GMG) provides a low-cost, efficient solution to grade modern low-mid range value sports cards. They only grade cards issued 1990-current with a max value of $99 raw. They combine a professional team with modern technology to accurately grade and verify each card. Their 10 Gem Mint is defined as a card that is nearly flawless. All 4 Corners must be sharp under magnification. Edges must be clean and level. One extremely small surface spot that is detectable under magnification is allowed. Centering must be 60/40 or better on the front, and 65/35 on the back.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image60.png"
    },
    {
        name: "AGS",
        content: `
        Automated Grading Systems (AGS) was launched in 2021 and provides an approach that uses 100% Artificial Intelligence (AI) and machine learning to grade cards. Their RoboGrading technology guarantees an unbiased, consistent, and fast grading process. To the robot, the card is just a variation of pixels, and it learns from expert graders and applies it. Without human subjectivity, AGS claims to provide a more reliable and consistent approach. AGS provides 8 subgrades per card, plus free HD photos and AI scans for every grade. They provide details for the grade rationale along with scans and scores for corners, edges, centering, and surfaces. Their technology looks for scratches, print lines, surface composition, and other microscopic details that can easily be missed by the human eye. They also offer an app to pre-grade cards using their proprietary technology so you can get an idea of whether it's cost effective to grade certain cards based on the projected grade and value.  Interestingly, Master P is an investor and on their Board of Directors.  They note significant investments in their technology and seek to differentiate themselves with cutting edge grading technology.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image61.png"
    },
    {
        name: "WCG",
        content: `
        World Class Grading (WCG) has a team of qualified and knowledgeable professionals that have been grading cards for over 25 years. They are split into new and vintage divisions. Their graders understand that all cards were not produced in the same manner and grading must take into consideration special circumstances that may surround a specific card. They are trained in knowing papers, inks, photography, and printing techniques, as well as knowing how to measure centering, check corners, and look for surface wear. They also offer all the complete information on their labels. WCG uses an easy-to-understand 1 to 10-point grading scale, with descending increments of one-half point (for example 10, 9.5, 9, 8.5, etc.). WCG claims to provide the fastest turnaround time in the industry, with an easy submission process. The optical-grade holders for the graded cards provide enhanced UV protection and are sealed to be airtight and watertight.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image62.png"
    },
    {
        name: "GMA",
        content: `
        GMA Grading has been in business for over 19 years. GMA Grading specializes in baseball cards, football cards, basketball cards, hockey cards, and non-sports cards. GMA promotes a fast turnaround time of less than 15 days, along with strong one-on-one customer service. They offer a variety of bulk card pricing models that are very affordable along with a membership program. Their GEM-MT 10 card grade is characterized by 60/40 or better centering, sharp focus, sharp corners, free of stains, no breaks in surface gloss, and little visible wear. A slight printing imperfection or surface scratch is allowable if it does not detract from the aesthetics of the card. The overall look of the card is calculated in the grade.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image65.jpeg"
    },
    {
        name: "RCG",
        content: `
        Revolution Card Grading (RCG) is based in Massachusetts and provides a 1--10-point grading scale based on their team's methodology. They derive a total score and then divide that by 4. Centering is based on the lowest grade from left to right and top to bottom. The total final grade cannot be more than 1 grade higher than the lowest grade. It takes all 4 subgrades being given 10 to receive a perfect "Crown Jewel 10", which means there are virtually no imperfections with the card. The centering is 50/50 to 52/48, or better, on the front and 60/40, or better, on the back of the card. The corners should be perfect, crisp and sharp. The edges should be perfect and nearly free of flaws under magnification. Finally, the surface should have no printing imperfections or print spots. The coloring should be vivid and perfect, with a high gloss and no scratches or print lines. The focus of the image needs to be perfect. The two ways to score a 10 are a quad 10 Crown Jewel and a Jewel 10, which is 3 10's and a 9.5.

        A unique aspect of RCG is the ability to customize your slab with your own unique design. They have patent-pending, direct-to-slab printing technology that is tamper-proof and provides an attractive display. They do not use paper labels and print instead on the inside of the slab itself - there will be no slipping of the label, no fading, and no way to reproduce or transfer the label. This will also help prevent fraud. In addition, RCG is currently the only company to not only print directly onto the graded slabs but also to offer short run and low population refractor, prism and gold label inserts. If a card receives a perfect quad 10 grade, it achieves the 22kt gold label status which is encapsulated in their Royal gold slab.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image66.png"
    },
    {
        name: "MNT",
        content: `
        MNT Grading is based in Canada, and they position themselves as a modern entrant to the card grading industry. They provide high quality slabs that are manufactured in North America and employ a team of professionals with a wealth of knowledge about the trading card industry. Their slabs are sonically sealed and tamper-proof, and they use the industry standard 1-10-point grading scale with half-point increments. MNT grades cards on 5 potential weighted categories: centering, corners, edges, surface and inner window (if applicable). A "Flawless 10" card is perfect in all categories of grading (Centering, Surface, Corners, Edges and Inner Window [if applicable]). A Flawless 10, with all sub- categories graded 10 will be marked on a special cracked ice black label. A Pristine 10 will be marked on a special cracked ice label. A graded Mint 9 to GEM Mint 9.5 will be marked with a gold label. Any graded cards receiving near-mint+ 8.5 or lower will be marked on a silver label.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image67.jpeg"
    },
    {
        name: "PGI",
        content: `
        Established at the National Sports Collectors Convention in 2002, Pristine Grading International (PGI) has been serving the collecting community for over twenty years. Located in Las Vegas, PGI carves a niche by address grading needs in the lower-priced card market. They provide an economic model that allows it to be cost-effective to grade lower-priced cards in your collection that could one day become more valuable. PGI grades all cards with a fair market value of less than $100 in ungraded condition and was produced after 1980. By specializing in this market sector, they can maintain an understanding of the cards, delivering quality service and maintaining a viable price point for grading and resale.

        Fair market value is defined as an average of completed online auctions and fixed price sales, based on current market data. PGI grades based on the industry standard 1-10-point scale, with Pristine 10 being the highest grade. A Pristine 10 is a flawless card with 50/50 centering and perfectly sharp at all corners, clean edges, no lack of gloss, and no imperfections or printing anomalies. Less than 1/10th of 1% of PGI cards have obtained this standard to date. A gold label is issued instead of the standard PGI sage green label. Due to the nature of the cards graded, PGI does not recommend encapsulating cards graded lower than Near Mint 8.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image68.png"
    },
    {
        name: "FCG",
        content: `
        Forensic Card Grading (FCG) is based in Southlake, Texas and they seek to provide a viable alternative to the main grading card companies without sacrificing the quality or look of the slabs. They focus on consistency and accuracy. The claim to be entirely objective with full transparency and fast turnaround times. They operate under a clearly defined set of rules for subgrades and utilize intense lighting and high magnification in the review process.

        Microscopes with multiple light settings allow the graders to quickly change the intensity of the light and level of magnification to best suit that individual card. Graders are also provided overhead magnifying lamps, with multiple tools and lighting options for the graders can combine the right lighting and magnification to get the best look at each aspect of every card. Cards are graded on their merit and their merit alone, no population control or worry about objectivity during the grading process.

        Another unique element is they offer a single service level -- "Fast". This is currently priced at $14 per card for a 10 day or less turnaround time. They do not upcharge based on value, autographs, or subgrades. If cards are not shipped within the 10-day turnaround they also offer a money-back guarantee. They use the industry standard 1-10-point scale, with 10 GEM MINT being the highest grade.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image69.png"
    },
    {
        name: "DCI",
        content: `
        Dynamic Card Innovations (DCI) is a third-party trading card authentication and grading company based in Frisco, Texas. Their team has authenticated and certified tens of thousands of memorabilia, autographs, and trading cards across a broad range of interests. The DCI Grading System is designed to help collectors save time and money by zeroing in on the most accurate grades, and they claim to have a higher than 95 percent gem rate when crossing over DCI-graded cards into other grading companies. Through their comprehensive slab grading and efficient grading services, they help their customers key-in on the best possible cards to grade, and their proprietary grading team delivers accurate and precise results. Their team averages a 5-business day turnaround on all orders shipped to their office and a 3-hour turnaround when you meet them at a local show.

        The DCI team consists of graders who take each card through a series of tests to verify each cards edges, surface, centering, measurements, and more. They use high powered magnification, color accurate lighting, and industry standard measuring tools. DCI uses the industry standard 1-10-point grading scale, with DCI 10 being the highest grade. DCI 10 is characterized by 4 sharp corners, original card gloss on the surface of the card without dimples, scratches, or indentions. The example should have sharp edges and corners. Centering on the card should be at least 55/45.`,
        image: "https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image70.jpeg"
    }
];

const PageGrading = () => {
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Card_Grade_Price_Data.xlsx');
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const companies = jsonData.map(row => row.Company);
            const prices = jsonData.map(row => row['Min Price']);
            const turnaround = jsonData.map(row => row.Turnaround);

            // Adjust the text positions to avoid overlap
            const textpositions = companies.map((_, index) => {
                if (index % 2 === 0) return 'top right';
                else return 'bottom left';
            });

            const trace = {
                x: turnaround,
                y: prices,
                mode: 'markers+text',
                type: 'scatter',
                text: companies,
                textposition: textpositions,
                textfont: {
                    color: 'black',
                    size: 14
                },
                marker: {
                    opacity: 0
                }
            };

            const layout = {
                title: 'Card Grading Companies: Price vs Turnaround',
                xaxis: { title: 'Turnaround Time (days)', showgrid: false },
                yaxis: { title: 'Minimum Price ($)', showgrid: false },
                shapes: [
                    {
                        type: 'rect',
                        xref: 'x',
                        yref: 'y',
                        x0: 0,
                        y0: 0,
                        x1: 90,
                        y1: 50,
                        fillcolor: 'rgba(255, 255, 0, 0.3)',
                        line: {
                            width: 0
                        }
                    },
                    {
                        type: 'rect',
                        xref: 'x',
                        yref: 'y',
                        x0: 0,
                        y0: 0,
                        x1: 60,
                        y1: 40,
                        fillcolor: 'rgba(0, 0, 255, 0.3)',
                        line: {
                            width: 0
                        }
                    },
                    {
                        type: 'rect',
                        xref: 'x',
                        yref: 'y',
                        x0: 0,
                        y0: 0,
                        x1: 30,
                        y1: 20,
                        fillcolor: 'rgba(0, 128, 0, 0.3)',
                        line: {
                            width: 0
                        }
                    }
                ]
            };

            Plotly.newPlot('scatterPlot', [trace], layout);
        };

        fetchData();
    }, []);
    return (
        <div className="page-grading">
            <Helmet>
                <title>Card Grading Companies</title>
                <meta name="description" content="Learn about the top sports card grading companies and their grading processes." />
            </Helmet>
            <h1 className="page-title">Sports Card Grading Companies</h1>
            <div className="centered-image">
                <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image73.jpeg" alt="Card Grading Process" />
            </div>
            <div className="download-link">
                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Card+Grading+Companies.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a>
            </div>
            <p className="intro-paragraph">
                <p>
                    Card grading is a meticulous process conducted by professional grading companies or organizations specializing in the evaluation of collectible cards.  The exact details of the grading process can vary slightly between grading companies.  Grading has become an essential aspect of the collectibles market, providing authenticity and value to cards.  According to Edge Grading, in the first half of 2023 alone PSA graded over 6.4 million cards out of an industry total of roughly 8 million. Plus, SGC showed to be growing in popularity and has increased to 7% market share.  Their survey showed an overwhelming majority of respondents choosing PSA.
                </p>
                <p>
                    The cost of card grading varies between companies and is typically based on a number of factors including desired turnaround time and estimated card value. The base grading fee ranges from around $10 to $39 per card for standard service. However, for high-value cards or expedited services, the fee can be significantly higher.  Some grading companies adjust their fees based on the estimated value of the card. For example, if you submit a card that is expected to be worth hundreds or thousands of dollars, you might pay a higher grading fee as a percentage of the card's value.  Faster services, such as "express" or "super express," usually cost more than standard or economy services. Prices for expedited services can range from $50 to several hundred dollars or more per card.
                </p>
                <p>
                    Starting in 1984 when Accugrade Sportscard Authentication (ASA) introduced the process of grading sports cards centering has been a key factor in the final grade of every card authenticated and slabbed ever since.  Centering specifications vary between grading companies. Professional Sports Authenticator (PSA) is the most lenient - 60/40 centering on the front and 75/25 on the back are the general guidelines for what could be considered a Gem Mint 10. Beckett Grading Services (BGS) is the strictest - requiring 50/50 on both the front and back to be eligible for a grade of 10.
                </p>
                <p>
                    Having trading cards graded by a reputable grading company can potentially add value to the cards, but it depends on several factors, including the card's rarity, condition, and the grading company's reputation. There are many examples of Gem Mint-graded cards that have sold for over 10x the value of an identical ungraded (raw) card.  During the pandemic, there was a massive increase of new collectors and grading baseball cards exploded.  There are currently over 25 card grading companies in the United States alone. The 10 widely regarded as the most trusted based on grading accuracy are Professional Sports Authenticator (PSA), Beckett Grading Services (BGS), Sportscard Guaranty Corporation (SGC), Certified Sports Guaranty (CSG), International Sports Authentication (ISA), Hybrid Grading Approach (HGA), Technical Authentication & Grading (TAG), Arena Club, Rare Edition, and Edge Grading.  However, the top 4 grading companies by far dominate the market, currently.
                </p>
            </p>

            {/* Table of Contents */}
            <div className="table-of-contents">
                <h2>Table of Contents</h2>
                <ul>
                    {gradingCompanies.map((company, index) => (
                        <li key={index}>
                            <a href={`#${company.name.replace(/\s+/g, '-')}`}>{company.name}</a>
                        </li>
                    ))}
                    <li>
                        <a href="#scatterplot">Scatterplot</a>
                    </li>
                </ul>
            </div>

            <div className="centered-image">
                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image71.png" target="_blank" rel="noopener noreferrer">
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image71.png" alt="Card Grading Process" />
                </a>
            </div>
            <div className="centered-image">
                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image72.png" target="_blank" rel="noopener noreferrer">
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image72.png" alt="Card Grading Process" />
                </a>
            </div>
            <div className="centered-image">
                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image49.png" target="_blank" rel="noopener noreferrer">
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image49.png" alt="Card Grading Process" />
                </a>
            </div>
            <div className="centered-image">
                <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image80.png" target="_blank" rel="noopener noreferrer">
                    <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image80.png" alt="Card Grading Process" />
                </a>
            </div>
            {/* Grading Companies */}
            {gradingCompanies.map((company, index) => (
                <div key={index} id={company.name.replace(/\s+/g, '-')} className="company-section">
                    <h2>{company.name}</h2>
                    <div className="company-images">
                        <img src={company.image} alt={`${company.name} logo`} />
                        {company.name === "Arena Club" && (
                            <img className="additional-arena-club-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image106.jpeg" alt="Additional Arena Club Image" />
                        )}
                        {company.name === "AGS" && (
                            <img className="additional-arena-club-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image107.jpeg" alt="Additional Arena Club Image" />
                        )}
                    </div>
                    {company.content.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph.trim()}</p>
                    ))}
                    {company.name === "PSA" && (
                        <div className="psa-section">
                            <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image50.png" target="_blank" rel="noopener noreferrer">
                                <img className="resized-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image50.png" alt="PSA Process" />
                            </a>
                            <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image86.png" target="_blank" rel="noopener noreferrer">
                                <img className="resized-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image86.png" alt="PSA Process" />
                            </a>
                        </div>
                    )}
                    {company.name === "BGS" && (
                        <div className="psa-section">
                            <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image105.png" target="_blank" rel="noopener noreferrer">
                                <img className="resized-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image105.png" alt="PSA Process" />
                            </a>
                        </div>
                    )}
                    {company.name === "SGC" && (
                        <div className="psa-section">
                            <a href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image87.png" target="_blank" rel="noopener noreferrer">
                                <img className="resized-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image87.png" alt="PSA Process" />
                            </a>
                        </div>
                    )}
                    {company.name === "ISA" && (
                        <>
                            <h2 className="subtitle">Slab Comparison: PSA, BGS, SGC, CGC, ISA</h2>
                            <div className="image-row">
                                <img className="comparison-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image74.jpg" alt="PSA Slab" />
                                <img className="comparison-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image75.png" alt="BGS Slab" />
                                <img className="comparison-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image76.jpg" alt="SGC Slab" />
                                <img className="comparison-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image77.png" alt="CGC Slab" />
                                <img className="comparison-image" src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image78.png" alt="ISA Slab" />
                            </div>
                        </>
                    )}
                </div>
            ))}
            <h2 id="scatterplot">Scatterplot</h2>
            <div id="scatterPlot" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default PageGrading;
