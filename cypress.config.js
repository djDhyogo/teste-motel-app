const { defineConfig } = require('cypress');
const dotenv = require('dotenv');
const path = require('path');

// Carrega .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = defineConfig({
  env: {
    USERNAME: process.env.DEFAULT_USERNAME,
    PASSWORD: process.env.DEFAULT_PASSWORD,
    APP_URL: process.env.APP_URL,
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
