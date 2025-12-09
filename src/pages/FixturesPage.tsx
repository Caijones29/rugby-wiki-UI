import React, { useEffect, useState, useCallback, useMemo } from 'react';
import FixtureCard from '../components/FixtureCard';
import { fetchAllFixtures, fetchFixturesByLeagueId } from '../api/fixtureService';
import { fetchLeagues } from '../api/leagueService';
import { Fixture } from '../types/Fixture';
import { League } from '../types/League';
import './FixturesPage.css';

const currentYear = new Date().getFullYear();
const availableYears = Array.from({ length: 7 }, (_, i) => 2020 + i);

const FixturesPage: React.FC = () => {
  const [allLeagueFixtures, setAllLeagueFixtures] = useState<Fixture[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState<boolean>(true);
  const [loadingLeagues, setLoadingLeagues] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Default to "All leagues"
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch leagues on mount
  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const fetchedLeagues = await fetchLeagues();
        setLeagues(fetchedLeagues);
      } catch (err: any) {
        console.error('Error fetching leagues:', err);
        setError(err.message || 'An unknown error occurred while fetching leagues.');
      } finally {
        setLoadingLeagues(false);
      }
    };
    getLeagues();
  }, []);

  const [fixturesCache, setFixturesCache] = useState<{ [key: string]: Fixture[] }>({});


  // Fetch fixtures for selected league or all
  const fetchAllFixturesForSelectedLeague = useCallback(async () => {
    setLoadingFixtures(true);
    setError(null);

    const cacheKey = selectedLeagueId === null ? 'all' : selectedLeagueId.toString();

    // Use cached data if available
    if (fixturesCache[cacheKey]) {
      setAllLeagueFixtures(fixturesCache[cacheKey]);
      setLoadingFixtures(false);
      return;
    }

    try {
      let data: Fixture[] = [];

      if (selectedLeagueId === null) {
        data = await fetchAllFixtures();
      } else {
        data = await fetchFixturesByLeagueId(selectedLeagueId);
      }

      // Save to cache
      setFixturesCache(prev => ({ ...prev, [cacheKey]: data }));

      setAllLeagueFixtures(data);
    } catch (err: any) {
      console.error('Error fetching fixtures:', err);
      setError(err.message || 'An unknown error occurred while fetching fixtures.');
    } finally {
      setLoadingFixtures(false);
    }
  }, [selectedLeagueId, fixturesCache]);


  useEffect(() => {
    fetchAllFixturesForSelectedLeague();
  }, [fetchAllFixturesForSelectedLeague]);

  // Filter fixtures by year and search term
  const filteredFixtures = useMemo(() => {
    let currentFixtures = allLeagueFixtures.filter(fixture => {
      return new Date(fixture.datePlayed).getFullYear() === selectedYear;
    });

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      currentFixtures = currentFixtures.filter(fixture => {
        const league = leagues.find(l => l.id === fixture.leagueId);
        const leagueName = league ? league.name : '';
        return (
            fixture.home.toLowerCase().includes(term) ||
            fixture.away.toLowerCase().includes(term) ||
            leagueName.toLowerCase().includes(term)
        );
      });
    }

    return currentFixtures;
  }, [allLeagueFixtures, selectedYear, searchTerm, leagues]);

  const isUpcoming = (fixture: Fixture) => {
    const fixtureDate = new Date(fixture.datePlayed);
    const today = new Date();
    fixtureDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return fixtureDate >= today;
  };

  const upcomingFixtures = useMemo(() => filteredFixtures.filter(isUpcoming), [filteredFixtures]);
  const recentFixtures = useMemo(
      () =>
          filteredFixtures
              .filter(f => !isUpcoming(f))
              .sort((a, b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime()),
      [filteredFixtures]
  );

  const selectedLeagueName =
      leagues.find(l => l.id === selectedLeagueId)?.name || 'All';

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
                  onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls-wrapper">
          {/* Year Dropdown */}
          <div className="filter-chip year-dropdown-chip">
            <select
                className="year-dropdown"
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
              ))}
            </select>
          </div>

          {/* League Chips */}
          {loadingLeagues ? (
              <div className="loading-message">Loading leagues...</div>
          ) : error ? (
              <div className="error-message">Error: {error}</div>
          ) : (
              <div className="filter-chips-scroll-container">
                {/* "All" chip */}
                <div
                    className={`filter-chip ${selectedLeagueId === null ? 'active' : ''}`}
                    onClick={() => setSelectedLeagueId(null)}
                >
                  <p className="filter-chip-text">All</p>
                </div>
                {/* Other league chips */}
                {leagues.map(league => (
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
        </div>

        {/* Fixtures List */}
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
                    <p className="no-items-message">
                      No upcoming matches for {selectedLeagueName} in {selectedYear}.
                    </p>
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
                    <p className="no-items-message">
                      No recent results for {selectedLeagueName} in {selectedYear}.
                    </p>
                )}
              </>
          )}
        </div>
      </div>
  );
};

export default FixturesPage;
