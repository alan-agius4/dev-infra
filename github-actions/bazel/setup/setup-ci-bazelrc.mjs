// Resolves the cache path to a system absolute path. This is necessary
// for Bazel to properly pick up the path. Note also that backslashes
// in the bazelrc file need to be escaled as otherwise those would escape
import fs from 'fs';
import assert from 'node:assert';

// followed characters that weren't supposed to be escaped.
const BAZEL_REPO_CACHE = process.argv[2];
const BAZELRC_PATH = process.argv[3];

// Check to ensure the arguments were provided
assert(BAZEL_REPO_CACHE, 'BAZEL_REPO_CACHE argument is not defined.');
assert(BAZELRC_PATH, 'BAZELRC_PATH argument is not defined.');

const bazelRcContent = `
# Print all the options that apply to the build.
# This helps us diagnose which options override others
# (e.g. /etc/bazel.bazelrc vs. tools/bazel.rc)
build --announce_rc

# Avoids re-downloading NodeJS/browsers all the time.
build --repository_cache=${escapedCachePath}

# More details on failures
build --verbose_failures=true

# CI supports colors but Bazel does not detect it.
common --color=yes
`;

await fs.promises.mkdir(BAZEL_REPO_CACHE, {recursive: true});
await fs.promises.appendFile(BAZELRC_PATH, bazelRcContent);

console.info('Appended to the Bazel RC file:\n\n');
console.info(bazelRcContent);
