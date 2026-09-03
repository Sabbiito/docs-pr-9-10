import React from 'react';

/**
 * Блок результатів матчу: заголовок переможця/нічиї та сітка сукупної
 * статистики сесії (перемоги гравця 1, нічиї, перемоги гравця 2).
 *
 * @param {{
 *   winner: number|'draw'|null,
 *   stats: { totalGames: number, player1Wins: number, draws: number, player2Wins: number }
 * }} props
 */
const ResultStats = ({ winner, stats }) => {
    return (
        <div className="space-y-4 w-full max-w-md">
            <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-2xl font-bold text-center">
                    {!winner ? 'Завантаження...' : winner === 'draw' ? '🤝 Нічия!' : `🎉 Переможець: Гравець ${winner}!`}
                </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-lg text-gray-600">Всього ігор: {stats.totalGames}</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600">{stats.player1Wins}</div>
                    <div className="text-sm text-gray-600 mt-1">Гравець 1</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-gray-600">{stats.draws}</div>
                    <div className="text-sm text-gray-600 mt-1">Нічиї</div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-600">{stats.player2Wins}</div>
                    <div className="text-sm text-gray-600 mt-1">Гравець 2</div>
                </div>
            </div>
        </div>
    );
};

export default ResultStats;