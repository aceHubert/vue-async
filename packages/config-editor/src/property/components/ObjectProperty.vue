<template>
  <div class="va-object-property" v-if="isEditable">
    <i-table stripe size="small" style="overflow: initial" :columns="tableColumns" :data="tableData">
      <template v-slot:key="{ row }">
        <template v-if="row.isEdit">
          <template v-if="schema.properties">
            <i-select size="small" v-model="row.key" @on-change="onKeyChange($event, row)">
              <i-option v-for="key in optionKeys" :key="key" :value="key">{{ key }}</i-option>
            </i-select>
          </template>
          <template v-else-if="schema.additionalProperties">
            <va-string
              v-model="row.key"
              size="small"
              placeholder="项"
              :validator="validKey"
              @input="onKeyChange($event, row)"
              @valid="onRowValid($event, row, 'key')"
            />
          </template>
        </template>
        <template v-else>{{ row.key }}</template>
      </template>
      <template v-slot:value="{ row }">
        <template v-if="row.isEdit">
          <va-value-type
            v-model="row.value"
            size="small"
            required
            boolean-dropdown
            :schema="getSchema(row.key)"
            @valid="onRowValid($event, row, 'value')"
          />
        </template>
        <template v-else>{{ String(row.value) }}</template>
      </template>
      <template v-slot:action="{ row, index }">
        <template v-if="row.isEdit">
          <i-button size="small" type="primary" :disabled="!row.isValid" @click="onRowConfirm(row, index)">
            确定</i-button
          >
          <i-button size="small" type="error" @click="onRowCancel(row, index)">取消</i-button>
        </template>
        <template v-else>
          <i-button class="va-action--when-hover" size="small" type="primary" @click="onRowEdit(row, index)"
            >编辑</i-button
          >
          <i-button class="va-action--when-hover" size="small" type="error" @click="onRowRemove(row, index)"
            >删除</i-button
          >
        </template>
      </template>
    </i-table>
    <i-button v-show="hasAddItem" size="small" type="primary" style="margin-top: 10px" @click="onAddProperty"
      >添加项</i-button
    >
  </div>
  <a v-else class="va-not-support" href="javascript:;" @click="$emit('not-support', schema)">{{ notSupportText }}</a>
</template>

<script lang="ts">
import Vue from 'vue';
import { Button, Table, Select, Option } from 'view-design';
import StringProperty from './StringProperty.vue';
import ValueTypeProperty from './ValueTypeProperty.vue';

