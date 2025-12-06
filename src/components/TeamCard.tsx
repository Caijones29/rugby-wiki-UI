// src/components/TeamCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamCard.css'; // Renamed CSS file for clarity and specific styling
// REMOVE THIS LINE: import chevronimg from '../assets/chevron-right.png'; // No longer needed if using font icon

interface TeamCardProps {
  name: string;
  league: string;
  logoUrl?: string; // New prop for team logo
}

const TeamCard: React.FC<TeamCardProps> = ({ name, league, logoUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const teamUrlName = encodeURIComponent(name); // Encode for URL safety
    navigate(`/teams/stats/${teamUrlName}`);
  };

  // A generic placeholder if no logoUrl is provided or found
  const defaultLogo = 'https://via.placeholder.com/48?text=TL'; // "Team Logo" placeholder

  return (
    <div className="team-list-item" onClick={handleCardClick}>
      <div className="team-info-group">
        <div
          className="team-logo"
          style={{ backgroundImage: `url('${logoUrl || defaultLogo}')` }}
          aria-label={`${name} team logo`} // Accessible label for the logo
        ></div>
        <div className="team-text-group">
          <p className="team-name">{name}</p>
          <p className="team-league-name">{league}</p>
        </div>
      </div>
      <div className="team-chevron">
        {/* Use the icon name 'chevron_right' here */}
        <span className="material-symbols-outlined">
          chevron_right
        </span>
      </div>
    </div>
  );
};

export default TeamCard;
