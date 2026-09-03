import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createConsentAwareStorage } from './consentAwareStorage';

const SETTINGS_KEY = 'connect-four-settings';

const DEFAULT_SETTINGS = {
    playerOneName: 'Гравець 1',
    playerTwoName: 'Гравець 2',
    gridSize: '6x7',
    winCondition: 4,
    boardColor: 'blue'
};

/**
 * Стор налаштувань гри (імена гравців, розмір дошки, умова перемоги,
 * колір дошки), персистентний через `localStorage` за ключем
 * `connect-four-settings`.
 *
 * Запис і читання проходять через `createConsentAwareStorage('preferences')`
 * (див. `consentAwareStorage.js`) — якщо користувач не дав згоду на
 * категорію "Налаштування гри" в GDPR cookie-банері, дані фізично НЕ
 * потрапляють у `localStorage`, і стор щоразу ініціалізується
 * `DEFAULT_SETTINGS`. Див. розділ 2.1 `PRIVACY_POLICY.md`.
 */
export const useSettingsStore = create(
    persist(
        (set, get) => ({
            settings: DEFAULT_SETTINGS,

            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),

            resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

            /** Перетворює рядковий код розміру дошки (напр. `'6x7'`) на `{ rows, cols }`. */
            getBoardDimensions: () => {
                const sizes = {
                    '6x7': { rows: 6, cols: 7 },
                    '7x8': { rows: 7, cols: 8 },
                    '8x9': { rows: 8, cols: 9 }
                };
                return sizes[get().settings.gridSize] || sizes['6x7'];
            }
        }),
        {
            name: SETTINGS_KEY,
            storage: createJSONStorage(() => createConsentAwareStorage('preferences'))
        }
    )
);