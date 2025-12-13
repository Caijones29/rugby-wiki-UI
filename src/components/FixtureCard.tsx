import React from 'react';
import './FixtureCard.css';
import {formatPrettyDate} from "../utils/formatDate";

interface FixtureCardProps {
  homeTeam: string;
  awayTeam: string;
  leagueName?: string;
  homeScore?: number;
  awayScore?: number;
  dateTime: string;
  logoUrl?: string; // league or home team logo
}

const FixtureCard: React.FC<FixtureCardProps> = ({
                                                   homeTeam,
                                                   awayTeam,
                                                   homeScore,
                                                   awayScore,
                                                   dateTime,
                                                   logoUrl,
                                                   leagueName
                                                 }) => {
  const isResult =
      homeScore !== undefined && awayScore !== undefined;

  return (
      <div className="fixture-row">
        {/* Left logo */}
        <div
            className="fixture-logo"
            style={
              logoUrl
                  ? { backgroundImage: `url(${logoUrl})` }
                  : undefined
            }
        />

        {/* Right text content */}
        <div className="fixture-content">
          <p className="fixture-title">
            {isResult
                ? `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`
                : `${homeTeam} vs. ${awayTeam}`}
          </p>

          <div>
            <p className="fixture-subtitle">
              {formatPrettyDate(dateTime)} / {leagueName}
            </p>

          </div>

        </div>
      </div>
  );
};

export default FixtureCard;
