import { Fixture } from '../types/Fixture';

const API_BASE_URL = 'https://rugby-wiki-backend-238f444127b7.herokuapp.com/api';

export const fetchFixtures = async (): Promise<Fixture[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fixtures`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: Fixture[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch all fixtures:", error);
    throw error;
  }
};

/**
 * Fetches fixtures within a specified date range.
 * @param startDate The start date for the range (e.g., new Date('2025-01-01')).
 * @param endDate The end date for the range (e.g., new Date('2025-12-01')).
 * @returns A promise that resolves to an array of Fixture objects.
 */
export const fetchFixturesByDateRange = async (startDate: Date, endDate: Date): Promise<Fixture[]> => {
  try {
    // Format dates to YYYY-MM-DD
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const url = `${API_BASE_URL}/fixtures/range?start=${formattedStartDate}&end=${formattedEndDate}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data: Fixture[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch fixtures by date range:", error);
    throw error;
  }
};
