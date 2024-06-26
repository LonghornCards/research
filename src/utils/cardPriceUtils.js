// cardPriceUtils.js
import axios from 'axios';

const API_KEY = '8b0ccba1cb45ed4a3db702d1296e7478a26f87a4';

export const fetchCardPrices = async (formattedDetails) => {
    const url = `https://www.sportscardspro.com/api/products?t=${API_KEY}&q=${formattedDetails}`;
    try {
        const response = await axios.get(url);
        if (response.data && response.data.status === 'success') {
            return response.data.products || [];
        }
    } catch (error) {
        console.error('Error fetching card prices:', error);
    }
    return [];
};

export const fetchAdditionalPrices = async (id) => {
    const url = `https://www.sportscardspro.com/api/product?t=${API_KEY}&id=${id}`;
    try {
        const response = await axios.get(url);
        if (response.data && response.data.status === 'success') {
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching additional prices:', error);
    }
    return null;
};
