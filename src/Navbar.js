import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import SearchResults from './SearchResults';
import axios from 'axios';
import { useAuth } from './AuthContext';

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
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
  }
`;

const NavMenu = styled('div').withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'isOpen',
})`
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
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
    padding: 10px;
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
  justify-content: flex-start;
  flex-shrink: 0; /* Prevent the container from shrinking */
`;

const LoginLink = styled(Link)`
  color: white;
  font-weight: bold;
  text-decoration: none;
  font-size: 1rem;
  padding: 10px 15px;
  white-space: nowrap;

  &:hover {
    color: black;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
    align-self: flex-end;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
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
  background: linear-gradient(45deg, #444, #666);
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
      background: rgba(255, 255, 255, 0.2);
      color: white;
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

const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Navbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [products, setProducts] = useState([]);
  const { isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
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
    return products.filter((product) =>
      product.Title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchResults = filterProducts(searchQuery);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Nav style={{ top: visible ? '0' : '-60px' }}>
        <LogoContainer>
          <Link to="/">
            <Logo
              src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Logo_Simple.png"
              alt="Logo"
            />
          </Link>
          <SocialIcons>
            <a href="https://www.facebook.com/longhorncards?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer">
              <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/facebook.ico" alt="Facebook" />
            </a>
            <a href="https://www.instagram.com/longhorncardsatx?igsh=MWs2cDUxbXk1bXhodQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
              <img src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/instagram.ico" alt="Instagram" />
            </a>
          </SocialIcons>
        </LogoContainer>
        <Hamburger onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </Hamburger>
        <NavMenu isOpen={isOpen}>
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <Dropdown>
            <span>Store</span>
            <DropdownContent className="dropdown-content">
              <NavLink to="/pageproducts" onClick={() => setIsOpen(false)}>
                All Products
              </NavLink>
              <NavLink to="/pagegradedcards" onClick={() => setIsOpen(false)}>
                Graded Cards
              </NavLink>
              <NavLink to="/pagerawcards" onClick={() => setIsOpen(false)}>
                Raw Cards
              </NavLink>
              <NavLink to="/pagelonghorns" onClick={() => setIsOpen(false)}>
                Longhorn Cards
              </NavLink>
              <NavLink to="/pagewheel" onClick={() => setIsOpen(false)}>
                Discount Wheel
              </NavLink>
            </DropdownContent>
          </Dropdown>
          <Dropdown>
            <span>Research</span>
            <DropdownContent className="dropdown-content">
              <NavLink to="/pagescoreboard" onClick={() => setIsOpen(false)}>
                Scoreboard
              </NavLink>
              <NavLink to="/pagegoogletrends" onClick={() => setIsOpen(false)}>
                Google Trends
              </NavLink>
              <NavLink to="/pagestats" onClick={() => setIsOpen(false)}>
                Player Statistics
              </NavLink>
              <NavLink to="/pagesnapshot" onClick={() => setIsOpen(false)}>
                Player Snapshot
              </NavLink>
              <NavLink to="/pagereturns" onClick={() => setIsOpen(false)}>
                Player Returns
              </NavLink>
              <NavLink to="/pagepricecharts" onClick={() => setIsOpen(false)}>
                Price Charts
              </NavLink>
              <NavLink to="/pagecsi" onClick={() => setIsOpen(false)}>
                Index Returns
              </NavLink>
              <NavLink to="/pagecardsearch" onClick={() => setIsOpen(false)}>
                eBay Card Sale Search
              </NavLink>
            </DropdownContent>
          </Dropdown>
          <Dropdown>
            <span>Blog</span>
            <DropdownContent className="dropdown-content">
              <NavLink to="/pageblog" onClick={() => setIsOpen(false)}>
                Blog
              </NavLink>
              <NavLink to="/pagerss" onClick={() => setIsOpen(false)}>
                RSS Feeds
              </NavLink>
              <NavLink to="/pagepodcasts" onClick={() => setIsOpen(false)}>
                Podcasts
              </NavLink>
              <NavLink to="/pagehistory" onClick={() => setIsOpen(false)}>
                History of Sports Trading Cards
              </NavLink>
              <NavLink to="/pagegrading" onClick={() => setIsOpen(false)}>
                Card Grading Companies
              </NavLink>
              <NavLink to="/pagebrands" onClick={() => setIsOpen(false)}>
                Sports Trading Card Brands
              </NavLink>
              <NavLink to="/pageglossary" onClick={() => setIsOpen(false)}>
                Sports Card Glossary
              </NavLink>
            </DropdownContent>
          </Dropdown>
          <NavLink to="/about" onClick={() => setIsOpen(false)}>
            About
          </NavLink>
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
        <RightNav>
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard">User Dashboard</NavLink>
              <LoginLink as="button" onClick={handleLogout}>
                Sign Out
              </LoginLink>
            </>
          ) : (
            <LoginLink to="/login" className="login-link">
              Log-in/Subscribe
            </LoginLink>
          )}
        </RightNav>
      </Nav>
      {showSearchResults && (
        <SearchResults
          query={searchQuery}
          products={searchResults}
          onClose={handleCloseSearch}
        />
      )}
    </>
  );
};

export default Navbar;
