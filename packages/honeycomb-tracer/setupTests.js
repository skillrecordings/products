// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom/extend-expect')
const dotenv = require('dotenv')
dotenv.config({path: './.env.test'})

// https://github.com/jsdom/jsdom/issues/2112#issuecomment-858874842
// There should be a single listener which simply prints to the
// console. We will wrap that listener in our own listener.
const listeners = window._virtualConsole.listeners('jsdomError')
const originalListener = listeners && listeners[0]

window._virtualConsole.removeAllListeners('jsdomError')

// Add a new listener to swallow JSDOM errors that orginate from clicks on anchor tags.
window._virtualConsole.addListener('jsdomError', (error) => {
  if (
    error.type !== 'not implemented' &&
    error.message !== 'Not implemented: navigation (except hash changes)' &&
    originalListener
  ) {
    originalListener(error)
  }

  // swallow error
})
