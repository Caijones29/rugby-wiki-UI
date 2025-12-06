import React, { useEffect, useState, useCallback } from 'react';
import { fetchTeamsByLeagueAndYear } from '../api/teamService';
import { fetchLeagues } from '../api/leagueService';
import { Team } from '../types/Team';
import { League } from '../types/League';
import TeamCard from '../components/TeamCard';
import './TeamsPage.css';

const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingTeams, setLoadingTeams] = useState<boolean>(true);
  const [loadingLeagues, setLoadingLeagues] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const fetchedLeagues = await fetchLeagues();
        setLeagues(fetchedLeagues);
        if (fetchedLeagues.length > 0) {
          setSelectedLeagueId(fetchedLeagues[0].id);
        }
      } catch (err: any) {
        console.error("Error fetching leagues:", err);
        setError(err.message || 'An unknown error occurred while fetching leagues.');
      } finally {
        setLoadingLeagues(false);
      }
    };
    getLeagues();
  }, []);

  const getTeams = useCallback(async () => {
    if (selectedLeagueId === null) {
      setTeams([]);
      return;
    }
    setLoadingTeams(true);
    setError(null);
    try {
      const data = await fetchTeamsByLeagueAndYear(selectedLeagueId, selectedYear);
      setTeams(data);
    } catch (err: any) {
      console.error(`Error fetching teams for league ID ${selectedLeagueId} and year ${selectedYear}:`, err);
      setError(err.message || 'An unknown error occurred while fetching teams.');
    } finally {
      setLoadingTeams(false);
    }
  }, [selectedLeagueId, selectedYear]);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  const selectedLeagueName = leagues.find(
    (league) => league.id === selectedLeagueId
  )?.name || 'Select a League';

  const isLoading = loadingLeagues || loadingTeams;

  const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLeagueId(Number(event.target.value));
  };

  return (
    <div className="teams-page-container">
      <h1>{selectedLeagueName} Teams - {selectedYear}</h1>

      {loadingLeagues && <div className="loading-message">Loading leagues...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loadingLeagues && leagues.length > 0 && (
        <div className="selector-group league-selector">
          <h3 className="selector-title">Select League:</h3>
          <select
            className="league-dropdown"
            value={selectedLeagueId || ''} // Use empty string if null, so it doesn't try to select an option with value 0
            onChange={handleLeagueChange}
            disabled={loadingLeagues}
          >
            <option value="" disabled>-- Choose a League --</option> {/* Placeholder option */}
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="selector-group year-selector">
        <h3 className="selector-title">Select Year:</h3>
        <div className="button-list">
          {availableYears.map((year) => (
            <button
              key={year}
              className={`selector-button ${year === selectedYear ? 'active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading teams...</div>
      ) : (
        <div className="team-list">
          {teams.length > 0 ? (
            teams.map((team) => (
              <TeamCard key={team.name} name={team.name} league={team.leagueName} />
            ))
          ) : (
            <p className="no-items-message">No teams found for {selectedLeagueName} in {selectedYear}.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
