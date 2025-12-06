import React from 'react';
import './FixtureCard.css'; // Import the CSS for styling the card

interface FixtureCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  dateTime: string;
}

const FixtureCard: React.FC<FixtureCardProps> = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  dateTime,
}) => {

  return (
    <div className="fixture-card">
      <div className="fixture-card-body">
        <div className="team-name-container home">
          <h2 className="team-name">{homeTeam}</h2>
        </div>

        <div className="scores-and-vs">
          <h2 className="team-score">{homeScore}</h2>
          <div className="vs">{'vs'}</div>
          <h2 className="team-score">{awayScore}</h2>
        </div>

        <div className="team-name-container away">
          <h2 className="team-name">{awayTeam}</h2>
        </div>
      </div>
      <div className="fixture-card-footer">
        <h3 className="match-datetime">{dateTime}</h3>
      </div>
    </div>
  );
};

export default FixtureCard;