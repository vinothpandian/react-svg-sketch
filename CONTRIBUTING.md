# Contributing to React-Sketch-Canvas

This project uses [TSDX](https://github.com/formium/tsdx) for development.

## Installation

- Running `yarn install` in the component's root directory will install everything you need for development.

## Commands

The core of the `react-sketch-canvas` library is inside `/src`, and demo stories are in `/stories`.

The recommended workflow is copied below as explained by TSDX.

In one terminal, run:

```bash
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run Storybook:

### Storybook

Run inside another terminal:

```bash
yarn storybook
```

This loads the stories from `./stories`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `yarn test`.
