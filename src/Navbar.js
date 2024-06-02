import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: peru;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 40px; /* Increase padding to ensure all items fit within the viewport */
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: top 0.3s;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 20px; /* Add spacing between the menu items */
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 14px 16px;
  text-align: left;

  &:hover {
    color: black; /* Change the text color only on hover */
  }
`;

const Navbar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, visible, handleScroll]);

    return (
        <Nav style={{ top: visible ? '0' : '-60px' }}>
            <NavMenu>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/page_scoreboard">Scoreboard</NavLink>
                <NavLink to="/page_blog">Blog</NavLink>
                <NavLink to="/page3">Page 3</NavLink>
                <NavLink to="/about">About</NavLink>
            </NavMenu>
        </Nav>
    );
};

export default Navbar;
