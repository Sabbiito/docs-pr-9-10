import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Title from '../components/common/Title';
import Button from '../components/common/Button';

/** Головна сторінка (`/`) — вітальний екран з описом гри та переходами до `/start` і `/sessions`. */
const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <Card className="text-center max-w-2xl">
                <Title>Вітаємо в грі "Чотири в ряд"! 🎮</Title>

                <p className="text-gray-600 text-lg mb-8">
                    Класична стратегічна гра для двох гравців.
                    Складіть лінію з чотирьох фішок для перемоги!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="text-4xl mb-3">🎯</div>
                        <h3 className="font-bold text-lg mb-2">Проста мета</h3>
                        <p className="text-gray-600 text-sm">
                            Складіть 4 фішки в ряд: горизонтально, вертикально або діагонально
                        </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                        <div className="text-4xl mb-3">⚙️</div>
                        <h3 className="font-bold text-lg mb-2">Налаштування</h3>
                        <p className="text-gray-600 text-sm">
                            Різні розміри дошки, умови перемоги та кольори
                        </p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                        <div className="text-4xl mb-3">💾</div>
                        <h3 className="font-bold text-lg mb-2">Збереження</h3>
                        <p className="text-gray-600 text-sm">
                            Всі ваші ігрові сесії зберігаються автоматично
                        </p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                        <div className="text-4xl mb-3">📊</div>
                        <h3 className="font-bold text-lg mb-2">Статистика</h3>
                        <p className="text-gray-600 text-sm">
                            Відстежуйте перемоги та нічиї для кожної сесії
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/start')} variant="primary">
                        🎮 Почати нову гру
                    </Button>
                    <Button onClick={() => navigate('/sessions')} variant="secondary">
                        📋 Переглянути сесії
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default HomePage;