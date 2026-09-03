// Підключаємо глобальні стилі основного проєкту (Tailwind base/components/
// utilities + базовий reset), щоб усі utility-класи компонентів
// (наприклад, bg-blue-600, rounded-lg) коректно відображались у Storybook.
import '../../src/index.css';

/** @type {import('@storybook/react').Preview} */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Компоненти проєкту (Card, білі фони, темний текст) розраховані на
    // світлий фон сторінки — вмикаємо світлий фон Storybook за замовчуванням
    // замість дефолтного темного/сірого, щоб превʼю виглядало так само,
    // як у самому застосунку.
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f3f4f6' },
        { name: 'dark', value: '#1f2937' },
      ],
    },
  },
};

export default preview;
