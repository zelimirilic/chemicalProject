const { defineConfig } = require("cypress");
const fs = require('fs-extra');
const path = require('path');
const cucumber = require('cypress-cucumber-preprocessor').default;

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress\\config', `${file}.json`);
  if (!fs.existsSync(pathToConfigFile)) {
    console.log("No custom config file found. ");
    return {};
  }
  return fs.readJSON(pathToConfigFile);
}


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
      on('file:preprocessor', cucumber())
      const file = config.env.configFile || ''
      return getConfigurationByFile(file)
    },
    baseUrl:
      'https://dev04/system/login/chemsofttest/?name=miljan&password=hirsl666',
    excludeSpecPattern: '**/other/*',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx,feature}',
  },
})
