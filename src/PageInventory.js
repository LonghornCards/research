import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PageInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('/api/ebay/inventory');
                setInventory(response.data.inventoryItems || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>eBay Inventory</h1>
            <ul>
                {inventory.map((item, index) => (
                    <li key={index}>
                        <h2>{item.title}</h2>
                        <p>SKU: {item.sku}</p>
                        <p>Price: {item.price.value} {item.price.currency}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PageInventory;
