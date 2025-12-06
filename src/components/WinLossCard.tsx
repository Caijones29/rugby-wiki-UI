// src/components/WinLossCard.tsx
import React from 'react';
import './WinLossCard.css'; // Import the CSS for styling the card

// Define the shape of the props that this component will accept
interface WinLossCardProps {
  wins: number;
  losses: number;
}

const WinLossCard: React.FC<WinLossCardProps> = ({
  wins,
  losses,
}) => {
  return (
    <div className="win-loss-container"> {/* This container will flex the two cards */}
      <div className="card win-card">
        <h2 className="card-title">Wins</h2>
        <div className="win-loss-count">{wins}</div>
      </div>
      <div className="card loss-card">
        <h2 className="card-title">Losses</h2> {/* Changed from "Loss" to "Losses" for consistency */}
        <div className="win-loss-count">{losses}</div>
      </div>
    </div>
  );
};

export default WinLossCard;
