// cypress.config.js

const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

module.exports = defineConfig({
  chromeWebSecurity: false, // Disable Chrome web security
  e2e: {
    setupNodeEvents(on, config) {
      // Define custom tasks
      on('task', {
        renameFile({ oldPath, newName }) {
          const currentDateTime = new Date().toISOString().replace(/:/g, '-'); // Get current date and time in a file-safe format
          const extension = path.extname(oldPath); // Extract file extension
          const newFileName = `${newName}_${currentDateTime}${extension}`; // Append date and time
          const newPath = path.join(path.dirname(oldPath), newFileName); // Combine new path

          return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, (err) => {
              if (err) return reject(err);
              resolve(newFileName); // Return the new file name
            });
          });
        },
        deleteFile(filePath) {
          return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
              if (err) {
                // If the error code is 'ENOENT', resolve as true since the file doesn't exist
                if (err.code === 'ENOENT') {
                  return resolve(true);
                }
                // If any other error occurs, reject the promise
                return reject(err);
              }
              // If no error occurred, resolve as true indicating successful deletion
              resolve(true);
            });
          });
        },
      });

      // Check if the browser is Chrome and add incognito mode
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeaded) {
          launchOptions.args.push('--incognito'); // Add incognito mode argument
        }
        return launchOptions;
      });

      // Load environment variables into Cypress config
      config.env.EMAIL = process.env.EMAIL;
      config.env.PASSWORD = process.env.PASSWORD;
      return config;
    },
    downloadsFolder: 'cypress/downloads', // Set the downloads folder
    env: {
      EMAIL: process.env.EMAIL,
      PASSWORD: process.env.PASSWORD,
    },
  },
});
