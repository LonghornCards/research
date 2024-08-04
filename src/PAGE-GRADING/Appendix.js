// src/PAGE-GRADING/Appendix.js
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const Appendix = () => {
  const [gradingCompanyWebsites, setGradingCompanyWebsites] = useState([]);

  useEffect(() => {
    const fetchGradingCompanyWebsites = async () => {
      const response = await fetch('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Grading+Company+Websites.xlsx');
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setGradingCompanyWebsites(jsonData);
    };

    fetchGradingCompanyWebsites();
  }, []);

  return (
    <div className="appendix">
      <h2>Appendix</h2>
      {gradingCompanyWebsites.length > 0 ? (
        <ul>
          {gradingCompanyWebsites.map((company, index) => (
            <li key={index}>
              <strong>{company['Grading Company']}</strong>: <a href={company['Website Address']} target="_blank" rel="noopener noreferrer">{company['Website Address']}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Appendix;
