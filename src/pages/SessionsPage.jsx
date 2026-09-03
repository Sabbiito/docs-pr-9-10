import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import Card from '../components/common/Card';
import Title from '../components/common/Title';
import Button from '../components/common/Button';
import styles from '../styles/SessionCard.module.css';

/**
 * Сторінка `/sessions` — список усіх збережених ігрових сесій з картками,
 * що показують гравців, налаштування, статистику та дозволяють
 * продовжити гру або видалити сесію.
 *
 * `handleDeleteSession` та `handleClearAll` реалізують GDPR "право на
 * видалення" (ст. 17) для категорії даних "Історія та статистика" —
 * див. розділ 4 `PRIVACY_POLICY.md`. Обидві дії підтверджуються через
 * `window.confirm`, оскільки видалення незворотне.
 */
const SessionsPage = () => {
    const navigate = useNavigate();
    const getAllSessions = useSessionStore((state) => state.getAllSessions);
    const deleteSession = useSessionStore((state) => state.deleteSession);
    const clearAllSessions = useSessionStore((state) => state.clearAllSessions);

    const sessions = getAllSessions();

    const handleContinueSession = (sessionId) => {
        navigate(`/game/${sessionId}`);
    };

    const handleDeleteSession = (sessionId, e) => {
        e.stopPropagation();
        if (window.confirm('Ви впевнені, що хочете видалити цю сесію?')) {
            deleteSession(sessionId);
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Видалити всі сесії? Цю дію не можна скасувати.')) {
            clearAllSessions();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-4 pt-24">
            <div className="max-w-6xl mx-auto">
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <Title size="medium">Мої ігрові сесії</Title>
                        {sessions.length > 0 && (
                            <Button variant="secondary" onClick={handleClearAll}>
                                🗑️ Очистити всі
                            </Button>
                        )}
                    </div>

                    {sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎮</div>
                            <p className="text-gray-600 text-lg mb-6">
                                У вас поки немає збережених сесій
                            </p>
                            <Button variant="primary" onClick={() => navigate('/start')}>
                                Створити нову гру
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className={styles.sessionCard}
                                    onClick={() => handleContinueSession(session.id)}
                                >
                                    <div className={styles.sessionHeader}>
                                        <div className={styles.sessionTitle}>
                                            {session.settings.playerOneName} vs {session.settings.playerTwoName}
                                        </div>
                                    </div>

                                    <div className={styles.sessionDate}>
                                        📅 {formatDate(session.lastPlayedAt)}
                                    </div>

                                    <div className="text-sm text-gray-600 my-2">
                                        📏 {session.settings.gridSize} • 🎯 {session.settings.winCondition} в ряд
                                    </div>

                                    <div className={styles.sessionStats}>
                                        <div className={`${styles.statBox} bg-red-50`}>
                                            <div className={`${styles.statValue} text-red-600`}>
                                                {session.stats.player1Wins}
                                            </div>
                                            <div className={styles.statLabel}>Перемог P1</div>
                                        </div>

                                        <div className={`${styles.statBox} bg-gray-100`}>
                                            <div className={`${styles.statValue} text-gray-600`}>
                                                {session.stats.draws}
                                            </div>
                                            <div className={styles.statLabel}>Нічиї</div>
                                        </div>

                                        <div className={`${styles.statBox} bg-yellow-50`}>
                                            <div className={`${styles.statValue} text-yellow-600`}>
                                                {session.stats.player2Wins}
                                            </div>
                                            <div className={styles.statLabel}>Перемог P2</div>
                                        </div>
                                    </div>

                                    <div className="text-center text-sm text-gray-500 mb-3">
                                        Всього ігор: {session.stats.totalGames}
                                    </div>

                                    <div className={styles.sessionActions}>
                                        <button
                                            className={`${styles.actionButton} ${styles.continueButton}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContinueSession(session.id);
                                            }}
                                        >
                                            ▶️ Продовжити
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={(e) => handleDeleteSession(session.id, e)}
                                        >
                                            🗑️ Видалити
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SessionsPage;