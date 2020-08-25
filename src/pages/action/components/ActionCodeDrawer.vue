<template>
  <el-drawer
    :visible.sync="drawerVisible"
    direction="rtl"
    :with-header="false"
    :destroy-on-close="true"
    size="50%">
    <div style="font-size: 8px">
      <codemirror v-model="code" :options="cmOptions" />
    </div>
  </el-drawer>
</template>

<script>
import 'codemirror/mode/clike/clike.js'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
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
        readOnly: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
      }
    }
  }
}
</script>
<style>
  .CodeMirror {
    height: auto;
  }
</style>
