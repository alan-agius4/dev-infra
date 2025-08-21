// Resolves the cache path to a system absolute path. This is necessary
// for Bazel to properly pick up the path. Note also that backslashes
// in the bazelrc file need to be escaled as otherwise those would escape

import assert from 'node:assert';

const BAZELRC_PATH = process.argv[2];
const BAZEL_REPO_CACHE_UNIX = process.argv[3];
const BAZEL_REPO_CACHE = process.argv[4];

assert(BAZEL_REPO_CACHE, 'BAZEL_REPO_CACHE argument variable is not defined.');
assert(BAZEL_REPO_CACHE_UNIX, 'BAZEL_REPO_CACHE_UNIX argument variable is not defined.');
assert(BAZELRC_PATH, 'BAZELRC_PATH argument variable is not defined.');

const bazelRcContent = `
# Print all the options that apply to the build.
# This helps us diagnose which options override others
# (e.g. /etc/bazel.bazelrc vs. tools/bazel.rc)
build --announce_rc

# Avoids re-downloading NodeJS/browsers all the time.
build --repository_cache=${BAZEL_REPO_CACHE_UNIX}

# More details on failures
build --verbose_failures=true

# CI supports colors but Bazel does not detect it.
common --color=yes
`;

await Promise.resolve([
  fs.promises.mkdir(cachePath, {recursive: true}),
  fs.promises.appendFile(BAZELRC_PATH, bazelRcContent),
]);

console.info('Appended to the Bazel RC file:\n\n');
console.info(bazelRcContent);
