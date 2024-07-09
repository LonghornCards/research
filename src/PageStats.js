import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useTable, useBlockLayout } from 'react-table';
import Select, { components } from 'react-select';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import './App.css';
import { useLocation } from 'react-router-dom';

const fetchData = async (url) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return worksheet;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const DataTable = ({ data, selectedNames, compositeRanks }) => {
    const columns = React.useMemo(
        () => (data.length > 0 ? Object.keys(data[0]).map(key => ({
            Header: key,
            accessor: key,
            sticky: key === 'Name' // Make the Name column sticky
        })) : []),
        [data]
    );

    const filteredData = React.useMemo(() => {
        if (selectedNames.length === 0) return data;
        return data.filter(row => selectedNames.some(option => option.value === row.Name));
    }, [data, selectedNames]);

    const fuse = new Fuse(compositeRanks, {
        keys: ['Name'],
        threshold: 0.3
    });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data: filteredData
        },
        useBlockLayout
    );

    const getRankColor = (value) => {
        if (value < 25) return 'red';
        if (value >= 25 && value < 50) return 'indianred';
        if (value >= 50 && value < 75) return 'green';
        if (value >= 75 && value <= 100) return 'limegreen';
        return 'black';
    };

    return (
        <div className="scoreboard-table-container">
            <div {...getTableProps()} className="scoreboard-table">
                <div>
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()} className="tr">
                            {headerGroup.headers.map(column => (
                                <div
                                    {...column.getHeaderProps()}
                                    className={`th ${column.sticky ? 'sticky' : ''}`}
                                    style={{ textAlign: column.Header === 'Name' ? 'left' : 'center' }}
                                >
                                    {column.render('Header')}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <div {...row.getRowProps()} className="tr" id={`row-${row.original.Name.replace(/\s+/g, '-').toLowerCase()}`}>
                                {row.cells.map(cell => {
                                    const isNameColumn = cell.column.Header === 'Name';
                                    const isRankColumn = cell.column.Header.includes('Rank');
                                    const cellValue = cell.value;
                                    const name = cell.value;
                                    const result = isNameColumn ? fuse.search(name) : [];
                                    const isNameMatched = result.length > 0;

                                    return (
                                        <div
                                            {...cell.getCellProps()}
                                            className={`td ${cell.column.sticky ? 'sticky' : ''}`}
                                            style={{
                                                textAlign: isNameColumn ? 'left' : 'center',
                                                color: isRankColumn ? getRankColor(cellValue) : 'black'
                                            }}
                                        >
                                            {isNameColumn && isNameMatched ? (
                                                <Link to={`/PageSnapshot?player=${name}`}>{name}</Link>
                                            ) : (
                                                cell.render('Cell')
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const Option = (props) => (
    <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{' '}
        <label>{props.label}</label>
    </components.Option>
);

const MultiValue = (props) => (
    <components.MultiValue {...props}>
        <span>{props.children}</span>
    </components.MultiValue>
);

const Page_Stats = () => {
    const [nflData, setNflData] = useState([]);
    const [nbaData, setNbaData] = useState([]);
    const [mlbData, setMlbData] = useState([]);
    const [selectedNflNames, setSelectedNflNames] = useState([]);
    const [selectedNbaNames, setSelectedNbaNames] = useState([]);
    const [selectedMlbNames, setSelectedMlbNames] = useState([]);
    const [compositeRanks, setCompositeRanks] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const loadStats = async () => {
            const [nflData, nbaData, mlbData, compositeRanks] = await Promise.all([
                fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NFL_Stats.xlsx'),
                fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/NBA_Stats.xlsx'),
                fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/MLB_Stats.xlsx'),
                fetchData('https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/Composite_Ranks.xlsx')
            ]);
            setNflData(nflData);
            setNbaData(nbaData);
            setMlbData(mlbData);
            setCompositeRanks(compositeRanks);
        };

        loadStats();
    }, []);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 0);
            }
        }
    }, [location]);

    const getUniqueOptions = (data, key) => {
        const options = data.map(row => row[key]);
        const uniqueOptions = [...new Set(options)];
        return uniqueOptions.map(option => ({ value: option, label: option }));
    };

    return (
        <div className="scoreboard-page-container">
            <Helmet>
                <title>Player Statistics</title>
            </Helmet>
            <h1>Sports Statistics</h1>
            <p className="scoreboard-intro-paragraph">
                Welcome to the Sports Statistics page! Here, you will find comprehensive statistics for key NFL, NBA, and MLB players.

                Use the filters below to narrow down the data based on your player selections. Data sourced from Sports-Reference.com.

                See the bottom of the page for a full glossary of the different statistics provided.

            </p>
            <h2>NFL Statistics Ranks</h2>
            <div className="scoreboard-filters center-filters">
                <div className="scoreboard-filter">
                    <label>Filter by Name</label>
                    <Select
                        isMulti
                        options={getUniqueOptions(nflData, 'Name')}
                        value={selectedNflNames}
                        onChange={setSelectedNflNames}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
            </div>
            <DataTable data={nflData} selectedNames={selectedNflNames} compositeRanks={compositeRanks} />
            <h2>NBA Statistics Ranks</h2>
            <div className="scoreboard-filters center-filters">
                <div className="scoreboard-filter">
                    <label>Filter by Name</label>
                    <Select
                        isMulti
                        options={getUniqueOptions(nbaData, 'Name')}
                        value={selectedNbaNames}
                        onChange={setSelectedNbaNames}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
            </div>
            <DataTable data={nbaData} selectedNames={selectedNbaNames} compositeRanks={compositeRanks} />
            <h2>MLB Statistics Ranks</h2>
            <div className="scoreboard-filters center-filters">
                <div className="scoreboard-filter">
                    <label>Filter by Name</label>
                    <Select
                        isMulti
                        options={getUniqueOptions(mlbData, 'Name')}
                        value={selectedMlbNames}
                        onChange={setSelectedMlbNames}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{ Option, MultiValue }}
                    />
                </div>
            </div>
            <DataTable data={mlbData} selectedNames={selectedMlbNames} compositeRanks={compositeRanks} />
            <div className="stats-paragraph-section">
                <p>
                    The tables above provide comprehensive statistics for NFL, NBA, and MLB players. These statistics are sourced from Sports-Reference.com as of April 2024.
                </p>
            </div>
            <div className="stats-paragraph-section">
                <p>
                    <strong>1D --</strong> First downs passing<br />
                    <strong>2B --</strong> Doubles Hit/Allowed<br />
                    <strong>2P --</strong> 2-Point Field Goals Per Game<br />
                    <strong>2PA --</strong> 2-Point Field Goal Attempts Per Game<br />
                    <strong>2P% --</strong> 2-Point Field Goal Percentage<br />
                    <strong>3B --</strong> Triples Hit/Allowed<br />
                    <strong>3P --</strong> 3-Point Field Goals Per Game<br />
                    <strong>3PA --</strong> 3-Point Field Goal Attempts Per Game<br />
                    <strong>3P% --</strong> 3-Point Field Goal Percentage<br />
                    <strong>4QC --</strong> Comebacks led by quarterback.<br />
                    <strong>AB --</strong> At Bats<br />
                    <strong>ANY/A --</strong> Adjusted Net Yards per Pass Attempt<br />
                    <strong>AST --</strong> Assists Per Game<br />
                    <strong>AV --</strong> Approximate Value is our attempt to attach a single number to every player-season since 1960.<br />
                    <strong>AY/A --</strong> Adjusted Yards gained per pass attempt<br />
                    <strong>Awards --</strong> Summary of how player did in awards voting that year.<br />
                    <strong>BB --</strong> Bases on Balls/Walks<br />
                    <strong>BLK --</strong> Blocks Per Game<br />
                    <strong>Cmp% --</strong> Percentage of Passes Completed<br />
                    <strong>CS --</strong> Caught Stealing<br />
                    <strong>DRB --</strong> Defensive Rebounds Per Game<br />
                    <strong>eFG% --</strong> Effective Field Goal Percentage<br />
                    <strong>FG --</strong> Field Goals Per Game<br />
                    <strong>FGA --</strong> Field Goal Attempts Per Game<br />
                    <strong>FG% --</strong> Field Goal Percentage<br />
                    <strong>FT --</strong> Free Throws Per Game<br />
                    <strong>FTA --</strong> Free Throw Attempts Per Game<br />
                    <strong>FT% --</strong> Free Throw Percentage<br />
                    <strong>G --</strong> Games played<br />
                    <strong>GDP --</strong> Double Plays Grounded Into<br />
                    <strong>GS --</strong> Games started as an offensive or defensive player<br />
                    <strong>GWD --</strong> Game-winning drives led by quarterback.<br />
                    <strong>H --</strong> Hits/Hits Allowed<br />
                    <strong>HBP --</strong> Times Hit by a Pitch<br />
                    <strong>HR --</strong> Home Runs Hit/Allowed<br />
                    <strong>IBB --</strong> Intentional Bases on Balls<br />
                    <strong>Int --</strong> Interceptions thrown<br />
                    <strong>Int% --</strong> Percentage of Times Intercepted when Attempting to Pass<br />
                    <strong>MP --</strong> Minutes Played Per Game<br />
                    <strong>NY/A --</strong> Net Yards gained per pass attempt<br />
                    <strong>OBP --</strong> (H + BB + HBP)/(At Bats + BB + HBP + SF)<br />
                    <strong>OPS --</strong> On-Base + Slugging Percentages<br />
                    <strong>OPS+ --</strong> OPS+<br />
                    <strong>ORB --</strong> Offensive Rebounds Per Game<br />
                    <strong>PA --</strong> Plate Appearances<br />
                    <strong>PF --</strong> Personal Fouls Per Game<br />
                    <strong>PTS --</strong> Points Per Game<br />
                    <strong>QBR --</strong> NFL Quarterback Rating<br />
                    <strong>QBrec --</strong> Team record in games started by this QB (regular season)<br />
                    <strong>R --</strong> Runs Scored/Allowed<br />
                    <strong>RBI --</strong> Runs Batted In<br />
                    <strong>SB --</strong> Stolen Bases<br />
                    <strong>SF --</strong> Sacrifice Flies<br />
                    <strong>SH --</strong> Sacrifice Hits (Sacrifice Bunts)<br />
                    <strong>Sk% --</strong> Percentage of Time Sacked when Attempting to Pass: Times Sacked / (Passes Attempted + Times Sacked)<br />
                    <strong>SLG --</strong> Total Bases/At Bats<br />
                    <strong>SO --</strong> Strikeouts<br />
                    <strong>STL --</strong> Steals Per Game<br />
                    <strong>Succ% --</strong> Passing Success Rate<br />
                    <strong>TB --</strong> Total Bases<br />
                    <strong>TOV --</strong> Turnovers Per Game<br />
                    <strong>TRB --</strong> Total Rebounds Per Game<br />
                    <strong>TD% --</strong> Percentage of Touchdowns Thrown when Attempting to Pass<br />
                    <strong>Y/A --</strong> Yards gained per pass attempt<br />
                    <strong>Y/C --</strong> Yards gained per pass completion (Passing Yards) / (Passes Completed)<br />
                    <strong>Y/G --</strong> Yards gained per game played
                </p>
            </div>
        </div>
    );
};

export default Page_Stats;
