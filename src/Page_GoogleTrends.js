import React, { useEffect } from 'react';
import TrendsChart from './TrendsChart';
import { useLocation } from 'react-router-dom';

const Page_GoogleTrends = () => {
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
