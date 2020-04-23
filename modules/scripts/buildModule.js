/* eslint-disable no-console */
//vue-cli-service build --target lib --name module-test --dest dist/module-test module-test/index.js

const fs = require('fs');
const path = require('path');
const execa = require('execa');

async function exec(name, execFile) {
  const { stdout } = await execa(require.resolve('@vue/cli-service/bin/vue-cli-service'), [
    'build',
    '--target',
    'lib',
    '--name',
    name,
    '--dest',
    `dist/${name}`,
    execFile,
  ]);
  return stdout;
}

async function findIndexFile(rootDir) {
  const dir = await fs.promises.opendir(rootDir);
  for await (const dirent of dir) {
    if (dirent.isFile() && path.basename(dirent.name, path.extname(dirent.name)) === 'index') {
      return path.resolve(rootDir, dirent.name);
    }
  }
}

async function run(files) {
  if (files && files.length) {
    for (file of files) {
      const fullpath = path.resolve(__dirname, '../', file);
      const lstat = await fs.promises.lstat(fullpath);
      if (lstat.isFile()) {
        const result = await exec(path.basename(fullpath, path.extname(fullpath)), fullpath);
        console.log(result);
      } else {
        const indexFile = await findIndexFile(fullpath);
        if (indexFile) {
          const result = await exec(path.basename(fullpath), indexFile);
          console.log(result);
        } else {
          console.error('未找到 index 文件');
        }
      }
    }
  } else {
    const rootDir = path.resolve(__dirname, '../src');

    const dir = await fs.promises.opendir(rootDir);
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        // 文件
        const rootFile = path.resolve(rootDir, dirent.name);
        const result = await exec(path.basename(dirent.name, path.extname(dirent.name)), rootFile);
        console.log(result);
      } else {
        // 目录=》 index.js/index.ts
        const indexFile = await findIndexFile(path.resolve(rootDir, dirent.name));
        if (indexFile) {
          const result = await exec(dirent.name, indexFile);
          console.log(result);
        } else {
          console.error('未找到 index 文件');
        }
      }
    }
  }
}

if (require.main === module) {
  run(process.argv.splice(2)).catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
