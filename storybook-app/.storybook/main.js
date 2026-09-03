/** @type {import('@storybook/react-webpack5').StorybookConfig} */
const path = require('path');

const config = {
  // Сторі лежать разом з компонентами, у кореневому src/ основного
  // проєкту (../../src відносно цієї папки .storybook), а не всередині
  // ізольованого storybook-app/ — так компоненти і їхні сторі
  // залишаються поруч, як для звичайної розробки.
  stories: ['../../src/**/*.stories.@(js|jsx)'],

  // @storybook/preset-create-react-app бере на себе ПОВНІСТЮ Babel/JSX/
  // PostCSS/CSS-Modules конфігурацію, ідентичну до react-scripts (тому
  // компоненти застосунку рендеряться в Storybook так само, як у самому
  // додатку). Без цього пресету @storybook/react-webpack5 не має
  // вбудованої Babel-трансформації для JSX — файли падають з
  // "Module parse failed: Unexpected token" на першому ж JSX-тезі.
  addons: ['@storybook/preset-create-react-app', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  webpackFinal: async (webpackConfig) => {
    // Дозволяємо Webpack резолвити react/react-dom (і все, що тягне
    // preset-create-react-app) з node_modules цієї ізольованої папки,
    // навіть коли сторі фізично лежать у ../../src (поза цією папкою).
    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.modules = [
      path.resolve(__dirname, '../node_modules'),
      ...(webpackConfig.resolve.modules || []),
    ];

    // preset-create-react-app бере конфіг babel-loader з react-scripts і
    // звужує його `include` до configDir (.storybook/) — бо в звичайному
    // CRA-проєкті Storybook і застосунок ділять ОДНУ src/. Тут вони
    // навмисно розділені (../../src, поза storybook-app/) заради
    // ізоляції node_modules, тому без явного розширення include нижче
    // Babel просто не застосовується до файлів компонентів і сторі —
    // Webpack бачить JSX-синтаксис нетранспільованим і падає з
    // "Module parse failed: Unexpected token".
    const projectSrc = path.resolve(__dirname, '../../src');

    const extendBabelInclude = (rule) => {
      if (!rule || typeof rule !== 'object') return;

      const isBabelLoader =
          typeof rule.loader === 'string' && /[/\\]babel-loader[/\\]/.test(rule.loader);

      if (isBabelLoader) {
        const currentInclude = Array.isArray(rule.include)
            ? rule.include
            : [rule.include].filter(Boolean);
        rule.include = [...currentInclude, projectSrc];
      }

      if (Array.isArray(rule.oneOf)) {
        rule.oneOf.forEach(extendBabelInclude);
      }
    };

    (webpackConfig.module?.rules || []).forEach(extendBabelInclude);

    return webpackConfig;
  },
};

module.exports = config;
