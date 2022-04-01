<template>
  <div class="va-editor">
    <div v-for="(schema, index) in schemas" :key="index" class="va-editor-item">
      <p v-if="schema.title" class="va-editor-item__title">{{ schema.title }}</p>
      <va-property
        v-for="(schema, key) in schema.properties"
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
  components: {
    VaProperty: Property,
  },
  props: {
    schemas: {
      type: Array,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currentValue: this.value,
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
      const pure = JSON.parse(JSON.stringify(this.currentValue));

      this.$emit('input', pure);
      this.$emit('change', pure);
    },
  },
});
</script>
