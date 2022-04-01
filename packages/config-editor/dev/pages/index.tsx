// dashboard
import Vue from 'vue';
import ConfigEditor from '@vue-async/config-editor';
import JsonEditor from './json-editor';
import '@vue-async/config-editor/dist/styles/config-editor.css';

export default Vue.extend({
  name: 'Playground',
  components: {
    ConfigEditor,
    JsonEditor,
  },
  data() {
    return {
      jsonView: false,
      value: {
        checked: true,
        object: {
          string: '13',
          aaa: '12',
        },
        objectAdditionalProperties: {
          aa: '12',
        },
      },
      schmeas: [
        {
          id: 'http://items/value-type.json',
          type: 'object',
          title: 'The Value Type Schema',
          properties: {
            checked: {
              type: 'boolean',
              description: 'This is a boolean type.',
              default: false,
            },
            name: {
              type: 'string',
              description: 'User name.',
              default: '',
              minLength: 6,
              maxLength: 16,
            },
            id: {
              type: 'integer',
              description: 'Id is an integer property.',
              default: 0,
              examples: [1],
            },
            price: {
              type: 'number',
              description: 'Price is a number property.',
              default: 0,
              exclusiveMinimum: 10,
              exclusiveMaximum: 100,
              examples: [12.5],
            },
            'dimensions.width': {
              type: 'integer',
              description: 'Object item.',
              default: 0,
            },
            'dimensions.height': {
              type: 'integer',
              description: 'Object item.',
              default: 0,
            },
            'dimensions.useType': {
              type: 'string',
              description: 'Object item with enum.',
              enum: ['Street', 'Avenue', 'Boulevard'],
            },
          },
        },
        {
          id: 'http://items/ref-type.json',
          type: 'object',
          title: 'The Ref Type Schema',
          properties: {
            object: {
              type: 'object',
              description: 'a object property with properties.',
              default: {
                string: '',
                integer: 10,
                number: 100.1,
                boolean: true,
              },
              properties: {
                string: { type: 'string' },
                integer: { type: 'integer', exclusiveMinimum: 10 },
                number: { type: 'number', default: 1.5 },
                boolean: { type: 'boolean', default: true, description: 'boolean in object.' },
              },
            },
            objectAdditionalProperties: {
              type: 'object',
              description: 'a object property with string additional properties.',
              default: {},
              additionalProperties: { type: 'string' },
            },
            objectComplex: {
              type: 'object',
              description: 'a object property with string additional properties.',
              default: {},
              properties: {
                innerObject: {
                  type: 'object',
                  additionalProperties: { type: 'string' },
                },
              },
            },
            tags: {
              type: 'array',
              description: 'An array property with string items property.',
              default: [],
              items: {
                type: 'string',
              },
            },
            arrayKeyValue: {
              type: 'array',
              description: 'An array with object items.',
              default: [],
              items: {
                type: 'object',
                required: ['id', 'name'],
                properties: {
                  id: {
                    type: 'integer',
                    default: 0,
                  },
                  name: {
                    type: 'string',
                    default: '',
                  },
                },
              },
            },
          },
        },
      ],
    };
  },
  watch: {
    jsonView(value) {
      if (value) {
        this.$nextTick(() => {
          (this.$refs.json as any).editor?.layout();
        });
      }
    },
  },
  render() {
    return (
      <div style="padding: 20px 100px 0;">
        <div style="padding: 10px 20px;">
          <button onClick={() => (this.jsonView = !this.jsonView)}>Switch</button>
        </div>
        <config-editor
          v-show={!this.jsonView}
          vModel={this.value}
          schemas={this.schmeas}
          {...{
            on: {
              'not-support': () => {
                this.jsonView = true;
              },
            },
          }}
        />
        <json-editor
          v-show={this.jsonView}
          ref="json"
          value={this.value}
          onSave={(value: any) => (this.value = value)}
          schemas={[
            ...this.schmeas,
            {
              type: 'object',
              title: 'The Ref Schema',
              properties: {
                '[ref]': {
                  $ref: 'http://items/value-type.json',
                },
              },
            },
          ]}
        />
      </div>
    );
  },
});
