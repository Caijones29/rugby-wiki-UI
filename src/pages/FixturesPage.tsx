// src/pages/FixturesPage.tsx

import React, { useEffect, useState, useCallback } from 'react';
import FixtureCard from '../components/FixtureCard';
import { fetchFixturesByDateRange } from '../api/fixtureService'; // We'll primarily use this one
import { Fixture } from '../types/Fixture';

const FixturesPage: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Set to false initially, fetch on button click or initial load
  const [error, setError] = useState<string | null>(null);

  // State for the selected date range (stored as YYYY-MM-DD strings for input type="date")
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');

  // Helper function to format a Date object to YYYY-MM-DD string
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set initial default date range (e.g., current month)
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0); // Last day of next month

    setSelectedStartDate(formatDateToString(firstDayOfMonth));
    setSelectedEndDate(formatDateToString(lastDayOfNextMonth));
  }, []); // Run once on component mount to set defaults

  // Function to fetch fixtures based on the selected date range
  const getFixtures = useCallback(async () => {
    if (!selectedStartDate || !selectedEndDate) {
      setError('Please select both a start and an end date.');
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);

      // Ensure end date includes the whole day
      end.setHours(23, 59, 59, 999);

      const data = await fetchFixturesByDateRange(start, end);
      setFixtures(data);
    } catch (err: any) {
      console.error("Error fetching fixtures:", err);
      setError(err.message || 'An unknown error occurred while fetching fixtures.');
    } finally {
      setLoading(false);
    }
  }, [selectedStartDate, selectedEndDate]); // Recreate if dates change

  // Fetch fixtures when the component mounts or when the default dates are set
  // This useEffect will run after the initial dates are set by the other useEffect
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      getFixtures();
    }
  }, [selectedStartDate, selectedEndDate, getFixtures]); // Depend on dates and the memoized getFixtures

  // Helper function to determine if a fixture is upcoming
  const isUpcoming = (fixture: Fixture): boolean => {
    const fixtureDate = new Date(fixture.datePlayed);
    const today = new Date();
    fixtureDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return fixtureDate >= today;
  };

  const upcomingFixtures = fixtures.filter(isUpcoming);
  const recentFixtures = fixtures.filter(fixture => !isUpcoming(fixture));

  return (
    <div className="fixtures-page-container">
      <h1>Fixtures</h1>

      <div className="date-selector-container" style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#2a2d34', borderRadius: '0.5rem' }}>
        <label htmlFor="startDate" style={{ marginRight: '0.5rem', color: '#e0e0e0' }}>Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={selectedStartDate}
          onChange={(e) => setSelectedStartDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #555', backgroundColor: '#3a3d44', color: '#e0e0e0', marginRight: '1rem' }}
        />

        <label htmlFor="endDate" style={{ marginRight: '0.5rem', color: '#e0e0e0' }}>End Date:</label>
        <input
          type="date"
          id="endDate"
          value={selectedEndDate}
          onChange={(e) => setSelectedEndDate(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #555', backgroundColor: '#3a3d44', color: '#e0e0e0', marginRight: '1rem' }}
        />

        {/* Removed explicit "Load Fixtures" button as useEffect now handles re-fetch on date change */}
      </div>

      {loading && <div className="loading-message">Loading fixtures...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && (
        <>
          <h2>Upcoming Matches</h2>
          {upcomingFixtures.length > 0 ? (
            upcomingFixtures.map(fixture => (
              <FixtureCard
                key={fixture.id}
                homeTeam={fixture.home}
                awayTeam={fixture.away}
                dateTime={fixture.datePlayed}
                homeScore={undefined}
                awayScore={undefined}
              />
            ))
          ) : (
            <p className="no-fixtures-message">No upcoming matches for the selected range.</p>
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
            <p className="no-fixtures-message">No recent results for the selected range.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FixturesPage;
