import Editor from './editor';
import './index.less';

const version = '__VERSION__';

export { version, Editor };

export default Editor;

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Editor as any);
}
