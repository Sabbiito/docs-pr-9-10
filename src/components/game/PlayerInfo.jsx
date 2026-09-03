import React from 'react';

/**
 * Картка інформації про гравця (ім'я, кількість перемог, індикатор
 * активного ходу).
 *
 * @param {{ playerName: string, isActive: boolean, wins: number }} props
 */
const PlayerInfo = ({ playerName, isActive, wins }) => {
    return (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
            isActive ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'
        }`}>
            <div>
        <span className="font-semibold text-lg block">
          {playerName} {isActive && '(хід)'}
        </span>
                <span className="text-sm text-gray-600">Перемог: {wins}</span>
            </div>
        </div>
    );
};

export default PlayerInfo;