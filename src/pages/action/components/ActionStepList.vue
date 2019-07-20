<template>
  <div>
    <el-table :data="steps" border @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="30" />
      <el-table-column align="center" width="80">
        <template slot="header">
          <el-button type="text" class="el-icon-circle-plus" @click="addStep" />
          <span class="required">步骤</span>
        </template>
        <template scope="scope">
          {{ stepNumber(scope.row, scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column label="步骤名" align="center">
        <template scope="{ row }">
          <el-input v-model="row.name" clearable />
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center">
        <template scope="{ row }">
          <el-select v-model="row.actionId" filterable clearable style="width: 100%" @change="actionSelected($event, row)" @visible-change="selectAction">
            <el-option v-for="action in selectableActions" :key="action.id" :value="action.id" :label="action.name">
              <span style="float: left">{{ optionLabelName(action) }}</span>
              <span style="float: right; padding-left: 5px; color: #8492a6; font-size: 13px">{{ action.description }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Action参数值" align="center">
        <template scope="{ row }">
          <el-table :data="row.paramValues" border>
            <el-table-column label="参数名" align="center">
              <template scope="scope_paramValues">
                <el-popover placement="right" width="400" trigger="click">
                  描述：{{ paramNameDesc(row.actionId, scope_paramValues.row.paramName) }}
                  <el-table v-if="hasPossibleValue(row.actionId, scope_paramValues.row.paramName)" :data="possibleValues(row.actionId, scope_paramValues.row.paramName)" border style="margin-top: 5px">
                    <el-table-column align="center" label="可选值">
                      <template scope="scope_possibleValues">
                        <el-button v-clipboard:copy="scope_possibleValues.row.value" v-clipboard:success="onCopy" type="text">{{ scope_possibleValues.row.value }}</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column property="description" align="center" label="描述" />
                  </el-table>
                  <el-button slot="reference" type="text">{{ scope_paramValues.row.paramName }}</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="参数值" align="center">
              <template scope="scope_paramValues">
                <el-input v-model="scope_paramValues.row.paramValue" clearable />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="赋值" align="center" width="100">
        <template scope="{ row }">
          <el-input v-model="row.evaluation" clearable :disabled="evaluationDisabled(row.actionId)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140">
        <template scope="scope">
          <el-button-group>
            <el-button size="mini" :disabled="moveUpDisable(scope.$index)" @click="moveUp(scope.$index)">↑</el-button>
            <el-button size="mini" :disabled="moveDownDisable(scope.$index)" @click="moveDown(scope.$index)">↓</el-button>
            <el-button size="mini" class="el-icon-delete" @click="deleteStep(scope.$index)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSelectableActions } from '@/api/action'
import clipboard from '@/directive/clipboard/index.js'
export default {
  directives: {
    clipboard
  },
  data() {
    return {
      steps: [],
      selectedSteps: [],
      selectableActions: []
    }
  },
  computed: {
    possibleValues() {
      return function(actionId, paramName) {
        const action = this.selectableActions.filter(action => action.id === actionId)[0]
        const possibleValues = action.params.filter(param => param.name === paramName)[0].possibleValues
        return possibleValues
      }
    },
    hasPossibleValue() {
      return function(actionId, paramName) {
        const action = this.selectableActions.filter(action => action.id === actionId)[0]
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
        const action = this.selectableActions.filter(action => action.id === actionId)[0]
        if (action && action.params && action.params.length > 0) {
          return action.params.filter(param => param.name === paramName)[0].description
        }
      }
    },
    evaluationDisabled() {
      return function(actionId) {
        if (!actionId) {
          return true
        } else {
          const action = this.selectableActions.filter(action => action.id === actionId)[0]
          if (action) {
            return !(action.hasReturnValue)
          }
        }
      }
    },
    optionLabelName() {
      return function(action) {
        const text1 = action.type === 1 ? '[基础组件]' : action.type === 2 ? '[封装组件]' : action.type === 3 ? '[测试用例]' : '[未知]'
        let text2
        if (action.hasReturnValue === 1) {
          if (action.returnValueDesc) {
            text2 = '[' + action.returnValueDesc + ']'
          } else {
            text2 = '[有返回值]'
          }
        } else {
          text2 = '[void]'
        }
        const text3 = action.name
        return text1 + text2 + text3
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
    this.fetchSelectableActions()
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
      this.steps.push({ paramValues: [] })
    },
    // 步骤勾选
    handleSelectionChange(val) {
      this.selectedSteps = this.steps.filter(step => val.indexOf(step) !== -1)
    },
    selectAction(type) {
      if (type) {
        this.fetchSelectableActions()
      }
    },
    fetchSelectableActions() {
      getSelectableActions(this.projectId, this.platform).then(resp => {
        this.selectableActions = resp.data
      })
    },
    // 选择了一个action或清除
    actionSelected(actionId, step) {
      step.paramValues = []
      const selectedAction = this.selectableActions.filter(action => action.id === actionId)[0]
      if (selectedAction) {
        if (selectedAction.params && selectedAction.params.length > 0) {
          selectedAction.params.forEach(param => {
            step.paramValues.push({
              paramName: param.name,
              paramValue: ''
            })
          })
        }
      }
    },
    onCopy(e) {
      this.$notify.success(e.text + '复制成功')
    }
  }
}
</script>
<style scoped>
  .required:before {
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
</style>
