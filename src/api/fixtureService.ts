// src/api/fixtureService.ts
import { Fixture } from '../types/Fixture';

const API_BASE_URL = 'https://rugby-wiki-backend-238f444127b7.herokuapp.com/api';

/**
 * Fetches fixtures for a specific date range.
 * @param startDate The start date for the range.
 * @param endDate The end date for the range.
 * @returns A promise that resolves to an array of Fixture objects.
 */
export const fetchFixturesByDateRange = async (startDate: Date, endDate: Date): Promise<Fixture[]> => {
  try {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    const url = `${API_BASE_URL}/fixtures/date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: Fixture[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch fixtures for date range ${startDate.toDateString()} - ${endDate.toDateString()}:`, error);
    throw error;
  }
};

/**
 * Fetches all fixtures for a specific league (across all years).
 * The year filtering will be done client-side.
 * @param leagueId The ID of the league to fetch fixtures for.
 * @returns A promise that resolves to an array of Fixture objects.
 */
export const fetchFixturesByLeagueId = async (leagueId: number): Promise<Fixture[]> => { // Renamed and simplified
  try {
    const url = `${API_BASE_URL}/fixtures/league/${leagueId}`; // Corrected endpoint
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: Fixture[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch all fixtures for league ID ${leagueId}:`, error);
    throw error;
  }
};
