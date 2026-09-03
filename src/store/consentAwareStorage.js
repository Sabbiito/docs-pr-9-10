import { CONSENT_KEY } from './consentStore';

/**
 * Storage-адаптер для zustand `persist`, що поважає вибір користувача
 * в GDPR cookie-банері (див. `consentStore.js` та `CookieConsentBanner.jsx`).
 *
 * Читає поточний стан згоди напряму з localStorage (а не з consentStore),
 * щоб уникнути циклічної залежності між сторами й лишатись максимально
 * простим — це лише "воротар" перед фізичним записом/читанням.
 *
 * Якщо потрібна категорія не дозволена користувачем:
 * - `setItem` перетворюється на no-op — жоден новий запис не потрапляє
 *   в localStorage;
 * - `getItem` повертає null — стор ініціалізується значеннями за
 *   замовчуванням, ніби збереження ще не було.
 *
 * Це забезпечує, що вибір "Відхилити все" в банері реально впливає на
 * поведінку застосунку, а не є лише візуальним елементом.
 */
const readConsentCategories = () => {
    try {
        const raw = window.localStorage.getItem(CONSENT_KEY);
        if (!raw) return { necessary: true, preferences: false, history: false };
        const parsed = JSON.parse(raw);
        return parsed.categories ?? { necessary: true, preferences: false, history: false };
    } catch {
        return { necessary: true, preferences: false, history: false };
    }
};

/**
 * @param {'preferences' | 'history'} category — яку категорію згоди
 *   перевіряти перед кожною операцією читання/запису.
 */
export const createConsentAwareStorage = (category) => ({
    getItem: (key) => {
        const categories = readConsentCategories();
        if (!categories[category]) return null;
        try {
            return window.localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem: (key, value) => {
        const categories = readConsentCategories();
        if (!categories[category]) return;
        try {
            window.localStorage.setItem(key, value);
        } catch {
            // localStorage недоступний (приватний режим, квота тощо) —
            // застосунок продовжує працювати лише в пам'яті.
        }
    },
    removeItem: (key) => {
        try {
            window.localStorage.removeItem(key);
        } catch {
            // ignore
        }
    },
});
