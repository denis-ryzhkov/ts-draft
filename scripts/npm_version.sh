#!/usr/bin/env bash
set -eu

# This script is executed on step 4 of `npm version`:
# https://docs.npmjs.com/cli/v9/commands/npm-version#description
# It replaces "Unreleased" in `CHANGELOG.md` with new version,
# adds this change to upcoming commit, and prints further instructions.

[[ -z "${npm_package_version-}" ]] && {
    echo 'ERROR: This script should only be run from `npm version` script!'
    exit 1
}

sed -i.bak "s/Unreleased/v$npm_package_version \\($(date +%F)\\)/" CHANGELOG.md
rm CHANGELOG.md.bak
git add CHANGELOG.md

echo 'Please:'
echo '1. Run: git push origin main'
echo '2. Check success of CI/CD to dev environment.'
echo "3. Run: git push origin $npm_package_version"
echo '4. Check success of CI/CD to prod environment.'
