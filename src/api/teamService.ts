// src/api/teamService.ts
import { Team } from '../types/Team'; // Import the Team interface

// IMPORTANT: Replace with your actual API endpoint if it differs
const API_BASE_URL = 'https://rugby-wiki-backend-238f444127b7.herokuapp.com/api';

/**
 * Fetches a list of teams for a specific league and year from fixtures.
 * @param leagueId The ID of the league to fetch teams for.
 * @param year The year for which to fetch teams (based on fixtures played in that year).
 * @returns A promise that resolves to an array of Team objects.
 */
export const fetchTeamsByLeagueAndYear = async (leagueId: number, year: number): Promise<Team[]> => {
  try {
    const url = `${API_BASE_URL}/teams/from-fixtures/league/${leagueId}/year/${year}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: Team[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch teams for league ID ${leagueId} and year ${year}:`, error);
    throw error;
  }
};

// The previous fetchTeamsByLeagueId and fetchAllTeams are removed as they
// don't match the new API endpoint structure for fetching teams by year.
