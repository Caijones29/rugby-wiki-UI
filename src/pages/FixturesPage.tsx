// src/pages/FixturesPage.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import FixtureCard from '../components/FixtureCard';
import { fetchFixturesByLeagueId } from '../api/fixtureService'; // Use the updated function
import { fetchLeagues } from '../api/leagueService';
import { Fixture } from '../types/Fixture';
import { League } from '../types/League';


const currentYear = new Date().getFullYear();
// Generate years from 2 years ago to 2 years in the future
const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const FixturesPage: React.FC = () => {
  const [allLeagueFixtures, setAllLeagueFixtures] = useState<Fixture[]>([]); // Stores ALL fixtures for selected league
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState<boolean>(true);
  const [loadingLeagues, setLoadingLeagues] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Effect to fetch leagues on component mount
  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      try {
        const fetchedLeagues = await fetchLeagues();
        setLeagues(fetchedLeagues);
        if (fetchedLeagues.length > 0) {
          setSelectedLeagueId(fetchedLeagues[0].id); // Set first league as default
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

  // Function to fetch ALL fixtures for the selected league (no year filter here)
  const fetchAllFixturesForSelectedLeague = useCallback(async () => {
    if (selectedLeagueId === null) {
      setAllLeagueFixtures([]);
      return;
    }

    setLoadingFixtures(true);
    setError(null);

    try {
      const data = await fetchFixturesByLeagueId(selectedLeagueId); // Call the updated service function
      setAllLeagueFixtures(data); // Store all fixtures for the league
    } catch (err: any) {
      console.error(`Error fetching fixtures for league ID ${selectedLeagueId}:`, err);
      setError(err.message || 'An unknown error occurred while fetching fixtures.');
    } finally {
      setLoadingFixtures(false);
    }
  }, [selectedLeagueId]); // Only re-run if selectedLeagueId changes

  // Effect to trigger fetching all fixtures for the selected league
  useEffect(() => {
    fetchAllFixturesForSelectedLeague();
  }, [fetchAllFixturesForSelectedLeague]);


  // Memoized filtered fixtures based on selectedYear
  const yearFilteredFixtures = useMemo(() => {
    return allLeagueFixtures.filter(fixture => {
      const fixtureYear = new Date(fixture.datePlayed).getFullYear();
      return fixtureYear === selectedYear;
    });
  }, [allLeagueFixtures, selectedYear]);


  // Helper function to determine if a fixture is upcoming
  const isUpcoming = (fixture: Fixture): boolean => {
    const fixtureDate = new Date(fixture.datePlayed);
    const today = new Date();
    // Compare dates only, ignore time for 'upcoming' classification
    fixtureDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return fixtureDate >= today;
  };

  const upcomingFixtures = useMemo(() => yearFilteredFixtures.filter(isUpcoming), [yearFilteredFixtures]);
  const recentFixtures = useMemo(() => yearFilteredFixtures
    .filter(fixture => !isUpcoming(fixture))
    .sort((a,b) => new Date(b.datePlayed).getTime() - new Date(a.datePlayed).getTime()), // Sort recent by most recent first
    [yearFilteredFixtures]
  );

  // Get the name of the currently selected league for the title
  const selectedLeagueName = leagues.find(
    (league) => league.id === selectedLeagueId
  )?.name || 'Select a League';

  const isLoading = loadingLeagues || loadingFixtures;

  // Handler for dropdown change
  const handleLeagueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLeagueId(Number(event.target.value));
  };


  return (
    <div className="fixtures-page-container">
      <h1>{selectedLeagueName} Fixtures - {selectedYear}</h1>

      {loadingLeagues && <div className="loading-message">Loading leagues...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loadingLeagues && leagues.length > 0 && (
        <div className="selector-group league-selector">
          <h3 className="selector-title">Select League:</h3>
          <select
            className="league-dropdown"
            value={selectedLeagueId || ''}
            onChange={handleLeagueChange}
            disabled={loadingLeagues}
          >
            <option value="" disabled>-- Choose a League --</option>
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
        <div className="loading-message">Loading fixtures...</div>
      ) : (
        <>
          <h2>Upcoming Matches</h2>
          {upcomingFixtures.length > 0 ? (
            upcomingFixtures.map(fixture => (
              <FixtureCard
                key={fixture.id}
                homeTeam={fixture.home}
                awayTeam={fixture.away}
                dateTime={fixture.datePlayed}
                homeScore={fixture.homeScore ? parseInt(fixture.homeScore, 10) : undefined}
                awayScore={fixture.awayScore ? parseInt(fixture.awayScore, 10) : undefined}
              />
            ))
          ) : (
            <p className="no-fixtures-message">No upcoming matches for {selectedLeagueName} in {selectedYear}.</p>
          )}

          <h2>Recent Results</h2>
          {recentFixtures.length > 0 ? (
            recentFixtures.map(fixture => (
              <FixtureCard
                key={fixture.id}
                homeTeam={fixture.home}
                awayTeam={fixture.away}
                homeScore={fixture.homeScore ? parseInt(fixture.homeScore, 10) : undefined}
                awayScore={fixture.awayScore ? parseInt(fixture.awayScore, 10) : undefined}
                dateTime={fixture.datePlayed}
              />
            ))
          ) : (
            <p className="no-fixtures-message">No recent results for {selectedLeagueName} in {selectedYear}.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FixturesPage;
