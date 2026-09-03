import React from 'react';
import Button from '../common/Button';

/**
 * Панель керування грою: "Нова гра" (перезапуск поточного матчу) та
 * "Вихід" (повернення до списку сесій).
 *
 * @param {Object} props
 * @param {function()} props.onNewGame
 * @param {function()} props.onExit
 */
const GameControls = ({ onNewGame, onExit }) => {
    return (
        <div className="flex gap-4 mt-6">
            <Button onClick={onNewGame} variant="primary">
                Нова гра
            </Button>
            <Button onClick={onExit} variant="secondary">
                Вихід
            </Button>
        </div>
    );
};

export default GameControls;