import Vue from 'vue';
import * as monaco from 'monaco-editor';

export default Vue.extend({
  name: 'MonacoEditor',
  model: {
    event: 'change',
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    schemas: {
      type: Array,
      required: true,
    },
  },
  data(): { editor?: monaco.editor.IStandaloneCodeEditor } {
    return {
      editor: undefined,
    };
  },
  watch: {
    value(val, oldVal) {
      if (this.editor && JSON.stringify(val) !== JSON.stringify(oldVal)) {
        const model = this.editor.getModel()!;
        this.editor.pushUndoStop();
        // @ts-expect-error
        model.pushEditOperations(
          [],
          [
            {
              range: model.getFullModelRange(),
              text: JSON.stringify(val, null, 2),
            },
          ],
        );
        this.editor.pushUndoStop();
      }
    },
  },
  mounted() {
    this.initMoraco();

    this.editor?.onDidChangeModelContent(() => {
      const owner = this.editor!.getModel()?.getLanguageId();
      const marker = monaco.editor.getModelMarkers({ owner });
      if (!marker.length) {
        const valueStr = this.editor!.getValue();
        try {
          const value = JSON.parse(valueStr);
          this.$emit('change', value);
        } catch {}
      }
    });

    this.editor!.addAction({
      id: 'save',
      label: 'Save',
      contextMenuOrder: 3, // choose the order
      contextMenuGroupId: '1_modification', // create a new grouping:
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        const owner = this.editor!.getModel()?.getLanguageId();
        const marker = monaco.editor.getModelMarkers({ owner });
        if (!marker.length) {
          const valueStr = this.editor!.getValue();
          try {
            const value = JSON.parse(valueStr);
            this.$emit('save', value);
          } catch {}
        }
      },
    });
  },
  methods: {
    initMoraco() {
      // a made up unique URI for our model
      const modelUri = monaco.Uri.parse('schema:/root.json');
      const model = monaco.editor.createModel(JSON.stringify(this.value, null, 2), 'json', modelUri);
      const schemas = (this.schemas as Array<Record<string, any>>).map(({ $id, id, ...schema }, index) => ({
        uri: id || $id || `http://items/schema-${index}.json`, // id of the first schema
        fileMatch: [modelUri.toString()], // associate with our model
        schema,
      }));
      // configure the JSON language support with schemas and schema associations
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemaValidation: 'error',
        schemas,
      });
      this.editor = monaco.editor.create(this.$refs['editor'] as any, {
        model: model,
      });
    },
  },
  render() {
    return <div ref="editor" style="height:500px" />;
  },
});
