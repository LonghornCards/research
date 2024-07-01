import React, { useState } from 'react';
import './App.css';

const PagePSA = () => {
    const [certNumber, setCertNumber] = useState('');
    const [response, setResponse] = useState(null);
    const [popResponse, setPopResponse] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [fileAppendResponse, setFileAppendResponse] = useState(null);
    const accessToken = 'g1ZRcY6zHxYNi9MDkSGvtnatMmVZCPDPfFVHYDM_znbod6iZ0Hdt0TbDhmAgKRnhHbmet4WCu8qurT005mIK-1pASjXiu-pbvGxs8fBb-gttXfqRAF8h02aWDznnvB0Zwt34Y0w5d3r0T_1GtNespXngqEPOqT42KwgovxII8ljnY-yf8iDsxakgCSvrZv_w7byQYysfGUALyP3ZEk4Z_wBhxTR85EG9w89dKLte9l_x0ZmFHA43odLXw9a20vY0B7bm2czYfSq4Hh0rIQKJ3nTL6tmKhRdftx8sDTNNtdFEFCQk';

    const handleInputChange = (e) => {
        setCertNumber(e.target.value);
    };

    const handleSubmit = async () => {
        const settings = {
            method: 'GET',
            headers: {
                'authorization': `bearer ${accessToken}`
            }
        };
        try {
            const response = await fetch(`https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber}`, settings);
            const data = await response.json();
            setResponse(data);

            const specID = data.PSACert.SpecID;
            const popResponse = await fetch(`https://api.psacard.com/publicapi/pop/GetPSASpecPopulation/${specID}`, settings);
            const popData = await popResponse.json();
            setPopResponse(popData);

            const certNum = data.PSACert.CertNumber;
            const imageResponse = await fetch(`https://api.psacard.com/publicapi/cert/GetImagesByCertNumber/${certNum}`, settings);
            const imageData = await imageResponse.json();
            if (imageData.images && imageData.images.length > 0) {
                setImageUrl(imageData.images[0].imageUrl);
            }

            const fileAppendResponse = await fetch(`https://api.psacard.com/publicapi/cert/GetByCertNumberForFileAppend/${certNum}`, settings);
            const fileAppendData = await fileAppendResponse.json();
            setFileAppendResponse(fileAppendData);

            console.log(data);
            console.log(popData);
            console.log(imageData);
            console.log(fileAppendData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const formatData = (data) => {
        const certData = data.PSACert;
        return (
            <>
                {imageUrl && (
                    <div className="psa-image-container">
                        <img src={imageUrl} alt="Card Image" className="psa-card-image" />
                    </div>
                )}
                <div className="psa-main-data-custom">
                    <h2>Main Data Points</h2>
                    <p><strong>Category:</strong> {certData.Category}</p>
                    <p><strong>Year:</strong> {certData.Year}</p>
                    <p><strong>Brand:</strong> {certData.Brand}</p>
                    <p><strong>Subject:</strong> {certData.Subject}</p>
                    <p><strong>Variety:</strong> {certData.Variety}</p>
                    <p><strong>CardGrade:</strong> {certData.CardGrade}</p>
                    <p><strong>GradeDescription:</strong> {certData.GradeDescription}</p>
                    <p><strong>TotalPopulation:</strong> {certData.TotalPopulation}</p>
                    <p><strong>TotalPopulationWithQualifier:</strong> {certData.TotalPopulationWithQualifier}</p>
                    <p><strong>PopulationHigher:</strong> {certData.PopulationHigher}</p>
                </div>
                <div className="psa-main-data-custom">
                    <h2>Additional Data Points</h2>
                    <p><strong>CertNumber:</strong> {certData.CertNumber}</p>
                    <p><strong>SpecID:</strong> {certData.SpecID}</p>
                    <p><strong>SpecNumber:</strong> {certData.SpecNumber}</p>
                    <p><strong>LabelType:</strong> {certData.LabelType}</p>
                    <p><strong>ReverseBarCode:</strong> {certData.ReverseBarCode ? "Yes" : "No"}</p>
                    <p><strong>IsPSADNA:</strong> {certData.IsPSADNA ? "Yes" : "No"}</p>
                    <p><strong>IsDualCert:</strong> {certData.IsDualCert ? "Yes" : "No"}</p>
                </div>
            </>
        );
    };

    const formatPopulationData = (data) => {
        const { PSAPop, PSADNAPop, ...rest } = data;
        return (
            <div className="psa-main-data-custom">
                <h2>Population Data</h2>
                {Object.entries(rest).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}</p>
                ))}
                {PSAPop && (
                    <div>
                        <h3>PSAPop</h3>
                        {Object.entries(PSAPop).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                    </div>
                )}
                {PSADNAPop && (
                    <div>
                        <h3>PSADNAPop</h3>
                        {Object.entries(PSADNAPop).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const formatFileAppendData = (data) => {
        const { PSACert, PSAPopulation, ...rest } = data;
        return (
            <div className="psa-main-data-custom">
                <h2>File Append Data</h2>
                {Object.entries(rest).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}</p>
                ))}
                {PSACert && (
                    <div>
                        <h3>PSACert</h3>
                        {Object.entries(PSACert).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                    </div>
                )}
                {PSAPopulation && (
                    <div>
                        <h3>PSAPopulation</h3>
                        {Object.entries(PSAPopulation).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="psa-page-container-custom">
            <div className="psa-title-container-custom">
                <h1 className="psa-title-custom">PSA Certification Verification</h1>
                <img
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/psa.jpeg"
                    alt="PSA"
                    className="psa-image-custom"
                />
            </div>
            <p className="psa-description-custom">
                Verify the validity of PSA & PSA/DNA certification numbers using the form field.
            </p>
            <div className="psa-form-container-custom">
                <input
                    type="text"
                    className="psa-input-custom"
                    maxLength="15"
                    placeholder="Enter certification number"
                    value={certNumber}
                    onChange={handleInputChange}
                />
                <button className="psa-submit-button-custom" onClick={handleSubmit}>
                    Verify
                </button>
                {response && (
                    <div className="psa-response-custom">
                        {formatData(response)}
                        {popResponse && formatPopulationData(popResponse)}
                        {fileAppendResponse && formatFileAppendData(fileAppendResponse)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PagePSA;
