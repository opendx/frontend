<template>
  <div>
    <el-row :gutter="2">
      <el-col :span="5">
        <action-tree :height="height" :actionTree="actionTree" :step-count="stepList.length" @actionClick="addStep" />
      </el-col>
      <el-col :span="19">
        <el-table
          v-if="showTable"
          ref="table"
          :data="stepList"
          border
          :height="height"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="20" />
          <el-table-column width="220">
            <template slot="header">
              <span class="required">步骤</span>
            </template>
            <template scope="scope">
              <div style="margin-bottom: 3px">
                {{ stepNumber(scope.row, scope.$index + 1) + '.' }}
                <el-input v-model="scope.row.name" type="textarea" :autosize="{ minRows: 1 }" placeholder="步骤名" style="width: 90%" />
              </div>
              <div>
                <el-select v-model="scope.row.handleException" size="mini" style="width: 100%">
                  <el-option label="失败时：中断执行" :value="null" />
                  <el-option label="失败时：忽略，继续执行" :value="0" />
                  <el-option label="失败时：抛出跳过异常" :value="1" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Action" min-width="300">
            <template scope="{ row }">
              <el-table :data="row.args" border>
                <el-table-column :key="row.actionId" label="参数" width="150" show-overflow-tooltip>
                  <template slot="header">
                    <el-tag type="success">{{ getActionName(row.actionId) }}</el-tag>
                  </template>
                  <template scope="scope">
                    <span>{{ getSimpleParamType(row.actionId, scope.$index) }}</span>
                    <el-button type="text" @click="showStepActionParamDialog(row.actionId, scope.$index, row.args)">
                      {{ getParamName(row.actionId, scope.$index) }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="参数值">
                  <template scope="scope">
                    <div v-if="row.actionId !== 1">
                      <image-input v-model="row.args[scope.$index]" />
                    </div>
                    <div v-else class="java-code">
                      <codemirror v-model="row.args[scope.$index]" :options="cmOptions" />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="变量接收Action返回值">
            <template scope="{ row }">
              <span class="ellipsis">{{ getActionReturnValueText(row.actionId) }}</span>
              <el-input
                :disabled="isEvaluationDisabled(row.actionId)"
                v-model="row.evaluation"
                type="textarea"
                :autosize="{ minRows: 1 }"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="94">
            <template scope="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
                size="mini"
              >
                {{ scope.row.status === 1 ? '启用' : '禁用' }}
              </el-tag>
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
              />
              <el-button-group style="margin-top: 1px">
                <el-button size="mini" class="el-icon-top" :disabled="moveUpDisable(scope.$index)" @click="moveUp(scope.$index)" />
                <el-button size="mini" class="el-icon-bottom" :disabled="moveDownDisable(scope.$index)" @click="moveDown(scope.$index)" />
              </el-button-group>
              <el-button-group style="margin-top: 3px">
                <el-button size="mini" class="el-icon-document-copy" @click="copyStep(scope.$index, scope.row)" />
                <el-button size="mini" class="el-icon-delete" @click="deleteStep(scope.$index)" />
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog :title="stepActionParamDialog.param.name" :visible.sync="stepActionParamDialog.visible">
      <el-form size="mini" label-position="left" label-width="80px">
        <el-form-item label="描述">
          {{ stepActionParamDialog.param.description || '暂无描述' }}
        </el-form-item>
        <el-form-item label="可选值">
          <el-table :data="stepActionParamDialog.param.possibleValues || []" border>
            <el-table-column align="center" label="值">
              <template scope="{ row }">
                <el-button type="text" @click="clickPossibleValue(row.value)">{{ row.value }}</el-button>
              </template>
            </el-table-column>
            <el-table-column property="description" align="center" label="描述" />
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getActionCascader } from '@/api/action'
import ActionTree from './ActionTree'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import ImageInput from '@/components/ImageInput'
import { getJavaSimpleName } from '@/utils/common'
export default {
  components: {
    ActionTree,
    ImageInput
  },
  props: {
    height: Number,
    steps: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    steps() {
      this.stepList = this.steps
    },
    stepList() {
      this.$emit('update:steps', this.stepList)
    }
  },
  data() {
    return {
      showTable: false,
      stepActionParamDialog: {
        visible: false,
        param: {},
        paramIndex: undefined,
        args: []
      },
      stepList: this.steps,
      selectedSteps: [],
      actionTree: [],
      actionMap: new Map(),
      cmOptions: {
        mode: 'text/x-java',
        theme: 'default',
        tabSize: 2,
        lineNumbers: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
      }
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
    },
    platform() {
      return this.$store.state.project.platform
    },
    stepNumber() {
      return function(row, stepNumber) {
        row.number = stepNumber
        return row.number
      }
    }
  },
  created() {
    this.fetchActionCascader()
  },
  methods: {
    showStepActionParamDialog(stepActionId, paramIndex, args) {
      const action = this.actionMap.get(stepActionId)
      this.stepActionParamDialog.param = action.params[paramIndex]
      this.stepActionParamDialog.paramIndex = paramIndex
      this.stepActionParamDialog.args = args
      this.stepActionParamDialog.visible = true
    },
    clickPossibleValue(value) {
      this.$set(this.stepActionParamDialog.args, this.stepActionParamDialog.paramIndex, value)
      this.stepActionParamDialog.visible = false
    },
    moveUpDisable(index) {
      return index === 0
    },
    moveDownDisable(index) {
      return index === (this.stepList.length - 1)
    },
    moveUp(index) {
      this.stepList[index - 1] = this.stepList.splice(index, 1, this.stepList[index - 1])[0]
    },
    moveDown(index) {
      this.stepList[index + 1] = this.stepList.splice(index, 1, this.stepList[index + 1])[0]
    },
    deleteStep(index) {
      this.stepList.splice(index, 1)
    },
    addStep(action, stepNumber) {
      const step = { actionId: action.id, args: [], handleException: null, status: 1 }
      if (action.params) {
        action.params.forEach(param => {
          step.args.push('')
        })
      }

      this.stepList.splice(stepNumber ? stepNumber - 1 : this.stepList.length, 0, step)
    },
    copyStep(index, row) {
      const _row = JSON.parse(JSON.stringify(row))
      delete _row.number
      this.stepList.splice(index, 0, _row)
    },
    // 步骤勾选
    handleSelectionChange(val) {
      this.selectedSteps = this.stepList.filter(step => val.indexOf(step) !== -1).sort((a, b) => a.number - b.number)
    },
    async fetchActionCascader() {
      const { data } = await getActionCascader(this.projectId, this.platform)
      this.actionTree = data
      this.$emit('actionTreeChange', this.actionTree)
      this.actionMap = new Map()
      this.actionTreeToMap(this.actionTree, this.actionMap)
      this.showTable = true // 防止步骤提前渲染，从actionMap拿不到action的问题
    },
    getSimpleParamType(actionId, paramIndex) {
      const action = this.actionMap.get(actionId)
      return getJavaSimpleName(action.params[paramIndex].type)
    },
    getParamName(actionId, paramIndex) {
      const action = this.actionMap.get(actionId)
      return action.params[paramIndex].name
    },
    getActionReturnValueText(actionId) {
      const action = this.actionMap.get(actionId)
      let text = `返回值: ${getJavaSimpleName(action.returnValueType)}`
      if (action.returnValueDesc) {
        text = `${text}(${action.returnValueDesc})`
      }
      return text
    },
    isEvaluationDisabled(actionId) {
      const action = this.actionMap.get(actionId)
      return action.returnValueType === 'void'
    },
    getActionName(actionId) {
      return this.actionMap.get(actionId).name
    },
    actionTreeToMap(actionTree, actionMap) {
      actionTree.forEach(node => {
        if (node.id) {
          actionMap.set(node.id, node)
        }
        if (node.children) {
          this.actionTreeToMap(node.children, actionMap)
        }
      })
    }
  }
}
</script>
<style scoped>
  .java-code {
    width: 100%;
  }
  .java-code >>> .CodeMirror-scroll {
    margin-right: 0px;
  }
</style>
