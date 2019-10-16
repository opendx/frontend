<template>
  <div>
    <div ref="closepopover" />
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
      <el-table-column label="Action" align="center" width="200">
        <template scope="{ row }">
          <el-input v-model="row.name" placeholder="步骤名" style="margin-bottom: 5px" type="textarea" :autosize="{ minRows: 1 }" />
          <el-select v-model="row.actionId" filterable clearable style="width: 100%" @change="actionSelected($event, row)" @visible-change="selectAction" placeholder="选择action">
            <el-option v-for="action in selectableActions" :key="action.id" :value="action.id" :label="action.name">
              <span style="float: left;color: blue" v-if="action.type === 1">[基础组件]</span>
              <span style="float: left;color: green" v-else-if="action.type === 2">[封装组件]</span>
              <span style="float: left;color: magenta" v-else-if="action.type === 3">[测试用例]</span>
              <span style="float: left">{{ returnValueTag(action) }}</span>
              <span style="float: left">{{ action.name }}</span>
              <span style="float: right; padding-left: 5px; color: #8492a6; font-size: 13px">{{ action.description }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Action参数" align="center">
        <template scope="{ row }">
          <el-table :data="row.paramValues" border>
            <el-table-column label="参数名" align="center" width="150" show-overflow-tooltip>
              <template scope="scope_paramValues">
                <el-popover placement="top-start" trigger="click">
                  {{ paramNameDesc(row.actionId, scope_paramValues.row.paramName) }}
                  <el-table v-if="hasPossibleValue(row.actionId, scope_paramValues.row.paramName)" :data="possibleValues(row.actionId, scope_paramValues.row.paramName)" border style="margin-top: 5px;width: 500px">
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
            <el-table-column label="参数类型" align="center" width="100" show-overflow-tooltip>
              <template scope="scope_paramValues">
                {{ scope_paramValues.row.paramType }}
              </template>
            </el-table-column>
            <el-table-column label="参数值" align="center">
              <template scope="scope_paramValues">
                <el-input v-model="scope_paramValues.row.paramValue" @paste.native="onpaste($event, scope_paramValues)" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }"/>
                <img v-if="isImg(scope_paramValues.row.paramValue)" :src="scope_paramValues.row.paramValue" />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="赋值" align="center" width="200">
        <template scope="{ row }">
          <el-input v-model="row.evaluation" :disabled="evaluationDisabled(row.actionId)" type="textarea" :autosize="{ minRows: 1 }" />
        </template>
      </el-table-column>
      <el-table-column label="异常处理" align="center" width="170">
        <template scope="{ row }">
          <el-select v-model="row.handleException">
            <el-option label="中断执行" :value="null" />
            <el-option label="忽略，继续执行" :value="0" />
            <el-option label="抛出跳过异常" :value="1" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template scope="scope">
          <el-button-group>
            <el-button size="mini" @click="addNextStep(scope.$index)">+</el-button>
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
export default {
  props: {
    // 当前编辑的actionId
    curActionId: Number
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
            return action.returnValue === 'void'
          }
        }
      }
    },
    returnValueTag() {
      return function(action) {
        if (action.returnValueDesc) {
          return '[' + action.returnValue + ': ' + action.returnValueDesc + ']'
        } else {
          return '[' + action.returnValue + ']'
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
    this.fetchSelectableActions()
  },
  methods: {
    isImg(value) {
      if (value) {
        // 简单粗暴判断是否是base64
        return value.startsWith('data:image/')
      } else {
        return false
      }
    },
    onpaste(e, scope) {
      console.log('paramValue onpaste')
      if (!(e.clipboardData && e.clipboardData.items)) {
        return
      }
      const item = e.clipboardData.items[0]
      // 判断是否为图片数据
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        console.log('paste img to base64')
        const imgFile = item.getAsFile()
        const reader = new FileReader()
        reader.onload = e => {
          scope.row.paramValue = e.target.result
        }
        reader.readAsDataURL(imgFile)
      }
    },
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
      this.steps.push({ paramValues: [], handleException: null })
    },
    addNextStep(index) {
      this.steps.splice(index + 1, 0, { paramValues: [], handleException: null })
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
        this.selectableActions = resp.data.filter(action => action.id !== this.curActionId)
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
              paramType: param.type,
              paramValue: ''
            })
          })
        }
      }
    },
    clickPossibleValue(row, paramName, possibleValue) {
      const paramValue = row.paramValues.filter(paramValue => paramValue.paramName === paramName)[0]
      paramValue.paramValue = possibleValue
      this.$refs.closepopover.click()
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
