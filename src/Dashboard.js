import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
});

// Styled components
const DashboardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  padding-top: 100px;
  background-color: #f9f9f9;
  flex-direction: column;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
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

// New styled components for the modal
const ModalContent = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  &:focus {
    border-color: peru;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  background-color: peru;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #e68a00;
  }
`;

const CancelButton = styled.button`
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #999;
  }
`;

const LinkHubContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 2px solid peru;
  border-radius: 10px;
  background-color: #fff;
`;

const LinkHubTitle = styled.h2`
  color: peru;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const LinkList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const LinkItem = styled.div`
  margin-bottom: 10px;
`;

const LinkAnchor = styled.a`
  color: black;
  text-decoration: underline;
  &:hover {
    color: peru;
  }
`;

// Helper function to upload data to S3
const uploadToS3 = async (data) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: 'websiteapp-storage-fdb68492737c0-dev',
        Key: 'Dashboard/Dashboard.xlsx',
    };

    try {
        const s3Object = await s3.getObject(params).promise();
        const workbook = XLSX.read(s3Object.Body, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert the worksheet to JSON
        let json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // If the file is empty, create headers
        if (json.length === 0) {
            json.push(['Account Email', 'First Name', 'Last Name', 'Street Address', 'City', 'State', 'Zip Code', 'Phone Number', 'Date of Birth', 'Favorite Sports', 'Favorite Teams', 'Favorite Players']);
        }

        // Find the index of the row to update
        const index = json.findIndex(row => row[0] === data['Account Email']);

        // Prepare the row data
        const rowData = [
            data['Account Email'],
            data['First Name'],
            data['Last Name'],
            data['Street Address'],
            data['City'],
            data['State'],
            data['Zip Code'],
            data['Phone Number'],
            data['Date of Birth'],
            data['Favorite Sports'],
            data['Favorite Teams'],
            data['Favorite Players']
        ];

        if (index !== -1) {
            // If the email exists, update the row
            json[index] = rowData;
        } else {
            // If the email does not exist, add a new row
            json.push(rowData);
        }

        // Convert the JSON back to a worksheet
        const updatedSheet = XLSX.utils.aoa_to_sheet(json);
        workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;

        // Write the updated workbook to a buffer
        const updatedExcelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        // Upload the updated Excel file to S3
        params.Body = updatedExcelBuffer;
        params.ContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        await s3.putObject(params).promise();
        console.log('Successfully uploaded data to S3');
    } catch (error) {
        console.error('Error uploading data to S3', error);
        throw new Error('Error uploading data to S3');
    }
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        'Account Email': '',
        'First Name': '',
        'Last Name': '',
        'Street Address': '',
        'City': '',
        'State': '',
        'Zip Code': '',
        'Phone Number': '',
        'Date of Birth': '',
        'Favorite Sports': '',
        'Favorite Teams': '',
        'Favorite Players': '',
    });

    const handleImageClick = (page) => {
        navigate(page);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);
        try {
            await uploadToS3(formData);
            alert('Profile updated successfully');
            setModalIsOpen(false);
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Error updating profile');
        }
    };

    const handleCancel = () => {
        setModalIsOpen(false);
    };

    return (
        <DashboardWrapper>
            <DashboardContainer>
                <Title>Welcome to Your Dashboard</Title>
                <ImageContainer>
                    <ImageWrapper onClick={() => handleImageClick('/pagecardhedge')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/cardhedge.jpeg" alt="Card Hedge" />
                        <HoverText>Search Card Hedge</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/cardprices')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/sportscardpro.jpeg" alt="Card Prices" />
                        <HoverText>Search Sports Card Pro</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/customscoreboard')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Scoreboard.png" alt="Scoreboard" />
                        <HoverText>Custom Scoreboard</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/aisearch')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/openai.png" alt="AI Search" />
                        <HoverText>AI Search</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/pagecollection')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/portfolioimage.png" alt="Card Collection" />
                        <HoverText>Card Collection</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/pagepsa')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/psa.jpeg" alt="PSA Cert" />
                        <HoverText>PSA Cert</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/pagerss')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/espn.jpeg" alt="ESPN RSS" />
                        <HoverText>ESPN RSS</HoverText>
                    </ImageWrapper>
                    <ImageWrapper onClick={() => handleImageClick('/pageprofile')}>
                        <StyledImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/user.svg" alt="User Profile" />
                        <HoverText>User Profile</HoverText>
                    </ImageWrapper>
                </ImageContainer>
                <Footer>
                    <ContactLink href="mailto:info@longhornsportscards.com">Contact Us</ContactLink>
                </Footer>
            </DashboardContainer>
            <LinkHubContainer>
                <LinkHubTitle>Link Hub</LinkHubTitle>
                <LinkList>
                    <LinkItem><LinkAnchor href="https://www.cardladder.com/">Card Ladder</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.psacard.com/">Sports Card Pro</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.cardhedger.com/">Card Hedge</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://130point.com/sales/">130 Point</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.psacard.com/">PSA Grading</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.gosgc.com/">SGC Grading</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.bgsgrading.com/">BGS Grading</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.sports-reference.com/">Sports-Reference</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.baseball-reference.com/">Baseball-Reference</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.basketball-reference.com/">Basketball-Reference</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.pro-football-reference.com/">Football-Reference</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.beckettmedia.com/books/graded-card-price-guide">Beckett Price Guide</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.topps.com/">Topps</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.paniniamerica.net/">Panini America</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://upperdeck.com/">Upper Deck</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://goldin.co/">Goldin</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.pwccmarketplace.com/">PWCC</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.ebay.com/">eBay</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.espn.com/">ESPN</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://sports.yahoo.com/">Yahoo Sports</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://sportscollectorsdigest.com/">Sports Collectors Digest</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.sportscollectorsdaily.com/">Sports Collectors Daily</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://bleacherreport.com/">Bleacher Report</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.sportscardportal.com/">Sports Card Portal</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.cardboardconnection.com/">The Cardboard Connection</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.splendidsports.com/">Splendid Sports</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.hobbynewsdaily.com/">Hobby Daily News</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.sportscardsnonsense.com/">Sports Cards Nonsense</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://marketmoversapp.com/">Market Movers</LinkAnchor></LinkItem>
                    <LinkItem><LinkAnchor href="https://www.sportbible.com/">Sports Bible</LinkAnchor></LinkItem>
                </LinkList>
            </LinkHubContainer>
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <ModalContent>
                    <h2>Update Profile</h2>
                    <form onSubmit={handleSubmit}>
                        {Object.keys(formData).map((key) => (
                            <InputGroup key={key}>
                                <Label htmlFor={key}>
                                    {key === 'Account Email' ? (
                                        <>
                                            {key} <span style={{ color: 'red' }}>*</span>
                                        </>
                                    ) : (
                                        key
                                    )}
                                </Label>
                                <Input
                                    id={key}
                                    name={key}
                                    type={
                                        key === 'Zip Code' || key === 'Phone Number' || key === 'Date of Birth'
                                            ? 'text'
                                            : 'text'
                                    }
                                    value={formData[key]}
                                    onChange={handleInputChange}
                                    pattern={
                                        key === 'Zip Code' ? '\\d*' :
                                            key === 'Phone Number' ? '\\d{1}-\\d{3}-\\d{3}-\\d{4}' :
                                                key === 'Date of Birth' ? '\\d{2}/\\d{2}/\\d{4}' : null
                                    }
                                    title={
                                        key === 'Phone Number' ? 'Format: 1-999-999-9999' :
                                            key === 'Date of Birth' ? 'Format: MM/DD/YYYY' : null
                                    }
                                    required={key === 'Account Email'}
                                />
                            </InputGroup>
                        ))}
                        <ButtonGroup>
                            <SubmitButton type="submit">Save</SubmitButton>
                            <CancelButton type="button" onClick={handleCancel}>Cancel</CancelButton>
                        </ButtonGroup>
                    </form>
                </ModalContent>
            </Modal>
        </DashboardWrapper>
    );
};

export default Dashboard;
