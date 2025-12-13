import React, { useEffect, useState, useCallback, useMemo } from 'react';
import FixtureCard from '../components/FixtureCard';
import { fetchFixturesByLeagueAndDateRange, fetchFixturesByDateRange } from '../api/fixtureService';
import { fetchLeagues } from '../api/leagueService';
import { Fixture } from '../types/Fixture';
import { League } from '../types/League';
import './FixturesPage.css';
import LeagueFilter from "../components/LeagueFilter";
import FixtureCardSkeleton from '../components/skeletons/FixtureCardSkeleton';

const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 7 }, (_, i) => 2020 + i);

const FixturesPage: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
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
          const defaultLeague = fetchedLeagues.find(l => l.name === "United Rugby Championship") || fetchedLeagues[0];
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

  // Function to fetch fixtures based on all current filters (league, year, search)
  const fetchAndFilterFixtures = useCallback(async () => {
    setLoadingFixtures(true);
    setError(null);
    let fetchedData: Fixture[] = [];

    try {
      const startDate = new Date(selectedYear, 0, 1); // January 1st of selectedYear
      const endDate = new Date(selectedYear, 11, 31); // December 31st of selectedYear

      if (selectedLeagueId === null) {
        // Use fetchFixturesByDateRange for "All Leagues"
        // Note: searchTerm will be handled client-side for this case
        fetchedData = await fetchFixturesByDateRange(startDate, endDate);
      } else {
        // Use fetchFixturesByLeagueAndDateRange for a specific league
        // searchTerm is passed to the backend for server-side filtering
        fetchedData = await fetchFixturesByLeagueAndDateRange(
            selectedLeagueId,
            startDate,
            endDate,
            searchTerm
        );
      }
      setFixtures(fetchedData);
    } catch (err: any) {
      console.error(
          `Error fetching fixtures for ${selectedLeagueId === null ? 'All Leagues' : `league ID ${selectedLeagueId}`} and year ${selectedYear}:`,
          err
      );
      setError(err.message || 'An unknown error occurred while fetching fixtures.');
    } finally {
      setLoadingFixtures(false);
    }
  }, [selectedLeagueId, selectedYear, searchTerm]); // Dependencies for re-fetching

  // Effect to trigger fetching whenever relevant filters change
  useEffect(() => {
    if (!loadingLeagues) {
      fetchAndFilterFixtures();
    }
  }, [fetchAndFilterFixtures, loadingLeagues]);


  // Helper function to determine if a fixture is upcoming
  const isUpcoming = (fixture: Fixture): boolean => {
    const fixtureDate = new Date(fixture.datePlayed);
    const today = new Date();
    fixtureDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return fixtureDate >= today;
  };

  // Memoized fixtures after applying client-side search if needed
  const filteredFixturesForDisplay = useMemo(() => {
    // If a specific league is selected, searchTerm was already applied server-side
    if (selectedLeagueId !== null) {
      return fixtures;
    }

    // If "All Leagues" is selected, searchTerm needs to be applied client-side
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return fixtures.filter(fixture => {
        // Lookup league name for filtering (needed if backend doesn't return it for /fixtures/date-range)
        const league = leagues.find(l => l.id === fixture.leagueId);
        const fixtureLeagueName = league ? league.name : '';

        return (
            fixture.home.toLowerCase().includes(lowerCaseSearchTerm) ||
            fixture.away.toLowerCase().includes(lowerCaseSearchTerm) ||
            fixtureLeagueName.toLowerCase().includes(lowerCaseSearchTerm)
        );
      });
    }
    return fixtures;
  }, [fixtures, searchTerm, selectedLeagueId, leagues]); // Add leagues to dependencies for leagueName lookup

  const upcomingFixtures = useMemo(() => filteredFixturesForDisplay.filter(isUpcoming), [filteredFixturesForDisplay]);
  const recentFixtures = useMemo(() => filteredFixturesForDisplay
          .filter(fixture => !isUpcoming(fixture))
          .sort((a,b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime()), // Sort recent by most recent first
      [filteredFixturesForDisplay]
  );

  const selectedLeagueName = leagues.find(
      (league) => league.id === selectedLeagueId
  )?.name || 'All';

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
                  placeholder="Search for a team..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* NEW: Filter controls wrapper */}
        <div className="filter-controls-wrapper">
          {/* Year Dropdown (fixed) */}
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

          <LeagueFilter
              leagues={leagues}
              selectedLeagueId={selectedLeagueId}
              loading={loadingLeagues}
              error={error}
              onSelectLeague={setSelectedLeagueId}
              containerClassName="filter-chips-scroll-container"
          />

        </div> {/* End filter-controls-wrapper */}

        {/* Fixture List Section */}
        <div className="fixture-list-section">
          {isLoading ? (
              <>
                {/*TODO Backend changes needed to fix upcoming matches functionality*/}

                {/*<h2>Upcoming Matches</h2>*/}
                {/*<div className="fixture-list">*/}
                {/*  {Array.from({ length: 4 }).map((_, index) => (*/}
                {/*      <FixtureCardSkeleton key={`upcoming-skel-${index}`} />*/}
                {/*  ))}*/}
                {/*</div>*/}

                <h2>Recent Results</h2>
                <div className="fixture-list">
                  {Array.from({ length: 6 }).map((_, index) => (
                      <FixtureCardSkeleton key={`recent-skel-${index}`} />
                  ))}
                </div>
              </>
          ) : error ? (

              <div className="error-message">Error: {error}</div>
          ) : (
              <>
                {/*TODO Backend changes needed to fix upcoming matches functionality*/}
                {/*<h2>Upcoming Matches</h2>*/}
                {/*{upcomingFixtures.length > 0 ? (*/}
                {/*    <div className="fixture-list">*/}
                {/*      {upcomingFixtures.map(fixture => (*/}
                {/*          <FixtureCard*/}
                {/*              key={fixture.id}*/}
                {/*              homeTeam={fixture.home}*/}
                {/*              awayTeam={fixture.away}*/}
                {/*              dateTime={fixture.datePlayed}*/}
                {/*              homeScore={fixture.homeScore ? parseInt(fixture.homeScore, 10) : undefined}*/}
                {/*              awayScore={fixture.awayScore ? parseInt(fixture.awayScore, 10) : undefined}*/}
                {/*          />*/}
                {/*      ))}*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <p className="no-items-message">No upcoming matches for {selectedLeagueName} in {selectedYear}.</p>*/}
                {/*)}*/}

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
                              leagueName={fixture.leagueName}
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
