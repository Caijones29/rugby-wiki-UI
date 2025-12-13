// src/pages/TeamsPage.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchTeams, fetchTeamsByLeagueAndYear } from '../api/teamService';
import { fetchLeagues } from '../api/leagueService';
import { Team } from '../types/Team';
import { League } from '../types/League';
import TeamCard from '../components/TeamCard';
import TeamCardSkeleton from '../components/skeletons/TeamCardSkeleton';
import LeagueFilter from '../components/LeagueFilter';
import './TeamsPage.css';

const currentYear = new Date().getFullYear();

const TeamsPage: React.FC = () => {
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingTeams, setLoadingTeams] = useState<boolean>(true);
  const [loadingLeagues, setLoadingLeagues] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch leagues on mount
  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const fetchedLeagues = await fetchLeagues();
        setLeagues(fetchedLeagues);

        if (fetchedLeagues.length > 0) {
          const defaultLeague =
              fetchedLeagues.find(l => l.name === 'Internationals') ||
              fetchedLeagues.find(l => l.name === 'United Rugby Championship') ||
              fetchedLeagues[0];

          setSelectedLeagueId(defaultLeague.id);
        }
      } catch (err: any) {
        console.error('Error fetching leagues:', err);
        setError(err.message || 'An unknown error occurred while fetching leagues.');
      } finally {
        setLoadingLeagues(false);
      }
    };

    getLeagues();
  }, []);

  // Fetch teams whenever selectedLeagueId changes
  const getTeams = useCallback(async () => {
    if (selectedLeagueId === null) return;

    setLoadingTeams(true);
    setAllTeams([]); // Clear previous teams immediately
    setError(null);

    try {
      let data: Team[] = [];
      if (selectedLeagueId === 0 || selectedLeagueId === null) {
        // "All" teams
        data = await fetchTeams();
      } else {
        data = await fetchTeamsByLeagueAndYear(selectedLeagueId, currentYear);
      }

      setAllTeams(data);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message || 'An unknown error occurred while fetching teams.');
      setAllTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  }, [selectedLeagueId]);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  // Filter teams by search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm) return allTeams;
    const lowerSearch = searchTerm.toLowerCase();
    return allTeams.filter(
        t => t.name.toLowerCase().includes(lowerSearch) || t.leagueName.toLowerCase().includes(lowerSearch)
    );
  }, [allTeams, searchTerm]);

  // Determine if skeletons should show
  const showSkeleton = loadingLeagues || loadingTeams || allTeams.length === 0;

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
                  onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* League Filter */}
        <LeagueFilter
            leagues={leagues}
            selectedLeagueId={selectedLeagueId}
            loading={loadingLeagues}
            error={error}
            onSelectLeague={setSelectedLeagueId}
        />

        {/* Team List Section */}
        <div className="team-list-section">
          {showSkeleton ? (
              <div className="team-list">
                {Array.from({ length: 5 }).map((_, i) => (
                    <TeamCardSkeleton key={i} />
                ))}
              </div>
          ) : error ? (
              <div className="error-message">Error: {error}</div>
          ) : filteredTeams.length > 0 ? (
              <div className="team-list">
                {filteredTeams.map(team => (
                    <TeamCard
                        key={`${team.leagueId}-${team.name}`} // <- Unique key per league + team
                        name={team.name}
                        league={team.leagueName}
                    />
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
