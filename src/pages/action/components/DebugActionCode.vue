<template>
  <el-drawer
    :visible.sync="drawerVisible"
    direction="rtl"
    :with-header="false"
    size="50%">
    <div style="padding: 5px; font-size: 8px">
      <codemirror v-model="code" :options="cmOptions" />
    </div>
  </el-drawer>
</template>

<script>
import 'codemirror/mode/clike/clike.js'
import 'codemirror/theme/base16-dark.css'
export default {
  props: {
    visible: Boolean,
    code: String
  },
  watch: {
    visible(val) {
      this.drawerVisible = val
    },
    drawerVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  data() {
    return {
      drawerVisible: false,
      cmOptions: {
        mode: 'text/x-java',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        readOnly: true
      }
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
