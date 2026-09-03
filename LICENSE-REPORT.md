# Звіт про перевірку ліцензій (License Report)

Цей звіт згенеровано інструментом [`license-checker`](https://www.npmjs.com/package/license-checker)
(версія `25.0.1`) для перевірки ліцензійної сумісності всіх прямих та транзитивних
залежностей проєкту **Connect Four** з обраною ліцензією проєкту — **MIT**.

## Як відтворити звіт

```bash
npm install
npx license-checker --summary
npx license-checker --relativeLicensePath --out license-report-full.txt
```

Повний "сирий" вивід інструменту (дерево всіх пакетів з ліцензіями, репозиторіями
та шляхами до файлів ліцензій) закомічено поруч у файлі
[`license-report-full.txt`](./license-report-full.txt).

## Зведення

Загальна кількість перевірених пакетів (прямі + транзитивні залежності,
включно з `devDependencies`): **1240**.

| Ліцензія | Кількість пакетів | Тип |
|---|---|---|
| MIT | 1039 | Permissive |
| ISC | 54 | Permissive |
| CC0-1.0 | 42 | Public domain |
| BSD-2-Clause | 37 | Permissive |
| Apache-2.0 | 28 | Permissive |
| BSD-3-Clause | 26 | Permissive |
| (MIT OR CC0-1.0) | 3 | Permissive (вибір) |
| Unlicense | 2 | Public domain |
| 0BSD | 2 | Permissive |
| Python-2.0 | 1 | Permissive |
| MPL-2.0 | 1 | Weak copyleft (файловий рівень) |
| CC-BY-4.0 | 1 | Permissive (потребує атрибуції) |
| BSD | 1 | Permissive |
| (Apache-2.0 OR MPL-1.1) | 1 | Permissive (вибір) |
| (AFL-2.1 OR BSD-3-Clause) | 1 | Permissive (вибір) |
| (BSD-3-Clause OR GPL-2.0) | 1 | Permissive (вибір) |
| UNLICENSED | 1 | Сам пакет проєкту, див. нижче |

## Особливі випадки

- **`connect-four@0.1.0` (сам проєкт) → `UNLICENSED`.**
  `license-checker` за замовчуванням позначає приватні пакети (`"private": true`
  у `package.json`) як `UNLICENSED`, незалежно від значення поля `"license"` —
  це конвенція npm для пакетів, що не призначені для публікації в реєстрі.
  Фактична ліцензія проєкту — **MIT**, що підтверджується:
  - полем `"license": "MIT"` у [`package.json`](./package.json);
  - файлом [`LICENSE`](./LICENSE) у корені репозиторію;
  - самим інструментом `license-checker`, який коректно знаходить
    `licenseFile: LICENSE` для цього пакета в повному звіті.

- **`axe-core@4.11.0` → `MPL-2.0`.**
  Транзитивна dev-залежність (приходить через `react-scripts` /
  `react-dev-utils`, використовується лише для accessibility-перевірок під
  час розробки). Не потрапляє у production-збірку (`npm run build`) і не
  розповсюджується разом із застосунком. MPL-2.0 — weak copyleft на рівні
  окремих файлів бібліотеки, тому навіть у разі використання в рантаймі
  не накладає жодних зобов'язань на код проєкту.

- **Пакети з ліцензією-вибором** (`X OR Y`) — `harmony-reflect`
  (`Apache-2.0 OR MPL-1.1`), `node-forge` (`BSD-3-Clause OR GPL-2.0`) та інші.
  У кожному такому випадку доступний permissive-варіант (Apache-2.0 /
  BSD-3-Clause), який і застосовується де-факто, тому конфлікту з MIT немає.

## Перевірка на copyleft-ліцензії, несумісні з MIT

Запущено з жорсткою забороною на "сильний" copyleft:

```bash
npx license-checker --failOn "GPL-2.0;GPL-3.0;AGPL-1.0;AGPL-3.0;LGPL-2.0;LGPL-3.0"
```

**Результат: exit code `0`** — жоден пакет не має точного (не-опційного) тегу
GPL/AGPL/LGPL. Дерево залежностей чисте.

## Висновок

Усі 1240 перевірених пакетів мають ліцензії, сумісні з обраною ліцензією
проєкту (**MIT**). Сильного copyleft (GPL/AGPL), який вимагав би зміни
ліцензії проєкту або розкриття вихідного коду, серед залежностей не
виявлено. Проєкт можна вільно розповсюджувати, модифікувати та
використовувати комерційно відповідно до умов файлу [`LICENSE`](./LICENSE).
