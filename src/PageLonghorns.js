import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Fuse from 'fuse.js';
import { useAuth } from './AuthContext'; // Import the Auth context
import { Helmet } from 'react-helmet'; // Import Helmet
import 'react-lazy-load-image-component/src/effects/blur.css';
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
    { value: 'rpa', label: 'rpa' }
];

const fuseOptions = {
    keys: ['Title'],
    threshold: 0.3, // Adjust the threshold for matching tolerance
    ignoreLocation: true,
    findAllMatches: true,
};

const PageLonghorns = () => {
    const { isLoggedIn } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [fuse, setFuse] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/products_json.json');
                if (response.data) {
                    const longhornsProducts = response.data.filter(product => product.Tags.includes('longhorns'));
                    setProducts(longhornsProducts);
                    setFilteredProducts(longhornsProducts);
                    setFuse(new Fuse(longhornsProducts, fuseOptions));
                    checkImages(longhornsProducts);
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
        filterProducts();
    }, [selectedTags, searchText, minPrice, maxPrice, products]);

    const handleTagChange = (selectedOptions) => {
        setSelectedTags(selectedOptions || []);
    };

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleMinPriceChange = (event) => {
        setMinPrice(event.target.value);
    };

    const handleMaxPriceChange = (event) => {
        setMaxPrice(event.target.value);
    };

    const resetFilters = () => {
        setSelectedTags([]);
        setSearchText('');
        setMinPrice('');
        setMaxPrice('');
        setFilteredProducts(products);
    };

    const filterProducts = () => {
        let filtered = products;

        if (selectedTags.length > 0) {
            filtered = filtered.filter(product =>
                selectedTags.every(tag => product.Tags.includes(tag.value))
            );
        }

        if (searchText && fuse) {
            const searchTerms = searchText.split(',').map(term => term.trim().toLowerCase());
            const searchResults = searchTerms.flatMap(term => fuse.search(term).map(result => result.item));
            const uniqueResults = Array.from(new Set(searchResults));
            filtered = uniqueResults;
        }

        if (minPrice || maxPrice) {
            filtered = filtered.filter(product => {
                const price = parseFloat(product.Price);
                const min = parseFloat(minPrice) || 0;
                const max = parseFloat(maxPrice) || Infinity;
                return price >= min && price <= max;
            });
        }

        setFilteredProducts(filtered);
    };

    const handleImageError = (e) => {
        e.target.src = '/placeholder.png';
    };

    const handleFilterByTag = (tag) => {
        const newTags = selectedTags.some(selectedTag => selectedTag.value === tag) ?
            selectedTags.filter(selectedTag => selectedTag.value !== tag) :
            [...selectedTags, { value: tag, label: tag }];
        setSelectedTags(newTags);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="products-page">
            <Helmet>
                <title>Longhorn Cards Sports Card Products</title>
            </Helmet>
            <div className="title-container">
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/texas.png"
                    alt="Longhorn Logo"
                    className="title-image"
                />
                <h1 className="products-title">Current Longhorn Inventory: Subscribe & Check Back For Updates!</h1>
            </div>
            <div className="filter-wrapper">
                <div className="filter-title">Search Cards:</div>
                <div className="filter-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search Card Title (comma-separated)"
                            value={searchText}
                            onChange={handleSearchTextChange}
                        />
                    </div>
                    <div className="price-filter">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                        />
                    </div>
                    <div className="tag-filter">
                        <Select
                            isMulti
                            name="tags"
                            options={tagOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedTags}
                            onChange={handleTagChange}
                            placeholder="Select tags to filter products"
                        />
                    </div>
                </div>
                <div className="image-filters">
                    <img
                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/football-solid.svg"
                        alt="Football Cards"
                        title="Football Cards"
                        className="filter-image"
                        onClick={() => handleFilterByTag('Football')}
                    />
                    <img
                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/basketball-solid.svg"
                        alt="Basketball Cards"
                        title="Basketball Cards"
                        className="filter-image"
                        onClick={() => handleFilterByTag('Basketball')}
                    />
                    <img
                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/baseball-solid.svg"
                        alt="Baseball Cards"
                        title="Baseball Cards"
                        className="filter-image"
                        onClick={() => handleFilterByTag('Baseball')}
                    />
                </div>
                <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
            </div>
            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div key={index} className="product-card">
                            <LazyLoadImage
                                src={product.Image_url}
                                alt={product.Title}
                                effect="blur"
                                className="product-image"
                                onError={handleImageError}
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

export default PageLonghorns;
