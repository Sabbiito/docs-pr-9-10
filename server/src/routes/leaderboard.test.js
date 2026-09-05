const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const createApp = require('../app');
const leaderboardStore = require('../data/leaderboardStore');

const validPayload = {
    sessionId: 'session_1234567890',
    playerOneName: 'Олег',
    playerTwoName: 'Ірина',
    stats: {
        player1Wins: 3,
        player2Wins: 1,
        draws: 1,
        totalGames: 5
    }
};

test('POST /api/v1/leaderboard/sync — приймає валідний payload і повертає 200', async () => {
    leaderboardStore._reset();
    const app = createApp();

    const response = await request(app)
        .post('/api/v1/leaderboard/sync')
        .send(validPayload);

    assert.equal(response.status, 200);
    assert.equal(response.body.synced, true);
    assert.equal(response.body.entry.sessionId, validPayload.sessionId);
});

test('POST /api/v1/leaderboard/sync — 400 при некоректному stats.totalGames', async () => {
    leaderboardStore._reset();
    const app = createApp();

    const response = await request(app)
        .post('/api/v1/leaderboard/sync')
        .send({ ...validPayload, stats: { ...validPayload.stats, totalGames: 999 } });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, 'ValidationError');
});

test('POST /api/v1/leaderboard/sync — 400 при відсутньому playerOneName', async () => {
    leaderboardStore._reset();
    const app = createApp();

    const { playerOneName, ...withoutName } = validPayload;
    const response = await request(app)
        .post('/api/v1/leaderboard/sync')
        .send(withoutName);

    assert.equal(response.status, 400);
    assert.ok(response.body.details.some((d) => d.includes('playerOneName')));
});

test('POST /api/v1/leaderboard/sync — повторний виклик з тим самим sessionId оновлює запис (upsert), не дублює', async () => {
    leaderboardStore._reset();
    const app = createApp();

    await request(app).post('/api/v1/leaderboard/sync').send(validPayload);
    await request(app)
        .post('/api/v1/leaderboard/sync')
        .send({ ...validPayload, stats: { ...validPayload.stats, player1Wins: 10, totalGames: 12 } });

    const listResponse = await request(app).get('/api/v1/leaderboard');
    assert.equal(listResponse.body.entries.length, 1);
    assert.equal(listResponse.body.entries[0].stats.player1Wins, 10);
});

test('GET /api/v1/leaderboard — повертає порожній список, коли немає синхронізованих сесій', async () => {
    leaderboardStore._reset();
    const app = createApp();

    const response = await request(app).get('/api/v1/leaderboard');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.entries, []);
});

test('GET /api/v1/leaderboard — сортує записи за сумою перемог, спадання', async () => {
    leaderboardStore._reset();
    const app = createApp();

    await request(app)
        .post('/api/v1/leaderboard/sync')
        .send({ ...validPayload, sessionId: 'session_low', stats: { player1Wins: 1, player2Wins: 0, draws: 0, totalGames: 1 } });
    await request(app)
        .post('/api/v1/leaderboard/sync')
        .send({ ...validPayload, sessionId: 'session_high', stats: { player1Wins: 8, player2Wins: 2, draws: 0, totalGames: 10 } });

    const response = await request(app).get('/api/v1/leaderboard');

    assert.equal(response.body.entries[0].sessionId, 'session_high');
    assert.equal(response.body.entries[1].sessionId, 'session_low');
});

test('GET /api/v1/health — повертає status ok', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/health');

    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'ok');
});
