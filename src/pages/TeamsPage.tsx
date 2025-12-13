// src/pages/TeamsPage.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {fetchTeams, fetchTeamsByLeagueAndYear} from '../api/teamService';
import { fetchLeagues } from '../api/leagueService';
import { Team } from '../types/Team';
import { League } from '../types/League';
import TeamCard from '../components/TeamCard';
import './TeamsPage.css';
import {wait} from "@testing-library/user-event/dist/utils";
import LeagueFilter from "../components/LeagueFilter";

const currentYear = new Date().getFullYear();

const TeamsPage: React.FC = () => {
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingTeams, setLoadingTeams] = useState<boolean>(true);
  const [loadingLeagues, setLoadingLeagues] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  // REMOVED: const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch leagues on component mount
  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const fetchedLeagues = await fetchLeagues();
        setLeagues(fetchedLeagues);
        if (fetchedLeagues.length > 0) {
          const defaultLeague = fetchedLeagues.find(l => l.name === "Internationals") ||
                                fetchedLeagues.find(l => l.name === "United Rugby Championship") ||
                                fetchedLeagues[0];
          setSelectedLeagueId(defaultLeague.id);
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
    setLoadingTeams(true);
    setError(null);

    try {
      if (selectedLeagueId === null) {
        const data = await fetchTeams();
        setAllTeams(data);
      } else {
        const data = await fetchTeamsByLeagueAndYear(
            selectedLeagueId,
            currentYear
        );
        setAllTeams(data);
      }
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message || 'An unknown error occurred while fetching teams.');
    } finally {
      setLoadingTeams(false);
    }
  }, [selectedLeagueId]);


  // Trigger team fetch when selectedLeagueId changes
  useEffect(() => {
    getTeams();
  }, [getTeams]);

  // Filter teams by search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm) {
      return allTeams;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return allTeams.filter(team =>
      team.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      team.leagueName.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allTeams, searchTerm]);


  const selectedLeagueName = leagues.find(
    (league) => league.id === selectedLeagueId
  )?.name || 'All';

  const isLoading = loadingLeagues || loadingTeams;

  return (
    <div className="teams-page-container">
      {/* Search Bar */}
      <div className="search-bar-container">
        <label className="search-input-label">
          <div className="search-input-wrapper">
            <input
              className="search-input"
              placeholder="Search for a team"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Filter Chips (Leagues) */}
      <LeagueFilter
          leagues={leagues}
          selectedLeagueId={selectedLeagueId}
          loading={loadingLeagues}
          error={error}
          onSelectLeague={setSelectedLeagueId}
      />

      {/* Team List Section */}
      <div className="team-list-section">
        {isLoading ? (
          <div className="loading-message">Loading teams...</div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : filteredTeams.length > 0 ? (
          <div className="team-list">
            {filteredTeams.map((team) => (
              <TeamCard key={team.name} name={team.name} league={team.leagueName} />
            ))}
          </div>
        ) : (
          <p className="no-items-message">No teams found for the current selection.</p>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
