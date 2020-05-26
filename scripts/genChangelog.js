/**
 * https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog
 */
const fs = require('fs');
const path = require('path');
const conventionalChangelog = require('conventional-changelog');

async function genNewRelease() {
  const { stdout } = await conventionalChangelog({ preset: 'angular' });
  return stdout;
}

const gen = (module.exports = async () => {
  const newRelease = await genNewRelease();
  if (!newRelease) {
    return;
  }
  const changelogPath = path.resolve(__dirname, '../CHANGELOG.md');

  const newChangelog = newRelease + '\n\n\n' + fs.readFileSync(changelogPath, { encoding: 'utf8' });
  fs.writeFileSync(changelogPath, newChangelog);

  delete process.env.PREFIX;
});

if (require.main === module) {
  gen().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
