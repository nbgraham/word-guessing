[![Node.js CI](https://github.com/nbgraham/word-guessing/actions/workflows/ci.yml/badge.svg)](https://github.com/nbgraham/word-guessing/actions/workflows/ci.yml)

# Word Guessing

A word guessing game

## Development Setup

It is recommended to use [nvm](https://github.com/nvm-sh/nvm) to ensure all development is done on the same node version. This repo contains a `.nvmrc` file specifying the version.  
Please use [Prettier](https://prettier.io/) to format all files. This repo contains a `.prettierrc` file specifying the formatting config.

## Deployment

This project is deployed using [Github Pages](https://pages.github.com/).  
This repo has CI/CD setup using [GitHub Actions](https://github.com/features/actions). To deploy to production, merge from `develop` into `master`.

## Main Dependencies

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).

- Uses [Redux Toolkit](https://redux-toolkit.js.org/usage/usage-guide) for state management.

- Uses [React Router](https://reactrouter.com/docs/en/v6) for URL path management.

- Calls [Datamuse API](https://www.datamuse.com/api/) to
  - Validate that words are real words
  - Get definitions
  - "Randomly" pick an answer for each game

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
