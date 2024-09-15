import React from 'react';
import { Helmet } from 'react-helmet';
import './App.css'; // Ensure this is the correct path

const names = [
  "AJ Brown",
  "Aaron Jones",
  "Aaron Judge",
  "Aaron Rodgers",
  "Adley Rutschman",
  // Add the rest of the sorted names here
];

const HolyGrail = () => {
  return (
    <div className="holy-grail-container" style={{ paddingTop: '70px' }}>
      <Helmet>
        <title>Sports Card Holy Grails - One-of-One (1/1) Card Sales</title>
      </Helmet>
      <h1 className="page-title">Sports Card Holy Grails - One-of-One (1/1) Card Sales</h1>
      <table className="name-table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {names.map((name, index) => (
            <tr key={index}>
              <td>{name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HolyGrail;
