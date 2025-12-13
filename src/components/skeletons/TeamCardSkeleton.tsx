// src/components/skeletons/TeamCardSkeleton.tsx
import React from 'react';
import './TeamCardSkeleton.css'; // Separate CSS file for skeletons

const TeamCardSkeleton: React.FC = () => {
    return (
        <div className="team-list-item skeleton-card">
            <div className="team-info-group">
                <div className="team-logo skeleton-box"></div>
                <div className="team-text-group">
                    <div className="skeleton-line skeleton-name"></div>
                    <div className="skeleton-line skeleton-league"></div>
                </div>
            </div>
            <div className="team-chevron">
                <div className="skeleton-chevron"></div>
            </div>
        </div>
    );
};

export default TeamCardSkeleton;
