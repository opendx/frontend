<template>
  <el-drawer
    title="Action Detail"
    :visible.sync="outerDrawer"
    direction="rtl"
    :show-close="false"
    size="50%">
    <div style="padding: 5px; height: 100%">
      <el-input placeholder="输入关键字进行过滤" v-model="actionTreeFilterText" clearable style="width: 40%;margin-bottom: 10px" />
      <div style="height: 70%;overflow: auto">
        <el-tree
          :data="selectableActions"
          :props="{ children: 'children', label: 'name' }"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree">
          <span slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <el-button type="text" v-if="node.isLeaf" @click="showInnerDrawer(data)">查看详情</el-button>
          </span>
        </el-tree>
      </div>
    </div>
    <el-drawer
      size="40%"
      :append-to-body="true"
      :visible.sync="innerDrawer">
      <codemirror v-model="codemirrorContent" :options="cmOptions"></codemirror>
    </el-drawer>
  </el-drawer>
</template>

<script>
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/base16-dark.css'
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
      this.outerDrawer = val
    },
    outerDrawer(val) {
      this.$emit('update:showActionDetail', val)
    }
  },
  data() {
    return {
      actionTreeFilterText: '',
      outerDrawer: false,
      innerDrawer: false,
      codemirrorContent: '',
      cmOptions: {
        mode: 'javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    showInnerDrawer(action) {
      this.innerDrawer = true
      const content = {
        id: action.id,
        name: action.name,
        description: action.description,
        returnValue: action.returnValue,
        returnValueDesc: action.returnValueDesc,
        invoke: action.invoke,
        params: action.params
      }
      this.codemirrorContent = JSON.stringify(content, null, '\t')
    }
  }
}
</script>
<style scoped>
  .vue-codemirror >>> .CodeMirror {
    height: auto;
  }
  .vue-codemirror {
    height: 70%;
    overflow: auto;
  }
</style>
