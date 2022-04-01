<template>
  <i-select v-if="dropdown" :size="size" :value="Number(value)" @on-change="onChange">
    <i-option
      v-for="item in [1, 0]"
      :key="item"
      :value="item"
      :label="String(Boolean(item))"
      style="display: flex; justify-content: space-between"
    >
      <p>{{ Boolean(item) }}</p>
      <p style="color: #666">{{ defaultValue === Boolean(item) ? 'default' : '' }}</p>
    </i-option>
  </i-select>
  <i-checkbox v-else :size="size" :value="value" @on-change="onChange">{{ label }}</i-checkbox>
</template>

<script lang="ts">
import Vue from 'vue';
import { Checkbox, Select, Option } from 'view-design';

export default Vue.extend({
  name: 'BooleanProperty',
  inheritAttrs: false,
  components: {
    ICheckbox: Checkbox,
    ISelect: Select,
    IOption: Option,
  },
  props: {
    value: Boolean,
    defaultValue: {
      type: Boolean,
      default: false,
    },
    dropdown: Boolean,
    label: String,
    size: String,
  },
  methods: {
    onChange(value: boolean | number) {
      this.$emit('input', Boolean(value));
      this.$emit('change', Boolean(value));
    },
  },
});
</script>
