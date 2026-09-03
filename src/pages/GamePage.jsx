import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSessionStore } from '../store/sessionStore';
import { useSettingsStore } from '../store/settingsStore';
import Card from '../components/common/Card';
import Title from '../components/common/Title';
import GameBoard from '../components/game/GameBoard';
import PlayerInfo from '../components/game/PlayerInfo';
import GameControls from '../components/game/GameControls';
import GameOverModal from '../components/modals/GameOverModal';

/**
 * Сторінка активної гри, маршрут `/game/:sessionId`.
 *
 * Якщо сесія з переданим `sessionId` не знайдена в `useSessionStore`,
 * автоматично перенаправляє на `/404`.
 *
 * При завершенні матчу (перемога/нічия) є навмисна затримка в 1 секунду
 * перед оновленням статистики сесії та показом `GameOverModal` — щоб
 * гравець встиг побачити переможну лінію на дошці, перш ніж екран
 * закриється модалкою.
 */
const GamePage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const getSession = useSessionStore((state) => state.getSession);
    const updateSessionStats = useSessionStore((state) => state.updateSessionStats);
    const getBoardDimensions = useSettingsStore((state) => state.getBoardDimensions);

    const session = getSession(sessionId);

    const dimensions = getBoardDimensions();

    const gameState = useGameLogic(dimensions, session?.settings.winCondition || 4);
    const [showGameOverModal, setShowGameOverModal] = useState(false);

    useEffect(() => {
        if (!session) {
            navigate('/404');
        }
    }, [session, navigate]);

    useEffect(() => {
        if (session && gameState.isGameOver && gameState.winner) {
            setTimeout(() => {
                updateSessionStats(sessionId, gameState.winner);
                setShowGameOverModal(true);
            }, 1000);
        }
    }, [gameState.isGameOver, gameState.winner, sessionId, updateSessionStats, session]);

    const handleModalPlayAgain = () => {
        setShowGameOverModal(false);
        gameState.restartGame();
    };

    const handleModalExit = () => {
        setShowGameOverModal(false);
        navigate('/sessions');
    };

    const handleExit = () => {
        if (window.confirm('Ви впевнені, що хочете вийти з гри?')) {
            navigate('/sessions');
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4 pt-24">
                <Card className="text-center">
                    <p>Завантаження...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4 pt-24">
            <Card className="text-center">
                <Title size="medium">Гра #{sessionId.slice(-8)}</Title>

                {gameState.isGameOver && (
                    <div className="mb-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg">
                        <p className="text-lg font-semibold text-green-800">Гра завершена!</p>
                    </div>
                )}

                <div className="flex gap-6 mb-6 justify-center flex-wrap">
                    <PlayerInfo
                        playerName={session.settings.playerOneName}
                        isActive={gameState.currentPlayer === 1 && !gameState.isGameOver}
                        wins={session.stats.player1Wins}
                    />
                    <PlayerInfo
                        playerName={session.settings.playerTwoName}
                        isActive={gameState.currentPlayer === 2 && !gameState.isGameOver}
                        wins={session.stats.player2Wins}
                    />
                </div>

                <div className="mb-6">
                    <GameBoard
                        board={gameState.board}
                        onColumnClick={gameState.makeMove}
                        isColumnFull={gameState.isColumnFull}
                        lastMove={gameState.lastMove}
                        boardColor={session.settings.boardColor}
                    />
                </div>

                <GameControls onNewGame={gameState.restartGame} onExit={handleExit} />
            </Card>

            <GameOverModal
                isOpen={showGameOverModal}
                winner={gameState.winner}
                playerOneName={session.settings.playerOneName}
                playerTwoName={session.settings.playerTwoName}
                stats={session.stats}
                onPlayAgain={handleModalPlayAgain}
                onRestart={() => {
                    setShowGameOverModal(false);
                    gameState.restartGame();
                }}
                onExit={handleModalExit}
            />
        </div>
    );
};

export default GamePage;