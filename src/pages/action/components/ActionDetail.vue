<template>
  <el-drawer
    :visible.sync="outerDrawer"
    direction="rtl"
    :with-header="false"
    size="50%">
    <div style="padding: 5px; font-size: 8px">
      <el-input placeholder="输入关键字进行过滤" v-model="actionTreeFilterText" clearable style="width: 40%" />
      <el-tree
        :data="selectableActions"
        :props="{ children: 'children', label: 'name' }"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
        <span slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <el-button type="text" v-if="node.isLeaf" @click="showInnerDrawer(data)">查看详情</el-button>
          <el-button type="text" v-clipboard:copy="copyJavaInvoke(data)" v-clipboard:success="onCopy" v-if="node.isLeaf" >复制java调用</el-button>
        </span>
      </el-tree>
    </div>
    <el-drawer
      size="40%"
      :with-header="false"
      :append-to-body="true"
      :visible.sync="innerDrawer">
      <codemirror v-model="codemirrorContent" :options="cmOptions" />
    </el-drawer>
  </el-drawer>
</template>

<script>
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import clipboard from '@/directive/clipboard/index.js'
export default {
  props: {
    selectableActions: Array,
    showActionDetail: Boolean
  },
  directives: {
    clipboard
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
        mode: 'application/json',
        theme: 'base16-dark',
        lineNumbers: true,
        readOnly: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
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
      this.codemirrorContent = JSON.stringify(action, null, '\t')
    },
    copyJavaInvoke(action) {
      let params = ''
      if (action.params && action.params.length > 0) {
        params = action.params.map(p => p.type + ' ' + p.name).join(',')
      }

      let methodName = ''
      if (action.type === 1) { // 基础组件
        methodName = action.invoke
      } else {
        methodName = 'action_' + action.id
      }
      return methodName + '(' + params + ')'
    },
    onCopy(e) {
      this.$notify.success(e.text + '复制成功')
    }
  }
}
</script>
<style>
  .CodeMirror {
    height: auto;
  }
  .el-drawer__body {
    height: 100%;
    overflow: auto;
  }
</style>
