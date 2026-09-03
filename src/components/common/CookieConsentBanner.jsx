import React, { useState } from 'react';
import { useConsentStore } from '../../store/consentStore';
import Portal from './Portal';
import Button from './Button';

/**
 * Банер згоди на використання локального сховища (`localStorage`)
 * відповідно до GDPR (ст. 6(1)(a) — згода користувача).
 *
 * Застосунок не використовує серверні cookies (немає бекенду), тому
 * йдеться саме про локальне сховище браузера — але з погляду GDPR це
 * та сама категорія "зберігання інформації на пристрої користувача"
 * (ePrivacy Directive, ст. 5(3)), яка потребує явної згоди.
 *
 * Банер показується лише поки `status === 'pending'` і дозволяє:
 * - прийняти все;
 * - відхилити все (окрім технічно необхідного);
 * - розгорнути детальні налаштування по категоріях і зберегти вибірково.
 *
 * Категорії відповідають розділу 2.1 PRIVACY_POLICY.md.
 */
const CATEGORY_INFO = [
    {
        key: 'necessary',
        title: 'Необхідні',
        locked: true,
        description:
            'Технічно обов\'язкове збереження самого факту вашого рішення щодо згоди, ' +
            'щоб не показувати цей банер повторно при кожному відвідуванні. Вимкнути неможливо.',
    },
    {
        key: 'preferences',
        title: 'Налаштування гри',
        locked: false,
        description:
            'Імена гравців, розмір ігрової дошки, умова перемоги та колір дошки. ' +
            'Дозволяє не вводити ці дані заново при кожному візиті.',
    },
    {
        key: 'history',
        title: 'Історія та статистика',
        locked: false,
        description:
            'Список ігрових сесій, кількість перемог/нічиїх та дати ігор. ' +
            'Дозволяє переглядати результати попередніх ігор на сторінці "Сесії".',
    },
];

const CookieConsentBanner = () => {
    const status = useConsentStore((state) => state.status);
    const categories = useConsentStore((state) => state.categories);
    const acceptAll = useConsentStore((state) => state.acceptAll);
    const rejectAll = useConsentStore((state) => state.rejectAll);
    const savePreferences = useConsentStore((state) => state.savePreferences);

    const [expanded, setExpanded] = useState(false);
    const [draft, setDraft] = useState(categories);

    if (status !== 'pending') {
        return null;
    }

    const toggleDraft = (key) => {
        if (key === 'necessary') return;
        setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Portal>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cookie-consent-title"
                className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 flex justify-center"
            >
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
                    <h2 id="cookie-consent-title" className="text-lg font-bold text-gray-900 mb-2">
                        🍪 Ми використовуємо локальне сховище браузера
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Connect Four зберігає деякі дані (імена гравців, налаштування, історію ігор)
                        локально у вашому браузері (<code className="bg-gray-100 px-1 rounded">localStorage</code>).
                        Ці дані ніколи не передаються на сервер. Детальніше — у{' '}
                        <a href="/privacy" className="text-blue-600 underline hover:text-blue-800">
                            Політиці конфіденційності
                        </a>.
                    </p>

                    {expanded && (
                        <div className="mb-4 space-y-3 border-t border-gray-200 pt-4">
                            {CATEGORY_INFO.map((cat) => (
                                <div key={cat.key} className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id={`consent-${cat.key}`}
                                        checked={draft[cat.key]}
                                        disabled={cat.locked}
                                        onChange={() => toggleDraft(cat.key)}
                                        className="mt-1 h-4 w-4 disabled:opacity-60"
                                    />
                                    <label htmlFor={`consent-${cat.key}`} className="text-sm">
                                        <span className="font-semibold text-gray-800">
                                            {cat.title}
                                            {cat.locked && (
                                                <span className="ml-2 text-xs font-normal text-gray-400">
                                                    (завжди активні)
                                                </span>
                                            )}
                                        </span>
                                        <p className="text-gray-500">{cat.description}</p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 justify-end">
                        {!expanded && (
                            <button
                                type="button"
                                onClick={() => setExpanded(true)}
                                className="mr-auto text-sm text-blue-600 underline hover:text-blue-800"
                            >
                                Налаштувати
                            </button>
                        )}

                        {expanded ? (
                            <Button variant="success" onClick={() => savePreferences(draft)}>
                                Зберегти вибір
                            </Button>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={rejectAll}>
                                    Відхилити все
                                </Button>
                                <Button variant="success" onClick={acceptAll}>
                                    Прийняти все
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default CookieConsentBanner;
