/** @type {import('tailwindcss').Config} */
// Наявність цього файлу САМА ПО СОБІ вмикає Tailwind PostCSS-плагін у
// react-scripts/config/webpack.config.js (перевірка через
// fs.existsSync(path.join(paths.appPath, 'tailwind.config.js')), де
// paths.appPath — це КОРІНЬ CRA-проєкту, тобто цієї папки storybook-app/,
// а не кореневого project/, де лежить основний tailwind.config.js).
// `content` тому вказує на реальне розташування компонентів (../../src
// відносно цього файлу — сам storybook-app/ не містить src/).
module.exports = {
    content: [
        "../src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
