#!/bin/bash
set -e

# This script works on Linux, macOS, and Windows via WSL.

BAZELRC_PATH="$1"
BAZEL_REPO_CACHE="$2"

if [ -z "$BAZELRC_PATH" ]; then
    echo "Error: BAZELRC_PATH environment variable is not defined."
    exit 1
fi

if [ -z "$BAZEL_REPO_CACHE" ]; then
    echo "Error: BAZEL_REPO_CACHE environment variable is not defined."
    exit 1
fi

mkdir -p "$BAZEL_REPO_CACHE"

cat <<EOF >> "$BAZELRC_PATH"

# Print all the options that apply to the build.
build --announce_rc

# Avoids re-downloading NodeJS/browsers all the time.
build --repository_cache="$BAZEL_REPO_CACHE"

# More details on failures
build --verbose_failures=true

# CI supports colors but Bazel does not detect it.
common --color=yes
EOF

echo "Appended the following to the Bazel RC file at $BAZELRC_PATH:"
cat "$BAZELRC_PATH"
