# Connect Four — Leaderboard API

Мінімальний REST API для опційної синхронізації статистики локальних
ігрових сесій Connect Four та перегляду загального лідерборду.

Це доповнення до основного клієнтського застосунку, не заміна: сама
гра повністю функціональна без цього сервера (усі дані за замовчуванням
зберігаються локально в браузері, `localStorage`). Синхронізація сюди —
явна, добровільна дія користувача.

## Запуск

```bash
npm install
npm start
```

Сервер підніметься на **http://localhost:4000**.

- Swagger UI (інтерактивна документація): **http://localhost:4000/api-docs**
- Health check: `GET http://localhost:4000/api/v1/health`

## Ендпоінти

| Метод | Шлях | Опис |
|---|---|---|
| `POST` | `/api/v1/leaderboard/sync` | Синхронізувати статистику сесії (upsert за `sessionId`) |
| `GET` | `/api/v1/leaderboard` | Отримати весь лідерборд, відсортований за перемогами |

Повний контракт з описом схем запиту/відповіді, кодів помилок і
прикладів — у [`openapi.yaml`](./openapi.yaml).

### Приклад запиту

```bash
curl -X POST http://localhost:4000/api/v1/leaderboard/sync \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1755000000000",
    "playerOneName": "Олег",
    "playerTwoName": "Ірина",
    "stats": { "player1Wins": 3, "player2Wins": 1, "draws": 1, "totalGames": 5 }
  }'
```

## Postman

Готова колекція — [`postman/Connect-Four-Leaderboard-API.postman_collection.json`](./postman/Connect-Four-Leaderboard-API.postman_collection.json).
Імпортуй її напряму в Postman (File → Import); містить 4 запити з
автоматизованими перевірками відповіді (health check, валідна
синхронізація, невалідна синхронізація з очікуваним 400, отримання
лідерборду). Перевірено прогоном через `newman` — усі 10 асертів
проходять без помилок проти живого сервера.

Щоб прогнати колекцію без відкриття Postman:

```bash
npx newman run postman/Connect-Four-Leaderboard-API.postman_collection.json
```

(Сервер має бути запущений окремо, `npm start`, перед цим.)

## Тести

```bash
npm test
```

7 тестів на вбудованому test runner Node.js із `supertest`: валідація
обов'язкових полів, узгодженість лічильників статистики,
ідемпотентність синхронізації (upsert за `sessionId`, не дублікат),
сортування лідерборду за сумою перемог, health check.

## Обмеження реалізації

Сховище лідерборду — in-memory (`src/data/leaderboardStore.js`), дані
не переживають перезапуск процесу. Це свідоме спрощення для
демонстраційного/навчального призначення сервера; заміна на
персистентну БД не вимагає зміни контракту API — інтерфейс сховища
відокремлений від маршрутів. Детальніше — у `docs-project/System-Specification-Document.md`, розділ «Нефункціональні вимоги».
