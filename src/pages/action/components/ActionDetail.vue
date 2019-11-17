<template>
  <el-drawer
    title="Action Detail"
    :visible.sync="show"
    direction="rtl"
    :show-close="false"
    size="80%">
    <div style="padding: 5px; height: 100%">
      <el-input placeholder="输入关键字进行过滤" v-model="actionTreeFilterText" clearable style="width: 20%;margin-bottom: 10px" />
      <div style="height: 80%;overflow: auto">
        <el-tree
          :data="selectableActions"
          :props="{ children: 'children', label: 'name' }"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree">
        </el-tree>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    selectableActions: Array,
    showActionDetail: Boolean
  },
  watch: {
    actionTreeFilterText(val) {
      this.$refs.tree.filter(val)
    },
    showActionDetail(val) {
      this.show = val
    },
    show(val) {
      this.$emit('update:showActionDetail', val)
    }
  },
  data() {
    return {
      actionTreeFilterText: '',
      show: false
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>
