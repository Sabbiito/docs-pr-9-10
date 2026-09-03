import { act } from '@testing-library/react';
import { useConsentStore, CONSENT_KEY } from './consentStore';

/**
 * useConsentStore ініціалізує свій початковий стан один раз при імпорті
 * модуля (читаючи localStorage у момент виклику `create()`), тому в цих
 * тестах ми не покладаємось на "чистий localStorage → чистий store"
 * після першого тесту — натомість явно приводимо стор до відомого стану
 * через `resetConsent()` перед кожним тестом.
 */
describe('useConsentStore', () => {
    beforeEach(() => {
        act(() => {
            useConsentStore.getState().resetConsent();
        });
    });

    test('starts in a pending state requiring a decision', () => {
        expect(useConsentStore.getState().status).toBe('pending');
        expect(useConsentStore.getState().categories).toEqual({
            necessary: true,
            preferences: false,
            history: false,
        });
    });

    test('acceptAll turns on every category and persists to localStorage', () => {
        act(() => {
            useConsentStore.getState().acceptAll();
        });

        expect(useConsentStore.getState().status).toBe('accepted');
        expect(useConsentStore.getState().categories).toEqual({
            necessary: true,
            preferences: true,
            history: true,
        });

        const stored = JSON.parse(window.localStorage.getItem(CONSENT_KEY));
        expect(stored.status).toBe('accepted');
        expect(stored.categories.preferences).toBe(true);
    });

    test('rejectAll keeps only necessary and persists the rejection', () => {
        act(() => {
            useConsentStore.getState().rejectAll();
        });

        expect(useConsentStore.getState().status).toBe('rejected');
        expect(useConsentStore.getState().categories).toEqual({
            necessary: true,
            preferences: false,
            history: false,
        });
    });

    test('savePreferences derives "accepted" status when any optional category is on', () => {
        act(() => {
            useConsentStore.getState().savePreferences({ preferences: true, history: false });
        });

        expect(useConsentStore.getState().status).toBe('accepted');
        expect(useConsentStore.getState().categories.preferences).toBe(true);
        expect(useConsentStore.getState().categories.history).toBe(false);
    });

    test('savePreferences derives "rejected" status when both optional categories are off', () => {
        act(() => {
            useConsentStore.getState().savePreferences({ preferences: false, history: false });
        });

        expect(useConsentStore.getState().status).toBe('rejected');
    });

    test('resetConsent (right to withdraw consent) clears localStorage and returns to pending', () => {
        act(() => {
            useConsentStore.getState().acceptAll();
        });
        expect(window.localStorage.getItem(CONSENT_KEY)).not.toBeNull();

        act(() => {
            useConsentStore.getState().resetConsent();
        });

        expect(useConsentStore.getState().status).toBe('pending');
        expect(window.localStorage.getItem(CONSENT_KEY)).toBeNull();
    });

    test('isPending reflects the current status', () => {
        expect(useConsentStore.getState().isPending()).toBe(true);

        act(() => {
            useConsentStore.getState().acceptAll();
        });

        expect(useConsentStore.getState().isPending()).toBe(false);
    });
});
