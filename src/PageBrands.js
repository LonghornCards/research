import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import styled from 'styled-components';
import Plot from 'react-plotly.js';
import Select from 'react-select';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-left: 10px;
  padding-right: 10px;
`;

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid peru;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: peru;
    color: white;
  }
`;

const Dropdown = styled.select`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid peru;
  border-radius: 4px;
  background-color: white;
  color: black;
`;

const ResetButton = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  align-self: center;
`;

const PageBrands = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [scatterData, setScatterData] = useState([]);
    const [selectedSport, setSelectedSport] = useState('All Sports');
    const [selectedManufacturers, setSelectedManufacturers] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedSports, setSelectedSports] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const tableContainerRef = useRef(null);
    const [chartWidth, setChartWidth] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Card+Brands.xlsx',
                { responseType: 'arraybuffer' }
            );
            const workbook = XLSX.read(result.data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            const sortedData = worksheet.sort((a, b) => b['Hobby Box'] - a['Hobby Box']);
            setData(sortedData);
            setFilteredData(sortedData);
        };

        fetchData();

        // Update chart width when the component mounts
        const updateChartWidth = () => {
            if (tableContainerRef.current) {
                setChartWidth(tableContainerRef.current.offsetWidth);
            }
        };

        updateChartWidth();
        window.addEventListener('resize', updateChartWidth);

        return () => {
            window.removeEventListener('resize', updateChartWidth);
        };
    }, []);

    const colorMapping = {
        'NBA': 'blue',
        'NFL': 'green',
        'MLB': 'red',
        'Multi': 'orange',
        'NCAA Football': 'purple',
        'NCAA Basketball': 'cyan',
        'NCAA Baseball': 'magenta'
    };

    useEffect(() => {
        let filteredScatterData = data;
        if (selectedSport !== 'All Sports') {
            filteredScatterData = data.filter(item => item.Sport === selectedSport);
        }

        const groupedData = filteredScatterData.reduce((acc, item) => {
            if (!acc[item.Sport]) {
                acc[item.Sport] = {
                    x: [],
                    y: [],
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        size: 10,
                        color: colorMapping[item.Sport] || 'black'
                    },
                    name: item.Sport
                };
            }
            acc[item.Sport].x.push(item.Brand);
            acc[item.Sport].y.push(item['Hobby Box']);
            return acc;
        }, {});

        setScatterData(Object.values(groupedData));
    }, [data, selectedSport]);

    const handleFilterChange = () => {
        let filtered = data;

        if (selectedManufacturers.length > 0) {
            filtered = filtered.filter(item => selectedManufacturers.includes(item.Manufacturer));
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(item => selectedBrands.includes(item.Brand));
        }

        if (selectedSports.length > 0) {
            filtered = filtered.filter(item => selectedSports.includes(item.Sport));
        }

        filtered = filtered.filter(item => item['Hobby Box'] >= priceRange[0] && item['Hobby Box'] <= priceRange[1]);

        setFilteredData(filtered);
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedManufacturers, selectedBrands, selectedSports, priceRange, data]);

    const uniqueManufacturers = [...new Set(filteredData.map(item => item.Manufacturer))];
    const uniqueBrands = [...new Set(filteredData.map(item => item.Brand))];
    const uniqueSports = [...new Set(filteredData.map(item => item.Sport))];

    const handleResetFilters = () => {
        setSelectedManufacturers([]);
        setSelectedBrands([]);
        setSelectedSports([]);
        setPriceRange([0, 10000]);
        setSelectedSport('All Sports');
    };

    return (
        <Container>
            <Content>
                <h1>Sports Trading Card Brands</h1>
                <p>Below are various sports trading card brands along with their respective manufacturers, current estimated hobby box prices, and sports. Data as of July 2024.</p>
                <Dropdown value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                    <option value="All Sports">All Sports</option>
                    <option value="NBA">NBA</option>
                    <option value="NFL">NFL</option>
                    <option value="MLB">MLB</option>
                    <option value="Multi">Multi</option>
                    <option value="NCAA Football">NCAA Football</option>
                    <option value="NCAA Basketball">NCAA Basketball</option>
                    <option value="NCAA Baseball">NCAA Baseball</option>
                </Dropdown>
                <Plot
                    data={scatterData}
                    layout={{
                        title: `${selectedSport} Brand vs Hobby Box Price`,
                        xaxis: { title: 'Brand' },
                        yaxis: { title: 'Hobby Box Price', type: 'log' },
                        width: chartWidth,
                        margin: { b: 200 } // Increase bottom margin to avoid cutting off x-axis labels
                    }}
                />
                <FiltersContainer>
                    <FilterSection>
                        <Select
                            isMulti
                            name="manufacturers"
                            options={uniqueManufacturers.map(manufacturer => ({ value: manufacturer, label: manufacturer }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Manufacturers"
                            onChange={(selected) => setSelectedManufacturers(selected.map(option => option.value))}
                        />
                        <Select
                            isMulti
                            name="brands"
                            options={uniqueBrands.map(brand => ({ value: brand, label: brand }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Brands"
                            onChange={(selected) => setSelectedBrands(selected.map(option => option.value))}
                        />
                        <Select
                            isMulti
                            name="sports"
                            options={uniqueSports.map(sport => ({ value: sport, label: sport }))}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Sports"
                            onChange={(selected) => setSelectedSports(selected.map(option => option.value))}
                        />
                        <RangeContainer>
                            <label>Hobby Box Price Range:</label>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            />
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            />
                            <div>
                                ${priceRange[0]} - ${priceRange[1]}
                            </div>
                        </RangeContainer>
                    </FilterSection>
                    <ResetButton
                        src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/reset.svg"
                        alt="Reset Filters"
                        onClick={handleResetFilters}
                    />
                </FiltersContainer>
                <TableContainer ref={tableContainerRef}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Manufacturer</th>
                                <th>Brand</th>
                                <th>Hobby Box Price</th>
                                <th>Sport</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Manufacturer}</td>
                                    <td>{row.Brand}</td>
                                    <td>{row['Hobby Box'].toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</td>
                                    <td>{row.Sport}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </Content>
        </Container>
    );
};

export default PageBrands;
