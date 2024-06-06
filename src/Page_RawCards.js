import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const rawTagOptions = [
    { value: 'Football', label: 'Football' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Baseball', label: 'Baseball' },
    { value: 'rookie', label: 'rookie' },
    { value: 'auto', label: 'auto' },
    { value: 'rpa', label: 'rpa' },
];

const PageRawCards = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/products_json.json');
                console.log('Full response data:', response);
                if (response.data) {
                    console.log('Product data fetched successfully:', response.data);
                    const rawProducts = response.data.filter(product => product.Tags.includes('raw'));
                    setProducts(rawProducts);
                    setFilteredProducts(rawProducts);
                } else {
                    console.error('No data in response:', response);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedTags.length === 0) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                selectedTags.every(tag => product.Tags.includes(tag.value))
            );
            setFilteredProducts(filtered);
        }
    }, [selectedTags, products]);

    const handleTagChange = (selectedOptions) => {
        setSelectedTags(selectedOptions || []);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="products-page">
            <h1 className="products-title">Current Raw Card Inventory:  Subscribe & Check Back For Updates!</h1>
            <div className="tag-filter">
                <Select
                    isMulti
                    name="tags"
                    options={rawTagOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleTagChange}
                    placeholder="Select tags to filter products"
                />
            </div>
            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div key={index} className="product-card">
                            <img
                                src={product.Image_url}
                                alt={product.Title}
                                className="product-image"
                                onClick={() => setSelectedImage(product.Image_url)}
                            />
                            <h2 className="product-title">{product.Title || 'No Title'}</h2>
                            <p className="product-price">${parseFloat(product.Price).toFixed(2)}</p>
                            <a href={product.ebay_link} className="product-link" target="_blank" rel="noopener noreferrer">View on eBay</a>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>
            {selectedImage && (
                <div className="modal" onClick={() => setSelectedImage(null)}>
                    <span className="close">&times;</span>
                    <img className="modal-content" src={selectedImage} alt="Product" />
                </div>
            )}
        </div>
    );
};

export default PageRawCards;
