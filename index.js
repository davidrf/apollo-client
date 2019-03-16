const fs = require('fs');

const pathPrefix = 'docs/source/';
const paths = [
  'index.md',
  'why-apollo.md',
  'integrations.md',
  'react-apollo-migration.md',
  'essentials/get-started.md',
  'essentials/queries.md',
  'essentials/mutations.md',
  'essentials/local-state.md',
  'features/error-handling.md',
  'features/pagination.md',
  'features/optimistic-ui.md',
  'features/server-side-rendering.md',
  'features/developer-tooling.md',
  'features/defer-support.md',
  'advanced/boost-migration.md',
  'advanced/subscriptions.md',
  'advanced/network-layer.md',
  'advanced/caching.md',
  'advanced/fragments.md',
  'recipes/authentication.md',
  'recipes/testing.md',
  'recipes/static-typing.md',
  'recipes/performance.md',
  'recipes/webpack.md',
  'recipes/recompose.md',
];

const run = async () => {
  paths.forEach(path => {
    const sourcePath = pathPrefix + path;
    const data = fs.readFileSync(sourcePath).toString();
    fs.appendFileSync('docs.md', data);
  });
};

run();
