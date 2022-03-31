<template>
  <div class="va-property">
    <p class="va-property__title" :title="path">
      <span
        v-for="(title, index) in formatTitle"
        :key="index"
        :class="['va-property-title__item', { 'va-property-title__item--current': index === formatTitle.length - 1 }]"
        >{{ title }}
        </span
      >
    </p>
    <p v-if="schema.description && schema.type !== 'boolean'" class="va-property__description">
      {{ schema.description }}
    </p>
    <component
      :is="renderComponent"
      :schema="schema"
      :value="value"
      @not-support="$emit('not-support', $event)"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import startCase from 'lodash.startcase';
import ValueTypeProperty from './components/ValueTypeProperty.vue';
import ObjectProperty from './components/ObjectProperty.vue';
import ArrayProperty from './components/ArrayProperty.vue';

export default Vue.extend({
  name: 'Property',
  components: {
    'va-value-type': ValueTypeProperty,
    'va-object': ObjectProperty,
    'va-array': ArrayProperty,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    path: String,
    value: {},
  },
  computed: {
    formatTitle() {
      const { title } = this.schema;
      return (typeof title === 'string' ? [title] : title).map((item: string) => {
        return startCase(item);
      });
    },
    renderComponent() {
      const { type = 'string' } = this.schema;
      return type === 'object' ? ObjectProperty : type === 'array' ? ArrayProperty : ValueTypeProperty;
    },
  },
});
</script>
