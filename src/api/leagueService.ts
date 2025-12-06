// src/api/leagueService.ts
import { League } from '../types/League';
// IMPORTANT: Replace with your actual API endpoint if it differs
const API_BASE_URL = 'https://rugby-wiki-backend-238f444127b7.herokuapp.com/api';

/**
 * Fetches a list of all available leagues.
 * @returns A promise that resolves to an array of League objects.
 */
export const fetchLeagues = async (): Promise<League[]> => {
  try {
    const url = `${API_BASE_URL}/leagues`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: League[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch leagues:`, error);
    throw error;
  }
};
