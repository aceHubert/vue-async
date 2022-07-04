import ConfigEditor from './ConfigEditor';

// Types
import type { VueConstructor } from 'vue';

ConfigEditor.install = function (Vue: VueConstructor) {
  Vue.component(ConfigEditor.name, ConfigEditor);
};

export default ConfigEditor;
export { ConfigEditor };
