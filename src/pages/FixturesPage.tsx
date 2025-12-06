// src/pages/FixturesPage.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import FixtureCard from '../components/FixtureCard';
import { fetchFixturesByLeagueId } from '../api/fixtureService';
import { fetchLeagues } from '../api/leagueService';
import { Fixture } from '../types/Fixture';
import { League } from '../types/League';
import './FixturesPage.css'; // This will contain the page-level styling

const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 7 }, (_, i) => 2020 + i);

const FixturesPage: React.FC = () => {
  const [allLeagueFixtures, setAllLeagueFixtures] = useState<Fixture[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState<boolean>(true);
  const [loadingLeagues, setLoadingLeagues] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Effect to fetch leagues on component mount
  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const fetchedLeagues = await fetchLeagues();
        setLeagues(fetchedLeagues);
        if (fetchedLeagues.length > 0) {
          // Set a preferred default league (e.g., "Six Nations") or fallback
          const defaultLeague = fetchedLeagues.find(l => l.name === "Six Nations") || fetchedLeagues[0];
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

  // Function to fetch ALL fixtures for the selected league
  const fetchAllFixturesForSelectedLeague = useCallback(async () => {
    if (selectedLeagueId === null) {
      setAllLeagueFixtures([]);
      return;
    }

    setLoadingFixtures(true);
    setError(null);

    try {
      const data = await fetchFixturesByLeagueId(selectedLeagueId);
      setAllLeagueFixtures(data);
    } catch (err: any) {
      console.error(`Error fetching fixtures for league ID ${selectedLeagueId}:`, err);
      setError(err.message || 'An unknown error occurred while fetching fixtures.');
    } finally {
      setLoadingFixtures(false);
    }
  }, [selectedLeagueId]);

  // Effect to trigger fetching all fixtures for the selected league
  useEffect(() => {
    fetchAllFixturesForSelectedLeague();
  }, [fetchAllFixturesForSelectedLeague]);


  // Memoized filtered fixtures based on selectedYear AND search term
  const filteredFixtures = useMemo(() => {
    let currentFixtures = allLeagueFixtures.filter(fixture => {
      const fixtureYear = new Date(fixture.datePlayed).getFullYear();
      return fixtureYear === selectedYear;
    });

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFixtures = currentFixtures.filter(fixture => {
        // Lookup league name for filtering
        const league = leagues.find(l => l.id === fixture.leagueId);
        const fixtureLeagueName = league ? league.name : ''; // Fallback to empty string if not found

        return (
          fixture.home.toLowerCase().includes(lowerCaseSearchTerm) ||
          fixture.away.toLowerCase().includes(lowerCaseSearchTerm) ||
          fixtureLeagueName.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
    }
    return currentFixtures;
  }, [allLeagueFixtures, selectedYear, searchTerm, leagues]);

  // Helper function to determine if a fixture is upcoming
  const isUpcoming = (fixture: Fixture): boolean => {
    const fixtureDate = new Date(fixture.datePlayed);
    const today = new Date();
    fixtureDate.setHours(0, 0, 0, 0); // Normalize to start of day
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    return fixtureDate >= today;
  };

  const upcomingFixtures = useMemo(() => filteredFixtures.filter(isUpcoming), [filteredFixtures]);
  const recentFixtures = useMemo(() => filteredFixtures
    .filter(fixture => !isUpcoming(fixture))
    .sort((a,b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime()), // Sort recent by most recent first
    [filteredFixtures]
  );

  const selectedLeagueName = leagues.find(
    (league) => league.id === selectedLeagueId
  )?.name || 'All'; // Display 'All' if no specific league is selected via chip

  const isLoading = loadingLeagues || loadingFixtures;

  return (
    <div className="fixtures-page-container">

      <h1>Rugby Wiki</h1>
      <h1 className="page-title">Fixtures & Results</h1>

      {/* Search Bar */}
      <div className="search-bar-container">
        <label className="search-input-label">
          <div className="search-input-wrapper">
            <input
              className="search-input"
              placeholder="Search for a team or league"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Filter Chips (Leagues and Year) */}
      {loadingLeagues ? (
        <div className="loading-message">Loading leagues...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <div className="filter-chips-container">
          {/* Year Dropdown (new style) */}
          <div className="filter-chip year-dropdown-chip">
            <select
              className="year-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* "All" chip (Optional, if your API supports fetching all leagues' fixtures without a specific ID) */}
          <div
            className={`filter-chip ${selectedLeagueId === null ? 'active' : ''}`}
            onClick={() => setSelectedLeagueId(null)}
          >
            <p className="filter-chip-text">All</p>
          </div>
          {/* Other league chips */}
          {leagues.map((league) => (
            <div
              key={league.id}
              className={`filter-chip ${selectedLeagueId === league.id ? 'active' : ''}`}
              onClick={() => setSelectedLeagueId(league.id)}
            >
              <p className="filter-chip-text">{league.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Fixture List Section */}
      <div className="fixture-list-section">
        {isLoading ? (
          <div className="loading-message">Loading fixtures...</div>
        ) : error ? (
          <div className="error-message">Error: {error}</div>
        ) : (
          <>
            <h2>Upcoming Matches</h2>
            {upcomingFixtures.length > 0 ? (
              <div className="fixture-list">
                {upcomingFixtures.map(fixture => (
                  <FixtureCard
                    key={fixture.id}
                    homeTeam={fixture.home}
                    awayTeam={fixture.away}
                    dateTime={fixture.datePlayed}
                    homeScore={fixture.homeScore ? parseInt(fixture.homeScore, 10) : undefined}
                    awayScore={fixture.awayScore ? parseInt(fixture.awayScore, 10) : undefined}
                  />
                ))}
              </div>
            ) : (
              <p className="no-items-message">No upcoming matches for {selectedLeagueName} in {selectedYear}.</p>
            )}

            <h2>Recent Results</h2>
            {recentFixtures.length > 0 ? (
              <div className="fixture-list">
                {recentFixtures.map(fixture => (
                  <FixtureCard
                    key={fixture.id}
                    homeTeam={fixture.home}
                    awayTeam={fixture.away}
                    homeScore={fixture.homeScore ? parseInt(fixture.homeScore, 10) : undefined}
                    awayScore={fixture.awayScore ? parseInt(fixture.awayScore, 10) : undefined}
                    dateTime={fixture.datePlayed}
                  />
                ))}
              </div>
            ) : (
              <p className="no-items-message">No recent results for {selectedLeagueName} in {selectedYear}.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FixturesPage;
