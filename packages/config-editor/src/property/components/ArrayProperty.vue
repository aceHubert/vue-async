<template>
  <div class="va-object-property" v-if="isEditable">
    <i-table
      stripe
      size="small"
      style="overflow: initial"
      :show-header="false"
      :columns="tableColumns"
      :data="tableData"
    >
      <template v-slot:value="{ row }">
        <template v-if="row.isEdit">
          <va-value-type
            v-model="row.value"
            size="small"
            required
            boolean-dropdown
            :schema="schema.items"
            @valid="onRowValid($event, row)"
          />
        </template>
        <template v-else>{{ row.value }}</template>
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
import { Button, Table } from 'view-design';
import ValueTypeProperty from './ValueTypeProperty.vue';

export default Vue.extend({
  name: 'ArrayProperty',
  components: {
    IButton: Button,
    ITable: Table,
    'va-value-type': ValueTypeProperty,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
    },
    notSupportText: {
      type: String,
      default: '在 Setting 中编辑',
    },
  },
  data() {
    const currentValue: Array<any> = JSON.parse(JSON.stringify(this.value || []));
    return {
      currentValue,
      tableColumns: [
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
      tableData: currentValue.map((value) => ({
        value,
        isEdit: false,
        isValid: true,
      })),
    };
  },
  computed: {
    hasAddItem(): boolean {
      return this.tableData.every((item: Record<string, any>) => !item.isEdit);
    },
    isEditable(): boolean {
      const { items } = this.schema;
      return items.type !== 'object' && items.type !== 'array';
    },
  },
  watch: {
    value(val: Array<any>, oldVal: Array<any>) {
      if (JSON.stringify(val) !== JSON.stringify(this.currentValue)) {
        this.currentValue = JSON.parse(JSON.stringify(val || []));
        this.tableData = this.currentValue.map((value) => ({
          value,
          isEdit: false,
          isValid: true,
        }));
      }
    },
  },
  methods: {
    onRowValid(isValid: boolean, row: Record<string, any>) {
      this.$set(row, 'isValid', isValid);
    },
    onRowConfirm(row: Record<string, any>, index: number) {
      if (row.oldRowData) {
        this.currentValue.splice(index, 1, row.value);
      } else {
        this.currentValue.push(row.value);
      }
      this.$set(this.tableData, index, { ...row, oldRowData: undefined, isEdit: false });
      this.$emit('change', this.currentValue.length ? JSON.parse(JSON.stringify(this.currentValue)) : undefined);
    },
    onRowCancel(row: Record<string, any>, index: number) {
      if (row.oldRowData) {
        this.tableData.splice(index, 1, { ...row, ...row.oldRowData, oldRowData: undefined, isEdit: false });
      } else {
        this.tableData.splice(index, 1);
      }
    },
    onRowEdit(row: Record<string, any>, index: number) {
      this.$set(this.tableData, index, { ...row, oldRowData: { value: row.value }, isEdit: true });
    },
    onRowRemove(index: number) {
      this.tableData.splice(index, 1);
      this.currentValue.splice(index, 1);
      this.$emit('change', this.currentValue.length ? JSON.parse(JSON.stringify(this.currentValue)) : undefined);
    },
    onAddProperty() {
      const { items } = this.schema;
      this.tableData.push({
        value: items.default !== undefined ? items.default : items.type === 'boolean' ? false : undefined,
        isEdit: true,
        isValid: items.type === 'boolean' ? true : false,
      } as any);
    },
  },
});
</script>
