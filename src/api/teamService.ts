import { Team, TeamStatistics } from '../types/Team'; // Import Team and the new TeamStatistics interface

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

/**
 * Fetches a list of all teams.
 * @returns A promise that resolves to an array of Team objects.
 */
export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const url = `${API_BASE_URL}/teams`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: Team[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch teams for league ID:`, error);
    throw error;
  }
};

/**
 * Fetches detailed statistics for a specific team.
 * @param teamName The name of the team for which to fetch statistics.
 * @returns A promise that resolves to a TeamStatistics object.
 */
export const fetchTeamStatistics = async (teamName: string): Promise<TeamStatistics> => {
  try {
    const url = `${API_BASE_URL}/team-statistics/${teamName}`; // Encode teamName for URL safety
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: TeamStatistics = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch statistics for team "${teamName}":`, error);
    throw error;
  }
};
