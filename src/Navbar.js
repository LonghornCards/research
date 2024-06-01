import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="menu-icon" onClick={toggleMenu}>
                ☰
            </div>
            <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                <li><Link to="/page1" onClick={toggleMenu}>Page 1</Link></li>
                <li><Link to="/page2" onClick={toggleMenu}>Page 2</Link></li>
                <li><Link to="/page3" onClick={toggleMenu}>Page 3</Link></li>
                <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
