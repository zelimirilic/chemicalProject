const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultCommandTimeout: 15000,
  projectId: 'rq4wyv',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  chromeWebSecurity: false,
  pageLoadTimeout: 30000,
  env: {
    chemsoft_homepage: 'https://dev04/system/login/chemsofttest',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl:
      'https://dev04/system/login/chemsofttest/?name=miljan&password=hirsl666',
    excludeSpecPattern: '**/other/*',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
