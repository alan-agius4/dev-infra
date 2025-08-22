import assert from 'node:assert';
import fs from 'node:fs';

// for Bazel to properly pick up the path. Note also that backslashes
// in the bazelrc file need to be escaled as otherwise those would escape
// followed characters that weren't supposed to be escaped.
const cachePath = process.argv[2];
const bazelRcPath = process.argv[3];

assert(bazelRcPath, 'bazelRcPath cannot be undefined.');
assert(cachePath, 'cachePath cannot be undefined.');

// Remove the cache WSL path D:/wsl_root/root/.cache -> root/.cache
// Bazel run run inside WSL, and make it can use the linux path directly.
let normalizedCachePath = cachePath.replace(/\\/g, '/');
normalizedCachePath = normalizedCachePath.replace(/^[A-Za-z]\:\/wsl_root\//, '/');

const bazelRcContent = `
# Print all the options that apply to the build.
# This helps us diagnose which options override others
# (e.g. /etc/bazel.bazelrc vs. tools/bazel.rc)
build --announce_rc

# Avoids re-downloading NodeJS/browsers all the time.
build --repository_cache=${normalizedCachePath}

# More details on failures
build --verbose_failures=true

# CI supports colors but Bazel does not detect it.
common --color=yes
`;

await Promise.all([
  fs.promises.mkdir(cachePath, {recursive: true}),
  fs.promises.appendFile(process.env.BAZELRC_PATH, bazelRcContent),
]);

console.info(`Appended to the Bazel RC file (${bazelRcPath}):\n\n`);
console.info(bazelRcContent);
