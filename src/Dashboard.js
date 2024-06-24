import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { useAuth } from './AuthContext';
import AWS from 'aws-sdk';
import * as XLSX from 'xlsx';
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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  flex: 1;
  padding: 10px;
  &:first-child {
    border-right: 2px solid peru;
    @media (max-width: 768px) {
      border-right: none;
      border-bottom: 2px solid peru;
      margin-bottom: 15px;
    }
  }
`;

const Item = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PictureContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadedImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
`;

const PlaceholderImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  opacity: 0.6;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: peru;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
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

const ConfirmationMessage = styled.div`
  color: green;
  font-weight: bold;
  margin-top: 10px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  margin-top: 10px;
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

const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
];

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.preferred_username || '');
    const [email, setEmail] = useState(user?.attributes?.email || '');
    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState(user?.attributes?.phone_number || '');
    const [birthdate, setBirthdate] = useState(user?.birthdate || '');
    const [picture, setPicture] = useState(user?.picture || '');
    const [pictureFile, setPictureFile] = useState(null);
    const [favoriteSports, setFavoriteSports] = useState(['', '', '']);
    const [favoriteTeams, setFavoriteTeams] = useState(['', '', '']);
    const [favoritePlayers, setFavoritePlayers] = useState(['', '', '']);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const userId = user?.attributes?.sub;

    // Load data from local storage on component mount
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('profileData'));
        if (storedData) {
            setUsername(storedData.username || '');
            setEmail(storedData.email || '');
            setAddress(storedData.address || '');
            setCity(storedData.city || '');
            setState(storedData.state || '');
            setZipCode(storedData.zipCode || '');
            setPhone(storedData.phone || '');
            setBirthdate(storedData.birthdate || '');
            setPicture(storedData.picture || '');
            setFavoriteSports(storedData.favoriteSports ? storedData.favoriteSports.split(', ') : ['', '', '']);
            setFavoriteTeams(storedData.favoriteTeams ? storedData.favoriteTeams.split(', ') : ['', '', '']);
            setFavoritePlayers(storedData.favoritePlayers ? storedData.favoritePlayers.split(', ') : ['', '', '']);
        }
    }, []);

    // Configure AWS SDK
    AWS.config.update({
        region: process.env.REACT_APP_AWS_REGION,
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
    });

    const uploadImageToS3 = async (file) => {
        const s3 = new AWS.S3();
        const fileName = `Dashboard/Pics/${Date.now()}_${file.name}`;
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: fileName,
            Body: file,
            ContentType: file.type,
            ACL: 'public-read'
        };

        try {
            await s3.putObject(params).promise();
            return `https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/${fileName}`;
        } catch (error) {
            console.error('Error uploading image to S3:', error);
            throw new Error('Error uploading image to S3');
        }
    };

    const fetchExcelFromS3 = async () => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'Dashboard/Dashboard.xlsx',
        };

        try {
            const data = await s3.getObject(params).promise();
            return XLSX.read(data.Body, { type: 'buffer' });
        } catch (error) {
            console.error('Error fetching Excel file from S3:', error);
            return null;
        }
    };

    const saveToS3 = async (data) => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: 'Dashboard/Dashboard.xlsx',
            Body: data,
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        try {
            console.log('Attempting to save to S3 with params:', params);
            await s3.putObject(params).promise();
            console.log('Data saved to S3 successfully');
        } catch (error) {
            console.error('Error saving data to S3:', error);
            throw new Error('Error saving data to S3');
        }
    };

    const handleSaveProfile = async () => {
        setConfirmationMessage('');
        setErrorMessage('');

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setErrorMessage('Verify account email to save profile');
            return;
        }

        try {
            let pictureUrl = picture;
            if (pictureFile) {
                pictureUrl = await uploadImageToS3(pictureFile);
            }

            const newProfileData = {
                sub: userId,
                username,
                email,
                address,
                city,
                state,
                zipCode,
                phone,
                birthdate,
                picture: pictureUrl,
                favoriteSports: favoriteSports.join(', '),
                favoriteTeams: favoriteTeams.join(', '),
                favoritePlayers: favoritePlayers.join(', ')
            };

            // Save data to local storage
            localStorage.setItem('profileData', JSON.stringify(newProfileData));

            console.log('New profile data prepared for saving:', newProfileData);

            const workbook = await fetchExcelFromS3();
            let worksheet;

            if (workbook) {
                worksheet = workbook.Sheets['Profile Data'] || XLSX.utils.json_to_sheet([]);
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const userIndex = jsonData.findIndex(user => user.email === email);
                if (userIndex > -1) {
                    jsonData[userIndex] = newProfileData;
                } else {
                    jsonData.push(newProfileData);
                }

                XLSX.utils.sheet_add_json(worksheet, jsonData, { skipHeader: true, origin: 'A1' });
            } else {
                worksheet = XLSX.utils.json_to_sheet([newProfileData]);
            }

            const newWorkbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Profile Data');

            const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            await saveToS3(blob);

            setConfirmationMessage('Profile Saved!');
        } catch (error) {
            console.error('Error saving profile:', error);
            setErrorMessage('Error saving data to S3');
        }
    };

    const handleBirthdateChange = (e) => {
        const dateValue = e.target.value;
        if (dateValue) {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                const formattedDate = date.toISOString().substr(0, 10);
                setBirthdate(formattedDate);
            } else {
                setBirthdate('');
            }
        } else {
            setBirthdate('');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicture(reader.result);
                setPictureFile(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFavoriteChange = (index, type) => (e) => {
        const value = e.target.value;
        if (type === 'sport') {
            setFavoriteSports((prev) => {
                const newSports = [...prev];
                newSports[index] = value;
                return newSports;
            });
        } else if (type === 'team') {
            setFavoriteTeams((prev) => {
                const newTeams = [...prev];
                newTeams[index] = value;
                return newTeams;
            });
        } else if (type === 'player') {
            setFavoritePlayers((prev) => {
                const newPlayers = [...prev];
                newPlayers[index] = value;
                return newPlayers;
            });
        }
    };

    const handleImageClick = (page) => {
        navigate(page);
    };

    return (
        <DashboardWrapper>
            <DashboardContainer>
                <Title>Welcome to Your Dashboard, {username}</Title>
                <Row>
                    <Column>
                        <Item>Email: <span style={{ color: 'red' }}>*</span>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Item>
                        <Item>Preferred Username:
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                            />
                        </Item>
                        <Item>Address:
                            <Input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Item>
                        <Item>City:
                            <Input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Item>
                        <Item>State:
                            <Select value={state} onChange={(e) => setState(e.target.value)}>
                                <option value="" disabled>Select your state</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </Select>
                        </Item>
                        <Item>Zip Code:
                            <InputMask
                                mask="99999"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            >
                                {(inputProps) => <Input {...inputProps} type="text" />}
                            </InputMask>
                        </Item>
                        <Item>Phone:
                            <InputMask
                                mask="+1-999-999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            >
                                {(inputProps) => <Input {...inputProps} type="text" />}
                            </InputMask>
                        </Item>
                        <Item>Birthdate:
                            <Input
                                type="date"
                                value={birthdate}
                                onChange={handleBirthdateChange}
                            />
                        </Item>
                        <Item>Picture:
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Item>
                        {picture ? (
                            <PictureContainer>
                                <UploadedImage src={picture} alt="Uploaded" />
                            </PictureContainer>
                        ) : (
                            <PictureContainer>
                                <PlaceholderImage src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/UPLOADPROFILEPIC.png" alt="Placeholder" />
                            </PictureContainer>
                        )}
                    </Column>
                    <Column>
                        <Item>Tools & Resources:</Item>
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
                        <Item>Preferences:
                            <div>
                                <label>Favorite Sports:</label>
                                {favoriteSports.map((sport, index) => (
                                    <Input
                                        key={index}
                                        type="text"
                                        value={sport}
                                        onChange={handleFavoriteChange(index, 'sport')}
                                        placeholder={`Favorite Sport ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <div>
                                <label>Favorite Teams:</label>
                                {favoriteTeams.map((team, index) => (
                                    <Input
                                        key={index}
                                        type="text"
                                        value={team}
                                        onChange={handleFavoriteChange(index, 'team')}
                                        placeholder={`Favorite Team ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <div>
                                <label>Favorite Players:</label>
                                {favoritePlayers.map((player, index) => (
                                    <Input
                                        key={index}
                                        type="text"
                                        value={player}
                                        onChange={handleFavoriteChange(index, 'player')}
                                        placeholder={`Favorite Player ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </Item>
                        <SaveButton onClick={handleSaveProfile}>Save Profile</SaveButton>
                        {confirmationMessage && <ConfirmationMessage>{confirmationMessage}</ConfirmationMessage>}
                        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    </Column>
                </Row>
                <Footer>
                    <ContactLink href="mailto:info@longhornsportscards.com">Contact Us</ContactLink>
                </Footer>
            </DashboardContainer>
        </DashboardWrapper>
    );
};

export default Dashboard;
