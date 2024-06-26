import React from 'react';
import styled from 'styled-components';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

// Styled components
const DashboardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  padding-top: 100px;
  background-color: #f9f9f9;
`;

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 2px solid peru;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: peru;
  text-align: center;
  margin-bottom: 30px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 10px;
  cursor: pointer;

  &:hover div {
    visibility: visible;
    opacity: 1;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  border: 2px solid peru;
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const HoverText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: peru;
  color: white;
  text-align: center;
  padding: 5px 0;
  border-radius: 0 0 10px 10px;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s linear;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 20px;
`;

const ContactLink = styled.a`
  color: peru;
  font-size: 32px;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleImageClick = (page) => {
        navigate(page);
    };

    return (
        <DashboardWrapper>
            <DashboardContainer>
                <Title>Welcome to Your Dashboard</Title>
                <ImageContainer>
                    <ImageWrapper onClick={() => handleImageClick('/customscoreboard')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Scoreboard.png" alt="Scoreboard" />
                        <HoverText>Custom Scoreboard</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/cardprices')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/sportscardpro.jpeg" alt="Card Prices" />
                        <HoverText>Search Card Prices</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/aisearch')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/openai.png" alt="AI Search" />
                        <HoverText>AI Search</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/pagecollection')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/portfolioimage.png" alt="Card Collection" />
                        <HoverText>Card Collection</HoverText>
                    </ImageWrapper>
                </ImageContainer>
                <Footer>
                    <ContactLink href="mailto:info@longhornsportscards.com">Contact Us</ContactLink>
                </Footer>
            </DashboardContainer>
        </DashboardWrapper>
    );
};

export default Dashboard;
