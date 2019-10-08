# KiltaGear
A 2D fighting game presented by NiemiSmäsh.

### Installation

1. Have `yarn` and Node.js 10.15.0 or newer installed (see https://yarnpkg.com/lang/en/docs/install/).
2. Run `yarn` to install local dependencies.

### Running locally

1. `yarn start`
2. Open *http://localhost:1234/* in your favourite browser.
3. Enjoy *KiltaGear*!

### Troubleshooting

On Windows platforms, some users may need to install TypeScript and Parcel locally as part of their Node.js installation.

`yarn global add typescript && yarn global add parcel-bundler`

Then you should be able to run the game with `parcel index.html`.

### Releasing to itch.io

- Delete dist directory `rm -rf dist` *carefully*
- Run `parcel build index.html assets/sprites/*`
- Rename newly made dist directory to release-0.x
- In release-0.x, remove slash from kiltagear.js path in index.html
- In kiltagear.xxxxxxxx.js, replace all as regex: `"\.\./assets/sprites/` -> `"./assets/sprites/`, `exports="/` -> `exports="`
- Zip the release directory, check that the filename has no spaces, and upload zip to itch.io
