import { create } from 'zustand';

/**
 * Ключ, під яким рішення користувача про згоду зберігається в localStorage.
 * Це єдине значення, яке Застосунок дозволяє собі зберегти ще ДО отримання
 * згоди — технічно необхідно, щоб не показувати банер повторно щоразу.
 */
export const CONSENT_KEY = 'connect-four-cookie-consent';

const readStoredConsent = () => {
    try {
        const raw = window.localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

/**
 * Стор згоди на використання локального сховища (GDPR-банер).
 *
 * Категорії згоди відповідають розділу 5 PRIVACY_POLICY.md:
 * - necessary   — сам прапорець згоди; завжди true, вимкнути не можна.
 * - preferences — налаштування гри (імена гравців, розмір дошки, колір).
 * - history     — історія ігрових сесій та статистика.
 *
 * Якщо користувач ще не приймав рішення, `status` дорівнює 'pending' і
 * банер повинен бути показаний.
 */
export const useConsentStore = create((set, get) => {
    const stored = readStoredConsent();

    const persist = (status, categories) => {
        try {
            window.localStorage.setItem(
                CONSENT_KEY,
                JSON.stringify({ status, categories, decidedAt: new Date().toISOString() })
            );
        } catch {
            // localStorage може бути недоступний (приватний режим тощо) —
            // у такому разі згода діє лише в межах поточного сеансу.
        }
    };

    return {
        status: stored?.status ?? 'pending', // 'pending' | 'accepted' | 'rejected'
        categories: stored?.categories ?? {
            necessary: true,
            preferences: false,
            history: false,
        },

        acceptAll: () => {
            const categories = { necessary: true, preferences: true, history: true };
            persist('accepted', categories);
            set({ status: 'accepted', categories });
        },

        rejectAll: () => {
            const categories = { necessary: true, preferences: false, history: false };
            persist('rejected', categories);
            set({ status: 'rejected', categories });
        },

        savePreferences: (categories) => {
            const merged = { necessary: true, ...categories };
            const status = merged.preferences || merged.history ? 'accepted' : 'rejected';
            persist(status, merged);
            set({ status, categories: merged });
        },

        /** Дозволяє користувачу будь-коли відкликати згоду (ст. 7(3) GDPR). */
        resetConsent: () => {
            try {
                window.localStorage.removeItem(CONSENT_KEY);
            } catch {
                // ignore
            }
            set({
                status: 'pending',
                categories: { necessary: true, preferences: false, history: false },
            });
        },

        isPending: () => get().status === 'pending',
    };
});
