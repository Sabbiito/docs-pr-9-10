import { useState, useCallback } from 'react';

/**
 * @typedef {Object} GameStatsApi
 * @property {{player1Wins: number, player2Wins: number, draws: number, totalGames: number}} stats
 * @property {function((number|string))} updateStats
 * @property {function()} resetStats
 */

/**
 * Хук для підрахунку статистики перемог/нічиїх у межах однієї сесії гри
 * (кілька матчів поспіль з тими самими гравцями та налаштуваннями).
 *
 * @returns {GameStatsApi}
 */
export const useGameStats = () => {
    const [stats, setStats] = useState({
        player1Wins: 0,
        player2Wins: 0,
        draws: 0,
        totalGames: 0
    });

    /** Реєструє результат одного завершеного матчу. `winner` — `1`, `2` або `'draw'`. */
    const updateStats = useCallback((winner) => {
        setStats(prev => ({
            player1Wins: winner === 1 ? prev.player1Wins + 1 : prev.player1Wins,
            player2Wins: winner === 2 ? prev.player2Wins + 1 : prev.player2Wins,
            draws: winner === 'draw' ? prev.draws + 1 : prev.draws,
            totalGames: prev.totalGames + 1
        }));
    }, []);

    const resetStats = useCallback(() => {
        setStats({
            player1Wins: 0,
            player2Wins: 0,
            draws: 0,
            totalGames: 0
        });
    }, []);

    return { stats, updateStats, resetStats };
};