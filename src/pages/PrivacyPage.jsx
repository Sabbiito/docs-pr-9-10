import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Title from '../components/common/Title';
import Button from '../components/common/Button';
import { useConsentStore } from '../store/consentStore';

/**
 * Сторінка `/privacy` — короткий виклад політики конфіденційності,
 * поточний статус GDPR-згоди користувача (з `useConsentStore`) та
 * посилання на повний текст `PRIVACY_POLICY.md`.
 *
 * Кнопка "Змінити рішення" викликає `resetConsent()`, що реалізує право
 * на відкликання згоди (ст. 7(3) GDPR) — після цього `CookieConsentBanner`
 * знову з'явиться при наступному рендері застосунку.
 */
const PrivacyPage = () => {
    const status = useConsentStore((state) => state.status);
    const categories = useConsentStore((state) => state.categories);
    const resetConsent = useConsentStore((state) => state.resetConsent);

    const statusLabel = {
        pending: 'Ще не вирішено',
        accepted: 'Прийнято',
        rejected: 'Відхилено',
    }[status];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center p-4 pt-24">
            <Card className="max-w-2xl w-full">
                <Title size="medium">🔒 Політика конфіденційності</Title>

                <p className="text-gray-600 mb-6">
                    Connect Four — клієнтський застосунок без сервера. Усі дані (імена
                    гравців, налаштування, історія ігор) зберігаються лише локально у
                    вашому браузері й ніколи нікуди не передаються.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="font-semibold text-gray-800 mb-2">
                        Ваш поточний вибір щодо локального сховища:{' '}
                        <span className="font-normal">{statusLabel}</span>
                    </p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Необхідні: завжди активні</li>
                        <li>Налаштування гри: {categories.preferences ? 'дозволено' : 'заборонено'}</li>
                        <li>Історія та статистика: {categories.history ? 'дозволено' : 'заборонено'}</li>
                    </ul>
                    <button
                        type="button"
                        onClick={resetConsent}
                        className="mt-3 text-sm text-blue-600 underline hover:text-blue-800"
                    >
                        Змінити рішення (відкликати згоду)
                    </button>
                </div>

                <p className="text-gray-600 mb-6">
                    Повний текст політики конфіденційності та ліцензійної угоди
                    користувача (EULA), включно з переліком усіх категорій даних,
                    правовими підставами обробки за GDPR та правами користувача,
                    доступний у файлі{' '}
                    <a
                        href="/PRIVACY_POLICY.md"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        PRIVACY_POLICY.md
                    </a>{' '}
                    у корені репозиторію проєкту.
                </p>

                <Link to="/">
                    <Button variant="primary">🏠 На головну</Button>
                </Link>
            </Card>
        </div>
    );
};

export default PrivacyPage;
