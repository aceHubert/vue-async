import Editor from './Editor.vue';

// Types
import { VueConstructor } from 'vue';

(Editor as any).install = function (Vue: VueConstructor) {
  Vue.component('config-editor', Editor);
};

export default Editor;
