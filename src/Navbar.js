import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchResults from './SearchResults';
import axios from 'axios';

const Nav = styled.nav`
  background: peru;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: top 0.3s;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: peru;
    padding: 10px 0;
    align-items: center;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 15px;
  text-align: center;
  font-weight: bold;

  &:hover {
    color: black;
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  div {
    width: 25px;
    height: 3px;
    background: white;
    margin: 4px 0;
    transition: all 0.3s ease;
  }
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const LoginLink = styled(Link)`
  color: white;
  font-weight: bold;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 15px;

  &:hover {
    color: black;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
    align-self: flex-end;
  }
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
  color: white;
  font-weight: bold;
  padding: 10px 15px;
  cursor: pointer;

  &:hover .dropdown-content {
    display: block;
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: peru;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

  a {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;

    &:hover {
      background-color: #111;
    }
  }
`;

const SearchBar = styled.form`
  display: flex;
  align-items: center;
  margin-left: auto;

  input {
    padding: 5px;
    font-size: 16px;
    border: none;
    border-radius: 4px 0 0 4px;
    flex: 1;
    margin-right: 5px;
  }

  button {
    padding: 5px 10px;
    font-size: 16px;
    background-color: white;
    color: peru;
    border: none;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: background-color 0.3s;

    &:hover {
      background-color: lightgray;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
  }
`;

const Navbar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch product data from JSON file
        axios
            .get('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/products_json.json')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching product data:', error);
            });
    }, []);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowSearchResults(true);
    };

    const handleCloseSearch = () => {
        setShowSearchResults(false);
        setSearchQuery('');
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, visible, handleScroll]);

    const filterProducts = (query) => {
        if (!query) return [];
        return products.filter(product =>
            product.Title.toLowerCase().includes(query.toLowerCase())
        );
    };

    const searchResults = filterProducts(searchQuery);

    return (
        <>
            <Nav style={{ top: visible ? '0' : '-60px' }}>
                <LogoContainer>
                    <Link to="/">
                        <Logo src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Logo_Simple.png" alt="Logo" />
                    </Link>
                </LogoContainer>
                <Hamburger onClick={toggleMenu}>
                    <div />
                    <div />
                    <div />
                </Hamburger>
                <NavMenu isOpen={isOpen}>
                    <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
                    <Dropdown>
                        <NavLink to="/page_store" onClick={() => setIsOpen(false)}>Store</NavLink>
                        <DropdownContent className="dropdown-content">
                            <Link to="/page_store" onClick={() => setIsOpen(false)}>Main Store</Link>
                            <Link to="/page_products" onClick={() => setIsOpen(false)}>All Products</Link>
                            <Link to="/page_gradedcards" onClick={() => setIsOpen(false)}>Graded Cards</Link>
                            <Link to="/page_rawcards" onClick={() => setIsOpen(false)}>Raw Cards</Link> {/* Add the Page_RawCards link */}
                        </DropdownContent>
                    </Dropdown>
                    <Dropdown>
                        <span>Research</span>
                        <DropdownContent className="dropdown-content">
                            <Link to="/page_scoreboard" onClick={() => setIsOpen(false)}>Scoreboard</Link>
                            <Link to="/page_googletrends" onClick={() => setIsOpen(false)}>Google Trends</Link>
                            <Link to="/page_stats" onClick={() => setIsOpen(false)}>Player Statistics</Link>
                            <Link to="/page_cardsearch" onClick={() => setIsOpen(false)}>eBay Card Sales</Link>
                        </DropdownContent>
                    </Dropdown>
                    <NavLink to="/page_blog" onClick={() => setIsOpen(false)}>Blog</NavLink>
                    <NavLink to="/about" onClick={() => setIsOpen(false)}>About</NavLink>
                </NavMenu>
                <SearchBar onSubmit={handleSearchSubmit} className="search-bar">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                    />
                    <button type="submit">Search</button>
                </SearchBar>
                <LoginLink to="/login" className="login-link">Log-in/Subscribe</LoginLink>
            </Nav>
            {showSearchResults && (
                <SearchResults query={searchQuery} products={searchResults} onClose={handleCloseSearch} />
            )}
        </>
    );
};

export default Navbar;
