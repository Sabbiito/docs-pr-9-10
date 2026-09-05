const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');
const leaderboardRouter = require('./routes/leaderboard');

const openapiDocument = YAML.parse(
    fs.readFileSync(path.join(__dirname, '..', 'openapi.yaml'), 'utf8')
);

/**
 * Створює й повертає налаштований Express-застосунок (без виклику
 * `listen` — це дозволяє окремо тестувати app через supertest без
 * реального відкриття мережевого порту, і окремо запускати його в
 * index.js).
 */
function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '100kb' }));

    // Обмеження частоти запитів — базовий захист від зловживання
    // публічним ендпоінтом синхронізації. Значення підібрані для
    // навчального/демонстраційного навантаження, не для продакшн-масштабу.
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 100,
            standardHeaders: true,
            legacyHeaders: false
        })
    );

    app.get('/api/v1/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

    app.use('/api/v1/leaderboard', leaderboardRouter);

    // Уніфікований обробник помилок JSON-парсингу (express.json кидає
    // SyntaxError при невалідному тілі запиту) — без цього клієнт
    // отримав би сирий HTML-стек Express замість JSON-помилки.
    app.use((err, _req, res, next) => {
        if (err.type === 'entity.parse.failed') {
            return res.status(400).json({ error: 'ValidationError', details: ['Тіло запиту має бути валідним JSON'] });
        }
        return next(err);
    });

    app.use((_req, res) => {
        res.status(404).json({ error: 'NotFound' });
    });

    return app;
}

module.exports = createApp;
