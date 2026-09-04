const express = require('express');
const leaderboardStore = require('../data/leaderboardStore');

const router = express.Router();

/**
 * Перевіряє форму об'єкта `stats`, який приходить із клієнтського
 * `sessionStore.js` (див. `GameSession.stats` у src/store/sessionStore.js).
 * Повертає масив текстів помилок; порожній масив означає валідність.
 */
function validateStats(stats) {
    const errors = [];
    if (typeof stats !== 'object' || stats === null) {
        return ['stats має бути об\'єктом'];
    }
    for (const field of ['player1Wins', 'player2Wins', 'draws', 'totalGames']) {
        const value = stats[field];
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
            errors.push(`stats.${field} має бути цілим невід'ємним числом`);
        }
    }
    if (errors.length === 0) {
        const sum = stats.player1Wins + stats.player2Wins + stats.draws;
        if (sum !== stats.totalGames) {
            errors.push('stats.totalGames має дорівнювати сумі player1Wins + player2Wins + draws');
        }
    }
    return errors;
}

/**
 * POST /api/v1/leaderboard/sync
 *
 * Синхронізує підсумкову статистику однієї локальної ігрової сесії
 * (клієнтський GameSession) із серверним лідербордом. Ендпоінт
 * ідемпотентний за sessionId: повторний виклик з тим самим sessionId
 * оновлює вже наявний запис (upsert), а не створює дублікат.
 *
 * Це єдина дія, що передає дані на сервер, і вона ЗАВЖДИ ініціюється
 * явним вибором користувача в інтерфейсі (кнопка «Синхронізувати»),
 * ніколи автоматично — узгоджено з принципом мінімізації даних
 * PRIVACY_POLICY.md.
 */
router.post('/sync', (req, res) => {
    const { sessionId, playerOneName, playerTwoName, stats } = req.body ?? {};

    const errors = [];
    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
        errors.push('sessionId є обов\'язковим рядком');
    }
    if (typeof playerOneName !== 'string' || playerOneName.trim() === '') {
        errors.push('playerOneName є обов\'язковим рядком');
    }
    if (typeof playerTwoName !== 'string' || playerTwoName.trim() === '') {
        errors.push('playerTwoName є обов\'язковим рядком');
    }
    errors.push(...validateStats(stats));

    if (errors.length > 0) {
        return res.status(400).json({ error: 'ValidationError', details: errors });
    }

    const entry = leaderboardStore.upsert({
        sessionId,
        playerOneName,
        playerTwoName,
        stats,
        syncedAt: new Date().toISOString()
    });

    return res.status(200).json({ synced: true, entry });
});

/**
 * GET /api/v1/leaderboard
 *
 * Повертає всі синхронізовані записи лідерборду, відсортовані за
 * сумарною кількістю перемог (спадання). Публічний ендпоінт без
 * авторизації — відповідає принципу «нічого, крім явно синхронізованої
 * статистики матчів, тут не зберігається і не публікується» (жодних
 * персональних даних понад ім'я гравця, яке саме по собі є довільним
 * ігровим псевдонімом, а не ідентифікатором особи).
 */
router.get('/', (_req, res) => {
    res.status(200).json({ entries: leaderboardStore.getAll() });
});

module.exports = router;
