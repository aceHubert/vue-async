<template>
  <div class="va-editor">
    <p v-if="freezeSchema.title" class="va-editor__title">{{ freezeSchema.title }}</p>
    <div class="va-editor__items">
      <va-property
        v-for="(schema, key) in freezeSchema.properties"
        :key="key"
        :schema="{ ...schema, title: schema.title ? [schema.title] : key.split('.') }"
        :path="key"
        :value="currentValue[key]"
        @not-support="$emit('not-support', $event)"
        @change="onChange($event, schema, key)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Property from '../property';

export default Vue.extend({
  name: 'Editor',
  model: {
    event: 'change',
  },
  components: {
    VaProperty: Property,
  },
  props: {
    schema: {
      type: Object,
      required: true,
      validator(val: Record<string, any>) {
        // 根目录必须是 object
        return val.type === 'object' && val.properties;
      },
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currentValue: this.value,
      freezeSchema: Object.freeze(this.schema),
    };
  },
  watch: {
    value(value, oldVal) {
      if (JSON.stringify(value) !== JSON.stringify(oldVal)) {
        this.currentValue = value;
      }
    },
  },
  methods: {
    onChange(value: unknown, schema: Record<string, any>, key: string) {
      if (value === undefined) {
        this.$delete(this.currentValue, key);
      } else {
        this.$set(this.currentValue as any, key, value);
      }
      this.$emit('change', JSON.parse(JSON.stringify(this.currentValue)));
    },
  },
});
</script>
