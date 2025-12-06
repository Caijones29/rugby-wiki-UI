import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './FixtureCard.css'; 

interface TeamCardProps {
  name: string;
  league: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  name,
  league,
}) => {
  const navigate = useNavigate(); 

  const handleCardClick = () => {
    const teamUrlName = encodeURIComponent(name);
    navigate(`/teams/stats/${teamUrlName}`);
  };

  return (
    <div className="team-card" onClick={handleCardClick}>
      <h2 className="team-name-main">{name}</h2>
      <p className="team-league-sub">{league}</p>
    </div>
  );
};

export default TeamCard;
