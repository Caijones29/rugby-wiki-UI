export interface Team {
  name: string;
  leagueId: number;
  leagueName: string;
  // id?: number; // Uncomment if your Team objects also have an 'id'
}

// Interface for a simplified match result (used within TeamStatistics)
export interface MatchResult {
  away: string;
  awayScore: number; // Scores are strings in the example
  datePlayed: string; // Date as string
  home: string;
  homeScore: number; // Scores are strings in the example
  id: number;
  leagueId: number;
  leagueName: string | null; // Can be null based on example
}

// Interface for the full team statistics response
export interface TeamStatistics {
  biggestLoss: MatchResult;
  biggestWin: MatchResult;
  draws: number;
  lastLoss: MatchResult;
  lastWin: MatchResult;
  losses: number;
  matchesPlayed: number; // Based on example, this is 0, but included for completeness
  pointsAgainst: number; // Based on example, this is 0, but included for completeness
  pointsFor: number;     // Based on example, this is 0, but included for completeness
  recentForm: string[];
  teamName: string;
  leagueName: string;
  totalPoints: number;   // Based on example, this is 0, but included for completeness
  winPercentage: number;
  wins: number;
}
