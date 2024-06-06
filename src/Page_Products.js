import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import LazyLoad from 'react-lazyload';
import './App.css';

const tagOptions = [
    { value: 'Football', label: 'Football' },
    { value: 'Baseball', label: 'Baseball' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'graded', label: 'graded' },
    { value: 'raw', label: 'raw' },
    { value: 'rookie', label: 'rookie' },
    { value: 'auto', label: 'auto' },
    { value: 'patch', label: 'patch' },
    { value: 'rpa', label: 'rpa' },
];

const PageProducts = () => {
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
                    setProducts(response.data);
                    setFilteredProducts(response.data);
                    checkImages(response.data);  // Check images on initial load
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

    const checkImages = (products) => {
        products.forEach(product => {
            const img = new Image();
            img.src = product.Image_url;
            img.onerror = () => {
                console.log('Broken image found for product:', product.Title);
            };
        });
    };

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

    const handleImageError = (e) => {
        e.target.src = '/placeholder.png';
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="products-page">
            <h1 className="products-title">Current Inventory: Subscribe & Check Back For Updates!</h1>
            <div className="tag-filter">
                <Select
                    isMulti
                    name="tags"
                    options={tagOptions}
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
                            <LazyLoad height={200} offset={100}>
                                <img
                                    src={product.Image_url}
                                    alt={product.Title}
                                    className="product-image"
                                    onError={handleImageError}
                                    onClick={() => setSelectedImage(product.Image_url)}
                                />
                            </LazyLoad>
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

export default PageProducts;
