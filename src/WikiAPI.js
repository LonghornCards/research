// WikiAPI.js
import axios from 'axios';

const fetchWikipediaData = async (playerName, sport) => {
    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(playerName)}`);
        const data = response.data;

        return {
            summary: data.extract,
            image: data.thumbnail ? data.thumbnail.source : null,
        };
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        return {
            summary: 'No Wikipedia summary found.',
            image: null,
        };
    }
};

export default fetchWikipediaData;
