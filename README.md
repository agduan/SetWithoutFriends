# Set with(out) Friends
A single-player, offline version of [Set with Friends](https://github.com/ekzhang/setwithfriends), a popular pattern-matching card game. This version runs entirely in the browser with no backend or database.

- Added a local game record with SET type counters
- Replaced Firebase database with local React states
- Removed multiplayer features

## Technical Details

This app is a client‑only build that runs entirely in the browser. The frontend was built with [React](https://reactjs.org/), with components from [Material UI](https://material-ui.com/). Animations are implemented with `@react-spring/web`.

Code for the frontend is written in JavaScript and located in the `src/` folder. There is no backend or serverless code; all game state (seed, deck, events) is managed via local React state, and user settings are stored in `localStorage`.

The latest development version of the code is on the `main` branch. Builds are created with `npm run build` and deployed by serving the generated static assets from the `docs/` directory via GitHub Pages.

## Deployment

To build the site for development:
- Install dependencies: `npm install`
- Start the dev server: `npm start`

To build the site for production:
- Create a build: `npm run build`
- The build output is moved to `docs/` (for GitHub Pages)

To deploy to GitHub Pages:
- Run `npm run build` to refresh `docs/`
- Commit and push the updated `docs/` directory
- GitHub Pages will serve the latest `docs/` contents after a short delay

## License
All source code is available under the [MIT License](LICENSE.txt).
