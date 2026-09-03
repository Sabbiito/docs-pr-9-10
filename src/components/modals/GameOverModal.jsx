import React from 'react';
import Portal from '../common/Portal';

/**
 * Модальне вікно завершення матчу — показує переможця/нічию, сукупну
 * статистику сесії та три дії: наступний раунд, повний рестарт, вихід.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen — якщо `false`, компонент нічого не рендерить.
 * @param {(number|string)} props.winner — `1`, `2` або `'draw'`.
 * @param {string} props.playerOneName
 * @param {string} props.playerTwoName
 * @param {{player1Wins: number, player2Wins: number, draws: number}} props.stats
 * @param {function()} props.onPlayAgain — почати новий раунд у тій самій сесії (статистика зберігається).
 * @param {function()} props.onRestart — почати сесію заново (скидає статистику).
 * @param {function()} props.onExit — повернутись у головне меню.
 */
const GameOverModal = ({
                           isOpen,
                           winner,
                           playerOneName,
                           playerTwoName,
                           stats,
                           onPlayAgain,
                           onRestart,
                           onExit
                       }) => {
    if (!isOpen) return null;

    const getWinnerData = () => {
        if (winner === 'draw') {
            return {
                title: '🤝 Нічия!',
                message: 'Обидва гравці зіграли чудово!',
                color: 'from-gray-400 to-gray-600'
            };
        }
        const winnerName = winner === 1 ? playerOneName : playerTwoName;
        return {
            title: `🎉 ${winnerName} переміг!`,
            message: 'Вітаємо з перемогою!',
            color: winner === 1 ? 'from-red-400 to-red-600' : 'from-yellow-400 to-yellow-600'
        };
    };

    const { title, message, color } = getWinnerData();

    return (
        <Portal>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
                    <div className={`bg-gradient-to-r ${color} p-6 rounded-t-2xl`}>
                        <h2 className="text-3xl font-bold text-white text-center">{title}</h2>
                        <p className="text-white text-center mt-2">{message}</p>
                    </div>

                    <div className="p-6">
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                                Загальна статистика
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">{stats.player1Wins}</div>
                                    <div className="text-xs text-gray-600 mt-1">{playerOneName}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-600">{stats.draws}</div>
                                    <div className="text-xs text-gray-600 mt-1">Нічиї</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.player2Wins}</div>
                                    <div className="text-xs text-gray-600 mt-1">{playerTwoName}</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button onClick={onPlayAgain} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all">
                                ▶ Наступний раунд
                            </button>
                            <button onClick={onRestart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
                                🔄 Почати заново
                            </button>
                            <button onClick={onExit} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-all">
                                🏠 Головне меню
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default GameOverModal;