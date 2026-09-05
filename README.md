# Connect Four (4 в ряд)

Веб-гра «4 в ряд» для двох гравців на одному пристрої: React-застосунок
з локальним збереженням прогресу, історією ігрових сесій та статистикою.

Навчальний проєкт з дисципліни **«Конструювання програмного забезпечення» (КОП)**.

---

## Зміст

- [Стек і вимоги](#стек-і-вимоги)
- [Встановлення та запуск](#встановлення-та-запуск)
- [Конфігурація](#конфігурація)
- [Базові команди](#базові-команди)
- [Структура проєкту](#структура-проєкту)
- [Генерована документація коду](#генерована-документація-коду-jsdoc)
- [Storybook](#storybook)
- [Cookie-банер і GDPR](#cookie-банер-і-gdpr)
- [Серверний API (опційний)](#серверний-api-опційний)
- [Проєктна документація (SSD, BRD)](#проєктна-документація-ssd-brd)
- [Ліцензія](#ліцензія)
- [Політика конфіденційності](#політика-конфіденційності)
- [Тести](#тести)
- [Авторство](#авторство)

---

## Стек і вимоги

- **React 18** + **React Router v7** (клієнтський роутинг, `BrowserRouter`)
- **Zustand 5** — глобальний стан (гра, налаштування, історія сесій, GDPR-згода), з `persist`-middleware для `localStorage`
- **Tailwind CSS 3** — стилізація
- **Create React App** (`react-scripts 5`) — збірка та dev-сервер
- **Node.js ≥ 18**, **npm ≥ 9** (перевірено на Node 22 / npm 10)

Бекенду немає — застосунок повністю клієнтський (client-side only),
усі дані зберігаються локально в браузері користувача.

## Встановлення та запуск

```bash
git clone <GITHUB_REPO_URL>
cd connect-four
npm install
npm start
```

Застосунок відкриється на **http://localhost:3000**.

## Конфігурація

Проєкт не потребує змінних середовища (`.env`) чи зовнішніх API-ключів —
усе працює «з коробки» після `npm install`. Основні конфігураційні файли:

| Файл | Призначення |
|---|---|
| `package.json` → `scripts` | усі команди проєкту (запуск, білд, тести, документація, Storybook) |
| `package.json` → `jest` | `transformIgnorePatterns` / `moduleNameMapper` для коректної роботи `react-router` v7 (ESM-пакет) у тестовому середовищі Jest, що постачається з `react-scripts` |
| `tailwind.config.js` | шляхи сканування класів Tailwind (`src/**/*.{js,jsx}`) |
| `.gitignore` | виключає `node_modules` (у трьох незалежних місцях — див. нижче), `build/`, `.idea/` |

### Три незалежні `node_modules`

Репозиторій має **три ізольовані середовища залежностей**, кожне зі своїм
`package.json` і `node_modules`:

```
connect-four/              ← основний застосунок (react-scripts)
├── docs-tooling/           ← генератор документації (jsdoc + better-docs)
└── storybook-app/          ← Storybook
```

Це навмисне архітектурне рішення: `jsdoc`/`better-docs` та `storybook`
тягнуть власні версії `@babel/core`, `ajv`, `react-scripts`, які
конфліктують із версіями, потрібними основному застосунку, якщо
встановлювати все в один спільний `node_modules`. Ізоляція вирішує це
без ризику зламати `npm run build` чи `npm test` основного застосунку.
Кожна з допоміжних команд (`npm run docs`, `npm run storybook`, …)
самостійно встановлює свої залежності при першому запуску — окремо
`cd docs-tooling && npm install` чи `cd storybook-app && npm install`
виконувати не потрібно.

## Базові команди

Усі команди запускаються з кореня репозиторію.

| Команда | Опис |
|---|---|
| `npm start` | dev-сервер застосунку на `:3000`, гаряче перезавантаження |
| `npm run build` | production-збірка в `build/` |
| `npm test` | запуск тестів (Jest + React Testing Library) |
| `npm run docs` | генерує JSDoc-документацію коду в `docs/` |
| `npm run docs:serve` | піднімає локальний сервер для перегляду `docs/` на `:8080` |
| `npm run storybook` | Storybook у dev-режимі на `:6006` |
| `npm run storybook:build` | статична збірка Storybook у `storybook-app/storybook-static/` |
| `npm run storybook:serve` | локальний сервер для вже зібраного Storybook на `:6006` |

## Структура проєкту

```
src/
├── components/
│   ├── common/       # Button, Card, Title, Navigation, Portal, CookieConsentBanner
│   ├── game/          # GameBoard, GameControls, PlayerInfo, ResultStats
│   └── modals/        # GameOverModal, SettingsModal, SettingsForm
├── hooks/              # useGameLogic, useGameBoard, useWinDetection, useGameStats
├── pages/              # HomePage, StartPage, GamePage, ResultsPage, SessionsPage, PrivacyPage, NotFoundPage
├── router/             # AppRouter — карта всіх маршрутів
└── store/              # gameStore, settingsStore, sessionStore, consentStore (Zustand)

docs/                   # згенерована документація коду (готова, не потребує npm run docs)
docs-tooling/           # генератор документації (ізольований)
docs-video/             # відео-огляд локальної документації
docs-project/           # SSD, BRD — документація проєктного рівня
storybook-app/          # Storybook (ізольований), включно з готовою static-збіркою
server/                 # опційний REST API (Express) + OpenAPI-специфікація + Postman-колекція
```

## Генерована документація коду (JSDoc)

Увесь значущий код — React-хуки, Zustand-стори, ключові компоненти,
роутер — задокументований у форматі **JSDoc**. Документація генерується
інструментом [`jsdoc`](https://jsdoc.app/) з темою
[`better-docs`](https://github.com/SoftwareBrothers/better-docs)
(таблиці параметрів, типів, значень за замовчуванням) і плагіном
`jsdoc-babel` для парсингу сучасного JSX/ESM-синтаксису.

### Перегляд документації локально

Готовий сайт документації вже закомічений у `docs/` — генерувати
заново не обов'язково, достатньо його показати:

```bash
npm run docs:serve
```

Відкриється на **http://localhost:8080**. Головна сторінка (`index.html`)
дає загальний опис проєкту; розділ **Global** у бічній панелі — повний
перелік задокументованих компонентів, хуків і сторів з описами,
таблицями параметрів і типів, посиланнями на вихідний код.

Щоб перегенерувати документацію самостійно (наприклад, після зміни
JSDoc-коментарів у коді):

```bash
npm run docs
```

### Відео-огляд

Оскільки проєкт не викладений на публічний сервер (немає публічного
доступу), короткий відео-огляд того, як запустити й переглянути
документацію та Storybook локально, знаходиться в
[`docs-video/local-docs-walkthrough.mp4`](./docs-video/local-docs-walkthrough.mp4).

## Storybook

Два компоненти застосунку описані в Storybook:

- **`Button`** (базовий) — `src/components/common/Button.stories.jsx`
  Сторі: `Primary`, `AllVariants`, `Disabled`. Властивості `variant`,
  `disabled`, `children` конфігуруються через панель Controls.
- **`GameBoard`** (комплексний) — `src/components/game/GameBoard.stories.jsx`
  Сторі: `EmptyBoard`, `InProgress`, `AlmostFull`. Властивість
  `boardColor` конфігурується через Controls; `board`/`lastMove`
  демонструють реальні ігрові стани (порожня дошка, гра в процесі з
  підсвіченим останнім ходом, майже заповнена дошка).

### Перегляд локально

Готова статична збірка вже закомічена в
`storybook-app/storybook-static/` — щоб просто переглянути:

```bash
npm run storybook:serve
```

Або в dev-режимі (з гарячим перезавантаженням при зміні сторі):

```bash
npm run storybook
```

Обидва варіанти відкриваються на **http://localhost:6006**.

## Cookie-банер і GDPR

При першому відвідуванні застосунок показує банер згоди на
використання `localStorage` (`CookieConsentBanner`, компонент
`src/components/common/CookieConsentBanner.jsx`). Банер пропонує три
дії:

- **Прийняти все** — дозволяє зберігати налаштування гри та історію сесій;
- **Відхилити все** — застосунок працює лише в межах поточного сеансу, без збереження;
- **Налаштувати** — вибірково дозволити категорії «Налаштування гри» та «Історія та статистика» окремо.

Це не лише візуальний елемент: вибір користувача реально впливає на
поведінку застосунку. Категорії, яким не дано згоди, **фізично не
записуються** в `localStorage` — це забезпечує адаптер
`src/store/consentAwareStorage.js`, підключений до `persist`-middleware
відповідних Zustand-сторів (`settingsStore`, `sessionStore`). Логіка
покрита тестами (`src/store/consentAwareStorage.test.js`,
`src/store/consentStore.test.js`).

Свій поточний статус згоди та можливість його відкликати користувач
бачить на сторінці [**«Конфіденційність»**](http://localhost:3000/privacy)
(`/privacy`), доступній з головного меню.

## Серверний API (опційний)

Основний застосунок повністю функціональний без сервера — усі дані за
замовчуванням локальні (`localStorage`). Додатково в `server/`
реалізовано мінімальний REST API для **опційної** синхронізації
статистики завершеної сесії та перегляду загального лідерборду. Синхронізація
завжди ініціюється явним вибором користувача, ніколи автоматично.

### Запуск сервера

```bash
cd server
npm install
npm start
```

Сервер підніметься на **http://localhost:4000**. Інтерактивна
документація (Swagger UI) — на **http://localhost:4000/api-docs**.

### Ендпоінти

| Метод | Шлях | Призначення |
|---|---|---|
| `POST` | `/api/v1/leaderboard/sync` | Синхронізувати статистику сесії (upsert за `sessionId`) |
| `GET` | `/api/v1/leaderboard` | Отримати весь лідерборд, відсортований за перемогами |
| `GET` | `/api/v1/health` | Перевірка стану сервера |

Повний контракт — у [`server/openapi.yaml`](./server/openapi.yaml)
(OpenAPI 3.0.3). Готова колекція запитів для Postman — у
[`server/postman/Connect-Four-Leaderboard-API.postman_collection.json`](./server/postman/Connect-Four-Leaderboard-API.postman_collection.json);
імпортується напряму в Postman і містить автоматизовані перевірки
відповіді для кожного запиту.

### Тести сервера

```bash
cd server
npm test
```

7 тестів (вбудований test runner Node.js + supertest), що покривають
обидва ендпоінти: валідні й невалідні дані, ідемпотентність
синхронізації (upsert), сортування лідерборду.

## Проєктна документація (SSD, BRD)

У папці [`docs-project/`](./docs-project) — два документи проєктного
рівня, що доповнюють технічну документацію коду (розділ вище):

- [**System Specification Document**](./docs-project/System-Specification-Document.md) — архітектура системи, функціональні й нефункціональні вимоги, модель даних, специфікація зовнішніх інтерфейсів, трасування вимог до реалізації.
- [**Business Requirements Document**](./docs-project/Business-Requirements-Document.md) — бізнес-контекст, цілі, зацікавлені сторони, бізнес-вимоги та бізнес-правила, критерії успіху, межі проєкту.

## Ліцензія

Проєкт розповсюджується за ліцензією **MIT** — див. [`LICENSE`](./LICENSE).

Ліцензійна сумісність усіх (1240) прямих та транзитивних залежностей
перевірена інструментом
[`license-checker`](https://www.npmjs.com/package/license-checker):

- [`LICENSE-REPORT.md`](./LICENSE-REPORT.md) — читабельний звіт: методологія, зведення по ліцензіях, пояснення особливих випадків, висновок про відсутність конфліктів з copyleft-ліцензіями (GPL/AGPL/LGPL);
- [`license-report-full.txt`](./license-report-full.txt) — повний «сирий» вивід інструмента (дерево всіх пакетів).

## Політика конфіденційності

Повний текст політики конфіденційності та ліцензійної угоди
користувача (EULA) — у [`PRIVACY_POLICY.md`](./PRIVACY_POLICY.md).
Документ описує:

- які дані застосунок обробляє і де саме вони зберігаються (виключно `localStorage`, без передачі на будь-який сервер — бекенду в застосунку немає);
- правові підстави обробки за GDPR (ст. 6);
- права користувача (доступ, видалення, перенесення даних — ст. 15, 17, 20 GDPR) і те, як вони реалізовані технічно в цьому конкретному застосунку;
- обмеження використання та відмову від відповідальності.

Скорочена версія з поточним статусом згоди доступна прямо в
застосунку на сторінці `/privacy`.

## Тести

```bash
npm test -- --watchAll=false
```

16 тестів (Jest + React Testing Library), зокрема:

- `src/App.test.js` — базовий рендер застосунку, навігація, поява GDPR-банера;
- `src/store/consentStore.test.js` — стани згоди (прийняти/відхилити/вибіркові налаштування/відкликання);
- `src/store/consentAwareStorage.test.js` — підтвердження, що відхилена категорія згоди реально блокує запис у `localStorage`, а не лише приховує UI.

## Авторство

**Максим Христюк**, ІПЗ-23-2

Репозиторій: `https://github.com/Sabbiito/docs-pr-9-10.git`

