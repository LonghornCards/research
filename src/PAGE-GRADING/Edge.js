import React from 'react';

const Edge = () => (
    <div id="Edge" className="company-section">
        <h2>Edge</h2>
        <div className="company-images">
            <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image63.jpeg" alt="Edge logo" />
        </div>
        <p>
            Edge Grading offers full Artificial Intelligence (AI) grading with human grader review and photographic proof of the grading process. Each card is evaluated by their proprietary AI image processor to microscopically scan every corner, edge, and surface for defects to create an initial grading report. A human grader then reviews the card based on 18 distinct features and determines the final grade from 1-10+. A card graded as a 10 will be considered GemMint. The condition of a GemMint card would be comparable to a PSA 10, SGC 10, and BGS 9.5. Any card that has a combined score higher than 10 will be considered ULTRAMINT and will receive a grade of 10+.
        </p>
        <p>
            Grading values are based on subtraction. Each of the regions on every card begins as a 10.5. Imperfections can be worth anywhere from -.3 for microscopic wear to -6.5 for major card damage. The first occurrence of each type of damage is weighed more heavily than subsequent occurrences. A card with only microscopic wear can still potentially receive a score of ULTRAMINT.
        </p>
        <p>
            When averaging the measurements of the 4 regions (Corners, Edges, Centering, and Surface) the lowest scoring region will be weighed more heavily in the calculation of the final grade. The centering grade is a "maximum possible" measurement -- for example, a card with a centering grade of 8 can have a maximum overall grade of 8. Plus, overall grades cannot be more than 1 grade higher than the lowest region grade. Centering measurements are represented as a percentage. If the left border of a card measures 3mm and the right border measures 2mm in thickness, then that card would be said to have 60/40 left/right centering since the left border takes up 60% (3mm/5mm) and the right border takes up 40% (2mm/5mm) of the total border measurement.
        </p>
        <p>
            For a card to be graded GEMMINT or above, all four corners and the edges must be sharp without visible signs of wear. Signs of chipping, rounding, or bent corners bring the card's grade down significantly. The card's surfaces must be free from minor scratches, print lines, and dimples. Cards with microscopic flaws can still sometimes grade as GEMMINT. Signs of color fading, creases, marks, stains, or large scratches and print lines bring the card's grade down significantly. For transparency, Edge provides eighteen ultra-high-resolution images of every card.
        </p>
        <p>
            Their holders and labels have been designed to accentuate a card's corners and edges while also providing detailed information about its grade in a way that does not distract from the card itself.
        </p>
        <div className="psa-section">
            <a
                href="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image92.png"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    className="resized-image"
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Trading+Card+History/History_Image92.png"
                    alt="DCI Grading Process"
                />
            </a>
        </div>
    </div>
);

export default Edge;
