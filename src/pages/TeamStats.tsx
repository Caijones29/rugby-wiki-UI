import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTeamStatistics } from '../api/teamService';
import { TeamStatistics } from '../types/Team';
import WinLossCard from '../components/WinLossCard';
import RecentForm from '../components/RecentForm';
import FixtureCard from '../components/FixtureCard';
import './TeamStatsPage.css';

const TeamStats: React.FC = () => {
    const { teamName } = useParams<{ teamName: string }>();
    const navigate = useNavigate();

    const [stats, setStats] = useState<TeamStatistics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTeamStats = async () => {
            if (!teamName) {
                setError("No team name provided.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await fetchTeamStatistics(teamName);
                setStats(data);
            } catch (err: any) {
                console.error("Error fetching team statistics:", err);
                setError(err.message || 'An unknown error occurred while fetching team statistics.');
            } finally {
                setLoading(false);
            }
        };

        getTeamStats();
    }, [teamName]);

    const handleBackClick = () => {
        navigate('/teams');
    };

    if (loading) {
        return <div className="loading-message">Loading team statistics...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!stats) {
        return <div className="no-data-message">No statistics found for this team.</div>;
    }

    return (
        <div className="team-stats-container">
            {/* Back Button with Arrow */}
            <button onClick={handleBackClick} className="back-button">
                <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
            </button>


            <h1>{stats.teamName}</h1>
            <h3>{stats.leagueName}</h3>

            <WinLossCard wins={stats.wins} losses={stats.losses}/>

            <h2>Recent Form</h2>
            <RecentForm form={stats.recentForm}/>

            <h2>Last Win</h2>
            {stats.lastWin ? (
                <FixtureCard
                    key={stats.lastWin.id}
                    homeTeam={stats.lastWin.home}
                    awayTeam={stats.lastWin.away}
                    dateTime={stats.lastWin.datePlayed}
                    homeScore={stats.lastWin.homeScore}
                    awayScore={stats.lastWin.awayScore}
                    leagueName={stats.lastWin.leagueName}
                />
            ) : (
                <p className="no-data-message">No last win recorded.</p>
            )}

            <h2>Last Loss</h2>
            {stats.lastLoss ? (
                <FixtureCard
                    key={stats.lastLoss.id}
                    homeTeam={stats.lastLoss.home}
                    awayTeam={stats.lastLoss.away}
                    dateTime={stats.lastLoss.datePlayed}
                    homeScore={stats.lastLoss.homeScore}
                    awayScore={stats.lastLoss.awayScore}
                    leagueName={stats.lastLoss.leagueName}

                />
            ) : (
                <p className="no-data-message">No last loss recorded.</p>
            )}

            <h2>Biggest Win</h2>
            {stats.biggestWin ? (
                <FixtureCard
                    key={stats.biggestWin.id}
                    homeTeam={stats.biggestWin.home}
                    awayTeam={stats.biggestWin.away}
                    dateTime={stats.biggestWin.datePlayed}
                    homeScore={stats.biggestWin.homeScore}
                    awayScore={stats.biggestWin.awayScore}
                    leagueName={stats.biggestWin.leagueName}

                />
            ) : (
                <p className="no-data-message">No biggest win recorded.</p>
            )}

            <h2>Biggest Loss</h2>
            {stats.biggestLoss ? (
                <FixtureCard
                    key={stats.biggestLoss.id}
                    homeTeam={stats.biggestLoss.home}
                    awayTeam={stats.biggestLoss.away}
                    dateTime={stats.biggestLoss.datePlayed}
                    homeScore={stats.biggestLoss.homeScore}
                    awayScore={stats.biggestLoss.awayScore}
                    leagueName={stats.biggestLoss.leagueName}

                />
            ) : (
                <p className="no-data-message">No biggest loss recorded.</p>
            )}

        </div>
    );
};

export default TeamStats;
