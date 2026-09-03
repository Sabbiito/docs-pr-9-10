import { createConsentAwareStorage } from './consentAwareStorage';
import { CONSENT_KEY } from './consentStore';

/**
 * Ці тести перевіряють, що вибір користувача в GDPR-банері
 * (`CookieConsentBanner.jsx`) реально впливає на фізичний запис/читання
 * `localStorage`, а не є лише візуальним елементом. Див. пояснення в
 * `consentAwareStorage.js` та розділ 5 `PRIVACY_POLICY.md`.
 */
describe('createConsentAwareStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    const setConsent = (categories) => {
        window.localStorage.setItem(
            CONSENT_KEY,
            JSON.stringify({ status: 'accepted', categories, decidedAt: new Date().toISOString() })
        );
    };

    test('does not write to localStorage when the category is not allowed', () => {
        setConsent({ necessary: true, preferences: false, history: false });
        const storage = createConsentAwareStorage('preferences');

        storage.setItem('connect-four-settings', JSON.stringify({ boardColor: 'green' }));

        // Ключ не мав з'явитися взагалі — перевіряємо напряму через сирий localStorage,
        // а не лише через getItem цього ж адаптера, щоб виключити хибно-позитивний результат.
        expect(window.localStorage.getItem('connect-four-settings')).toBeNull();
    });

    test('writes to localStorage when the category is allowed', () => {
        setConsent({ necessary: true, preferences: true, history: false });
        const storage = createConsentAwareStorage('preferences');

        storage.setItem('connect-four-settings', JSON.stringify({ boardColor: 'green' }));

        expect(window.localStorage.getItem('connect-four-settings')).toBe(
            JSON.stringify({ boardColor: 'green' })
        );
    });

    test('getItem returns null for a disallowed category even if data exists', () => {
        // Дані були записані раніше (наприклад, до відкликання згоди),
        // але з відкликаною згодою стор не повинен їх повертати.
        window.localStorage.setItem('connect-four-sessions', JSON.stringify({ foo: 'bar' }));
        setConsent({ necessary: true, preferences: false, history: false });

        const storage = createConsentAwareStorage('history');

        expect(storage.getItem('connect-four-sessions')).toBeNull();
    });

    test('categories are independent of each other', () => {
        setConsent({ necessary: true, preferences: true, history: false });

        const preferencesStorage = createConsentAwareStorage('preferences');
        const historyStorage = createConsentAwareStorage('history');

        preferencesStorage.setItem('connect-four-settings', 'ok');
        historyStorage.setItem('connect-four-sessions', 'blocked');

        expect(window.localStorage.getItem('connect-four-settings')).toBe('ok');
        expect(window.localStorage.getItem('connect-four-sessions')).toBeNull();
    });

    test('defaults to blocking when no consent decision exists yet', () => {
        // Жодного запису під CONSENT_KEY немає — це стан "банер ще не показаний
        // або рішення ще не прийнято". Дані все одно не повинні писатись.
        const storage = createConsentAwareStorage('preferences');

        storage.setItem('connect-four-settings', 'should-not-persist');

        expect(window.localStorage.getItem('connect-four-settings')).toBeNull();
    });

    test('removeItem always works regardless of consent (right to erasure)', () => {
        setConsent({ necessary: true, preferences: true, history: false });
        window.localStorage.setItem('connect-four-settings', 'some-value');

        const storage = createConsentAwareStorage('preferences');
        storage.removeItem('connect-four-settings');

        expect(window.localStorage.getItem('connect-four-settings')).toBeNull();
    });
});
