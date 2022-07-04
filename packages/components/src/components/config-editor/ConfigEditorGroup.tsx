import startCase from 'lodash.startcase';
import merge from 'lodash.merge';
import { createForm } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/vue';
import { defineComponent, computed } from '@vue/composition-api';
import { getOptions, getPrefixCls } from '../../options';

// Types
import type { ISchema, DefineComponent } from '@formily/vue';
import type { RegisterComponents } from '../../options';

export interface ConfigEditorGroupProps {
  schema: ISchema;
  path?: string;
  value?: any;
  components?: RegisterComponents;
  prefixCls?: string;
}

export default defineComponent({
  name: 'VacConfigEditorGroup',
  emits: ['change'],
  props: {
    schema: {
      type: Object,
      required: true,
    },
    path: String,
    value: {},
    components: {
      type: Object,
      defalut: () => ({}),
    },
    prefixCls: String,
  },
  setup(props: ConfigEditorGroupProps) {
    const form = createForm();

    const formatTitleRef = computed((): string[] => {
      const { title } = props.schema;
      return (typeof title === 'string' ? [title] : title).map((item: string) => {
        return startCase(item);
      });
    });

    const renderComponentsRef = computed(
      (): Dictionary<any> => {
        const { components, schema } = props;
        const options = getOptions();
        const { type = 'string' } = schema;
        const { object, array, ...valueTypeComponents } = merge({}, options.configEditor, components);
        return type === 'array'
          ? { ...valueTypeComponents, ...array }
          : type === 'object'
          ? { ...valueTypeComponents, ...object }
          : valueTypeComponents;
      },
    );

    const renderSchemaRef = computed(
      (): ISchema => {
        const { value, schema } = props;
        const { type = 'string', ...rest } = schema;
        return {
          ...rest,
          type,
          'x-value': value,
          'x-component': renderComponentsRef.value[type] || renderComponentsRef.value['string'],
        };
      },
    );

    const renderFieldRef = computed(() => {
      const { SchemaField } = createSchemaField({
        components: renderComponentsRef.value,
      });

      return SchemaField;
    });

    return () => {
      const { prefixCls: customizePrefixCls, schema, path } = props;
      const prefixCls = getPrefixCls('config-editor-group', customizePrefixCls);
      const RenderField = renderFieldRef.value;

      return (
        <FormProvider form={form} {...{ class: prefixCls }}>
          <p class={`${prefixCls}__title`} title={path}>
            {formatTitleRef.value.map((title: string, index: number) => (
              <span
                class={[
                  `${prefixCls}-title__item`,
                  { [`${prefixCls}-title__item--current`]: index === formatTitleRef.value.length - 1 },
                ]}
              >
                {title}
              </span>
            ))}
          </p>
          {schema.description && schema.type !== 'boolean' && (
            <p class="va-property__description">{schema.description}</p>
          )}
          <RenderField schema={renderSchemaRef.value} />
        </FormProvider>
      );
    };
  },
}) as DefineComponent<ConfigEditorGroupProps>;
