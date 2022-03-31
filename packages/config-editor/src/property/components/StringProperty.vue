<template>
  <i-tooltip placement="bottom-start" :content="errMessage" :disabled="!errMessage">
    <i-form :model="current" ref="form" :show-message="false" :rules="rules" :label-width="0" @on-validate="onValid">
      <i-form-item prop="value">
        <i-select
          v-if="options && options.length"
          v-model="current.value"
          :size="size"
          style="width: 220px; max-width: 100%"
          @on-change="onChange"
        >
          <i-option v-for="option in options" :key="option" :value="option">{{ option }}</i-option>
        </i-select>
        <i-input
          v-else
          v-model="current.value"
          :size="size"
          style="width: 220px; max-width: 100%"
          :maxlength="maxLength"
          :placeholder="placeholder"
          @on-change="onInput"
          @on-blur="onChange"
        />
      </i-form-item>
    </i-form>
  </i-tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import { Input, Select, Option, Form, FormItem, Tooltip } from 'view-design';

export default Vue.extend({
  name: 'StringProperty',
  inheritAttrs: false,
  components: {
    IInput: Input,
    ISelect: Select,
    IOption: Option,
    IForm: Form,
    IFormItem: FormItem,
    ITooltip: Tooltip,
  },
  props: {
    value: String,
    defaultValue: String,
    options: Array,
    pattern: String,
    maxLength: Number,
    minLength: Number,
    size: String,
    placeholder: {
      type: String,
      default: '字符串...',
    },
    required: Boolean,
    validator: Function,
  },
  data() {
    return {
      current: {
        value: this.value,
      },
      errMessage: '',
    };
  },
  computed: {
    rules(): Record<string, any> {
      return {
        value: [
          {
            type: 'string',
            required: !!this.required,
            message: '必填参数！',
          },
          {
            type: 'string',
            validator: (rule: any, value: string) => {
              if (value) {
                if (this.minLength && value.length < this.minLength) {
                  return new Error(`长度必须大于等于${this.minLength}！`);
                }

                if (this.maxLength && value.length > this.maxLength) {
                  return new Error(`长度必须小于等于${this.maxLength}！`);
                }
              }
              return true;
            },
          },
          this.pattern && {
            type: 'string',
            pattern: this.pattern,
            message: '输入的格式不正确！',
          },
          this.validator && {
            type: 'string',
            validator: (rule: any, value: string) => this.validator(value),
          },
        ].filter(Boolean),
      };
    },
  },
  watch: {
    value(val) {
      val !== this.current.value && (this.current.value = val);
    },
  },
  mounted() {
    if (this.value !== undefined) {
      (this.$refs['form'] as any).validate();
    }
  },
  methods: {
    isValid() {
      return new Promise((resolve) => {
        (this.$refs['form'] as any).validate((valid: boolean) => resolve(valid));
      });
    },
    onValid(prop: string, status: boolean, error: string) {
      this.errMessage = status ? '' : error;
      this.$emit('valid', status, this.errMessage);
    },
    onInput() {
      this.$emit('input', this.current.value === '' ? undefined : this.current.value);
    },
    onChange() {
      this.$emit('input', this.current.value);
      (this.$refs['form'] as any).validate((valid: boolean) => {
        if (valid) {
          this.$emit('change', this.current.value === '' ? undefined : this.current.value);
        }
      });
    },
  },
});
</script>
