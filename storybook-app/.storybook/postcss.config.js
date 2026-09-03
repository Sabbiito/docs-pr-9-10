const path = require('path');

// tailwind.config.js основного проєкту (../../tailwind.config.js відносно
// storybook-app/.storybook/) вже задає `content: ["./src/**/*.{js,jsx,ts,tsx}"]`
// відносно КОРЕНЯ основного проєкту — тому імпортуємо той самий файл, а не
// дублюємо його налаштування тут.
module.exports = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, '../../tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
