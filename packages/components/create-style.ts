import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';

glob('./*/style/index.ts', { cwd: path.resolve(__dirname, './src/components') }, (err, files) => {
  // eslint-disable-next-line no-console
  if (err) return console.error(err);
  fs.writeFile(
    path.resolve(__dirname, './src/components/style.ts'),
    `// auto generated code
${files
  .map((file) => {
    return `import '${path.dirname(file)}';\n`;
  })
  .join('')}`,
    'utf8',
  );
});
