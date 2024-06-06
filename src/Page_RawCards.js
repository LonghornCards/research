import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { useLocation } from 'react-router-dom';

const Page_RawCards = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const productRefs = useRef({});

    useEffect(() => {
        // Fetch product data from JSON file
        axios
            .get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/products_json.json')
            .then((response) => {
                // Filter products that contain the "raw" tag
                const rawProducts = response.data.filter(product =>
                    product.Tags && product.Tags.includes('raw')
                );
                setProducts(rawProducts);
            })
            .catch((error) => {
                console.error('Error fetching product data:', error);
            });
    }, []);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            if (productRefs.current[id]) {
                setTimeout(() => {
                    productRefs.current[id].scrollIntoView({ behavior: 'smooth' });
                    productRefs.current[id].classList.add('highlight');
                }, 0);
                setTimeout(() => {
                    if (productRefs.current[id]) {
                        productRefs.current[id].classList.remove('highlight');
                    }
                }, 3000); // Remove highlight after 3 seconds
            }
        }
    }, [location]);

    return (
        <div className="products-page">
            <h1 className="products-title">Raw Cards: Please Check Back & Subscribe for New Product Updates</h1>
            <p className="products-subscribe">
                <a href="/login" className="subscribe-link">Subscribe</a> to our newsletter for updates
            </p>
            <div className="products-grid">
                {products.map((product, index) => {
                    const ebayUrl = product.ebay_link;
                    const productId = `product-${product.Title.replace(/\s+/g, '-').toLowerCase()}`;

                    return (
                        <div
                            key={index}
                            id={productId}
                            className="product-card"
                            ref={(el) => (productRefs.current[productId] = el)}
                        >
                            <h2 className="product-title">{product.Title}</h2>
                            <div className="product-footer">
                                <p className="product-price">${parseFloat(product.Price).toFixed(2)}</p>
                                <a href={ebayUrl} className="product-link" target="_blank" rel="noopener noreferrer">View on eBay</a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Page_RawCards;
