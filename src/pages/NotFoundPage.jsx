import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Title from '../components/common/Title';
import Button from '../components/common/Button';

/**
 * Сторінка 404 (`/404` та fallback-маршрут `*` у роутері), а також
 * ціль редіректу для неіснуючих ігрових/результатних сесій.
 */
const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center p-4">
            <Card className="text-center max-w-md">
                <div className="text-8xl mb-4">😕</div>
                <Title size="medium">404</Title>
                <p className="text-gray-600 text-lg mb-6">
                    Сторінку не знайдено
                </p>
                <p className="text-gray-500 mb-8">
                    Можливо, ви перейшли за неправильним посиланням або сторінка була видалена.
                </p>
                <Link to="/">
                    <Button variant="primary">🏠 На головну</Button>
                </Link>
            </Card>
        </div>
    );
};

export default NotFoundPage;