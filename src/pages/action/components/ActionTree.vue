<template>
  <div>
    <el-input placeholder="筛选action, 试试输入: click / 点击" v-model="filterText" clearable style="width: 100%" size="mini" />
    <el-tree
      :data="actionTree"
      :props="{ children: 'children', label: 'name' }"
      default-expand-all
      :filter-node-method="filterNode"
      ref="tree"
    >
      <span slot-scope="{ node, data }">
        <span :title="nodeTitle(data)">{{ node.label }}</span>
        <el-button v-if="node.isLeaf" type="text" @click="addStep(data)">添加</el-button>
        <el-button v-if="node.isLeaf" type="text" style="margin-left: 0px" @click="insertStep(data)">插入</el-button>
        <el-button v-if="node.isLeaf" type="text" style="margin-left: 0px" v-clipboard:copy="copyJavaInvoke(data)" v-clipboard:success="onCopySuccess">Java调用</el-button>
      </span>
    </el-tree>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form label-position="left" label-width="50px">
        <el-form-item label="步骤">
          <el-select v-model="insertStepNumber" filterable clearable>
            <el-option v-for="number in stepCount" :key="number" :value="number" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmInsertStep">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js'
export default {
  props: {
    actionTree: Array,
    stepCount: Number
  },
  directives: {
    clipboard
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      filterText: '',
      dialogTitle: '',
      dialogVisible: false,
      insertStepNumber: null,
      insertAction: null
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true

      if (data.invoke) {
        return data.name.indexOf(value) !== -1 || data.invoke.indexOf(value) !== -1
      }
      return data.name.indexOf(value) !== -1
    },
    nodeTitle(node) {
      if (node.id) { // action
        const descText = '描述: ' + (node.description || '无')

        let returnValueText = '返回值: ' + node.returnValue
        if (node.returnValueDesc) {
          returnValueText = returnValueText + '(' + node.returnValueDesc + ')'
        }

        let paramText = '方法参数: '
        if (node.params && node.params.length > 0) {
          const params = JSON.parse(JSON.stringify(node.params))
          params.forEach(param => delete param.possibleValues) // possibleValues可能很长，删除
          paramText += JSON.stringify(params)
        } else {
          paramText += '无'
        }

        return descText + '\n' + returnValueText + '\n' + paramText
      } else {
        return ''
      }
    },
    addStep(action) {
      this.$emit('actionClick', action)
    },
    insertStep(action) {
      this.insertAction = action
      this.dialogTitle = action.name
      this.insertStepNumber = null
      this.dialogVisible = true
    },
    confirmInsertStep() {
      if (!this.insertStepNumber) {
        this.$message.error('步骤号不能为空')
        return
      }
      this.$emit('actionClick', this.insertAction, this.insertStepNumber)
      this.dialogVisible = false
    },
    copyJavaInvoke(action) {
      let params = ''
      if (action.params && action.params.length > 0) {
        params = action.params.map(p => p.type + ' ' + p.name).join(', ')
      }
      // type: 1 基础组件
      const methodName = action.type === 1 ? action.invoke : 'action_' + action.id
      return methodName + '(' + params + ')'
    },
    onCopySuccess() {
      this.$notify.success('Java调用已添加到剪切板')
    }
  }
}
</script>
