import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled components
const PageWrapper = styled.div`
  padding-top: 100px; /* Adjust padding to shift content below the navigation bar */
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: peru;
`;

const Dropdown = styled.select`
  padding: 10px;
  font-size: 16px;
  margin-top: 20px;
  border: 2px solid peru;
  border-radius: 5px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const ResetImage = styled.img`
  width: 30px;
  height: 30px;
  margin-top: 20px;
  cursor: pointer;

  &:hover::after {
    content: 'Reset Filters';
    display: block;
    position: absolute;
    background: #fff;
    border: 1px solid #000;
    padding: 5px;
    font-size: 12px;
    white-space: nowrap;
    transform: translate(-50%, -150%);
    color: peru;
  }
`;

const ResponseContainer = styled.div`
  margin-top: 40px;
  padding: 20px;
  border: 2px solid peru;
  border-radius: 10px;
  background-color: #fff;
  white-space: pre-wrap;
  text-align: left;
  height: 400px; /* Fixed height */
  overflow-y: scroll; /* Scroll function */
`;

const TableTitle = styled.h2`
  color: peru;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  border: 1px solid peru;
  padding: 8px;
  background-color: peru;
  color: white;
`;

const Td = styled.td`
  border: 1px solid peru;
  padding: 8px;
`;

const Hyperlink = styled.a`
  color: peru;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const PagePlayers = () => {
    const [selectedSport, setSelectedSport] = useState('');
    const [recordedValue, setRecordedValue] = useState('');
    const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
    const [seasonOptions, setSeasonOptions] = useState([]);
    const [apiResponse, setApiResponse] = useState([]);
    const [nbaResponse, setNbaResponse] = useState([]);
    const [ncaaResponse, setNcaaResponse] = useState([]);
    const [mlbResponse, setMlbResponse] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);
    const [playerStatistics, setPlayerStatistics] = useState([]);
    const [aggregatedPlayerResults, setAggregatedPlayerResults] = useState([]);
    const [playerDetails, setPlayerDetails] = useState([]);
    const [mlbPlayerResponse, setMlbPlayerResponse] = useState([]);

    const handleSportChange = (e) => {
        const sport = e.target.value;
        setSelectedSport(sport);
        if (sport === 'nfl') {
            setRecordedValue('1');
            setSeasonOptions([
                '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016',
                '2015', '2014', '2013', '2012', '2011', '2010'
            ]);
            setShowSeasonDropdown(true);
        } else if (sport === 'ncaa') {
            setRecordedValue('2');
            setSeasonOptions(['2023', '2022', '2021']);
            setShowSeasonDropdown(true);
        } else if (sport === 'nba' || sport === 'mlb') {
            setRecordedValue('');
            setSeasonOptions([
                '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016',
                '2015'
            ]);
            setShowSeasonDropdown(true);
        } else {
            setShowSeasonDropdown(false);
        }
    };

    const handleSeasonChange = async (e) => {
        const selectedSeasons = Array.from(e.target.selectedOptions, option => option.value);
        const aggregatedResults = [];
        const nbaAggregatedResults = [];
        const ncaaAggregatedResults = [];
        const mlbAggregatedResults = [];

        if (selectedSport === 'nfl') {
            for (const season of selectedSeasons) {
                try {
                    const options = {
                        method: 'GET',
                        url: 'https://api-american-football.p.rapidapi.com/teams',
                        params: {
                            league: recordedValue,
                            season: season
                        },
                        headers: {
                            'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                            'x-rapidapi-host': 'api-american-football.p.rapidapi.com'
                        }
                    };
                    const response = await axios.request(options);
                    const formattedData = response.data.response.map(team => ({
                        season,
                        id: team.id,
                        name: team.name,
                        code: team.code || 'N/A',
                        city: team.city || 'N/A',
                        coach: team.coach || 'N/A',
                        owner: team.owner || 'N/A',
                        stadium: team.stadium || 'N/A',
                        established: team.established || 'N/A',
                        logo: team.logo,
                        countryName: team.country.name,
                        countryCode: team.country.code,
                        countryFlag: team.country.flag
                    }));
                    aggregatedResults.push(...formattedData);
                } catch (error) {
                    console.error(`Error fetching data for season ${season}`, error);
                    aggregatedResults.push({
                        season,
                        error: 'Error fetching data'
                    });
                }
            }
            setApiResponse(aggregatedResults);
        } else if (selectedSport === 'nba') {
            for (const season of selectedSeasons) {
                try {
                    const options = {
                        method: 'GET',
                        url: 'https://api-nba-v1.p.rapidapi.com/teams',
                        headers: {
                            'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
                        }
                    };
                    const response = await axios.request(options);
                    const formattedData = response.data.response.map(team => ({
                        season,
                        id: team.id,
                        name: team.name,
                        nickname: team.nickname,
                        code: team.code || 'N/A',
                        city: team.city || 'N/A',
                        logo: team.logo,
                        allStar: team.allStar ? 'Yes' : 'No',
                        nbaFranchise: team.nbaFranchise ? 'Yes' : 'No',
                        leagues: team.leagues
                    }));
                    nbaAggregatedResults.push(...formattedData);
                } catch (error) {
                    console.error(`Error fetching NBA data for season ${season}`, error);
                    nbaAggregatedResults.push({
                        season,
                        error: 'Error fetching data'
                    });
                }
            }
            setNbaResponse(nbaAggregatedResults);
        } else if (selectedSport === 'ncaa') {
            for (const season of selectedSeasons) {
                try {
                    const options = {
                        method: 'GET',
                        url: 'https://api-american-football.p.rapidapi.com/teams',
                        params: {
                            league: '2',
                            season: season
                        },
                        headers: {
                            'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                            'x-rapidapi-host': 'api-american-football.p.rapidapi.com'
                        }
                    };
                    const response = await axios.request(options);
                    const formattedData = response.data.response.map(team => ({
                        season,
                        id: team.id,
                        name: team.name,
                        logo: team.logo
                    }));
                    ncaaAggregatedResults.push(...formattedData);
                } catch (error) {
                    console.error(`Error fetching data for season ${season}`, error);
                    ncaaAggregatedResults.push({
                        season,
                        error: 'Error fetching data'
                    });
                }
            }
            setNcaaResponse(ncaaAggregatedResults);
        } else if (selectedSport === 'mlb') {
            for (const season of selectedSeasons) {
                try {
                    const options = {
                        method: 'GET',
                        url: 'https://api-baseball.p.rapidapi.com/teams',
                        params: {
                            league: '1',
                            season: season
                        },
                        headers: {
                            'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                            'x-rapidapi-host': 'api-baseball.p.rapidapi.com'
                        }
                    };
                    const response = await axios.request(options);
                    const formattedData = response.data.response.map(team => ({
                        season,
                        id: team.id,
                        name: team.name,
                        logo: team.logo
                    }));
                    mlbAggregatedResults.push(...formattedData);
                } catch (error) {
                    console.error(`Error fetching MLB data for season ${season}`, error);
                    mlbAggregatedResults.push({
                        season,
                        error: 'Error fetching data'
                    });
                }
            }
            setMlbResponse(mlbAggregatedResults);
        }
    };

    const fetchPlayerStats = async (teamId, selectedSeasons) => {
        const aggregatedPlayerResults = [];
        for (const season of selectedSeasons) {
            try {
                const options = {
                    method: 'GET',
                    url: 'https://api-nba-v1.p.rapidapi.com/players',
                    params: {
                        team: teamId,
                        season: season
                    },
                    headers: {
                        'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
                    }
                };
                const response = await axios.request(options);
                const formattedData = response.data.response.map(player => ({
                    season,
                    id: player.id,
                    firstname: player.firstname,
                    lastname: player.lastname,
                    birthDate: player.birth.date,
                    birthCountry: player.birth.country,
                    nbaStart: player.nba.start,
                    nbaPro: player.nba.pro,
                    heightFeets: player.height.feets,
                    heightInches: player.height.inches,
                    heightMeters: player.height.meters,
                    weightPounds: player.weight.pounds,
                    weightKilograms: player.weight.kilograms,
                    college: player.college,
                    affiliation: player.affiliation,
                    jersey: player.leagues.standard.jersey,
                    active: player.leagues.standard.active,
                    pos: player.leagues.standard.pos
                }));
                aggregatedPlayerResults.push(...formattedData);
            } catch (error) {
                console.error(`Error fetching player stats for team ${teamId} and season ${season}`, error);
                aggregatedPlayerResults.push({
                    teamId,
                    season,
                    error: 'Error fetching player stats'
                });
            }
        }
        setAggregatedPlayerResults(aggregatedPlayerResults);
    };

    const fetchPlayerDetails = async (playerId, selectedSeasons) => {
        const aggregatedDetailsResults = [];
        for (const season of selectedSeasons) {
            try {
                const options = {
                    method: 'GET',
                    url: 'https://api-nba-v1.p.rapidapi.com/players/statistics',
                    params: {
                        id: playerId,
                        season: season
                    },
                    headers: {
                        'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
                    }
                };
                const response = await axios.request(options);
                const formattedData = response.data.response.map(stat => ({
                    playerId: stat.player.id,
                    firstname: stat.player.firstname,
                    lastname: stat.player.lastname,
                    teamId: stat.team.id,
                    teamName: stat.team.name,
                    teamNickname: stat.team.nickname,
                    teamCode: stat.team.code,
                    teamLogo: stat.team.logo,
                    gameId: stat.game.id,
                    points: stat.points,
                    pos: stat.pos,
                    min: stat.min,
                    fgm: stat.fgm,
                    fga: stat.fga,
                    fgp: stat.fgp,
                    ftm: stat.ftm,
                    fta: stat.fta,
                    ftp: stat.ftp,
                    tpm: stat.tpm,
                    tpa: stat.tpa,
                    tpp: stat.tpp,
                    offReb: stat.offReb,
                    defReb: stat.defReb,
                    totReb: stat.totReb,
                    assists: stat.assists,
                    pFouls: stat.pFouls,
                    steals: stat.steals,
                    turnovers: stat.turnovers,
                    blocks: stat.blocks,
                    plusMinus: stat.plusMinus,
                    comment: stat.comment,
                    season: stat.season
                }));
                aggregatedDetailsResults.push(...formattedData);
            } catch (error) {
                console.error(`Error fetching details for player ${playerId} and season ${season}`, error);
                aggregatedDetailsResults.push({
                    playerId,
                    season,
                    error: 'Error fetching player details'
                });
            }
        }
        setPlayerDetails(aggregatedDetailsResults);
    };

    const fetchMlbPlayerStats = async (teamId, selectedSeasons) => {
        const aggregatedPlayerResults = [];
        for (const season of selectedSeasons) {
            try {
                const options = {
                    method: 'GET',
                    url: `https://major-league-baseball-mlb.p.rapidapi.com/team-players/${teamId}`,
                    headers: {
                        'x-rapidapi-key': '84da300ec1msh25545272e4c12a2p1a1421jsnc5fa6b6e4767',
                        'x-rapidapi-host': 'major-league-baseball-mlb.p.rapidapi.com'
                    }
                };
                const response = await axios.request(options);
                const formattedData = (response.data.athletes || []).map(player => ({
                    id: player.id,
                    firstName: player.firstName,
                    lastName: player.lastName,
                    fullName: player.fullName,
                    displayName: player.displayName,
                    shortName: player.shortName,
                    weight: player.weight,
                    displayWeight: player.displayWeight,
                    height: player.height,
                    displayHeight: player.displayHeight,
                    age: player.age,
                    dateOfBirth: player.dateOfBirth,
                    debutYear: player.debutYear,
                    jersey: player.jersey,
                    position: player.position?.displayName || 'N/A',
                    birthPlace: player.birthPlace ? `${player.birthPlace.city}, ${player.birthPlace.country}` : 'N/A',
                    headshot: player.headshot?.href || 'N/A',
                    links: player.links ? player.links.map(link => ({
                        text: link.text,
                        href: link.href
                    })) : []
                }));
                aggregatedPlayerResults.push(...formattedData);
            } catch (error) {
                console.error(`Error fetching player stats for team ${teamId} and season ${season}`, error);
                aggregatedPlayerResults.push({
                    teamId,
                    season,
                    error: 'Error fetching player stats'
                });
            }
        }
        setMlbPlayerResponse(aggregatedPlayerResults);
    };

    const handlePlayerDetailsClick = (playerId) => {
        fetchPlayerDetails(playerId, seasonOptions);
    };

    const handleTeamClick = (teamId) => {
        fetchPlayerStats(teamId, seasonOptions);
    };

    const handleMlbTeamClick = (teamId) => {
        fetchMlbPlayerStats(teamId, seasonOptions);
    };

    const resetFilters = () => {
        setSelectedSport('');
        setRecordedValue('');
        setShowSeasonDropdown(false);
        setSeasonOptions([]);
        setApiResponse([]);
        setNbaResponse([]);
        setNcaaResponse([]);
        setMlbResponse([]);
        setPlayerStats([]);
        setPlayerStatistics([]);
        setAggregatedPlayerResults([]);
        setPlayerDetails([]);
        setMlbPlayerResponse([]);
    };

    const renderSeason = (season) => (
        <div>
            {season && (
                <>
                    <p><strong>Year:</strong> {season.year}</p>
                    <p><strong>Display Name:</strong> {season.displayName}</p>
                    <p><strong>Type:</strong> {season.type}</p>
                    <p><strong>Name:</strong> {season.name}</p>
                </>
            )}
        </div>
    );

    const renderAthletes = (athletes) => (
        <div>
            {athletes && athletes.map((group, index) => (
                <div key={index}>
                    <h4>{group.position}</h4>
                    <ul>
                        {group.items.length > 0 ? (
                            group.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item}</li>
                            ))
                        ) : (
                            <li>No players available</li>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );

    const renderCoach = (coach) => (
        <div>
            {coach && coach.map((c, index) => (
                <div key={index}>
                    <p><strong>ID:</strong> {c.id}</p>
                    <p><strong>First Name:</strong> {c.firstName}</p>
                    <p><strong>Last Name:</strong> {c.lastName}</p>
                    <p><strong>Experience:</strong> {c.experience}</p>
                </div>
            ))}
        </div>
    );

    const renderTeam = (team) => (
        <div>
            {team && (
                <>
                    <p><strong>ID:</strong> {team.id}</p>
                    <p><strong>Abbreviation:</strong> {team.abbreviation}</p>
                    <p><strong>Location:</strong> {team.location}</p>
                    <p><strong>Name:</strong> {team.name}</p>
                    <p><strong>Display Name:</strong> {team.displayName}</p>
                    <p><strong>Clubhouse:</strong> <a href={team.clubhouse} target="_blank" rel="noopener noreferrer">{team.clubhouse}</a></p>
                    <p><strong>Color:</strong> {team.color}</p>
                    <p><strong>Logo:</strong> <img src={team.logo} alt={`${team.displayName} logo`} width="50" /></p>
                    <p><strong>Record Summary:</strong> {team.recordSummary}</p>
                    <p><strong>Season Summary:</strong> {team.seasonSummary}</p>
                    <p><strong>Standing Summary:</strong> {team.standingSummary}</p>
                </>
            )}
        </div>
    );

    return (
        <PageWrapper>
            <Title>Player Sports Statistics</Title>
            <DropdownContainer>
                <Dropdown value={selectedSport} onChange={handleSportChange}>
                    <option value="">Select Sport</option>
                    <option value="nfl">NFL Football</option>
                    <option value="ncaa">NCAA Football</option>
                    <option value="nba">NBA Basketball</option>
                    <option value="mlb">MLB Baseball</option>
                </Dropdown>
                {showSeasonDropdown && (
                    <Dropdown multiple style={{ marginTop: '20px', height: 'auto' }} onChange={handleSeasonChange}>
                        <option value="">Select Seasons</option>
                        {seasonOptions.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Dropdown>
                )}
                <ResetImage
                    src="https://websiteapp-storage-fdb68492737c0-dev.s3.us-east-2.amazonaws.com/reset.svg"
                    alt="Reset Filters"
                    title="Reset Filters"
                    onClick={resetFilters}
                />
            </DropdownContainer>
            {apiResponse.length > 0 && (
                <ResponseContainer>
                    <TableTitle>NFL Teams</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Season</Th>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Code</Th>
                                <Th>City</Th>
                                <Th>Coach</Th>
                                <Th>Owner</Th>
                                <Th>Stadium</Th>
                                <Th>Established</Th>
                                <Th>Logo</Th>
                                <Th>Country Name</Th>
                                <Th>Country Code</Th>
                                <Th>Country Flag</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiResponse
                                .filter(team => !team.name.includes('NFC') && !team.name.includes('AFC'))
                                .map((team, index) => (
                                    <tr key={index}>
                                        <Td>{team.season}</Td>
                                        <Td><Hyperlink onClick={() => handleTeamClick(team.id)}>{team.id}</Hyperlink></Td>
                                        <Td>{team.name}</Td>
                                        <Td>{team.code}</Td>
                                        <Td>{team.city}</Td>
                                        <Td>{team.coach}</Td>
                                        <Td>{team.owner}</Td>
                                        <Td>{team.stadium}</Td>
                                        <Td>{team.established}</Td>
                                        <Td><img src={team.logo} alt={`${team.name} logo`} width="50" /></Td>
                                        <Td>{team.countryName}</Td>
                                        <Td>{team.countryCode}</Td>
                                        <Td><img src={team.countryFlag} alt={`${team.countryName} flag`} width="50" /></Td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {nbaResponse.length > 0 && (
                <ResponseContainer>
                    <TableTitle>NBA Teams</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Season</Th>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Nickname</Th>
                                <Th>Code</Th>
                                <Th>City</Th>
                                <Th>Logo</Th>
                                <Th>All-Star</Th>
                                <Th>NBA Franchise</Th>
                                <Th>Standard Conference</Th>
                                <Th>Standard Division</Th>
                                <Th>Vegas Conference</Th>
                                <Th>Vegas Division</Th>
                                <Th>Utah Conference</Th>
                                <Th>Utah Division</Th>
                                <Th>Sacramento Conference</Th>
                                <Th>Sacramento Division</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {nbaResponse
                                .filter(team => team.leagues?.vegas?.conference && team.nbaFranchise)
                                .map((team, index) => (
                                    <tr key={index}>
                                        <Td>{team.season}</Td>
                                        <Td><Hyperlink onClick={() => handleTeamClick(team.id)}>{team.id}</Hyperlink></Td>
                                        <Td>{team.name}</Td>
                                        <Td>{team.nickname}</Td>
                                        <Td>{team.code}</Td>
                                        <Td>{team.city}</Td>
                                        <Td><img src={team.logo} alt={`${team.name} logo`} width="50" /></Td>
                                        <Td>{team.allStar ? 'Yes' : 'No'}</Td>
                                        <Td>{team.nbaFranchise ? 'Yes' : 'No'}</Td>
                                        <Td>{team.leagues?.standard?.conference || 'N/A'}</Td>
                                        <Td>{team.leagues?.standard?.division || 'N/A'}</Td>
                                        <Td>{team.leagues?.vegas?.conference || 'N/A'}</Td>
                                        <Td>{team.leagues?.vegas?.division || 'N/A'}</Td>
                                        <Td>{team.leagues?.utah?.conference || 'N/A'}</Td>
                                        <Td>{team.leagues?.utah?.division || 'N/A'}</Td>
                                        <Td>{team.leagues?.sacramento?.conference || 'N/A'}</Td>
                                        <Td>{team.leagues?.sacramento?.division || 'N/A'}</Td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {ncaaResponse.length > 0 && (
                <ResponseContainer>
                    <TableTitle>NCAA Football Teams</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Season</Th>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Logo</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {ncaaResponse.map((team, index) => (
                                <tr key={index}>
                                    <Td>{team.season}</Td>
                                    <Td><Hyperlink href="#">{team.id}</Hyperlink></Td>
                                    <Td>{team.name}</Td>
                                    <Td><img src={team.logo} alt={`${team.name} logo`} width="50" /></Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {mlbResponse.length > 0 && (
                <ResponseContainer>
                    <TableTitle>MLB Teams</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Season</Th>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Logo</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {mlbResponse
                                .filter(team => !team.name.includes('American League') && !team.name.includes('National League') && !team.name.includes('Sugar Land'))
                                .map((team, index) => (
                                    <tr key={index}>
                                        <Td>{team.season}</Td>
                                        <Td><Hyperlink onClick={() => handleMlbTeamClick(team.id)}>{team.id}</Hyperlink></Td>
                                        <Td>{team.name}</Td>
                                        <Td><img src={team.logo} alt={`${team.name} logo`} width="50" /></Td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {playerStats.length > 0 && (
                <ResponseContainer>
                    <TableTitle>NFL Players</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Season</Th>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Age</Th>
                                <Th>Height</Th>
                                <Th>Weight</Th>
                                <Th>College</Th>
                                <Th>Group</Th>
                                <Th>Position</Th>
                                <Th>Number</Th>
                                <Th>Salary</Th>
                                <Th>Experience</Th>
                                <Th>Image</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerStats.map((player, index) => (
                                <tr key={index}>
                                    <Td>{player.season}</Td>
                                    <Td><Hyperlink onClick={() => handlePlayerDetailsClick(player.id)}>{player.id}</Hyperlink></Td>
                                    <Td>{player.name}</Td>
                                    <Td>{player.age}</Td>
                                    <Td>{player.height}</Td>
                                    <Td>{player.weight}</Td>
                                    <Td>{player.college}</Td>
                                    <Td>{player.group}</Td>
                                    <Td>{player.position}</Td>
                                    <Td>{player.number}</Td>
                                    <Td>{player.salary}</Td>
                                    <Td>{player.experience}</Td>
                                    <Td><img src={player.image} alt={`${player.name}`} width="50" /></Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {playerStatistics.length > 0 && (
                <ResponseContainer>
                    <TableTitle>NFL Statistics</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Season</Th>
                                <Th>Player ID</Th>
                                <Th>Player Name</Th>
                                <Th>Team ID</Th>
                                <Th>Team Name</Th>
                                <Th>Group Name</Th>
                                <Th>Statistic Name</Th>
                                <Th>Value</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerStatistics.map((stat, index) => (
                                stat.teams.map((team, teamIndex) => (
                                    team.groups.map((group, groupIndex) => (
                                        group.statistics.map((statistic, statIndex) => (
                                            <tr key={`${index}-${teamIndex}-${groupIndex}-${statIndex}`}>
                                                <Td>{stat.season}</Td>
                                                <Td>{stat.player.id}</Td>
                                                <Td>{stat.player.name}</Td>
                                                <Td>{team.team.id}</Td>
                                                <Td>{team.team.name}</Td>
                                                <Td>{group.name}</Td>
                                                <Td>{statistic.name}</Td>
                                                <Td>{statistic.value}</Td>
                                            </tr>
                                        ))
                                    ))
                                ))
                            ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {aggregatedPlayerResults.length > 0 && (
                <ResponseContainer>
                    <TableTitle>NBA Players</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Season</Th>
                                <Th>ID</Th>
                                <Th>Firstname</Th>
                                <Th>Lastname</Th>
                                <Th>Date of Birth</Th>
                                <Th>Country</Th>
                                <Th>NBA Start</Th>
                                <Th>NBA Pro</Th>
                                <Th>Height Feets</Th>
                                <Th>Height Inches</Th>
                                <Th>Height Meters</Th>
                                <Th>Weight Pounds</Th>
                                <Th>Weight Kilograms</Th>
                                <Th>College</Th>
                                <Th>Affiliation</Th>
                                <Th>Jersey</Th>
                                <Th>Active</Th>
                                <Th>Pos</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {aggregatedPlayerResults.map((player, index) => (
                                <tr key={index}>
                                    <Td>{player.season}</Td>
                                    <Td><Hyperlink onClick={() => handlePlayerDetailsClick(player.id)}>{player.id}</Hyperlink></Td>
                                    <Td>{player.firstname}</Td>
                                    <Td>{player.lastname}</Td>
                                    <Td>{player.birthDate}</Td>
                                    <Td>{player.birthCountry}</Td>
                                    <Td>{player.nbaStart}</Td>
                                    <Td>{player.nbaPro}</Td>
                                    <Td>{player.heightFeets}</Td>
                                    <Td>{player.heightInches}</Td>
                                    <Td>{player.heightMeters}</Td>
                                    <Td>{player.weightPounds}</Td>
                                    <Td>{player.weightKilograms}</Td>
                                    <Td>{player.college}</Td>
                                    <Td>{player.affiliation}</Td>
                                    <Td>{player.jersey}</Td>
                                    <Td>{player.active ? 'Yes' : 'No'}</Td>
                                    <Td>{player.pos}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {playerDetails.length > 0 && (
                <ResponseContainer>
                    <TableTitle>NBA Statistics</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Player ID</Th>
                                <Th>Firstname</Th>
                                <Th>Lastname</Th>
                                <Th>Team ID</Th>
                                <Th>Team Name</Th>
                                <Th>Team Nickname</Th>
                                <Th>Team Code</Th>
                                <Th>Team Logo</Th>
                                <Th>Game ID</Th>
                                <Th>Points</Th>
                                <Th>Pos</Th>
                                <Th>Min</Th>
                                <Th>FGM</Th>
                                <Th>FGA</Th>
                                <Th>FGP</Th>
                                <Th>FTM</Th>
                                <Th>FTA</Th>
                                <Th>FTP</Th>
                                <Th>TPM</Th>
                                <Th>TPA</Th>
                                <Th>TPP</Th>
                                <Th>OffReb</Th>
                                <Th>DefReb</Th>
                                <Th>TotReb</Th>
                                <Th>Assists</Th>
                                <Th>PFouls</Th>
                                <Th>Steals</Th>
                                <Th>Turnovers</Th>
                                <Th>Blocks</Th>
                                <Th>PlusMinus</Th>
                                <Th>Comment</Th>
                                <Th>Season</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerDetails.map((detail, index) => (
                                <tr key={index}>
                                    <Td>{detail.playerId}</Td>
                                    <Td>{detail.firstname}</Td>
                                    <Td>{detail.lastname}</Td>
                                    <Td>{detail.teamId}</Td>
                                    <Td>{detail.teamName}</Td>
                                    <Td>{detail.teamNickname}</Td>
                                    <Td>{detail.teamCode}</Td>
                                    <Td><img src={detail.teamLogo} alt={`${detail.teamName} logo`} width="50" /></Td>
                                    <Td>{detail.gameId}</Td>
                                    <Td>{detail.points}</Td>
                                    <Td>{detail.pos}</Td>
                                    <Td>{detail.min}</Td>
                                    <Td>{detail.fgm}</Td>
                                    <Td>{detail.fga}</Td>
                                    <Td>{detail.fgp}</Td>
                                    <Td>{detail.ftm}</Td>
                                    <Td>{detail.fta}</Td>
                                    <Td>{detail.ftp}</Td>
                                    <Td>{detail.tpm}</Td>
                                    <Td>{detail.tpa}</Td>
                                    <Td>{detail.tpp}</Td>
                                    <Td>{detail.offReb}</Td>
                                    <Td>{detail.defReb}</Td>
                                    <Td>{detail.totReb}</Td>
                                    <Td>{detail.assists}</Td>
                                    <Td>{detail.pFouls}</Td>
                                    <Td>{detail.steals}</Td>
                                    <Td>{detail.turnovers}</Td>
                                    <Td>{detail.blocks}</Td>
                                    <Td>{detail.plusMinus}</Td>
                                    <Td>{detail.comment}</Td>
                                    <Td>{detail.season}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
            {mlbPlayerResponse.length > 0 && (
                <ResponseContainer>
                    <TableTitle>MLB Players</TableTitle>
                    <Table>
                        <thead>
                            <tr>
                                <Th>ID</Th>
                                <Th>First Name</Th>
                                <Th>Last Name</Th>
                                <Th>Full Name</Th>
                                <Th>Display Name</Th>
                                <Th>Short Name</Th>
                                <Th>Weight</Th>
                                <Th>Display Weight</Th>
                                <Th>Height</Th>
                                <Th>Display Height</Th>
                                <Th>Age</Th>
                                <Th>Date of Birth</Th>
                                <Th>Debut Year</Th>
                                <Th>Jersey</Th>
                                <Th>Position</Th>
                                <Th>Birth Place</Th>
                                <Th>Headshot</Th>
                                <Th>Links</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {mlbPlayerResponse.map((player, index) => (
                                <tr key={index}>
                                    <Td>{player.id}</Td>
                                    <Td>{player.firstName}</Td>
                                    <Td>{player.lastName}</Td>
                                    <Td>{player.fullName}</Td>
                                    <Td>{player.displayName}</Td>
                                    <Td>{player.shortName}</Td>
                                    <Td>{player.weight}</Td>
                                    <Td>{player.displayWeight}</Td>
                                    <Td>{player.height}</Td>
                                    <Td>{player.displayHeight}</Td>
                                    <Td>{player.age}</Td>
                                    <Td>{player.dateOfBirth}</Td>
                                    <Td>{player.debutYear}</Td>
                                    <Td>{player.jersey}</Td>
                                    <Td>{player.position}</Td>
                                    <Td>{player.birthPlace}</Td>
                                    <Td><img src={player.headshot} alt={player.fullName} width="50" /></Td>
                                    <Td>
                                        <ul>
                                            {player.links.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <a href={link.href} target="_blank" rel="noopener noreferrer">{link.text}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ResponseContainer>
            )}
        </PageWrapper>
    );
};

export default PagePlayers;
