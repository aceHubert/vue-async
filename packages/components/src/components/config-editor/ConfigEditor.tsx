import { defineComponent, reactive, set, del, watch } from '@vue/composition-api';
import { getPrefixCls } from '../../options';
import ConfigEditorGroup from './ConfigEditorGroup';

// Types
import type {
  DefineComponent,
  SchemaTypes,
  SchemaKey,
  SchemaEnum,
  SchemaProperties,
  SchemaItems,
  ISchema,
} from '@formily/vue';
import type { RegisterComponents } from '../../options';

export declare type Schema<
  Decorator = any,
  Component = any,
  DecoratorProps = any,
  ComponentProps = any,
  Pattern = any,
  Display = any,
  Validator = any,
  Message = any
> = {
  version?: string;
  name?: SchemaKey;
  title?: Message;
  description?: Message;
  default?: any;
  readOnly?: boolean;
  writeOnly?: boolean;
  type?: SchemaTypes;
  enum?: SchemaEnum<Message>;
  const?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string | RegExp;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[] | boolean | string;
  format?: string;
  $ref?: string;
  $namespace?: string;
  /** nested json schema spec **/
  definitions?: SchemaProperties<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >;
  properties?: SchemaProperties<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >;
  items?: SchemaItems<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  additionalItems?: ISchema<Decorator, Component, DecoratorProps, ComponentProps, Pattern, Display, Validator, Message>;
  patternProperties?: SchemaProperties<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >;
  additionalProperties?: ISchema<
    Decorator,
    Component,
    DecoratorProps,
    ComponentProps,
    Pattern,
    Display,
    Validator,
    Message
  >;
};

export interface ConfigEditorProps {
  schemas: Array<Schema>;
  value: Dictionary<any>;
  components?: RegisterComponents;
  prefixCls?: string;
}

export default defineComponent({
  name: 'VacConfigEditor',
  emits: ['input', 'change'],
  props: {
    schemas: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    components: {
      type: Object,
      defalut: () => ({}),
    },
    prefixCls: String,
  },
  setup(props: ConfigEditorProps, { emit }) {
    let current = reactive(props.value);

    watch(
      () => props.value,
      (value) => {
        if (JSON.stringify(value) !== JSON.stringify(current)) {
          current = value;
        }
      },
    );

    const onChange = function (value: unknown, schema: Record<string, any>, key: string) {
      if (value === undefined) {
        del(current, key);
      } else {
        set(current, key, value);
      }
      const pure = JSON.parse(JSON.stringify(current));

      emit('input', pure);
      emit('change', pure);
    };

    return () => {
      const { schemas, prefixCls: customizePrefixCls } = props;
      const prefixCls = getPrefixCls('config-editor', customizePrefixCls);

      return (
        <div class={prefixCls}>
          {schemas.map((schema) => (
            <div class={`${prefixCls}-item`}>
              {schema.title && <p class={`${prefixCls}-item__title`}>{schema.title}</p>}
              {schema.properties &&
                Object.keys(schema.properties).map((propertyKey) => {
                  <ConfigEditorGroup
                    schema={{
                      ...schema.properties![propertyKey],
                      title: schema.properties![propertyKey]?.title
                        ? [schema.properties![propertyKey]?.title]
                        : propertyKey.split('.'),
                    }}
                    path={propertyKey}
                    value={current[propertyKey]}
                    {...{
                      on: {
                        'not-support': () => emit('not-support', schema.properties![propertyKey]),
                        change: (value: any) => onChange(value, schema.properties![propertyKey], propertyKey),
                      },
                    }}
                  />;
                })}
            </div>
          ))}
        </div>
      );
    };
  },
}) as DefineComponent<ConfigEditorProps>;
