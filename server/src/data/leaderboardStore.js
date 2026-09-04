/**
 * Мінімальне in-memory сховище лідерборду.
 *
 * Навмисне спрощення для навчального проєкту: дані живуть лише в
 * пам'яті процесу і зникають при перезапуску сервера. Для production
 * використання це має бути замінено на реальну БД (наприклад,
 * PostgreSQL чи SQLite) — структура таблиці нижче спроєктована так,
 * щоб заміна сховища не вимагала зміни контракту API (див. SSD,
 * розділ «Нефункціональні вимоги», обмеження щодо персистентності).
 *
 * @typedef {Object} LeaderboardEntry
 * @property {string} sessionId — id сесії з клієнтського sessionStore.js.
 * @property {string} playerOneName
 * @property {string} playerTwoName
 * @property {{player1Wins: number, player2Wins: number, draws: number, totalGames: number}} stats
 * @property {string} syncedAt — ISO 8601, момент синхронізації з клієнтом.
 */

/** @type {Map<string, LeaderboardEntry>} sessionId → запис лідерборду */
const entries = new Map();

module.exports = {
    /** Додає або оновлює запис лідерборду для сесії (upsert за sessionId). */
    upsert(entry) {
        entries.set(entry.sessionId, entry);
        return entry;
    },

    /** Повертає всі записи, відсортовані за сумарною кількістю перемог обох гравців (спадання). */
    getAll() {
        return Array.from(entries.values()).sort((a, b) => {
            const totalA = a.stats.player1Wins + a.stats.player2Wins;
            const totalB = b.stats.player1Wins + b.stats.player2Wins;
            return totalB - totalA;
        });
    },

    /** Лише для тестів: очищає сховище до початкового стану. */
    _reset() {
        entries.clear();
    }
};
