import React from 'react';
import './FixtureCard.css'; // Import the CSS for styling the card

// Define the shape of the props that this component will accept
interface FixtureCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number; // Optional, for upcoming matches
  awayScore?: number; // Optional, for upcoming matches
  dateTime: string;
  homeTeamLogo?: string; // Optional: URL for home team logo
  awayTeamLogo?: string; // Optional: URL for away team logo
}

const FixtureCard: React.FC<FixtureCardProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  dateTime,
  homeTeamLogo,
  awayTeamLogo,
}) => {

  return (
    <div className="fixture-card">
      <div className="fixture-card-body">
        {/* Container for Home Team Name - aligned left */}
        <div className="team-name-container home">
          {/* You can add homeTeamLogo here if desired, e.g., <img src={homeTeamLogo} className="team-logo" alt="Home Team Logo" /> */}
          <h2 className="team-name">{homeTeam}</h2>
        </div>

        {/* Container for Scores and 'vs' - centered */}
        <div className="scores-and-vs">
          <h2 className="team-score">{homeScore}</h2>
          <div className="vs">{'vs'}</div>
          <h2 className="team-score">{awayScore}</h2>
        </div>

        {/* Container for Away Team Name - aligned right */}
        <div className="team-name-container away">
          <h2 className="team-name">{awayTeam}</h2>
          {/* You can add awayTeamLogo here if desired, e.g., <img src={awayTeamLogo} className="team-logo" alt="Away Team Logo" /> */}
        </div>
      </div>
      <div className="fixture-card-footer">
        <h3 className="match-datetime">{dateTime}</h3>
      </div>
    </div>
  );
};

export default FixtureCard;