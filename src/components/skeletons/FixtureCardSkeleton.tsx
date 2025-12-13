import React from 'react';
import './FixtureCardSkeleton.css';

const FixtureCardSkeleton: React.FC = () => {
    return (
        <div className="fixture-card skeleton">
            <div className="fixture-card-body">
                {/* Home team */}
                <div className="team-name-container home">
                    <div className="skeleton-box team-name-skeleton" />
                </div>

                {/* Scores + VS */}
                <div className="scores-and-vs">
                    <div className="skeleton-box score-skeleton" />
                    <div className="skeleton-box vs-skeleton" />
                    <div className="skeleton-box score-skeleton" />
                </div>

                {/* Away team */}
                <div className="team-name-container away">
                    <div className="skeleton-box team-name-skeleton" />
                </div>
            </div>

            {/* Footer date */}
            <div className="fixture-card-footer">
                <div className="skeleton-box date-skeleton" />
            </div>
        </div>
    );
};

export default FixtureCardSkeleton;
