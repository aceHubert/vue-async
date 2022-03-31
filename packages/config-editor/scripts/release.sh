#!/bin/bash
set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  if [[ -z $SKIP_TESTS ]]; then
    npm run test
  fi

  # build
  VERSION=$VERSION npm run build

  if [[ -z $RELEASE_TAG ]]; then
    npm publish
  else
    npm publish --tag "$RELEASE_TAG"
  fi

  # commit
  git add -A
  git commit -m "chore(release): publish v$VERSION"
  # tag version
  git tag -a @vue-async/config-editor@"$VERSION" -m "chore(release): publish v$VERSION"
  npm version "$VERSION" --message "chore(release): publish v$VERSION"

  # publish
  git push origin refs/tags/@vue-async/config-editor@"$VERSION"
  git push
fi