import React from 'react';
import { League } from '../types/League';

interface LeagueFilterChipsProps {
    leagues: League[];
    selectedLeagueId: number | null;
    loading: boolean;
    error?: string | null;
    onSelectLeague: (leagueId: number | null) => void;
    skeletonCount?: number;
    containerClassName?: string;
}

const LeagueFilter: React.FC<LeagueFilterChipsProps> = ({
                                                                 leagues,
                                                                 selectedLeagueId,
                                                                 loading,
                                                                 error,
                                                                 onSelectLeague,
                                                                 skeletonCount = 8,
                                                                 containerClassName = 'filter-chips-container',
                                                             }) => {
    if (loading) {
        return (
            <div className={containerClassName}>
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div key={index} className="filter-chip skeleton-chip" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className={containerClassName}>
            {/* All chip */}
            <div
                className={`filter-chip ${selectedLeagueId === null ? 'active' : ''}`}
                onClick={() => onSelectLeague(0)}
            >
                <p className="filter-chip-text">All</p>
            </div>

            {leagues.map(league => (
                <div
                    key={league.id}
                    className={`filter-chip ${
                        selectedLeagueId === league.id ? 'active' : ''
                    }`}
                    onClick={() => onSelectLeague(league.id)}
                >
                    <p className="filter-chip-text">{league.name}</p>
                </div>
            ))}
        </div>
    );
};

export default LeagueFilter;
