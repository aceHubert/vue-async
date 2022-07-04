import { build } from '../../scripts/build-style';

const watch = process.argv[2] === 'watch';

build({
  watch,
  allStylesOutputFile: 'dist/components.css',
});
