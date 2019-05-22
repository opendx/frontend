<template>
  <div>
    <el-button size="mini" type="primary" @click="addStep">添加步骤</el-button>
    <el-table :data="steps" border style="margin-top: 4px" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="30" />
      <el-table-column label="步骤" align="center" width="50">
        <template scope="scope">
          {{ stepNumber(scope.row, scope.$index + 1) }}
        </template>
      </el-table-column>
      <el-table-column label="步骤名" align="center">
        <template scope="scope">
          <el-input v-model="scope.row.name" clearable />
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center">
        <template scope="scope">
          <el-select
            v-model="scope.row.actionId"
            filterable
            clearable
            style="width: 100%"
            @change="actionSelected($event,scope.row)"
            @visible-change="selectAction"
          >
            <el-option v-for="action in selectableActions" :value="action.id" :label="action.name" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Action参数值" align="center">
        <template scope="scope">
          <el-table :data="scope.row.paramValues" border>
            <el-table-column label="参数名" align="center">
              <template scope="scope1">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="hover"
                >
                  参数描述：{{ scope1.row.description }}
                  <el-table :data="scope1.row.possibleValues">
                    <el-table-column property="value" align="center" label="可选参数值" />
                    <el-table-column property="description" align="center" label="描述" />
                  </el-table>
                  <el-button slot="reference" type="text">{{ scope1.row.paramName }}</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="参数值" align="center">
              <template scope="scope1">
                <el-input v-model="scope1.row.paramValue" clearable />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="赋值" align="center" width="100">
        <template scope="scope">
          <el-input v-model="scope.row.evaluation" clearable />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template scope="scope">
          <el-button-group>
            <el-button size="mini" :disabled="moveUpDisable(scope.$index)" @click="moveUp(scope.$index)">↑</el-button>
            <el-button size="mini" :disabled="moveDownDisable(scope.$index)" @click="moveDown(scope.$index)">↓</el-button>
            <el-button size="mini" type="danger" @click="deleteStep(scope.$index)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findSelectableActions } from '@/api/action'
export default {
  data() {
    return {
      steps: [],
      selectedSteps: [],
      selectableActions: []
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.id
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
    // 防止 复制/修改 pageAction 选择action不显示actionName
    this.getSelectableActions()
  },
  methods: {
    moveUp(index) {
      const temp = this.steps[index]
      this.steps[index] = this.steps[index - 1]
      this.steps[index - 1] = temp
      // 触发vue更新数据
      this.steps = this.steps.splice(0, this.steps.length)
    },
    moveDown(index) {
      const temp = this.steps[index + 1]
      this.steps[index + 1] = this.steps[index]
      this.steps[index] = temp
      // 触发vue更新数据
      this.steps = this.steps.splice(0, this.steps.length)
    },
    deleteStep(index) {
      this.steps.splice(index, 1)
    },
    addStep() {
      this.steps.push({ paramValues: [] })
    },
    // 步骤勾选
    handleSelectionChange(val) {
      const arr = this.steps.filter(step => {
        return val.indexOf(step) !== -1
      })
      this.selectedSteps = arr
    },
    // 点击select框
    selectAction(type) {
      if (type) {
        this.getSelectableActions()
      }
    },
    getSelectableActions() {
      findSelectableActions(this.projectId).then(resp => {
        this.selectableActions = resp.data
      })
    },
    // 步骤选择了一个action
    actionSelected(actionId, step) {
      this.selectableActions.forEach(action => {
        if (action.id === actionId) {
          action.params.forEach(param => {
            param.paramName = param.name
            delete param.name
          })
          step.paramValues = action.params
        }
      })
    }
  }
}
</script>
