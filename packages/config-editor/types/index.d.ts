import Vue, { VueConstructor } from 'vue';

declare class PluginComponent extends Vue {
  static install(vue: VueConstructor): void;
}

export class Editor extends PluginComponent {
  schema: Record<string, any>;
  value: Record<string, any>;
}

export const version: string;

export default Editor;
