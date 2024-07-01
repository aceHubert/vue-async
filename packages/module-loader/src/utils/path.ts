import warning from 'warning';
import { pathToRegexp, Key, PathToRegexpOptions } from 'path-to-regexp';
import { debug } from '../env';

export function cleanPath(path: string): string {
  return path.replace(/\/(?:\s*\/)+/g, '/');
}

export function getLocation(location: Location, base: string = '/'): string {
  let path = location.pathname;
  const pathLowerCase = path.toLowerCase();
  const baseLowerCase = base.toLowerCase();
  // base="/a" shouldn't turn path="/app" into "/a/pp"
  // https://github.com/vuejs/vue-router/issues/3555
  // so we ensure the trailing slash in the base
  if (base && (pathLowerCase === baseLowerCase || pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0)) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash;
}

export function compilePathRegex(path: string, pathToRegexpOptions: PathToRegexpOptions) {
  const regex = pathToRegexp(path, pathToRegexpOptions);
  if (debug) {
    const _keys: any = Object.create(null);
    regex.keys.forEach((key: Key) => {
      warning(!_keys[key.name], `Duplicate param keys in route with path: "${path}"`);
      _keys[key.name] = true;
    });
  }
  return regex;
}
