<template>
  <i-tooltip placement="bottom-start" :content="errMessage" :disabled="!errMessage">
    <i-form :model="current" ref="form" :show-message="false" :rules="rules" :label-width="0" @on-validate="onValid">
      <i-form-item prop="value">
        <i-input
          v-model="current.value"
          :size="size"
          :placeholder="placeholder"
          type="number"
          style="width: 220px; max-width: 100%"
          @on-change="onInput"
          @on-blur="onChange"
        />
      </i-form-item>
    </i-form>
  </i-tooltip>
</template>

<script lang="ts">
import Vue from 'vue';
import { Input, Form, FormItem, Tooltip } from 'view-design';

export default Vue.extend({
  name: 'IntegerProperty',
  inheritAttrs: false,
  components: {
    IInput: Input,
    IForm: Form,
    IFormItem: FormItem,
    ITooltip: Tooltip,
  },
  props: {
    value: Number,
    defaultValue: Number,
    minimum: Number,
    exclusiveMinimum: Number,
    maximum: Number,
    exclusiveMaximum: Number,
    size: String,
    placeholder: {
      type: String,
      default: '整数...',
    },
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
            type: 'integer',
            message: '必须是整数！',
            transform: (value: string) => {
              return Number(value);
            },
          },
          {
            type: 'integer',
            validator: (rule: any, value: number) => {
              if (value) {
                if (this.minimum && value < this.minimum) {
                  return new Error(`必须大于等于${this.minimum}！`);
                }
                if (this.exclusiveMinimum && value <= this.exclusiveMinimum) {
                  return new Error(`必须大于${this.exclusiveMinimum}！`);
                }

                if (this.maximum && value > this.maximum) {
                  return new Error(`必须小于等于${this.maximum}！`);
                }

                if (this.exclusiveMaximum && value >= this.exclusiveMaximum) {
                  return new Error(`必须小于${this.exclusiveMaximum}！`);
                }
              }
              return true;
            },
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
      this.$emit('input', String(this.current.value) === '' ? undefined : Number(this.current.value));
    },
    onChange() {
      this.$emit('input', this.current.value);
      (this.$refs['form'] as any).validate((valid: boolean) => {
        if (valid) {
          this.$emit('change', String(this.current.value) === '' ? undefined : Number(this.current.value));
        }
      });
    },
  },
});
</script>
