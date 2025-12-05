// src/components/TeamCard.tsx
import React from 'react';
import './FixtureCard.css'; // Import the CSS for styling the card

// Define the shape of the props that this component will accept
interface TeamCardProps {
  name: string;
  league: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  league,
}) => {
  return (
    <div className="fixture-card"> {/* Renamed from fixture-card-body in previous version */}
      <h2 className="team-name-main">{name}</h2>
      <p className="team-league-sub">{league}</p>
    </div>
  );
};

export default TeamCard;
