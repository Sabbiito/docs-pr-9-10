import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/settingsStore';
import { useSessionStore } from '../store/sessionStore';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Title from '../components/common/Title';
import SettingsModal from '../components/modals/SettingsModal';

/**
 * Сторінка `/start` — попередній екран перед грою: показує поточні
 * налаштування (гравці, розмір дошки, умова перемоги, колір), дозволяє
 * їх відредагувати через `SettingsModal`, і створює нову ігрову сесію
 * (`useSessionStore.createSession`) при натисканні "Почати гру", одразу
 * переходячи на `/game/:sessionId`.
 */
const StartPage = () => {
    const navigate = useNavigate();
    const settings = useSettingsStore((state) => state.settings);
    const updateSettings = useSettingsStore((state) => state.updateSettings);
    const createSession = useSessionStore((state) => state.createSession);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const handleStartGame = () => {
        const sessionId = createSession(settings);
        navigate(`/game/${sessionId}`);
    };

    const handleOpenSettings = () => {
        setShowSettingsModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4 pt-24">
            <Card className="text-center max-w-lg">
                <Title>Налаштування гри</Title>

                <div className="mb-8">
                    <p className="text-gray-600 text-lg mb-4">
                        {settings.playerOneName} VS {settings.playerTwoName}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Розмір: {settings.gridSize} • Умова: {settings.winCondition} в ряд
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500">Колір дошки:</span>
                        <div className={`w-6 h-6 rounded-full ${
                            settings.boardColor === 'blue' ? 'bg-blue-600' :
                                settings.boardColor === 'green' ? 'bg-green-600' :
                                    'bg-purple-600'
                        }`}></div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-red-500 rounded-full shadow-lg"></div>
                    <span className="text-3xl font-bold text-gray-400">VS</span>
                    <div className="w-16 h-16 bg-yellow-500 rounded-full shadow-lg"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button onClick={handleStartGame} variant="primary">
                        🎮 Почати гру
                    </Button>

                    <Button onClick={handleOpenSettings} variant="secondary">
                        ⚙️ Налаштування
                    </Button>

                    <Button onClick={() => navigate('/sessions')} variant="secondary">
                        📋 Мої сесії
                    </Button>
                </div>
            </Card>

            <SettingsModal
                isOpen={showSettingsModal}
                settings={settings}
                onSave={updateSettings}
                onClose={() => setShowSettingsModal(false)}
            />
        </div>
    );
};

export default StartPage;