export default Vue.extend({
  name: 'ObjectProperty',
  components: {
    IButton: Button,
    ITable: Table,
    ISelect: Select,
    IOption: Option,
    'va-string': StringProperty,
    'va-value-type': ValueTypeProperty,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    value: Object,
    notSupportText: {
      type: String,
      default: '在 Setting 中编辑',
    },
  },
  data() {
    const currentValue: Record<string, any> = this.value || {};
    const properties: Record<string, any> = this.schema.properties;
    return {
      currentValue,
      tableColumns: [
        {
          title: '项',
          slot: 'key',
        },
        {
          title: '值',
          slot: 'value',
        },
        {
          title: '',
          width: 200,
          slot: 'action',
        },
      ],
      tableData: Object.keys(currentValue)
        .filter((key) => {
          return properties ? Object.keys(properties).includes(key) : true;
        })
        .map((key) => ({
          key,
          value: currentValue[key],
          isEdit: false,
          isValid: true,
        })),
    };
  },
  computed: {
    hasAddItem(): boolean {
      const { properties } = this.schema;
      let flag = this.tableData.every((item: Record<string, any>) => !item.isEdit);
      if (flag && properties) {
        flag = !!this.optionKeys.length;
      }
      return flag;
    },
    isEditable(): boolean {
      const { properties, additionalProperties } = this.schema;
      return properties
        ? Object.values(properties as Record<string, any>).every(({ type }) => type !== 'object' && type !== 'array')
        : additionalProperties
        ? additionalProperties.type !== 'object' && additionalProperties.type !== 'array'
        : false;
    },
    optionKeys(): Array<string> {
      const { properties } = this.schema;
      if (properties) {
        let currentKeys = Object.keys(this.currentValue);
        let editKey: string | undefined;
        // 当前编辑的 key 不能排队
        if ((editKey = this.tableData.find((item) => item.isEdit)?.key)) {
          currentKeys = currentKeys.filter((key) => key !== editKey);
        }
        return Object.keys(properties).filter((key) => !currentKeys.includes(key));
      }
      return [];
    },
  },
  methods: {
    isRefType(key?: string) {
      const { properties, additionalProperties } = this.schema;
      const type = additionalProperties ? additionalProperties.type : properties ? properties[key!] : 'string';
      return type === 'object' || type === 'array';
    },
    validKey(key: string) {
      if (!key) {
        return new Error(`项必填！`);
      } else if (Object.keys(this.currentValue).includes(key)) {
        return new Error(`项"${key}"已存在！`);
      }
      return true;
    },
    getSchema(key?: string) {
      const { properties, additionalProperties } = this.schema;
      return additionalProperties ? additionalProperties : properties ? properties[key!] : { type: 'string' };
    },
    onRowValid(isValid: boolean, row: Record<string, any>, keyName: 'key' | 'value') {
      const { properties, additionalProperties } = this.schema;
      if (properties) {
        this.$set(row, 'isValid', isValid);
      } else if (additionalProperties) {
        if (!row.valid) row.valid = { key: false, value: false };
        row.valid[keyName] = isValid;
        this.$set(
          row,
          'isValid',
          Object.values(row.valid).every((flag) => flag === true),
        );
      }
    },
    onRowConfirm(row: Record<string, any>, index: number) {
      if (row.oldRowData) {
        this.$delete(this.currentValue, row.oldRowData.key);
      }
      this.$set(this.tableData, index, { ...row, oldRowData: undefined, isEdit: false });
      this.$set(this.currentValue, row.key, row.value);
      this.$emit('change', JSON.parse(JSON.stringify(this.currentValue)));
    },
    onRowCancel(row: Record<string, any>, index: number) {
      if (row.oldRowData) {
        this.tableData.splice(index, 1, { ...row, ...row.oldRowData, oldRowData: undefined, isEdit: false });
      } else {
        this.tableData.splice(index, 1);
      }
    },
    onRowEdit(row: Record<string, any>, index: number) {
      this.$set(this.tableData, index, { ...row, oldRowData: { key: row.key, value: row.value }, isEdit: true });
    },
    onRowRemove(row: Record<string, any>, index: number) {
      const removeRow = this.tableData.splice(index, 1)[0];
      this.$delete(this.currentValue, removeRow?.key);
      this.$emit(
        'change',
        Object.keys(this.currentValue).length ? JSON.parse(JSON.stringify(this.currentValue)) : undefined,
      );
    },
    onAddProperty() {
      const { properties, additionalProperties } = this.schema;

      if (additionalProperties) {
        this.tableData.push({
          key: undefined,
          value:
            additionalProperties.default !== undefined
              ? additionalProperties.default
              : additionalProperties.type === 'boolean'
              ? false
              : undefined,
          isEdit: true,
          isValid: additionalProperties.type === 'boolean' ? true : false,
        } as any);
      } else if (properties) {
        const key = this.optionKeys[0];
        key &&
          this.tableData.push({
            key,
            value:
              properties[key].default !== undefined
                ? properties[key].default
                : properties[key].type === 'boolean'
                ? false
                : undefined,
            isEdit: true,
            isValid: properties[key].type === 'boolean' ? true : false,
          });
      }
    },
    onKeyChange(keyName: string, row: Record<string, any>) {
      const { properties } = this.schema;
      if (properties) {
        Object.assign(row, {
          value:
            properties[keyName].default !== undefined
              ? properties[keyName].default
              : properties[keyName].type === 'boolean'
              ? false
              : undefined,
          isValid: properties[keyName].type === 'boolean' ? true : false,
          oldValue: { key: row.key, value: row.value },
        });
      }
    },
  },
});
</script>
