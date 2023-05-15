## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `generate-actions`

Generate Typescript spell functions from the source Lua code. This requires that you have 'data/scripts/gun/gun_actions.lua' present.

Runs `scripts/generate_gun_actions.py`.

### `generate-entity-map`

Generate a Typescript map from projectile definitions to spells that use them, based on the source Lua code. This requires that you have 'data/scripts/gun/gun_actions.lua' present.

Runs `scripts/generate_entity_map.py`.

### `generate-translations`

Generate display strings from IDs based on the game's translation file. This requires that you have './data_base/translations/common.csv' present.

Runs `scripts/generate_translations.py`.
