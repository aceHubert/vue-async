<template>
  <component
    v-if="isValidComponent"
    ref="control"
    :is="renderComponent"
    :size="size"
    v-bind="bindProps"
    v-on="this.$listeners"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import StringProperty from './StringProperty.vue';
import BooleanProperty from './BooleanProperty.vue';
import NumberProperty from './NumberProperty.vue';
import IntegerProperty from './IntegerProperty.vue';

export default Vue.extend({
  name: 'ValueTypeProperty',
  components: {
    'va-string': StringProperty,
    'va-boolean': BooleanProperty,
    'va-number': NumberProperty,
    'va-integer': IntegerProperty,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    value: {},
    size: String,
    required: Boolean,
    booleanDropdown: Boolean,
    validator: Function,
  },
  computed: {
    isValidComponent() {
      const { type = 'string' } = this.schema;
      return ['string', 'boolean', 'number', 'integer'].includes(type);
    },
    renderComponent() {
      const { type } = this.schema;
      if (type) {
        return `va-${type}`;
      }
      return 'va-string';
    },
    bindProps() {
      const { type = 'string', description, default: defaultValue, enum: options, ...rest } = this.schema;

      switch (type) {
        case 'string':
          return {
            value: this.value,
            defaultValue,
            options,
            pattern: rest.pattern,
            maxLength: rest.maxLength,
            minLength: rest.minLength,
            required: this.required,
            validator: this.validator,
          };
        case 'boolean':
          return {
            value: this.value,
            defaultValue,
            label: description,
            dropdown: this.booleanDropdown,
          };
        case 'number':
        case 'integer':
          return {
            value: this.value,
            defaultValue,
            minimum: rest.minimum,
            exclusiveMinimum: rest.exclusiveMinimum,
            maximum: rest.maximum,
            exclusiveMaximum: rest.exclusiveMaximum,
            validator: this.validator,
          };
        default:
          return {
            value: this.value,
            defaultValue,
          };
      }
    },
  },
  methods: {
    isVaild(): Promise<boolean> {
      const control = this.$refs['control'] as any;
      if (control.isValid) {
        return control.isValid();
      } else {
        return Promise.resolve(true);
      }
    },
  },
});
</script>
