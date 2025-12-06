
import React, { useEffect, useState, useCallback } from 'react';
import { fetchTeamsByLeagueAndYear } from '../api/teamService';
import { Team } from '../types/Team';
import TeamCard from '../components/TeamCard';
import './TeamsPage.css';

const availableLeagues = [
  { id: 1, name: 'United Rugby Championship' },
  { id: 4, name: 'Gallagher Premiership' },
  { id: 5, name: 'WRU Championship' },
];

const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showYearSelector, setShowYearSelector] = useState<boolean>(false);

  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(availableLeagues[0].id);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const getTeams = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
    
      const data = await fetchTeamsByLeagueAndYear(selectedLeagueId, selectedYear);
      setTeams(data);
    } catch (err: any) {
      console.error("Error fetching teams:", err);
      setError(err.message || 'An unknown error occurred while fetching teams.');
    } finally {
      setLoading(false);
    }
  }, [selectedLeagueId, selectedYear]);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  const selectedLeagueName = availableLeagues.find(
    (league) => league.id === selectedLeagueId
  )?.name || 'Unknown League';

  return (
    <div className="teams-page-container">
      <h1>{selectedLeagueName} Teams - {selectedYear}</h1>

      <div className="selector-group league-selector">
        <h3 className="selector-title">Select League:</h3>
        <div className="button-list">
          {availableLeagues.map((league) => (
            <button
              key={league.id}
              className={`selector-button ${league.id === selectedLeagueId ? 'active' : ''}`}
              onClick={() => setSelectedLeagueId(league.id)}
            >
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {showYearSelector && (
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
      )}

      {loading && <div className="loading-message">Loading teams...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && (
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
