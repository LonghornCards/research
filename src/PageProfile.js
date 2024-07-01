import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AWS from 'aws-sdk';
import Papa from 'papaparse';
import './App.css'; // Reference the main App.css file

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const PageProfile = () => {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        city: '',
        state: '',
        country: '',
        favoriteSports: '',
        favoriteTeams: '',
        favoritePlayers: ''
    });
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [profileImage, setProfileImage] = useState('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/UPLOADPROFILEPIC.png');
    const [uploadedImageFile, setUploadedImageFile] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5; // Slow down the video playback rate
        }
    }, []);

    // Load data from local storage when the component mounts
    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem('profileData'));
        if (savedFormData) {
            setFormData(savedFormData);
            setDateOfBirth(savedFormData.dateOfBirth ? new Date(savedFormData.dateOfBirth) : null);
            setProfileImage(savedFormData.profileImage || 'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/UPLOADPROFILEPIC.png');
        }
    }, []);

    // Save form data to local storage
    useEffect(() => {
        localStorage.setItem('profileData', JSON.stringify({
            ...formData,
            dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
            profileImage,
        }));
    }, [formData, dateOfBirth, profileImage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'displayName') {
            const noSpacesValue = value.replace(/\s/g, '');
            setFormData({ ...formData, [name]: noSpacesValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDateChange = (date) => {
        setDateOfBirth(date);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
            setUploadedImageFile(file);
        }
    };

    const handleSaveProfile = () => {
        if (!formData.email) {
            alert('Please enter your email address to save your profile.');
            return;
        }

        if (uploadedImageFile) {
            const params = {
                Bucket: 'websiteapp-storage-fdb68492737c0-dev',
                Key: `Dashboard/Pics/${formData.email}`,
                Body: uploadedImageFile,
                ContentType: uploadedImageFile.type,
                ACL: 'public-read', // Change as per your requirement
            };

            s3.upload(params, function (err, data) {
                if (err) {
                    console.log('Error uploading data: ', err);
                } else {
                    console.log('Successfully uploaded data to s3', data);
                    setProfileImage(data.Location);
                    setShowSuccessMessage(true);
                }
            });
        }

        // Save the rest of the profile information in a CSV file
        const csvData = Papa.unparse([
            {
                'Display Name': formData.displayName,
                'Email': formData.email,
                'City': formData.city,
                'State': formData.state,
                'Country': formData.country,
                'Date of Birth': dateOfBirth ? dateOfBirth.toLocaleDateString() : '',
                'Favorite Sports': formData.favoriteSports,
                'Favorite Teams': formData.favoriteTeams,
                'Favorite Players': formData.favoritePlayers
            }
        ]);

        const blob = new Blob([csvData], { type: 'text/csv' });
        const params = {
            Bucket: 'websiteapp-storage-fdb68492737c0-dev',
            Key: `Dashboard/Profiles/${formData.email}.csv`,
            Body: blob,
            ContentType: 'text/csv',
            ACL: 'public-read', // Change as per your requirement
        };

        s3.upload(params, function (err, data) {
            if (err) {
                console.log('Error uploading data: ', err);
            } else {
                console.log('Successfully uploaded data to s3', data);
                setShowSuccessMessage(true);
            }
        });
    };

    return (
        <div className="profile-page">
            <div className="video-container">
                <video ref={videoRef} autoPlay loop muted className="background-video">
                    <source src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/mixkit-earth-globe-rotating-on-a-dark-background-21617-hd-ready.mp4" type="video/mp4" />
                </video>
            </div>
            <div className="profile-container">
                <div className="profile-header">
                    <h1>User Profile</h1>
                    <div className="header-content-custom">
                        <img
                            src={profileImage}
                            alt="User"
                            className="profile-image"
                        />
                        {formData.displayName && <span className="display-name-custom">{formData.displayName}</span>}
                    </div>
                </div>
                <div className="profile-content peru-container">
                    <div className="profile-info-column">
                        <h2>Profile Information</h2>
                        <div className="form-group">
                            <label htmlFor="displayName">Display Name:</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="state">State:</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country:</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of Birth:</label>
                            <DatePicker
                                selected={dateOfBirth}
                                onChange={handleDateChange}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="MM/DD/YYYY"
                                className="date-picker-input"
                            />
                        </div>
                    </div>
                    <div className="profile-info-column">
                        <h2>Additional Information</h2>
                        <div className="form-group">
                            <label htmlFor="favoriteSports">Favorite Sports:</label>
                            <input
                                type="text"
                                id="favoriteSports"
                                name="favoriteSports"
                                value={formData.favoriteSports}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="favoriteTeams">Favorite Teams:</label>
                            <input
                                type="text"
                                id="favoriteTeams"
                                name="favoriteTeams"
                                value={formData.favoriteTeams}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="favoritePlayers">Favorite Players:</label>
                            <input
                                type="text"
                                id="favoritePlayers"
                                name="favoritePlayers"
                                value={formData.favoritePlayers}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="upload-section">
                            <div className="upload-container">
                                <div>
                                    <label htmlFor="upload-button" className="upload-label">
                                        Upload Profile Image
                                    </label>
                                    <label htmlFor="upload-button" className="upload-image-label">
                                        <img
                                            src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/upload.svg"
                                            alt="Upload"
                                            className="upload-image"
                                        />
                                    </label>
                                    <input
                                        type="file"
                                        id="upload-button"
                                        className="upload-button"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                <div className="display-image-container">
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="display-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="save-profile-group-right">
                        <button className="save-profile-button" onClick={handleSaveProfile}>
                            Save Profile
                        </button>
                    </div>
                    <div className="contact-us">
                        <a href="mailto:info@longhornsportscards.com">CONTACT US</a>
                    </div>
                </div>
                {showSuccessMessage && (
                    <div className="success-message">
                        Profile Saved
                        <button onClick={() => setShowSuccessMessage(false)}>X</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageProfile;
