<template>
  <div>
    <div ref="closepopover" />
    <el-table ref="table" :data="steps" border @selection-change="handleSelectionChange" :max-height="tableHeight">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" width="90">
        <template slot="header">
          <el-button type="text" class="el-icon-circle-plus" @click="addStep" />
          <span class="required">步骤</span>
        </template>
        <template scope="scope">
          {{ stepNumber(scope.row, scope.$index + 1) }}
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#13ce66" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="200">
        <template slot="header">
          <span>Action</span>
          <el-button type="text" @click="showActionDetail = true">detail</el-button>
        </template>
        <template scope="{ row }">
          <el-input v-model="row.name" placeholder="步骤名" style="margin-bottom: 5px" type="textarea" :autosize="{ minRows: 1 }" />
          <el-cascader
            v-model="row.actionId"
            :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, expandTrigger: 'hover' }"
            :options="selectableActions"
            filterable
            clearable
            style="width: 100%"
            :show-all-levels="false"
            @change="actionSelected($event, row)"
            @visible-change="actionSelectChange"
            placeholder="支持模糊搜索">
            <template slot-scope="{ node, data }">
              <span v-if="data.returnValue">{{ returnValue(data) }}</span>
              <el-divider v-if="data.returnValue" direction="vertical" />
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
        </template>
      </el-table-column>
      <el-table-column label="Action参数" align="center" min-width="300">
        <template scope="{ row }">
          <el-table :data="row.paramValues" border>
            <el-table-column label="参数名" width="150" show-overflow-tooltip>
              <template scope="scope_paramValues">
                <el-popover placement="right" trigger="click">
                  {{ paramNameDesc(row.actionId, scope_paramValues.row.paramName) }}
                  <el-table v-if="hasPossibleValue(row.actionId, scope_paramValues.row.paramName)" :data="possibleValues(row.actionId, scope_paramValues.row.paramName)" border max-height="500px" style="margin-top: 5px;width: 500px">
                    <el-table-column align="center" label="可选值">
                      <template scope="scope_possibleValues">
                        <el-button type="text" @click="clickPossibleValue(row, scope_paramValues.row.paramName, scope_possibleValues.row.value)">{{ scope_possibleValues.row.value }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column property="description" align="center" label="描述" />
                  </el-table>
                  <el-button slot="reference" type="text">{{ scope_paramValues.row.paramName }}</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="参数类型" width="100">
              <template scope="scope_paramValues">
                {{ scope_paramValues.row.paramType }}
              </template>
            </el-table-column>
            <el-table-column label="参数值">
              <template scope="scope_paramValues">
                <div v-if="row.actionId !== 1">
                  <image-input v-model="scope_paramValues.row.paramValue" />
                </div>
                <div v-else class="java-code">
                  <codemirror v-model="scope_paramValues.row.paramValue" :options="cmOptions" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template scope="scope">
          <el-input v-model="scope.row.evaluation" type="textarea" :autosize="{ minRows: 1 }" placeholder="赋值" />
          <el-select v-model="scope.row.handleException" style="margin-top: 5px">
            <el-option label="失败时:中断执行" :value="null" />
            <el-option label="失败时:忽略，继续执行" :value="0" />
            <el-option label="失败时:抛出跳过异常" :value="1" />
          </el-select>
          <el-button size="mini" style="width: 100%;margin-top: 5px" @click="copyStep(scope.$index, scope.row)">复制</el-button>
          <el-button-group style="margin-top: 5px">
            <el-button size="mini" class="el-icon-plus" @click="addNextStep(scope.$index)" />
            <el-button size="mini" class="el-icon-minus" @click="deleteStep(scope.$index)" />
          </el-button-group>
          <el-button-group style="margin-top: 5px">
            <el-button size="mini" class="el-icon-top" :disabled="moveUpDisable(scope.$index)" @click="moveUp(scope.$index)" />
            <el-button size="mini" class="el-icon-bottom" :disabled="moveDownDisable(scope.$index)" @click="moveDown(scope.$index)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <action-detail :show-action-detail.sync="showActionDetail" :selectable-actions="selectableActions" />
  </div>
</template>

<script>
import { getActionCascader } from '@/api/action'
import ActionDetail from './ActionDetail'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import ImageInput from '@/components/ImageInput'
export default {
  props: {
    // 当前编辑的actionId
    curActionId: Number
  },
  components: {
    ActionDetail,
    ImageInput
  },
  data() {
    return {
      steps: [],
      selectedSteps: [],
      selectableActions: [],
      showActionDetail: false,
      cmOptions: {
        mode: 'text/x-java',
        theme: 'default',
        tabSize: 2,
        lineNumbers: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
      },
      tableHeight: 100
    }
  },
  computed: {
    possibleValues() {
      return function(actionId, paramName) {
        const action = this.findActionInSelectableActions(actionId)
        const possibleValues = action.params.filter(param => param.name === paramName)[0].possibleValues
        return possibleValues
      }
    },
    hasPossibleValue() {
      return function(actionId, paramName) {
        const action = this.findActionInSelectableActions(actionId)
        if (action && action.params && action.params.length > 0) {
          const param = action.params.filter(param => param.name === paramName)[0]
          if (param && param.possibleValues && param.possibleValues.length > 0) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }
    },
    paramNameDesc() {
      return function(actionId, paramName) {
        const action = this.findActionInSelectableActions(actionId)
        if (action && action.params && action.params.length > 0) {
          return action.params.filter(param => param.name === paramName)[0].description
        }
      }
    },
    returnValue() {
      return function(action) {
        if (action.returnValueDesc) {
          return action.returnValue + '(' + action.returnValueDesc + ')'
        } else {
          return action.returnValue
        }
      }
    },
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
    },
    // 第一条不能往上移
    moveUpDisable() {
      return function(index) {
        return index === 0
      }
    },
    // 最后一条不能往下移
    moveDownDisable() {
      return function(index) {
        return index === (this.steps.length - 1)
      }
    }
  },
  created() {
    this.fetchActionCascader()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 5

      window.onresize = () => {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 5
      }
    })
  },
  methods: {
    moveUp(index) {
      this.steps[index - 1] = this.steps.splice(index, 1, this.steps[index - 1])[0]
    },
    moveDown(index) {
      this.steps[index + 1] = this.steps.splice(index, 1, this.steps[index + 1])[0]
    },
    deleteStep(index) {
      this.steps.splice(index, 1)
    },
    addStep() {
      this.steps.push({ paramValues: [], handleException: null, status: 1 })
    },
    addNextStep(index) {
      this.steps.splice(index + 1, 0, { paramValues: [], handleException: null, status: 1 })
    },
    copyStep(index, row) {
      const _row = JSON.parse(JSON.stringify(row))
      delete _row.number
      this.steps.splice(index, 0, _row)
    },
    // 步骤勾选
    handleSelectionChange(val) {
      this.selectedSteps = this.steps.filter(step => val.indexOf(step) !== -1).sort((a, b) => a.number - b.number)
    },
    clickPossibleValue(row, paramName, possibleValue) {
      const paramValue = row.paramValues.filter(paramValue => paramValue.paramName === paramName)[0]
      paramValue.paramValue = possibleValue
      this.$refs.closepopover.click()
    },
    actionSelectChange(type) {
      if (type) {
        this.fetchActionCascader()
      }
    },
    fetchActionCascader() {
      getActionCascader(this.projectId, this.platform).then(resp => {
        this.selectableActions = resp.data
        if (this.curActionId) { // 编辑action时，第一次拿不到curActionId
          this.disableCurActionInSelectableActions(this.curActionId)
        }
        this.$emit('selectableActionsChange', this.selectableActions)
      })
    },
    // 选择了一个action或清除
    actionSelected(actionId, step) {
      step.paramValues = []
      console.log('cascader selected', actionId)
      if (actionId) {
        const selectedAction = this.findActionInSelectableActions(actionId)
        console.log('selected action', selectedAction)
        if (selectedAction) {
          if (selectedAction.params && selectedAction.params.length > 0) {
            selectedAction.params.forEach(param => {
              step.paramValues.push({
                paramName: param.name,
                paramType: param.type,
                paramValue: ''
              })
            })
          }
        }
      }
    },
    // 根据actionId递归搜索出action
    findActionInSelectableActions(actionId) {
      return this.findAction(this.selectableActions, actionId)
    },
    // 在actions里查找action by acitonId
    findAction(actions, actionId) {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].children) {
          const action = this.findAction(actions[i].children, actionId)
          if (action) {
            return action
          }
        } else {
          if (actions[i].id === actionId) {
            return actions[i]
          }
        }
      }
    },
    disableAction(actions, actionId) {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].children) {
          this.disableAction(actions[i].children, actionId)
        } else {
          if (actions[i].id === actionId) {
            console.log('disable action', actions[i].id)
            actions[i].disabled = true
          }
        }
      }
    },
    // 禁用当前编辑的action
    disableCurActionInSelectableActions(actionId) {
      this.disableAction(this.selectableActions, actionId)
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
