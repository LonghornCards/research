import React from 'react';
import TrendsChart from './TrendsChart';

const Page_GoogleTrends = () => {
    return (
        <div style={{ paddingTop: '50px', padding: '20px' }}> {/* Increased paddingTop for larger space */}
            <TrendsChart
                fileUrl="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_NFL.xlsx"
                title="NFL Google Trends"
            />
            <TrendsChart
                fileUrl="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_NBA.xlsx"
                title="NBA Google Trends"
            />
            <TrendsChart
                fileUrl="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Google_Trends_MLB.xlsx"
                title="MLB Google Trends"
            />
        </div>
    );
};

export default Page_GoogleTrends;
